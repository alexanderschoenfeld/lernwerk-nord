# Lernplattform Lernwerk Nord

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten. Alle Personen, Konten und Inhalte sind erfunden.

Die Lernplattform zeigt Lernpakete hinter einem Login. Lernende sehen die veröffentlichten Lernpakete, die Kuratorin sieht dazu die Entwürfe. Ein Lernpaket besteht aus Workbook, Anleitung und Erklärseite und dauert höchstens eine Stunde.

## Starten

Voraussetzung: Node.js ab Version 22.18. Es gibt keine Pakete aus dem Netz; `npm install` lädt nichts herunter.

| Befehl | Was er tut |
|---|---|
| `npm install` | prüft die Umgebung |
| `npm run dev` | legt beim ersten Start `.env` und die Datenbank an und startet die Lernplattform unter http://localhost:3000 |
| `npm run reset` | setzt die Datenbank auf die Startdaten aus `db/seed.sql` zurück |
| `npm test` | führt die Tests unter `test/` aus |
| `npm run sql -- "SELECT ..."` | führt eine SQL-Abfrage auf `db/lernwerk.db` aus und zeigt das Ergebnis als Tabelle |

Anmelden können sich alle Konten aus `db/seed.sql` mit dem Passwort `lernwerk`, etwa `henrike.sommer@lernwerk-nord.example` (Kuratorin) oder `jonas.albers@lernwerk-nord.example` (Lernende).

## Aufbau

| Ort | Inhalt |
|---|---|
| `src/server.ts` | Webserver und Routen |
| `src/auth.ts` | Rollen, Anmeldung, Sitzungen |
| `src/lernpakete.ts` | Abfragen zu Lernpaketen und Bestandteilen |
| `src/seiten.ts` | HTML der Seiten |
| `src/db/schema.sql` | Schema der Datenbank, maßgeblich für alle Tabellen und Felder |
| `src/db/verbindung.ts` | Verbindung zur SQLite-Datenbank |
| `db/seed.sql` | Startdaten |
| `inhalte/` | Workbooks, Anleitungen und Erklärseiten der Lernpakete |
| `docs/` | Dokumentation |
| `scripts/` | Start, Zurücksetzen, SQL-Abfragen |
