// Abfragen zu Lernpaketen und Bestandteilen. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import type { DatabaseSync } from "node:sqlite";
import type { Rolle } from "./auth.ts";

export type Lernpaket = {
  id: number;
  slug: string;
  titel: string;
  thema: string;
  niveau: string;
  dauer_minuten: number;
  status: string;
  beschreibung: string;
};

export type Bestandteil = { art: string; titel: string; pfad: string };

export function sichtbareLernpakete(db: DatabaseSync, rolle: Rolle): Lernpaket[] {
  const filter = rolle === "kuratorin" ? "" : "WHERE status = 'veroeffentlicht'";
  return db
    .prepare(`SELECT id, slug, titel, thema, niveau, dauer_minuten, status, beschreibung FROM lernpakete ${filter} ORDER BY id`)
    .all() as Lernpaket[];
}

export function lernpaket(db: DatabaseSync, slug: string, rolle: Rolle): Lernpaket | undefined {
  return sichtbareLernpakete(db, rolle).find((p) => p.slug === slug);
}

export function bestandteileVon(db: DatabaseSync, id: number): Bestandteil[] {
  return db.prepare("SELECT art, titel, pfad FROM bestandteile WHERE lernpaket_id = ? ORDER BY id").all(id) as Bestandteil[];
}
