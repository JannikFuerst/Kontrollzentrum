# Kontrollzentrum

Ein schnelles Desktop-Control-Center auf Basis von Tauri, mit dem du Web- und Desktop-Apps zentral verwalten kannst.

## Highlights

- Web- und Desktop-Apps in einer gemeinsamen Uebersicht
- App-Scan fuer Windows-Desktop-Apps
- Favoritenbereich mit Drag-and-Drop-Reihenfolge
- Freie Kategorien inkl. Kategorie-Management
- Notizbereich mit mehreren Seiten, Loeschschutz und Lock
- Clipboard-Verlauf mit einstellbarer Aufbewahrung
- Hotkey zum Ein-/Ausblenden der App
- Theme-/Farb-/Hintergrund-Anpassung
- Sprachumschaltung (Deutsch / Englisch) per Globus-Button oben rechts

## Was in diesem Stand umgesetzt wurde

- Voller Sprach-Switch DE/EN fuer Haupt-UI
- Sprach-Switch DE/EN fuer:
  - App-hinzufuegen-Modal
  - Einstellungen
  - Kategorien-Management
  - Confirm-Dialoge und zentrale Laufzeittexte
- Sprach-Button fest oben rechts positioniert
- Stabilerer Dev-Start:
  - Tauri laeuft ueber lokalen Dev-Server (`http://127.0.0.1:1420`)
  - Rust-Build-Target liegt ausserhalb von OneDrive (`%LOCALAPPDATA%\\Kontrollzentrum\\cargo-target`)

## Tech-Stack

- Frontend: Vanilla HTML/CSS/JavaScript (`web/`)
- Desktop Shell: Tauri v2 (`src-tauri/`)
- Rust Backend fuer Desktop-Integrationen (Open External, Clipboard, App Scan, Hotkey)

## Voraussetzungen

- Node.js + npm
- Rust Toolchain + Cargo
- Windows (fuer Desktop-Scan und bestimmte Integrationen)

## Installation

```bash
npm install
```

## Entwicklung

In PowerShell kann `npm.ps1` je nach Policy blockiert sein. Dann einfach:

```bash
cmd /c npm run dev
```

Normal (wenn deine PowerShell-Policy es erlaubt):

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Projektstruktur

- `web/` Frontend (UI, Modals, Styling, i18n-Logik)
- `src-tauri/` Tauri + Rust
- `src-tauri/src/lib.rs` Backend-Commands

## Release / Tagging

Historische Tags im Repo nutzen das Schema `vX.Y.Z`.
Fuer diesen Stand wurde der zusaetzliche Tag `1.1.3` gesetzt.

## Lizenz

ISC
