# Übergabe: Grill-Ergebnis zum Wunsch-Feature „Lesezeichen und Notizen“

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**Für:** die nächste Session, die mit `/to-spec` aus diesem Grill-Ergebnis die Spec macht.

## Entscheidungen

- Eine Lernende setzt ein Lesezeichen auf ein ganzes Lernpaket, nicht auf einen Bestandteil; Begründung: Ein Lernpaket ist in höchstens einer Stunde durchgearbeitet, und Bestandteile sind nur drei Dateien.
- Je Lernende und Lernpaket gibt es höchstens ein Lesezeichen; Begründung: Ein zweites Lesezeichen auf dasselbe Lernpaket sagt nichts Neues.
- Eine Notiz gehört zum Lesezeichen und damit zum ganzen Lernpaket; ohne Lesezeichen gibt es keine Notiz; Begründung: eine Stelle zum Merken, eine Stelle zum Schreiben.
- Eine Notiz ist reiner Text ohne Formatierung und darf leer sein; Begründung: Es geht um einen Gedanken, nicht um ein Dokument.
- Notizen und Lesezeichen sind privat; die Kuratorin sieht sie nicht, auch nicht anonym gezählt; Begründung: Lernende sollen frei schreiben, und eine Auswertung hat niemand verlangt.
- Lesezeichen gibt es nur auf veröffentlichte Lernpakete; Begründung: Lernende sehen Entwürfe nicht (`sichtbareLernpakete` in `src/lernpakete.ts`).
- Auf der Detailseite eines Lernpakets setzt und entfernt die Lernende das Lesezeichen und bearbeitet die Notiz; Begründung: Dort arbeitet sie mit dem Lernpaket.
- Eine eigene Seite „Meine Lesezeichen“ listet alle Lesezeichen der angemeldeten Lernenden mit Titel des Lernpakets und Notiz, das zuletzt gesetzte zuerst; Begründung: so verlangt im Vorschlag.
- Entfernt die Lernende das Lesezeichen, ist auch die Notiz weg; Begründung: Eine Notiz ohne Lesezeichen hätte keinen Ort mehr.
- Die Daten liegen in einer neuen Tabelle `lesezeichen` mit `lernende_id`, `lernpaket_id`, `notiz` und `gesetzt_am`; Änderungen am Schema folgen den Schritten zum Ändern der Datenbank in dieser Codebasis; Begründung: eine Zeile je Lesezeichen, die Notiz hängt daran.

## Offen

Keine offene Entscheidung.
