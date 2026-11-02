# Übergabe: Grill-Ergebnis zum Wunsch-Feature „Lernfortschritt anzeigen“

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**Für:** die nächste Session, die mit `/to-spec` aus diesem Grill-Ergebnis die Spec macht. Erkundung der Codebasis: `docs/erkundung.md`.

## Ziel

Lernende sehen auf der Übersicht je Lernpaket, ob sie es noch nicht begonnen, begonnen oder abgeschlossen haben.

## Ausgangslage im Code

- Die Tabelle `belegungen` hat die Felder `begonnen_am` und `abgeschlossen_am`; nur die Startdaten in `db/seed.sql` füllen sie, kein Code unter `src/` liest oder schreibt die Tabelle.
- Keine Tabelle hält fest, welche Bestandteile eine Lernende geöffnet hat.
- Jedes Lernpaket hat drei Bestandteile in `bestandteile`: Workbook, Anleitung und Erklärseite; der Server liefert sie über die Route `/inhalte/` in `src/server.ts`.

## Entscheidungen

| Nr | Frage | Entscheidung |
|---|---|---|
| E1 | Wann gilt ein Lernpaket als abgeschlossen? | Ein Lernpaket gilt als abgeschlossen, sobald die Lernende alle seine Bestandteile (Workbook, Anleitung, Erklärseite) mindestens einmal geöffnet hat. Das Öffnen des Workbooks allein reicht nicht. |
| E2 | Wann gilt ein Lernpaket als begonnen? | Sobald die Lernende den ersten Bestandteil öffnet; dann entsteht die Belegung mit `begonnen_am`. |
| E3 | Wo steht, welche Bestandteile geöffnet sind? | In einer neuen Tabelle `aufrufe` mit `lernende_id`, `bestandteil_id` und `geoeffnet_am`; je Lernende und Bestandteil zählt nur der erste Aufruf. |
| E4 | Welcher Tag gilt als Abschluss? | Der Tag, an dem die Lernende den letzten noch fehlenden Bestandteil öffnet; er steht in `belegungen.abgeschlossen_am`. |
| E5 | Was zeigt die Übersicht? | Je Lernpaket einen der drei Zustände „nicht begonnen“, „begonnen“, „abgeschlossen“; keine Prozentangabe. |
| E6 | Wer sieht den Fortschritt? | Nur die angemeldete Lernende, und nur ihren eigenen; die Kuratorin sieht keinen Fortschritt. |
| E7 | Zählen Entwürfe? | Nein; ein Aufruf eines Bestandteils eines Entwurfs legt keine Belegung an. |
| E8 | Was gilt für die Belegungen aus den Startdaten? | Sie bleiben gültig, wie sie sind; ein abgeschlossenes Lernpaket bleibt abgeschlossen, auch ohne Einträge in `aufrufe`. |
| E9 | Kann ein Abschluss wieder verschwinden? | Nein; erneutes Öffnen ändert nichts, Lernende können den Fortschritt nicht zurücksetzen. |

## Außerhalb des Umfangs

- Eine Auswertung des Fortschritts für die Kuratorin.
- Eine Schaltfläche, mit der Lernende ein Lernpaket selbst als erledigt markieren.
- Die Route `/inhalte/` prüft weder Rolle noch Status (`docs/erkundung.md`, Abschnitt Entwürfe); das ist ein eigenes Thema.

## Suggested skills

- `/to-spec` mit dieser Datei, danach `/to-tickets`.
