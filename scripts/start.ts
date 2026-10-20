// npm run dev: legt .env und Datenbank an, falls sie fehlen, und startet den Webserver. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { datenbankAnlegen } from "./reset.ts";
import { DATENBANK } from "../src/db/verbindung.ts";

const env = fileURLToPath(new URL("../.env", import.meta.url));
if (!existsSync(env)) {
  copyFileSync(fileURLToPath(new URL("../.env.example", import.meta.url)), env);
  console.log(".env aus .env.example angelegt");
}
for (const zeile of readFileSync(env, "utf-8").split(/\r?\n/)) {
  const treffer = /^([A-Z_]+)=(.*)$/.exec(zeile);
  if (treffer && process.env[treffer[1]] === undefined) process.env[treffer[1]] = treffer[2];
}
if (!existsSync(DATENBANK)) datenbankAnlegen();
await import("../src/server.ts");
