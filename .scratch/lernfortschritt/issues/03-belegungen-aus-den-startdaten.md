# 03: Belegungen aus den Startdaten

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**What to build:** Eine Lernende mit Belegungen aus der Zeit vor diesem Feature sieht sie auf der Übersicht: abgeschlossene Lernpakete als „abgeschlossen“, begonnene als „begonnen“, auch ohne Einträge in `aufrufe`.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Eine Belegung aus den Startdaten mit Abschluss ergibt „abgeschlossen“, eine ohne Abschluss „begonnen“ (E8)
- [ ] Öffnet die Lernende danach die fehlenden Bestandteile eines begonnenen Lernpakets, gilt die Regel aus Ticket 01 (E1, E4)
- [ ] Nach einer Anmeldung als Lernende mit Belegungen aus den Startdaten zeigt die Übersicht ihre Zustände
- [ ] Ein Test für E8; `npm test` ist grün
