# Spec: Hinweis auf neu veröffentlichte Lernpakete

Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.

**Status:** ready-for-agent · **Grundlage:** `docs/uebergaben/benachrichtigung-grillen.md`

## Problem

Lernende merken nicht, wenn die Kuratorin ein neues Lernpaket veröffentlicht; sie müssten die Übersicht selbst nach neuen Titeln absuchen. Gewünscht war eine Benachrichtigung per E-Mail, aber die Lernplattform kann keine E-Mails verschicken, und die Kuratorin kann in der Oberfläche gar nicht veröffentlichen.

## Lösung

Die Kuratorin veröffentlicht einen Entwurf mit einer Schaltfläche auf seiner Detailseite. Die Lernplattform merkt sich je Lernende den letzten Besuch der Übersicht und zeigt dort oben „Neu veröffentlicht seit Ihrem letzten Besuch“ mit den Titeln der neuen Lernpakete. Neu ist ein Lernpaket, dessen Tag der Veröffentlichung auf den Tag des letzten Besuchs der Übersicht fällt oder danach.

## User Stories

1. Als Lernende möchte ich oben auf der Übersicht sehen, welche Lernpakete seit meinem letzten Besuch veröffentlicht wurden, damit ich nichts Neues übersehe.
2. Als Lernende möchte ich, dass der Hinweis nach meinem nächsten Besuch verschwindet, damit er nur Neues zeigt.
3. Als Lernende möchte ich beim ersten Besuch keinen Hinweis sehen, damit nicht alle Lernpakete als neu erscheinen.
4. Als Lernende möchte ich von einem Titel im Hinweis direkt zur Detailseite des Lernpakets kommen, damit ich gleich anfangen kann.
5. Als Kuratorin möchte ich einen Entwurf auf seiner Detailseite mit einer Schaltfläche veröffentlichen, damit ich dafür keine Datenbank anfassen muss.
6. Als Kuratorin möchte ich, dass ein veröffentlichtes Lernpaket seinen Tag der Veröffentlichung behält, damit der Tag stimmt.
7. Als Kuratorin möchte ich, dass nur ich veröffentlichen kann, damit Lernende keine Entwürfe freigeben.

## Entscheidungen zur Umsetzung

- Kein Versand per E-Mail; der Hinweis steht in der Lernplattform (E1).
- Der Hinweis steht oben auf der Übersicht unter „Neu veröffentlicht seit Ihrem letzten Besuch“, je neues Lernpaket der Titel als Link zur Detailseite (E2).
- Neu ist ein Lernpaket, dessen Tag der Veröffentlichung auf den Tag des letzten Besuchs der Übersicht fällt oder danach. Der Tag der Veröffentlichung hat keine Uhrzeit, deshalb zählt auch der Tag des letzten Besuchs (E3).
- Jedes Öffnen der Übersicht durch eine Lernende ist ein Besuch; der Hinweis entsteht aus dem bisherigen letzten Besuch, danach gilt der heutige Tag (E4).
- Neues Feld für den Tag des letzten Besuchs je Lernende, leer bis zum ersten Besuch (E5).
- Ohne letzten Besuch zeigt die Übersicht keinen Hinweis (E6).
- Nur die Kuratorin veröffentlicht, mit einer Schaltfläche auf der Detailseite eines Entwurfs; Status veröffentlicht, Tag der Veröffentlichung heute; ein schon veröffentlichtes Lernpaket behält seinen Tag (E7).
- Die Kuratorin sieht keinen Hinweis, ihr Besuch zählt nicht; Lernende sehen keine Schaltfläche, und der Server lehnt ihre Anfrage zum Veröffentlichen ab (E8).

## Entscheidungen zu Tests

- Getestet wird von außen über die Funktionen, die einen Besuch der Übersicht festhalten und einen Entwurf veröffentlichen.
- Jeder Test baut eine Datenbank im Arbeitsspeicher aus Schema und Startdaten.
- Mindestens je ein Test für E3 (am Tag des letzten Besuchs veröffentlicht ist neu), E4 (beim nächsten Besuch ist der Hinweis weg), E6 (erster Besuch ohne Hinweis) und E7 (der Tag eines veröffentlichten Lernpakets bleibt).

## Außerhalb des Umfangs

- Ein Versand per E-Mail oder eine andere Nachricht außerhalb der Lernplattform.
- Ein veröffentlichtes Lernpaket wieder zum Entwurf machen.
- Eine Einstellung, mit der Lernende den Hinweis abschalten.
