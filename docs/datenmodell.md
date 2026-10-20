# Datenmodell der Lernplattform

Stand: 12.03.2026 · Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

Diese Seite beschreibt die Tabellen der Lernplattform und die Rollen, mit denen man sich anmeldet.

## Tabellen

| Tabelle | Inhalt |
|---|---|
| `lernende` | Konten der Lernenden mit Name, E-Mail, Passwort-Hash und Anmeldezeitpunkt (`angemeldet_am`) |
| `admins` | Konten der Administration |
| `lernpakete` | Lernpakete mit Titel, Thema, Schwierigkeit, Dauer und Status |
| `bestandteile` | Workbook, Anleitung und Erklärseiten je Lernpaket |
| `belegungen` | Welche Lernenden welches Lernpaket begonnen oder abgeschlossen haben |

## Felder der Tabelle `lernpakete`

| Feld | Bedeutung | Werte |
|---|---|---|
| `titel` | Titel des Lernpakets | Text |
| `thema` | Themenbereich | Agenten, Automatisierung, Hosting, Nutzerverwaltung, Wunsch-Feature |
| `schwierigkeit` | Schwierigkeit für die Lernenden | `leicht`, `mittel`, `schwer` |
| `dauer_minuten` | Bearbeitungszeit | höchstens 60 |
| `status` | Sichtbarkeit | `veroeffentlicht`, `entwurf` |

## Rollen

| Rolle | Darf |
|---|---|
| `lernende` | veröffentlichte Lernpakete ansehen und bearbeiten |
| `admin` | alle Lernpakete ansehen, Entwürfe veröffentlichen, Konten verwalten |
