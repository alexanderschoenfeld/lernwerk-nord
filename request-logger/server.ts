// npm run request-logger: Proxy zwischen Claude Code und dem Modellanbieter, schreibt jede Anfrage lesbar nach request-logger/logs/. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
// Nur an der Lernplattform einsetzen: Die Mitschnitte enthalten Code und Dateiinhalte im Klartext.
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const PORT = 8787;
const ZIEL = process.env.LOGGER_ZIEL ?? "https://api.anthropic.com";
const LOGS = fileURLToPath(new URL("./logs/", import.meta.url));
const EINSTELLUNGEN = fileURLToPath(new URL("./einstellungen.json", import.meta.url));
const GEHEIM = new Set(["authorization", "x-api-key", "cookie"]);
const NICHT_WEITERGEBEN = new Set(["host", "connection", "content-length", "accept-encoding"]);
const NICHT_ZURUECK = new Set(["content-encoding", "content-length", "transfer-encoding", "connection"]);

type Einstellungen = { agent: string };
type Block = Record<string, any>;

async function einstellungenLesen(): Promise<Einstellungen> {
  if (existsSync(EINSTELLUNGEN)) return JSON.parse(readFileSync(EINSTELLUNGEN, "utf-8")) as Einstellungen;
  const leser = createInterface({ input: process.stdin });
  const zeilen = leser[Symbol.asyncIterator]();
  const frage = async (text: string): Promise<string> => {
    process.stdout.write(text);
    const zeile = await zeilen.next();
    return zeile.done ? "" : String(zeile.value).trim();
  };
  let agent = "";
  while (agent !== "1") agent = (await frage("Welchen Agenten nutzen Sie? 1 = Claude Code: ")) || "1";
  const merken = (await frage("Antwort merken? (j/n): ")).toLowerCase();
  leser.close();
  const einstellungen = { agent: "Claude Code" };
  if (merken.startsWith("j")) writeFileSync(EINSTELLUNGEN, JSON.stringify(einstellungen, null, 2) + "\n");
  return einstellungen;
}

function startbefehl(): string {
  const adresse = `http://localhost:${PORT}`;
  return process.platform === "win32"
    ? `$env:ANTHROPIC_BASE_URL="${adresse}"; claude`
    : `ANTHROPIC_BASE_URL=${adresse} claude`;
}

function lesen(anfrage: IncomingMessage): Promise<Buffer> {
  return new Promise((fertig, fehler) => {
    const teile: Buffer[] = [];
    anfrage.on("data", (teil: Buffer) => teile.push(teil));
    anfrage.on("end", () => fertig(Buffer.concat(teile)));
    anfrage.on("error", fehler);
  });
}

function text(inhalt: unknown): string {
  if (typeof inhalt === "string") return inhalt;
  if (!Array.isArray(inhalt)) return inhalt === undefined ? "" : JSON.stringify(inhalt, null, 2);
  return inhalt.map((b: Block) => (b.type === "text" ? b.text : `[${b.type}]`)).join("\n");
}

function nachricht(n: Block, nr: number): string {
  const zeilen = [`Nachricht ${nr} (${n.role})`];
  const bloecke: Block[] = typeof n.content === "string" ? [{ type: "text", text: n.content }] : n.content ?? [];
  for (const b of bloecke) {
    if (b.type === "text") zeilen.push(b.text);
    else if (b.type === "tool_use") zeilen.push(`[Werkzeugaufruf ${b.name}, ${b.id}]`, JSON.stringify(b.input, null, 2));
    else if (b.type === "tool_result") zeilen.push(`[Werkzeugergebnis ${b.tool_use_id}${b.is_error ? ", Fehler" : ""}]`, text(b.content));
    else if (b.type === "thinking") zeilen.push("[Denken]", b.thinking ?? "");
    else zeilen.push(`[${b.type}]`);
  }
  return zeilen.join("\n");
}

function antwortLesen(roh: string): string {
  const zeilen: string[] = [];
  let stopp = "";
  let nutzung: Block = {};
  const bloecke: Block[] = [];
  const ereignisse = roh.split("\n").filter((z) => z.startsWith("data: ")).map((z) => {
    try { return JSON.parse(z.slice(6)) as Block; } catch { return null; }
  }).filter((e): e is Block => e !== null);
  if (ereignisse.length === 0) {
    try {
      const json = JSON.parse(roh) as Block;
      if (json.error) return `Fehler: ${json.error.type}: ${json.error.message}`;
      stopp = json.stop_reason ?? "";
      nutzung = json.usage ?? {};
      for (const b of json.content ?? []) bloecke.push(b.type === "tool_use" ? { ...b, eingabe: JSON.stringify(b.input) } : b);
    } catch {
      return roh.slice(0, 2000);
    }
  }
  for (const e of ereignisse) {
    if (e.type === "message_start") nutzung = { ...e.message?.usage };
    if (e.type === "content_block_start") bloecke[e.index] = { ...e.content_block, text: e.content_block.text ?? "", eingabe: "" };
    if (e.type === "content_block_delta" && bloecke[e.index]) {
      if (e.delta.type === "text_delta") bloecke[e.index].text += e.delta.text;
      if (e.delta.type === "input_json_delta") bloecke[e.index].eingabe += e.delta.partial_json;
      if (e.delta.type === "thinking_delta") bloecke[e.index].thinking = (bloecke[e.index].thinking ?? "") + e.delta.thinking;
    }
    if (e.type === "message_delta") {
      stopp = e.delta?.stop_reason ?? stopp;
      nutzung = { ...nutzung, ...e.usage };
    }
    if (e.type === "error") zeilen.push(`Fehler: ${e.error?.type}: ${e.error?.message}`);
  }
  zeilen.push(`Stopp-Grund: ${stopp || "—"}`);
  zeilen.push(`Token: Eingabe ${nutzung.input_tokens ?? 0}, Ausgabe ${nutzung.output_tokens ?? 0}, aus dem Cache gelesen ${nutzung.cache_read_input_tokens ?? 0}, in den Cache geschrieben ${nutzung.cache_creation_input_tokens ?? 0}`);
  for (const b of bloecke.filter(Boolean)) {
    if (b.type === "text") zeilen.push("Text:", b.text);
    if (b.type === "tool_use") zeilen.push(`[Werkzeugaufruf ${b.name}, ${b.id}]`, b.eingabe);
    if (b.type === "thinking") zeilen.push("[Denken]", b.thinking ?? "");
  }
  return zeilen.join("\n");
}

