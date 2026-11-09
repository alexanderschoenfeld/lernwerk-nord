# Issue-Tracker: lokale Markdown-Dateien

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

Specs und Tickets dieser Codebasis liegen als Markdown-Dateien unter `.scratch/`.

## Konventionen

- Ein Feature je Ordner: `.scratch/<feature-slug>/`, etwa `.scratch/lernfortschritt/`.
- Die Spec ist `.scratch/<feature-slug>/spec.md`.
- Tickets liegen als eine Datei je Ticket unter `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, nummeriert ab `01`, nie als gemeinsame Datei.
- Der Stand eines Tickets steht in einer Zeile `Status:` oben in der Datei: `ready-for-agent`, `ready-for-human` oder `done`.
- Kommentare kommen unten in der Datei unter die Überschrift `## Comments`.

## Wenn ein Skill sagt „im Issue-Tracker veröffentlichen“

Lege eine neue Datei unter `.scratch/<feature-slug>/` an, den Ordner bei Bedarf mit.

## Wenn ein Skill sagt „das Ticket holen“

Lies die Datei unter dem genannten Pfad; meist nennt die Person den Pfad oder die Nummer des Tickets.
