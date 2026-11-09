# Coding Standards der Lernplattform

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

Gilt für jede Änderung am Code unter `src/`, `scripts/` und `test/`. Was hier nicht steht, entscheidet der bestehende Code.

## Sprache und Abhängigkeiten

- TypeScript, das Node.js ab 22.18 direkt ausführt; kein Build-Schritt, keine Pakete aus dem Netz.
- Datenbank nur über `node:sqlite`; Tests nur mit `node:test` und `node:assert`.
- Namen von Dateien, Funktionen und Variablen auf Deutsch, wie im bestehenden Code.

## Aufbau

- Abfragen an die Datenbank stehen in Funktionen unter `src/`, nicht in `src/server.ts` und nicht in `src/seiten.ts`.
- `src/server.ts` ruft diese Funktionen auf und gibt ihr Ergebnis an die Seiten; `src/seiten.ts` erzeugt nur HTML.
- Jede Abfrage nutzt `prepare` mit Platzhaltern `?`; Werte werden nie in den SQL-Text eingesetzt.
- Text aus der Datenbank kommt in HTML nur über `escape`.

## Tests

- Jede neue Funktion unter `src/`, die etwas entscheidet, hat Tests unter `test/` mit der Endung `.test.ts`; `npm test` führt sie aus.
- Tests prüfen das Verhalten von außen über die Funktionen eines Moduls, nicht einzelne Abfragen.
- Jeder Test baut seine Datenbank im Arbeitsspeicher aus `src/db/schema.sql` und `db/seed.sql`; kein Test ändert `db/lernwerk.db`.
- `npm test` ist vor jedem Commit grün.

## Commits

- Jede Änderung, die zu einem Ticket gehört, nennt das Ticket in der Commit-Nachricht.
