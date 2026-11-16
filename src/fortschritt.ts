// Lernfortschritt: Aufrufe von Bestandteilen festhalten und den Zustand je Lernpaket ableiten. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import type { DatabaseSync } from "node:sqlite";

export type Zustand = "nicht begonnen" | "begonnen" | "abgeschlossen";

function heute(): string {
  return new Date().toISOString().slice(0, 10);
}

function zustandVon(db: DatabaseSync, lernendeId: number, lernpaketId: number): Zustand {
  const belegung = db
    .prepare("SELECT abgeschlossen_am FROM belegungen WHERE lernende_id = ? AND lernpaket_id = ?")
    .get(lernendeId, lernpaketId) as { abgeschlossen_am: string | null } | undefined;
  if (belegung?.abgeschlossen_am) return "abgeschlossen";
  const { geoeffnet, gesamt } = db
    .prepare(
      "SELECT (SELECT count(*) FROM aufrufe a JOIN bestandteile b ON b.id = a.bestandteil_id WHERE a.lernende_id = ? AND b.lernpaket_id = ?) AS geoeffnet, " +
        "(SELECT count(*) FROM bestandteile WHERE lernpaket_id = ?) AS gesamt",
    )
    .get(lernendeId, lernpaketId, lernpaketId) as { geoeffnet: number; gesamt: number };
  if (geoeffnet > 0 && geoeffnet === gesamt) return "abgeschlossen";
  return belegung || geoeffnet > 0 ? "begonnen" : "nicht begonnen";
}

export function aufrufFesthalten(db: DatabaseSync, lernendeId: number, pfad: string, am = heute()): void {
  const teil = db
    .prepare(
      "SELECT b.id, b.lernpaket_id FROM bestandteile b JOIN lernpakete p ON p.id = b.lernpaket_id WHERE b.pfad = ? AND p.status = 'veroeffentlicht'",
    )
    .get(pfad.replaceAll("\\", "/")) as { id: number; lernpaket_id: number } | undefined;
  if (!teil) return;
  db.prepare("INSERT OR IGNORE INTO aufrufe (lernende_id, bestandteil_id, geoeffnet_am) VALUES (?, ?, ?)").run(lernendeId, teil.id, am);
  db.prepare("INSERT OR IGNORE INTO belegungen (lernende_id, lernpaket_id, begonnen_am) VALUES (?, ?, ?)").run(
    lernendeId,
    teil.lernpaket_id,
    am,
  );
  if (zustandVon(db, lernendeId, teil.lernpaket_id) === "abgeschlossen") {
    db.prepare(
      "UPDATE belegungen SET abgeschlossen_am = ? WHERE lernende_id = ? AND lernpaket_id = ? AND abgeschlossen_am IS NULL",
    ).run(am, lernendeId, teil.lernpaket_id);
  }
}

export function fortschritt(db: DatabaseSync, lernendeId: number): Map<number, Zustand> {
  const pakete = db.prepare("SELECT id FROM lernpakete WHERE status = 'veroeffentlicht' ORDER BY id").all() as { id: number }[];
  return new Map(pakete.map((p) => [p.id, zustandVon(db, lernendeId, p.id)]));
}
