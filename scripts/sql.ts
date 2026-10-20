// npm run sql -- "SELECT ...": führt eine Abfrage auf db/lernwerk.db aus und zeigt das Ergebnis. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { existsSync } from "node:fs";
import { DATENBANK, verbinden } from "../src/db/verbindung.ts";
import { datenbankAnlegen } from "./reset.ts";

const abfrage = process.argv.slice(2).join(" ").trim();
if (!abfrage) {
  console.error('Aufruf: npm run sql -- "SELECT ..."');
  process.exit(2);
}
if (!existsSync(DATENBANK)) datenbankAnlegen();
const db = verbinden();
const zeilen = db.prepare(abfrage).all() as Record<string, unknown>[];
if (zeilen.length === 0) {
  console.log("(keine Zeilen)");
} else {
  console.table(zeilen);
}
db.close();