function mitschnitt(zeit: string, methode: string, pfad: string, kopf: IncomingMessage["headers"], koerper: string, status: number, antwort: string): string {
  let anfrage: Block = {};
  try { anfrage = JSON.parse(koerper) as Block; } catch { /* kein JSON, etwa GET */ }
  const kopfzeilen = Object.entries(kopf).map(([name, wert]) => `${name}: ${GEHEIM.has(name) ? "[entfernt]" : wert}`);
  const werkzeuge = (anfrage.tools ?? []).map((w: Block) => `- ${w.name}: ${String(w.description ?? "").split("\n")[0]}`);
  const parameter = ["max_tokens", "stream", "temperature", "thinking"].filter((k) => k in anfrage).map((k) => `${k}: ${JSON.stringify(anfrage[k])}`);
  return [
    "<meta>",
    `Zeitpunkt (UTC): ${zeit}`,
    `Anfrage: ${methode} ${pfad}`,
    `Modell: ${anfrage.model ?? "—"}`,
    `Status: ${status}`,
    "</meta>",
    "<headers>", ...kopfzeilen, "</headers>",
    "<request>",
    "<params>", ...parameter, "</params>",
    "<system-prompt>", text(anfrage.system), "</system-prompt>",
    "<tools>", `Anzahl: ${werkzeuge.length}`, ...werkzeuge, "</tools>",
    "<messages>", ...(anfrage.messages ?? []).map((n: Block, i: number) => nachricht(n, i + 1) + "\n"), "</messages>",
    "</request>",
    "<response>", antwortLesen(antwort), "</response>",
    "",
  ].join("\n");
}

let zaehler = 0;

async function weiterleiten(anfrage: IncomingMessage, antwort: ServerResponse): Promise<void> {
  const zeit = new Date().toISOString();
  const koerper = await lesen(anfrage);
  const kopf = new Headers();
  for (const [name, wert] of Object.entries(anfrage.headers)) {
    if (wert !== undefined && !NICHT_WEITERGEBEN.has(name)) kopf.set(name, Array.isArray(wert) ? wert.join(", ") : wert);
  }
  kopf.set("accept-encoding", "identity");
  const methode = anfrage.method ?? "GET";
  const oben = await fetch(ZIEL + (anfrage.url ?? "/"), {
    method: methode,
    headers: kopf,
    body: methode === "GET" || methode === "HEAD" ? undefined : koerper,
  });
  const rueck: Record<string, string> = {};
  oben.headers.forEach((wert, name) => { if (!NICHT_ZURUECK.has(name)) rueck[name] = wert; });
  antwort.writeHead(oben.status, rueck);
  const teile: Buffer[] = [];
  if (oben.body) {
    for await (const teil of oben.body) {
      const puffer = Buffer.from(teil);
      teile.push(puffer);
      antwort.write(puffer);
    }
  }
  antwort.end();
  const roh = Buffer.concat(teile).toString("utf-8");
  zaehler += 1;
  const name = `${zeit.replace(/:/g, "-")}-${String(zaehler).padStart(3, "0")}`;
  mkdirSync(LOGS, { recursive: true });
  writeFileSync(LOGS + name + ".request.txt", koerper);
  writeFileSync(LOGS + name + ".response.txt", roh);
  writeFileSync(LOGS + name + ".md", mitschnitt(zeit, methode, anfrage.url ?? "/", anfrage.headers, koerper.toString("utf-8"), oben.status, roh));
  console.log(`${zeit}  ${methode} ${anfrage.url}  ${oben.status}  -> logs/${name}.md`);
}

const einstellungen = await einstellungenLesen();
createServer((anfrage, antwort) => {
  weiterleiten(anfrage, antwort).catch((fehler: Error) => {
    console.error(`Fehler beim Weiterleiten: ${fehler.message}`);
    if (!antwort.headersSent) antwort.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    antwort.end(`Request-Logger: ${fehler.message}`);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Request-Logger für ${einstellungen.agent} lauscht auf localhost:${PORT} und leitet an ${ZIEL} weiter.`);
  console.log("Starten Sie Claude Code in einem zweiten Fenster im Ordner der Lernplattform mit diesem Befehl:");
  console.log("");
  console.log(`  ${startbefehl()}`);
  console.log("");
  console.log("Mitschnitte landen in request-logger/logs/. Beenden mit Strg+C.");
});
