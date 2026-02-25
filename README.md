# Kontrollzentrum

Kontrollzentrum ist ein moderner App-Hub für Windows: schnell, klar und auf produktives Arbeiten ausgelegt.  
Webseiten, Desktop-Programme, Kategorien, Sprachsteuerung, Notizen und Clipboard-Verlauf in einer Oberfläche.

## Version 2.0.2

`v2.0.2` ist das große UI- und Workflow-Update mit Fokus auf:

- konsistenteres Design und bessere Lesbarkeit
- sauberere Interaktionen im eingeklappten/ausgeklappten Modus
- überarbeitete Add-App- und Settings-Flows
- bessere Hotkey-Nutzung für einzelne Apps

## Kernfunktionen

- Apps zentral verwalten (Web + Desktop)
- Apps über Suche, Kategorien oder Favoriten starten
- Desktop-Scan für installierte Programme
- Sprachsteuerung mit Aktivierungswort
- Notizen mit Seitenverwaltung
- Clipboard-Verlauf mit Löschmodus (Anzahl oder Zeit)
- Individuelle Akzentfarbe inkl. eigener Farbauswahl
- Globaler Hotkey zum Anzeigen/Verstecken des Fensters

## Highlights in v2.0.2

- Deutlich überarbeitete Oberfläche in mehreren Bereichen (Karten, Popups, Dropdowns, Controls)
- Neue/verbesserte Interaktionen für Kategorien und Unterkategorien
- Verbesserte App-Bearbeitung mit stabilerem Verhalten im Modal
- Hotkey-Flow pro App ausgebaut (inkl. eigener Hotkey-Kategorie)
- Bessere Bedienung bei vielen Einträgen und kompakteren Layouts
- Versionierung und Release-Flow für `v2.0.2` vereinheitlicht

## Download

Die aktuelle Version findest du unter:

- https://github.com/JannikFuerst/Kontrollzentrum/releases

## Technologie

- Frontend: Vanilla HTML, CSS, JavaScript (`web/`)
- Desktop-App: Tauri v2 (`src-tauri/`)
- Backend: Rust (`src-tauri/src/`)

## Voraussetzungen

- Windows 10 oder Windows 11
- Node.js + npm
- Rust Toolchain + Cargo

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Falls PowerShell-Skripte blockiert sind:

```bash
cmd /c npm run dev
```

## Build (Installer)

```bash
npm run build
```

Der Build erzeugt u. a.:

- MSI-Installer
- NSIS-Setup (`.exe`)
- Updater-Artefakte (für GitHub Releases)

## Release-Prozess

1. Version hochziehen in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`
2. Commit erstellen
3. Tag setzen: `vX.Y.Z`
4. `main` + Tag pushen
5. GitHub Action erstellt den Release-Build

## Projektstruktur

- `web/` Frontend, UI-Komponenten, Modals, Styling
- `src-tauri/` Tauri-Konfiguration und Rust-Backend
- `.github/workflows/` CI/CD und Release-Automation

## Lizenz

ISC

