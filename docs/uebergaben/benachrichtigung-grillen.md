# Übergabe: Grill-Ergebnis zum Wunsch-Feature „Benachrichtigung per E-Mail“

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**Für:** die nächste Session, die mit `/to-spec` aus diesem Grill-Ergebnis die Spec macht. Begriffe: `GLOSSARY.md`.

## Ziel

Lernende erfahren, dass die Kuratorin ein neues Lernpaket veröffentlicht hat, ohne dass sie die Übersicht selbst nach neuen Titeln absuchen.

## Ausgangslage im Code

- Die Lernplattform verschickt keine E-Mails: `package.json` hat keine Abhängigkeiten, `.env.example` nennt keinen Mailserver, und `CODING_STANDARDS.md` verbietet Pakete aus dem Netz.
- Die Kuratorin kann in der Oberfläche nichts veröffentlichen; `src/server.ts` hat außer der Anmeldung keine Route für `POST`, den Status ändern nur `db/seed.sql` und `npm run sql`.
- Die Tabelle `lernende` hält nicht fest, wann eine Lernende zuletzt da war.

## Entscheidungen

| Nr | Frage | Entscheidung |
|---|---|---|
| E1 | Wie erfahren Lernende von einem neuen Lernpaket? | In der Lernplattform, nicht per E-Mail; ein Versand bräuchte einen Mailserver und ein Paket, beides fehlt, und das Paket verbietet `CODING_STANDARDS.md`. |
| E2 | Wo sehen Lernende den Hinweis? | Oben auf der Übersicht unter der Überschrift „Neu veröffentlicht seit Ihrem letzten Besuch“, mit dem Titel jedes neuen Lernpakets als Link zur Detailseite. |
| E3 | Was gilt als neu? | Neu ist ein Lernpaket, dessen Tag der Veröffentlichung auf den Tag des letzten Besuchs der Übersicht fällt oder danach. Der Tag der Veröffentlichung hat keine Uhrzeit; lieber zeigt der Hinweis ein Lernpaket an einem Tag zweimal als nie. |
| E4 | Was gilt als Besuch? | Jedes Öffnen der Übersicht durch eine Lernende; der Hinweis entsteht aus dem bisherigen letzten Besuch, danach gilt der heutige Tag als letzter Besuch. Beim nächsten Besuch an einem späteren Tag ist der Hinweis weg. |
| E5 | Wo steht der letzte Besuch? | In einem neuen Feld `letzter_besuch_am` der Tabelle `lernende`, leer bis zum ersten Besuch; Änderungen am Schema folgen dem Skill `datenbank-aendern`. |
| E6 | Was sehen Lernende beim ersten Besuch? | Keinen Hinweis; ohne letzten Besuch ist nichts neu. |
| E7 | Wer veröffentlicht, und wie? | Nur die Kuratorin, mit einer Schaltfläche „Veröffentlichen“ auf der Detailseite eines Entwurfs; sie setzt den Status auf veröffentlicht und den Tag der Veröffentlichung auf heute. Ein schon veröffentlichtes Lernpaket behält seinen Tag. |
| E8 | Was sieht die Kuratorin? | Keinen Hinweis; ihr Besuch der Übersicht wird nicht festgehalten. Lernende sehen keine Schaltfläche, und eine Anfrage zum Veröffentlichen von ihnen lehnt der Server ab. |

## Außerhalb des Umfangs

- Ein Versand per E-Mail oder eine andere Nachricht außerhalb der Lernplattform.
- Ein veröffentlichtes Lernpaket wieder zum Entwurf machen.
- Eine Einstellung, mit der Lernende den Hinweis abschalten.

## Glossar

`GLOSSARY.md` ergänzt um Veröffentlichen, Letzter Besuch und Neu veröffentlicht.

## Suggested skills

- `/to-spec` mit dieser Datei, danach `/to-tickets`.
