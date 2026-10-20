// npm run reset: legt db/lernwerk.db aus Schema und Startdaten neu an. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DATENBANK, verbinden } from "../src/db/verbindung.ts";

export function datenbankAnlegen(): void {
  rmSync(DATENBANK, { force: true });
  const db = verbinden();
  db.exec(readFileSync(fileURLToPath(new URL("../src/db/schema.sql", import.meta.url)), "utf-8"));
  db.exec(readFileSync(fileURLToPath(new URL("../db/seed.sql", import.meta.url)), "utf-8"));
  db.close();
  console.log("Datenbank db/lernwerk.db aus db/seed.sql angelegt");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) datenbankAnlegen();
