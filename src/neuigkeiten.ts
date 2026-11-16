// Hinweis auf Lernpakete, die seit dem letzten Besuch der Übersicht veröffentlicht wurden (Ticket 01). Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import type { DatabaseSync } from "node:sqlite";

export type Neuigkeit = { slug: string; titel: string };

function heute(): string {
  return new Date().toISOString().slice(0, 10);
}

// Hält den Besuch der Übersicht fest und liefert, was seit dem bisherigen letzten Besuch veröffentlicht wurde.
// Der Tag der Veröffentlichung hat keine Uhrzeit; deshalb zählt auch der Tag des letzten Besuchs als neu.
export function uebersichtBesucht(db: DatabaseSync, lernendeId: number, am = heute()): Neuigkeit[] {
  const zeile = db.prepare("SELECT letzter_besuch_am FROM lernende WHERE id = ?").get(lernendeId) as
    | { letzter_besuch_am: string | null }
    | undefined;
  if (!zeile) return [];
  const neu = zeile.letzter_besuch_am
    ? (db
        .prepare(
          "SELECT slug, titel FROM lernpakete WHERE status = 'veroeffentlicht' AND veroeffentlicht_am >= ? ORDER BY veroeffentlicht_am DESC, id",
        )
        .all(zeile.letzter_besuch_am) as Neuigkeit[])
    : [];
  db.prepare("UPDATE lernende SET letzter_besuch_am = ? WHERE id = ?").run(am, lernendeId);
  return neu.map((n) => ({ slug: n.slug, titel: n.titel }));
}
