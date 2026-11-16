# 01: Hinweis „Neu veröffentlicht seit Ihrem letzten Besuch“

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**What to build:** Öffnet eine angemeldete Lernende die Übersicht, hält die Lernplattform den Tag als letzten Besuch fest und zeigt oben die Lernpakete, die seit dem bisherigen letzten Besuch veröffentlicht wurden. Neu ist ein Lernpaket, dessen Tag der Veröffentlichung auf den Tag des letzten Besuchs der Übersicht fällt oder danach.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Neues Feld für den Tag des letzten Besuchs je Lernende, leer bis zum ersten Besuch, mit dem Skill `datenbank-aendern` (E5)
- [x] Jedes Öffnen der Übersicht durch eine Lernende hält den Tag fest; der Besuch der Kuratorin zählt nicht (E4, E8)
- [x] Die Übersicht zeigt oben „Neu veröffentlicht seit Ihrem letzten Besuch“ mit dem Titel jedes neuen Lernpakets als Link; ohne letzten Besuch keinen Hinweis (E2, E3, E6)
- [x] Prüfbar ohne Schaltfläche: als Lernende die Übersicht öffnen, einen Entwurf mit `npm run sql` veröffentlichen, die Übersicht neu laden
- [x] Kein Versand per E-Mail und kein neues Paket in `package.json` (E1)
- [x] Je ein Test für E3, E4 und E6; `npm test` ist grün

## Comments

- Umgesetzt mit `/implement`: Feld `letzter_besuch_am` mit dem Skill `datenbank-aendern` (Schema, `docs/datenmodell.md`), `src/neuigkeiten.ts`, Hinweis auf der Übersicht; `/code-review` gegen die Spec ohne offenen Befund; im Browser geprüft.
