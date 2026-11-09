// Tests zum Lernfortschritt (Ticket 01), mit npm test. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
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
