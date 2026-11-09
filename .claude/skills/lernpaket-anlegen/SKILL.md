---
name: lernpaket-anlegen
description: Legt ein neues Lernpaket der Lernplattform im Status entwurf an. Verwenden, wenn ein Lernpaket neu angelegt werden soll.
---

# Lernpaket anlegen

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

1. Lege den Ordner `inhalte/<slug>/` an; der Slug besteht aus Kleinbuchstaben, Ziffern und Bindestrichen.
2. Lege darin `workbook.md`, `anleitung.md` und `erklaerseite.html` an, nach dem Muster eines vorhandenen Lernpakets unter `inhalte/`, mit dem Hinweis „Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.“.
3. Ergänze in `db/seed.sql` eine `INSERT`-Zeile für die Tabelle `lernpakete` mit der nächsten freien `id`, `slug`, `titel`, `thema`, `niveau` (`einsteiger` oder `fortgeschritten`), `dauer_minuten` (1 bis 60), `status` `entwurf`, `beschreibung`, `kuratiert_von` 1 und `veroeffentlicht_am` NULL.
4. Ergänze in `db/seed.sql` drei `INSERT`-Zeilen für die Tabelle `bestandteile` mit den nächsten freien `id`, der `lernpaket_id` aus Schritt 3 und den Werten von `art`, `titel` und `pfad`: `workbook`, `Workbook`, `inhalte/<slug>/workbook.md`; `anleitung`, `Anleitung`, `inhalte/<slug>/anleitung.md`; `erklaerseite`, „Erklärseite: <Thema> auf einen Blick“, `inhalte/<slug>/erklaerseite.html`.
5. Führe `npm run reset` aus, damit `db/lernwerk.db` die neuen Zeilen enthält.
6. Prüfe mit `npm run sql -- "SELECT slug, status FROM lernpakete"`, dass das Lernpaket mit `entwurf` erscheint; als Kuratorin steht es nach `npm run dev` auf der Übersicht unter den Entwürfen, Lernende sehen es nicht.
