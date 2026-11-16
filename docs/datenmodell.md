# Datenmodell der Lernplattform

Stand: 16.11.2026 · Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

Diese Seite beschreibt die Tabellen der Lernplattform und die Rollen, mit denen man sich anmeldet. Maßgeblich ist `src/db/schema.sql`; jede Änderung am Schema wird hier nachgetragen. Die Fachbegriffe und ihre Regeln stehen in `GLOSSARY.md`.

## Tabellen

| Tabelle | Inhalt |
|---|---|
| `kuratorinnen` | Konten der Kuratorinnen mit Name, E-Mail und Passwort-Hash |
| `lernende` | Konten der Lernenden mit Name, E-Mail, Passwort-Hash und Anmeldezeitpunkt |
| `lernpakete` | Lernpakete mit Titel, Thema, Niveau, Dauer und Status |
| `bestandteile` | Workbook, Anleitung und Erklärseite je Lernpaket |
| `belegungen` | Welche Lernenden welches Lernpaket begonnen und abgeschlossen haben |
| `aufrufe` | Welche Lernenden welchen Bestandteil zum ersten Mal geöffnet haben |

## Felder der Tabelle `kuratorinnen`

| Feld | Bedeutung | Werte |
|---|---|---|
| `id` | Schlüssel | Zahl |
| `name` | Name der Kuratorin | Text |
| `email` | Adresse für die Anmeldung | Text, eindeutig |
| `passwort_hash` | Passwort als scrypt-Hash | Text |

## Felder der Tabelle `lernende`

| Feld | Bedeutung | Werte |
|---|---|---|
| `id` | Schlüssel | Zahl |
| `name` | Name der Lernenden | Text |
| `email` | Adresse für die Anmeldung | Text, eindeutig |
| `passwort_hash` | Passwort als scrypt-Hash | Text |
| `angemeldet_am` | Zeitpunkt, zu dem das Konto angelegt wurde | `JJJJ-MM-TTThh:mm:ss` |

## Felder der Tabelle `lernpakete`

| Feld | Bedeutung | Werte |
|---|---|---|
| `id` | Schlüssel | Zahl |
| `slug` | Kurzname in Adressen und Ordnern unter `inhalte/` | Kleinbuchstaben, Ziffern, Bindestriche; eindeutig |
| `titel` | Titel des Lernpakets | Text |
| `thema` | Themenbereich | Agenten, Automatisierung, Hosting, Nutzerverwaltung, Wunsch-Feature |
| `niveau` | Vorwissen, das das Lernpaket voraussetzt | `einsteiger`, `fortgeschritten` |
| `dauer_minuten` | Bearbeitungszeit | 1 bis 60 |
| `status` | Sichtbarkeit | `veroeffentlicht`, `entwurf` |
| `beschreibung` | Ein Satz zum Inhalt | Text |
| `kuratiert_von` | Kuratorin, die das Lernpaket pflegt | Verweis auf `kuratorinnen` |
| `veroeffentlicht_am` | Tag der Veröffentlichung | `JJJJ-MM-TT`, leer bei `entwurf` |

## Felder der Tabelle `bestandteile`

| Feld | Bedeutung | Werte |
|---|---|---|
| `id` | Schlüssel | Zahl |
| `lernpaket_id` | Lernpaket, zu dem der Bestandteil gehört | Verweis auf `lernpakete` |
| `art` | Art des Bestandteils | `workbook`, `anleitung`, `erklaerseite` |
| `titel` | Titel auf der Detailseite | Text |
| `pfad` | Datei unter `inhalte/` | Text |

## Felder der Tabelle `belegungen`

Schlüssel ist das Paar aus `lernende_id` und `lernpaket_id`.

| Feld | Bedeutung | Werte |
|---|---|---|
| `lernende_id` | Lernende | Verweis auf `lernende` |
| `lernpaket_id` | Lernpaket | Verweis auf `lernpakete` |
| `begonnen_am` | Tag, an dem die Lernende das Lernpaket begonnen hat | `JJJJ-MM-TT` |
| `abgeschlossen_am` | Tag des Abschlusses; leer, solange das Lernpaket nicht abgeschlossen ist | `JJJJ-MM-TT` oder leer |

## Felder der Tabelle `aufrufe`

Schlüssel ist das Paar aus `lernende_id` und `bestandteil_id`; je Lernende und Bestandteil zählt nur der erste Aufruf.

| Feld | Bedeutung | Werte |
|---|---|---|
| `lernende_id` | Lernende | Verweis auf `lernende` |
| `bestandteil_id` | Geöffneter Bestandteil | Verweis auf `bestandteile` |
| `geoeffnet_am` | Tag des ersten Öffnens | `JJJJ-MM-TT` |

## Rollen

| Rolle | Konten in | Darf |
|---|---|---|
| `lernende` | `lernende` | veröffentlichte Lernpakete ansehen und bearbeiten, den eigenen Lernfortschritt sehen |
| `kuratorin` | `kuratorinnen` | alle Lernpakete ansehen, auch Entwürfe; sieht keinen Lernfortschritt |
