# 02: Schaltfläche „Veröffentlichen“ für die Kuratorin

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**What to build:** Die Kuratorin sieht auf der Detailseite eines Entwurfs die Schaltfläche „Veröffentlichen“; danach ist das Lernpaket veröffentlicht, mit dem heutigen Tag als Tag der Veröffentlichung, und Lernende sehen es.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Die Schaltfläche steht nur für die Kuratorin und nur auf der Detailseite eines Entwurfs (E7, E8)
- [x] Veröffentlichen setzt den Status auf veröffentlicht und den Tag der Veröffentlichung auf heute; ein veröffentlichtes Lernpaket behält seinen Tag (E7)
- [x] Eine Anfrage zum Veröffentlichen von einer Lernenden lehnt der Server ab (E8)
- [x] Nach dem Veröffentlichen durch die Kuratorin sieht eine Lernende das Lernpaket auf der Übersicht
- [x] Ein Test für E7; `npm test` ist grün

## Comments

- Umgesetzt mit `/implement`: `veroeffentlichen` in `src/lernpakete.ts`, Route zum Veröffentlichen nur für die Kuratorin, Schaltfläche auf der Detailseite eines Entwurfs; `/code-review` gegen die Spec ohne offenen Befund; im Browser geprüft.
