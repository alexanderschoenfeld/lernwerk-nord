// Tests zum Veröffentlichen durch die Kuratorin (Ticket 02), mit npm test. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { sichtbareLernpakete, veroeffentlichen } from "../src/lernpakete.ts";
import { uebersichtBesucht } from "../src/neuigkeiten.ts";

const ENTWURF = "benachrichtigung-per-e-mail";

function datenbank(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf-8"));
  db.exec(readFileSync(new URL("../db/seed.sql", import.meta.url), "utf-8"));
  return db;
}

function paket(db: DatabaseSync, slug: string) {
  return { ...db.prepare("SELECT status, veroeffentlicht_am FROM lernpakete WHERE slug = ?").get(slug) };
}

test("ein Entwurf wird mit dem Tag veröffentlicht und für Lernende sichtbar (E7)", () => {
  const db = datenbank();
  assert.equal(veroeffentlichen(db, ENTWURF, "2026-11-17"), true);
  assert.deepEqual(paket(db, ENTWURF), { status: "veroeffentlicht", veroeffentlicht_am: "2026-11-17" });
  assert.ok(sichtbareLernpakete(db, "lernende").some((p) => p.slug === ENTWURF));
});

test("ein veröffentlichtes Lernpaket behält seinen Tag (E7)", () => {
  const db = datenbank();
  assert.equal(veroeffentlichen(db, "agent-fuer-routineaufgaben", "2026-11-17"), false);
  assert.deepEqual(paket(db, "agent-fuer-routineaufgaben"), { status: "veroeffentlicht", veroeffentlicht_am: "2026-02-02" });
});

test("nach dem Veröffentlichen steht das Lernpaket im Hinweis für Lernende", () => {
  const db = datenbank();
  uebersichtBesucht(db, 7, "2026-11-16");
  veroeffentlichen(db, ENTWURF, "2026-11-17");
  assert.deepEqual(uebersichtBesucht(db, 7, "2026-11-18").map((n) => n.titel), ["Wunsch-Feature: Benachrichtigung per E-Mail"]);
});
