# Spec: Lernfortschritt anzeigen

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**Status:** ready-for-agent · **Grundlage:** `docs/uebergaben/lernfortschritt-grillen.md`

## Problem

Lernende sehen auf der Übersicht der Lernplattform nicht, welche Lernpakete sie schon begonnen und welche sie abgeschlossen haben. Die Datenbank kennt Belegungen mit Beginn und Abschluss, aber nichts in der Lernplattform setzt sie, und niemand hat festgelegt, wann ein Lernpaket abgeschlossen ist.

## Lösung

Die Lernplattform hält fest, welche Bestandteile eine Lernende öffnet, und leitet daraus den Zustand jedes Lernpakets ab. Ein Lernpaket gilt als abgeschlossen, sobald die Lernende alle seine Bestandteile (Workbook, Anleitung, Erklärseite) mindestens einmal geöffnet hat. Die Übersicht zeigt je Lernpaket „nicht begonnen“, „begonnen“ oder „abgeschlossen“.

## User Stories

1. Als Lernende möchte ich auf der Übersicht je Lernpaket sehen, ob ich es nicht begonnen, begonnen oder abgeschlossen habe, damit ich weiß, wo ich weitermache.
2. Als Lernende möchte ich, dass ein Lernpaket als begonnen gilt, sobald ich den ersten Bestandteil öffne, damit ich nichts eigens anklicken muss.
3. Als Lernende möchte ich, dass ein Lernpaket erst als abgeschlossen gilt, wenn ich Workbook, Anleitung und Erklärseite geöffnet habe, damit „abgeschlossen“ heißt, dass ich alles gesehen habe.
4. Als Lernende möchte ich, dass ein Abschluss bestehen bleibt, auch wenn ich das Lernpaket später wieder öffne, damit mein Fortschritt nicht verschwindet.
5. Als Lernende möchte ich, dass meine Belegungen aus der Zeit vor diesem Feature weiter gelten, damit abgeschlossene Lernpakete abgeschlossen bleiben.
6. Als Lernende möchte ich nur meinen eigenen Fortschritt sehen, damit niemand sonst ihn sieht.
7. Als Kuratorin möchte ich die Übersicht wie bisher sehen, ohne Fortschritt von Lernenden, damit sich für mich nichts ändert.
8. Als Kuratorin möchte ich, dass Aufrufe von Bestandteilen eines Entwurfs keinen Fortschritt erzeugen, damit Entwürfe nicht als begonnen gelten.

## Entscheidungen zur Umsetzung

- Abschluss: Ein Lernpaket gilt als abgeschlossen, sobald die Lernende alle seine Bestandteile (Workbook, Anleitung, Erklärseite) mindestens einmal geöffnet hat. Das Öffnen des Workbooks allein reicht nicht (E1).
- Beginn: Sobald die Lernende den ersten Bestandteil öffnet, entsteht die Belegung mit dem Tag des Beginns (E2).
- Neue Tabelle `aufrufe` mit Lernende, Bestandteil und Tag des Öffnens; je Lernende und Bestandteil zählt nur der erste Aufruf (E3).
- Tag des Abschlusses ist der Tag, an dem die Lernende den letzten noch fehlenden Bestandteil öffnet; er steht in der Belegung (E4).
- Die Übersicht zeigt je Lernpaket genau einen der Zustände „nicht begonnen“, „begonnen“, „abgeschlossen“, ohne Prozentangabe (E5).
- Nur die angemeldete Lernende sieht ihren eigenen Fortschritt; die Kuratorin sieht keinen (E6).
- Entwürfe zählen nicht; ein Aufruf eines Bestandteils eines Entwurfs legt keine Belegung an (E7).
- Belegungen aus den Startdaten bleiben gültig, wie sie sind; ein abgeschlossenes Lernpaket bleibt abgeschlossen, auch ohne Aufrufe (E8).
- Ein Abschluss verschwindet nicht; erneutes Öffnen ändert nichts, Lernende können den Fortschritt nicht zurücksetzen (E9).
- Ein neues Modul für den Fortschritt bietet zwei Funktionen an: eine hält einen Aufruf fest, eine liefert je Lernpaket den Zustand für eine Lernende. Server und Übersicht nutzen nur diese beiden.

## Entscheidungen zu Tests

- Getestet wird nur von außen über die beiden Funktionen des Moduls für den Fortschritt, nicht über einzelne Abfragen.
- Jeder Test baut eine Datenbank im Arbeitsspeicher aus Schema und Startdaten und prüft den Zustand nach einer Folge von Aufrufen.
- `npm test` führt die Tests mit dem eingebauten Testrunner von Node.js aus; es kommt kein Paket dazu.
- Mindestens je ein Test für E1 (nur Workbook geöffnet ergibt „begonnen“), E7 (Entwurf ergibt keine Belegung) und E8 (abgeschlossene Belegung aus den Startdaten bleibt „abgeschlossen“).

## Außerhalb des Umfangs

- Eine Auswertung des Fortschritts für die Kuratorin.
- Eine Schaltfläche, mit der Lernende ein Lernpaket selbst als erledigt markieren.
- Die Route `/inhalte/` prüft weder Rolle noch Status; das bleibt ein eigenes Thema.

## Weitere Hinweise

- Fragen zum Datenmodell beantwortet das Schema, nicht `docs/datenmodell.md`; die Beschreibung ist veraltet.
