// HTML der Seiten. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import type { Konto } from "./auth.ts";
import type { Zustand } from "./fortschritt.ts";
import type { Neuigkeit } from "./neuigkeiten.ts";
import type { Bestandteil, Lernpaket } from "./lernpakete.ts";

const STIL = `
  body { font-family: system-ui, sans-serif; margin: 0; color: #1f2933; background: #f5f7fa; }
  header { background: #12355b; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; }
  header a { color: white; }
  main { max-width: 60rem; margin: 2rem auto; padding: 0 1rem; }
  .karte { background: white; border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px #0002; }
  .entwurf { border-left: 6px solid #d97706; }
  .neu { border-left: 6px solid #15803d; }
  footer { text-align: center; color: #6b7280; font-size: 0.85rem; margin: 2rem; }
  label { display: block; margin-top: 1rem; }
  input { padding: 0.5rem; width: 20rem; }
  button { margin-top: 1rem; padding: 0.5rem 1.5rem; background: #12355b; color: white; border: 0; border-radius: 4px; }
  .fehler { color: #b91c1c; }
  .zustand { font-weight: bold; color: #12355b; }
`;

function escape(text: string): string {
  return text.replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[z]!);
}

function rahmen(titel: string, inhalt: string, konto?: Konto): string {
  const kopf = konto
    ? `<span>${escape(konto.name)} (${konto.rolle}) · <a href="/abmelden">Abmelden</a></span>`
    : "";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${escape(titel)} – Lernwerk Nord</title>
<style>${STIL}</style></head><body><header><strong>Lernwerk Nord</strong>${kopf}</header>
<main>${inhalt}</main><footer>Lernwerk Nord ist fiktiv – synthetische Schulungsdaten</footer></body></html>`;
}

export function anmeldeseite(fehler = false): string {
  return rahmen(
    "Anmeldung",
    `<div class="karte"><h1>Anmeldung</h1>
${fehler ? '<p class="fehler">E-Mail oder Passwort stimmt nicht.</p>' : ""}
<form method="post" action="/anmelden">
<label>E-Mail <input name="email" type="email" required></label>
<label>Passwort <input name="passwort" type="password" required></label>
<button type="submit">Anmelden</button></form></div>`,
  );
}

export function uebersicht(konto: Konto, pakete: Lernpaket[], zustaende?: Map<number, Zustand>, neu: Neuigkeit[] = []): string {
  const karten = pakete
    .map(
      (p) => `<div class="karte${p.status === "entwurf" ? " entwurf" : ""}">
<h2><a href="/lernpakete/${p.slug}">${escape(p.titel)}</a></h2>
<p>${escape(p.thema)} · ${p.niveau} · ${p.dauer_minuten} Minuten${p.status === "entwurf" ? " · Entwurf" : ""}</p>
<p>${escape(p.beschreibung)}</p>${zustaende?.has(p.id) ? `<p class="zustand">Fortschritt: ${zustaende.get(p.id)}</p>` : ""}</div>`,
    )
    .join("\n");
  const hinweis = neu.length
    ? `<div class="karte neu"><h2>Neu veröffentlicht seit Ihrem letzten Besuch</h2><ul>${neu
        .map((n) => `<li><a href="/lernpakete/${n.slug}">${escape(n.titel)}</a></li>`)
        .join("")}</ul></div>`
    : "";
  return rahmen("Lernpakete", `<h1>Lernpakete</h1>${hinweis}${karten}`, konto);
}

export function detailseite(konto: Konto, paket: Lernpaket, teile: Bestandteil[]): string {
  const liste = teile.map((t) => `<li><a href="/${t.pfad}">${escape(t.titel)}</a> (${t.art})</li>`).join("");
  return rahmen(
    paket.titel,
    `<div class="karte"><h1>${escape(paket.titel)}</h1><p>${escape(paket.beschreibung)}</p><ul>${liste}</ul>
${konto.rolle === "kuratorin" && paket.status === "entwurf"
      ? `<form method="post" action="/lernpakete/${paket.slug}/veroeffentlichen"><button type="submit">Veröffentlichen</button></form>`
      : ""}
<p><a href="/lernpakete">Zurück zur Übersicht</a></p></div>`,
    konto,
  );
}
