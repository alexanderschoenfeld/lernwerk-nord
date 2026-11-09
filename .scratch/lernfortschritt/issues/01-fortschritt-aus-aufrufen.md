# 01: Fortschritt aus den Aufrufen auf der Übersicht

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**What to build:** Öffnet eine angemeldete Lernende einen Bestandteil eines veröffentlichten Lernpakets, hält die Lernplattform den ersten Aufruf fest und führt die Belegung nach. Die Übersicht zeigt danach je Lernpaket „nicht begonnen“, „begonnen“ oder „abgeschlossen“. Ein Lernpaket gilt als abgeschlossen, sobald die Lernende alle seine Bestandteile (Workbook, Anleitung, Erklärseite) mindestens einmal geöffnet hat.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Tabelle `aufrufe` im Schema; je Lernende und Bestandteil zählt nur der erste Aufruf (E3)
- [x] Der erste Aufruf eines Bestandteils legt die Belegung mit dem Tag des Beginns an (E2)
- [x] Sind alle drei Bestandteile geöffnet, steht der Tag des letzten Aufrufs als Abschluss in der Belegung; nur das Workbook ergibt „begonnen“ (E1, E4)
- [x] Die Übersicht zeigt je Lernpaket genau einen der drei Zustände, ohne Prozentangabe (E5)
- [x] `npm test` führt die Tests aus und ist grün

## Comments

- Umgesetzt mit `/implement`: Tabelle `aufrufe`, `src/fortschritt.ts`, Übersicht mit Zustand; `npm test` grün (5 Tests).
