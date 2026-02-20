# Kontrollzentrum

Kontrollzentrum ist dein schneller App-Hub fuer Windows.
Web-Apps, Desktop-Apps, Sprachsteuerung, Clipboard-History und Notizen in einer klaren, modernen Oberfläche.

## Warum Kontrollzentrum

- Starte alles von einem Ort aus: Browser-Apps und Desktop-Programme
- Finde Apps per Suche oder Sprachbefehl in Sekunden
- Nutze Kategorien und Favoriten fuer einen sauberen Workflow
- Halte Notizen und Clipboard-Verlauf direkt im Tool
- Passe Look & Feel mit Theme, Accent und Background an

## Highlights in v1.2.1

- Voice-Upgrade mit Option `Keine Stimme (nur Sound)`
- Neue moderne Aktivierungssounds (Short Thud bleibt erhalten)
- Besseres Sprach-Matching fuer App-Namen und Aliase
- Steam-Game-Scan inkl. Steam-Launch-Links (`steam://run/<appid>`)
- Steam-Cover/Icons verbessert (lokal + CDN-Fallback)
- Scan-Verhalten verbessert: kein Auto-Scan beim Oeffnen, nur manuell
- Update-Hinweis beim Start, wenn auf GitHub eine neuere Version verfuegbar ist

## Download

Die neueste Version findest du hier:

- Releases: https://github.com/JannikFuerst/Kontrollzentrum/releases

## Features

- App-Management
- Web + Desktop Apps in einer Grid-Ansicht
- App-Scan fuer Windows-Apps + Steam-Games
- Favoritenbereich mit Drag-and-Drop
- Eigene Kategorien inkl. Management

- Voice Control
- Wake-Word + Command-Modus
- Sprachfeedback oder Sound-only
- Man/Female/No-Voice Auswahl
- Mehrere Aktivierungstoene

- Produktivitaet
- Notizen mit mehreren Seiten und Lock
- Clipboard-History mit Retention-Optionen
- Global Hotkey zum Ein-/Ausblenden

- Customization
- Deutsch / Englisch
- Light/Dark + Accent-Farben
- Background-Modi inkl. Custom Image

## Tech Stack

- Frontend: Vanilla HTML, CSS, JavaScript (`web/`)
- Desktop: Tauri v2 (`src-tauri/`)
- Backend: Rust Commands fuer Shell/Scan/Clipboard/Hotkey

## Voraussetzungen

- Windows 10/11
- Node.js + npm
- Rust Toolchain + Cargo

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Wenn PowerShell-Skripte blockiert sind:

```bash
cmd /c npm run dev
```

## Build (Installer + Updater Artefakte)

```bash
npm run build
```

Tauri erzeugt dabei Installer/Bundles sowie Updater-Artefakte fuer Releases.

## Projektstruktur

- `web/` UI, Styling, Modals, App-Logik
- `src-tauri/` Tauri-Konfig + Rust-Backend
- `src-tauri/src/lib.rs` Desktop-Commands

## Update-Flow

- App-Version in `package.json`, `src-tauri/Cargo.toml` und `src-tauri/tauri.conf.json`
- Release auf GitHub mit Tag `vX.Y.Z`
- Updater-Dateien aus dem Build bei der Release hochladen
- Beim naechsten App-Start sehen aeltere Versionen den Update-Hinweis

## Lizenz

ISC
