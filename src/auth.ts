// Rollen, Anmeldung und Sitzungen. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";

export type Rolle = "lernende" | "kuratorin";

export type Konto = { id: number; name: string; email: string; rolle: Rolle };

const sitzungen = new Map<string, Konto>();

function passwortPasst(passwort: string, gespeichert: string): boolean {
  const [verfahren, salt, hash] = gespeichert.split("$");
  if (verfahren !== "scrypt" || !salt || !hash) return false;
  const erwartet = Buffer.from(hash, "hex");
  const berechnet = scryptSync(passwort, salt, erwartet.length);
  return timingSafeEqual(erwartet, berechnet);
}

export function anmelden(db: DatabaseSync, email: string, passwort: string): string | null {
  const quellen: [string, Rolle][] = [["kuratorinnen", "kuratorin"], ["lernende", "lernende"]];
  for (const [tabelle, rolle] of quellen) {
    const zeile = db.prepare(`SELECT id, name, email, passwort_hash FROM ${tabelle} WHERE email = ?`).get(email) as
      | { id: number; name: string; email: string; passwort_hash: string }
      | undefined;
    if (zeile && passwortPasst(passwort, zeile.passwort_hash)) {
      const token = randomUUID();
      sitzungen.set(token, { id: zeile.id, name: zeile.name, email: zeile.email, rolle });
      return token;
    }
  }
  return null;
}

export function kontoZu(token: string | undefined): Konto | undefined {
  return token ? sitzungen.get(token) : undefined;
}

export function abmelden(token: string | undefined): void {
  if (token) sitzungen.delete(token);
}
