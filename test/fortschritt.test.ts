// Tests zum Lernfortschritt (Tickets 01 bis 03), mit npm test. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { aufrufFesthalten, fortschritt } from "../src/fortschritt.ts";

const LERNENDE = 7; // Theo Grote, ohne Belegungen und Aufrufe in den Startdaten
const PAKET = 1; // agent-fuer-routineaufgaben, veröffentlicht
const TEILE = "inhalte/agent-fuer-routineaufgaben/";

function datenbank(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf-8"));
  db.exec(readFileSync(new URL("../db/seed.sql", import.meta.url), "utf-8"));
  return db;
}

function belegung(db: DatabaseSync) {
  return db.prepare("SELECT begonnen_am, abgeschlossen_am FROM belegungen WHERE lernende_id = ? AND lernpaket_id = ?").get(LERNENDE, PAKET);
}

test("ohne Aufruf ist jedes Lernpaket nicht begonnen", () => {
  const db = datenbank();
  assert.deepEqual([...fortschritt(db, LERNENDE).values()], ["nicht begonnen", "nicht begonnen", "nicht begonnen", "nicht begonnen"]);
});

test("nach dem ersten Aufruf ist das Lernpaket begonnen", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, TEILE + "anleitung.md", "2026-11-09");
  assert.equal(fortschritt(db, LERNENDE).get(PAKET), "begonnen");
});

test("der erste Aufruf legt die Belegung mit dem Tag des Beginns an", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, TEILE + "erklaerseite.html", "2026-11-09");
  assert.deepEqual({ ...belegung(db) }, { begonnen_am: "2026-11-09", abgeschlossen_am: null });
});

test("je Bestandteil zählt nur der erste Aufruf", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, TEILE + "anleitung.md", "2026-11-09");
  aufrufFesthalten(db, LERNENDE, TEILE + "anleitung.md", "2026-11-10");
  const zeilen = db.prepare("SELECT geoeffnet_am FROM aufrufe WHERE lernende_id = ?").all(LERNENDE) as { geoeffnet_am: string }[];
  assert.deepEqual(zeilen.map((z) => z.geoeffnet_am), ["2026-11-09"]);
});

test("sind alle drei Bestandteile geöffnet, ist das Lernpaket abgeschlossen", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, TEILE + "anleitung.md", "2026-11-09");
  aufrufFesthalten(db, LERNENDE, TEILE + "erklaerseite.html", "2026-11-10");
  aufrufFesthalten(db, LERNENDE, TEILE + "workbook.md", "2026-11-11");
  assert.equal(fortschritt(db, LERNENDE).get(PAKET), "abgeschlossen");
  assert.deepEqual({ ...belegung(db) }, { begonnen_am: "2026-11-09", abgeschlossen_am: "2026-11-11" });
});

test("nur das Workbook geöffnet ergibt begonnen, nicht abgeschlossen (E1)", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, TEILE + "workbook.md", "2026-11-09");
  assert.equal(fortschritt(db, LERNENDE).get(PAKET), "begonnen");
  assert.deepEqual({ ...belegung(db) }, { begonnen_am: "2026-11-09", abgeschlossen_am: null });
});

test("ein Aufruf eines Entwurfs legt weder Aufruf noch Belegung an (E7)", () => {
  const db = datenbank();
  aufrufFesthalten(db, LERNENDE, "inhalte/lernfortschritt-anzeigen/workbook.md", "2026-11-09");
  const zaehlen = (tabelle: string) => (db.prepare(`SELECT count(*) AS n FROM ${tabelle} WHERE lernende_id = ?`).get(LERNENDE) as { n: number }).n;
  assert.equal(zaehlen("aufrufe"), 0);
  assert.equal(zaehlen("belegungen"), 0);
});

test("erneutes Öffnen ändert den Tag des Abschlusses nicht (E9)", () => {
  const db = datenbank();
  for (const datei of ["anleitung.md", "erklaerseite.html", "workbook.md"]) aufrufFesthalten(db, LERNENDE, TEILE + datei, "2026-11-09");
  aufrufFesthalten(db, LERNENDE, TEILE + "workbook.md", "2026-11-20");
  assert.equal(fortschritt(db, LERNENDE).get(PAKET), "abgeschlossen");
  assert.deepEqual({ ...belegung(db) }, { begonnen_am: "2026-11-09", abgeschlossen_am: "2026-11-09" });
});

test("Belegungen aus den Startdaten gelten weiter (E8)", () => {
  const db = datenbank();
  assert.equal(fortschritt(db, 2).get(2), "abgeschlossen"); // Leonie Brandt, abgeschlossen am 2026-03-17
  assert.equal(fortschritt(db, 3).get(4), "begonnen"); // Emil Carstens, begonnen ohne Abschluss
});
