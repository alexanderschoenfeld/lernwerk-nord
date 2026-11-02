# Erkundung der Lernplattform

Zusammenfassungen von Subagenten, je Aussage mit Datei und Stelle. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

## Entwürfe

| Aussage | Datei | Funktion oder Stelle in der Datei |
|---|---|---|
| Ein Lernpaket hat den Status `veroeffentlicht` oder `entwurf`; andere Werte lehnt die Datenbank ab. | `src/db/schema.sql` | Tabelle `lernpakete`, Spalte `status` mit `CHECK` |
| Die Rolle ergibt sich bei der Anmeldung aus der Tabelle, in der die E-Mail steht: `kuratorinnen` oder `lernende`. | `src/auth.ts` | Funktion `anmelden` |
| Die Kuratorin sieht alle Lernpakete, Lernende nur veröffentlichte. | `src/lernpakete.ts` | Funktion `sichtbareLernpakete`, Filter `WHERE status = 'veroeffentlicht'` |
| Die Übersicht zeigt genau die Lernpakete, die `sichtbareLernpakete` für die Rolle der angemeldeten Person liefert. | `src/server.ts` | Route `/lernpakete` |
| Ruft eine Lernende die Detailseite eines Entwurfs auf, antwortet der Server mit „Nicht gefunden“. | `src/server.ts` | Route `/lernpakete/` mit Slug, Funktion `lernpaket` |
| Entwürfe tragen in der Übersicht den Zusatz „Entwurf“ und einen farbigen Rand; sehen kann das nur die Kuratorin. | `src/seiten.ts` | Funktion `uebersicht`, Klasse `entwurf` |
| Dateien unter `/inhalte/` liefert der Server jeder angemeldeten Person, ohne Rolle oder Status zu prüfen; Workbook, Anleitung und Erklärseite eines Entwurfs sind über ihre Adresse auch für Lernende erreichbar. | `src/server.ts` | Route `/inhalte/` |

## Anmeldung und Sitzungen

| Aussage | Datei | Funktion oder Stelle in der Datei |
|---|---|---|
| Das Formular der Anmeldeseite schickt E-Mail und Passwort an `/anmelden`. | `src/seiten.ts` | Funktion `anmeldeseite`, Formular mit `action="/anmelden"` |
| Die Anmeldung sucht die E-Mail zuerst in `kuratorinnen`, dann in `lernende`. | `src/auth.ts` | Funktion `anmelden`, Liste `quellen` |
| Das Passwort wird mit scrypt gegen `passwort_hash` geprüft. | `src/auth.ts` | Funktion `passwortPasst` mit `scryptSync` und `timingSafeEqual` |
| Nach der Anmeldung entsteht ein zufälliges Token; die Sitzung liegt nur im Arbeitsspeicher des Servers. | `src/auth.ts` | Funktion `anmelden` mit `randomUUID`, Map `sitzungen` |
| Das Token geht als Cookie `sitzung` mit `HttpOnly` an den Browser; ohne gültige Sitzung führt jede Seite zur Anmeldung. | `src/server.ts` | Route `/anmelden` mit `set-cookie`, Zeile `if (!konto) return umleiten` |
| Abmelden löscht die Sitzung im Server und das Cookie im Browser. | `src/server.ts` | Route `/abmelden` mit `Max-Age=0`, Funktion `abmelden` |
| Eine Ablaufzeit der Sitzung ist nicht festgelegt; sie endet mit Abmelden oder einem Neustart des Servers. | offen: nicht im Code gefunden | kein `Max-Age` beim Anmelden, keine Zeitprüfung in `kontoZu` |
