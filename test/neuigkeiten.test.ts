// Tests zum Hinweis auf neu veröffentlichte Lernpakete (Ticket 01), mit npm test. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { uebersichtBesucht } from "../src/neuigkeiten.ts";

const LERNENDE = 7; // Theo Grote
const ENTWURF = "benachrichtigung-per-e-mail";
const TITEL = "Wunsch-Feature: Benachrichtigung per E-Mail";

function datenbank(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf-8"));
  db.exec(readFileSync(new URL("../db/seed.sql", import.meta.url), "utf-8"));
  return db;
}

// ohne Schaltfläche: einen Entwurf direkt in der Datenbank veröffentlichen, wie mit npm run sql
function veroeffentlicht(db: DatabaseSync, am: string): void {
  db.prepare("UPDATE lernpakete SET status = 'veroeffentlicht', veroeffentlicht_am = ? WHERE slug = ?").run(am, ENTWURF);
}

function titel(db: DatabaseSync, am: string): string[] {
  return uebersichtBesucht(db, LERNENDE, am).map((n) => n.titel);
}

test("beim ersten Besuch gibt es keinen Hinweis (E6)", () => {
  const db = datenbank();
  assert.deepEqual(titel(db, "2026-11-16"), []);
});

test("der Besuch hält den Tag als letzten Besuch fest", () => {
  const db = datenbank();
  titel(db, "2026-11-16");
  assert.deepEqual({ ...db.prepare("SELECT letzter_besuch_am FROM lernende WHERE id = ?").get(LERNENDE) }, { letzter_besuch_am: "2026-11-16" });
});

test("ein nach dem letzten Besuch veröffentlichtes Lernpaket ist neu", () => {
  const db = datenbank();
  titel(db, "2026-11-16");
  veroeffentlicht(db, "2026-11-17");
  assert.deepEqual(titel(db, "2026-11-18"), [TITEL]);
});

test("am Tag des letzten Besuchs veröffentlicht zählt als neu (E3)", () => {
  const db = datenbank();
  titel(db, "2026-11-16");
  veroeffentlicht(db, "2026-11-16");
  assert.deepEqual(titel(db, "2026-11-16"), [TITEL]);
});

test("beim nächsten Besuch an einem späteren Tag ist der Hinweis weg (E4)", () => {
  const db = datenbank();
  titel(db, "2026-11-16");
  veroeffentlicht(db, "2026-11-17");
  titel(db, "2026-11-18");
  assert.deepEqual(titel(db, "2026-11-19"), []);
});
