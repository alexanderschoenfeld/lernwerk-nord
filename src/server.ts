// Webserver und Routen der Lernplattform. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { abmelden, anmelden, kontoZu } from "./auth.ts";
import { verbinden } from "./db/verbindung.ts";
import { aufrufFesthalten, fortschritt } from "./fortschritt.ts";
import { bestandteileVon, lernpaket, sichtbareLernpakete } from "./lernpakete.ts";
import { anmeldeseite, detailseite, uebersicht } from "./seiten.ts";

const db = verbinden();
const WURZEL = fileURLToPath(new URL("..", import.meta.url));
const TYPEN: Record<string, string> = { ".html": "text/html; charset=utf-8", ".md": "text/plain; charset=utf-8" };

function token(anfrage: IncomingMessage): string | undefined {
  return /(?:^|;\s*)sitzung=([^;]+)/.exec(anfrage.headers.cookie ?? "")?.[1];
}

function senden(antwort: ServerResponse, status: number, inhalt: string, kopf: Record<string, string> = {}): void {
  antwort.writeHead(status, { "content-type": "text/html; charset=utf-8", ...kopf });
  antwort.end(inhalt);
}

function umleiten(antwort: ServerResponse, ziel: string, kopf: Record<string, string> = {}): void {
  antwort.writeHead(303, { location: ziel, ...kopf });
  antwort.end();
}

async function formular(anfrage: IncomingMessage): Promise<URLSearchParams> {
  let text = "";
  for await (const teil of anfrage) text += teil;
  return new URLSearchParams(text);
}

createServer(async (anfrage, antwort) => {
  const url = new URL(anfrage.url ?? "/", "http://localhost");
  const konto = kontoZu(token(anfrage));

  if (url.pathname === "/" && anfrage.method === "GET") {
    return konto ? umleiten(antwort, "/lernpakete") : senden(antwort, 200, anmeldeseite());
  }
  if (url.pathname === "/anmelden" && anfrage.method === "POST") {
    const daten = await formular(anfrage);
    const neu = anmelden(db, daten.get("email") ?? "", daten.get("passwort") ?? "");
    if (!neu) return senden(antwort, 401, anmeldeseite(true));
    return umleiten(antwort, "/lernpakete", { "set-cookie": `sitzung=${neu}; HttpOnly; SameSite=Lax; Path=/` });
  }
  if (url.pathname === "/abmelden") {
    abmelden(token(anfrage));
    return umleiten(antwort, "/", { "set-cookie": "sitzung=; Max-Age=0; Path=/" });
  }
  if (!konto) return umleiten(antwort, "/");

  if (url.pathname === "/lernpakete") {
    const zustaende = konto.rolle === "lernende" ? fortschritt(db, konto.id) : undefined;
    return senden(antwort, 200, uebersicht(konto, sichtbareLernpakete(db, konto.rolle), zustaende));
  }
  const detail = /^\/lernpakete\/([a-z0-9-]+)$/.exec(url.pathname);
  if (detail) {
    const paket = lernpaket(db, detail[1], konto.rolle);
    if (!paket) return senden(antwort, 404, "Nicht gefunden");
    return senden(antwort, 200, detailseite(konto, paket, bestandteileVon(db, paket.id)));
  }
  if (url.pathname.startsWith("/inhalte/")) {
    const pfad = normalize(decodeURIComponent(url.pathname)).replace(/^[\\/]+/, "");
    if (pfad.includes("..")) return senden(antwort, 400, "Ungültiger Pfad");
    try {
      const inhalt = await readFile(WURZEL + pfad, "utf-8");
      if (konto.rolle === "lernende") aufrufFesthalten(db, konto.id, pfad);
      return senden(antwort, 200, inhalt, { "content-type": TYPEN[extname(pfad)] ?? "text/plain; charset=utf-8" });
    } catch {
      return senden(antwort, 404, "Nicht gefunden");
    }
  }
  senden(antwort, 404, "Nicht gefunden");
}).listen(Number(process.env.PORT ?? 3000), () => {
  console.log(`Lernplattform läuft unter http://localhost:${process.env.PORT ?? 3000}`);
});
