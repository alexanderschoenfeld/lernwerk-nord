---
name: datenbank-aendern
description: Schritte, um Tabellen, Felder oder Startdaten der Lernplattform zu ändern (src/db/schema.sql, db/seed.sql, npm run reset). Verwenden, wenn eine Tabelle, ein Feld, ein erlaubter Wert oder die Startdaten geändert werden sollen.
---

# Datenbank ändern

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

## Was du wissen musst

- Die Datenbank ist die Datei `db/lernwerk.db`; sie steht in `.gitignore`, enthält nur Startdaten und darf jederzeit weggeworfen werden.
- Maßgeblich für Tabellen und Felder ist `src/db/schema.sql`, nicht `docs/datenmodell.md`; diese Beschreibung ist veraltet.
- Es gibt keine Migrationen und kein ORM. `npm run reset` löscht `db/lernwerk.db` und legt sie aus `src/db/schema.sql` und `db/seed.sql` neu an.
- Die Lernplattform nutzt `node:sqlite` aus Node.js; installiere kein Paket für die Datenbank.
- Daten in `db/lernwerk.db`, die nicht aus `db/seed.sql` stammen, gehen beim nächsten `npm run reset` verloren.

## Schritte

1. Ändere die Tabelle in `src/db/schema.sql`. Ein neues Feld mit `NOT NULL` braucht einen Wert in jeder Zeile von `db/seed.sql`.
2. Erlaubte Werte stehen als `CHECK` im Schema, etwa für `status`, `niveau` und `art`; ein neuer Wert braucht dort einen Eintrag.
3. Passe jede `INSERT`-Zeile der betroffenen Tabelle in `db/seed.sql` an: Spaltenliste und Werte in derselben Reihenfolge.
4. Speichere Datumsangaben als Text im Format `JJJJ-MM-TT`, Zeitpunkte als `JJJJ-MM-TTThh:mm:ss`; das Format TT.MM.JJJJ gilt nur für Antworten.
5. Verweise aus einer neuen Tabelle mit `REFERENCES lernende(id)` oder `REFERENCES lernpakete(id)`. `node:sqlite` prüft Fremdschlüssel; eine Zeile in `db/seed.sql` mit einer ID, die es nicht gibt, lässt `npm run reset` scheitern.
6. Führe `npm run reset` aus. Meldet es einen Fehler, passen Schema und Startdaten nicht zusammen.
7. Prüfe das Ergebnis mit `npm run sql -- "SELECT ..."`, etwa die Zahl der Zeilen der geänderten Tabelle.
8. Nutzt Code unter `src/` die geänderte Tabelle, passe dort die Abfrage und den Typ an, etwa in `src/lernpakete.ts` den Typ `Lernpaket`.
9. Ändere das Schema nie nur in `db/lernwerk.db`, etwa mit `ALTER TABLE` über `npm run sql`; der nächste `npm run reset` verwirft die Änderung.

## Prüfen, bevor du fertig meldest

- `npm run reset` läuft ohne Fehler.
- `npm run dev` startet, und die Übersicht unter http://localhost:3000 lädt nach der Anmeldung.
- `git diff` zeigt Änderungen nur in `src/db/schema.sql`, `db/seed.sql` und den Dateien unter `src/`, die die Tabelle nutzen.
