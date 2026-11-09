-- Schema der Lernplattform von Lernwerk Nord. Lernwerk Nord ist fiktiv – synthetische Schulungsdaten.
-- Maßgeblich für alle Tabellen und Felder.

CREATE TABLE kuratorinnen (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwort_hash TEXT NOT NULL
);

CREATE TABLE lernende (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwort_hash TEXT NOT NULL,
  angemeldet_am TEXT NOT NULL
);

CREATE TABLE lernpakete (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  titel TEXT NOT NULL,
  thema TEXT NOT NULL,
  niveau TEXT NOT NULL CHECK (niveau IN ('einsteiger', 'fortgeschritten')),
  dauer_minuten INTEGER NOT NULL CHECK (dauer_minuten BETWEEN 1 AND 60),
  status TEXT NOT NULL CHECK (status IN ('veroeffentlicht', 'entwurf')),
  beschreibung TEXT NOT NULL,
  kuratiert_von INTEGER NOT NULL REFERENCES kuratorinnen(id),
  veroeffentlicht_am TEXT
);

CREATE TABLE bestandteile (
  id INTEGER PRIMARY KEY,
  lernpaket_id INTEGER NOT NULL REFERENCES lernpakete(id),
  art TEXT NOT NULL CHECK (art IN ('workbook', 'anleitung', 'erklaerseite')),
  titel TEXT NOT NULL,
  pfad TEXT NOT NULL
);

CREATE TABLE belegungen (
  lernende_id INTEGER NOT NULL REFERENCES lernende(id),
  lernpaket_id INTEGER NOT NULL REFERENCES lernpakete(id),
  begonnen_am TEXT NOT NULL,
  abgeschlossen_am TEXT,
  PRIMARY KEY (lernende_id, lernpaket_id)
);

CREATE TABLE aufrufe (
  lernende_id INTEGER NOT NULL REFERENCES lernende(id),
  bestandteil_id INTEGER NOT NULL REFERENCES bestandteile(id),
  geoeffnet_am TEXT NOT NULL,
  PRIMARY KEY (lernende_id, bestandteil_id)
);
