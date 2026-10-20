// Verbindung zur SQLite-Datenbank über node:sqlite. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

export const DATENBANK = fileURLToPath(new URL("../../db/lernwerk.db", import.meta.url));

export function verbinden(): DatabaseSync {
  return new DatabaseSync(DATENBANK);
}
