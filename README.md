# Kontrollzentrum

Moderne Tauri-Desktop-App (Tauri 2 + Vanilla JS) fuer den schnellen Zugriff auf Web- und Desktop-Apps in einer zentralen Oberflaeche.

**Version:** `3.0.0`

## Inhalt

1. [Produktidee](#produktidee)
2. [Feature-Set](#feature-set)
3. [Quick Start und Shortcuts](#quick-start-und-shortcuts)
4. [UI-Bereiche](#ui-bereiche)
5. [Technischer Aufbau](#technischer-aufbau)
6. [Installation und Development](#installation-und-development)
7. [Build und Release](#build-und-release)
8. [Datenmodell und Persistenz](#datenmodell-und-persistenz)
9. [Tauri Commands (Rust Backend)](#tauri-commands-rust-backend)
10. [Projektstruktur](#projektstruktur)
11. [Troubleshooting](#troubleshooting)
12. [Lizenz](#lizenz)

## Produktidee

Kontrollzentrum reduziert Kontextwechsel: statt Browser-Bookmarks, Startmenue-Suche und verstreuten Launchern hast du einen zentralen, schnellen Einstiegspunkt fuer alles.

Ziel: Apps finden, starten, organisieren und automatisieren in Sekunden.

## Feature-Set

- App-Hub mit Kartenansicht fuer Web- und Desktop-Apps
- Favoriten, angepinnte Apps und Hotkey-Ansicht
- Schnellfilter ueber Hauptsuche + Kategorie-Suche
- Kategorien + Ueberkategorien (inkl. Icon-Mapping)
- Drag-and-drop fuer Karten, Kategorien und Ueberkategorien
- Kontextmenues fuer App- und Kategorie-Aktionen
- Quick Launcher Overlay mit fuzzy / phonetic Matching
- Fester Quick-Shortcut: `Ctrl+Space` (Windows/Linux) / `Super+Space` (macOS)
- User-konfigurierbarer globaler Toggle-Hotkey (Fenster ein/ausblenden)
- Pro-App-Hotkeys (globale Registrierung ueber Tauri)
- Add/Edit-Modal mit Icon-Upload, Favicon, Scan-Auswahl und Hotkey-Capture
- Desktop-App-Scan unter Windows (Start Apps, Startmenue, Desktop, Steam)
- Notizen-Seitenleiste mit mehreren Seiten, Lock und Persistenz
- Clipboard-Historie (Text/Bild), inklusive Retention-Regeln
- Sprachsteuerung mit Wake Phrase + Befehlserkennung
- DE/EN Sprachumschaltung (i18n)
- Theming: Accent, Background Modes (theme/mono/duo/custom image)
- Update-Hinweis gegen GitHub Releases (`latest.json`)
- Profilspeicherung via Tauri (AppData), mit Shared-Profile-Export

## Quick Start und Shortcuts

### Shortcut-Ebenen

Im Projekt gibt es bewusst drei Shortcut-Typen:

1. **Quick Launcher (fix):**
   - Windows/Linux: `Ctrl+Space`
   - macOS: `Super+Space`
   - Oeffnet den Quick Launcher immer direkt mit Fokus im Eingabefeld

2. **Global Toggle Hotkey (einstellbar):**
   - In den Einstellungen aufnehmbar
   - Blendet das Hauptfenster ein/aus

3. **App Hotkeys (pro App):**
   - Im Add/Edit-Modal je App hinterlegbar
   - Startet die jeweilige App direkt

### Weitere Tastatur-Shortcuts in der UI

- `Ctrl/Cmd + F`: Fokus auf App-Suche
- `Ctrl/Cmd + G`: Fokus auf Kategorie-Suche
- Quick Launcher Navigation: `ArrowUp`, `ArrowDown`, `Enter`, `Escape`
- Hotkey-Capture abbrechen: `Escape`
- App-Hotkey im Modal loeschen waehrend Capture: `Backspace` oder `Delete`

## UI-Bereiche

- **Topbar:** Suche, Sprache, Voice Settings, Add-App, Settings
- **Tab-Bereich:** Alle, Favoriten, Hotkeys, dynamische Kategorien
- **Ueberkategorien:** frei anlegbar, reorderbar, Icon-unterstuetzt
- **Pinned Row:** schnelle Favoriten-Zeile oben
- **App Grid:** Karten mit Icon, Titel, Launch, Hotkey, Aktionen
- **Quick Launcher Overlay:** ultraschneller fuzzy Start
- **Notes Panel:** Seitenverwaltung, Lock-State, Persistenz
- **Clipboard Panel:** Verlauf mit zeit-/mengenbasierter Bereinigung
- **Modals:** Add/Edit App, Kategorieverwaltung, Icon Picker, Settings, Voice

## Technischer Aufbau

### Frontend

- Vanilla JS (`web/app.js`)
- Statisches HTML (`web/index.html`)
- Styles in `web/styles.css`
- Modals als HTML-Partial + JS-Helfer (`web/modals/*`)

### Desktop Shell

- Tauri 2 (`src-tauri`)
- Rust Commands fuer:
  - Global Shortcuts
  - App Shortcuts
  - Desktop-App Scan (Windows)
  - Clipboard IO (Text/Bild)
  - Externes Oeffnen
  - Profil laden/speichern

### Wichtige Plugins

- `tauri-plugin-global-shortcut`
- `tauri-plugin-shell`
- `tauri-plugin-updater`

## Installation und Development

### Voraussetzungen

- Node.js 20+
- Rust Toolchain (stable)
- Tauri Prerequisites fuer dein OS
- Windows: WebView2 Runtime (bei aktuellen Systemen meist bereits installiert)

### Projekt starten

```bash
npm install
npm run tauri dev
```

Das Projekt nutzt in Dev ein statisches Frontend unter `http://127.0.0.1:1420`.

### Nuetzliche NPM-Skripte

- `npm run tauri dev` -> Desktop App im Dev-Modus
- `npm run tauri build` -> Installer/Bundles bauen
- `npm run profile:export` -> `%APPDATA%\\com.jannik.kontrollzentrum\\profile.json` nach `src-tauri/profile.shared.json` kopieren

## Build und Release

### Lokaler Release Build

```bash
npm run tauri build
```

Typische Bundle-Ausgaben liegen unter:

- `src-tauri/target/release/bundle/`

### GitHub Release per Tag

Im Repo ist ein Workflow vorhanden: `.github/workflows/release.yml`.

Trigger:

- Push eines Tags nach Muster `v*.*.*` (z. B. `v3.0.0`)

Ablauf:

- GitHub Action baut die Windows-Artefakte via `tauri-apps/tauri-action`
- Release + Artefakte werden am Tag erstellt/aktualisiert

### Versionierung (dieses Release)

`3.0.0` ist in diesen Dateien gepflegt:

- `package.json`
- `package-lock.json`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`
- `src-tauri/tauri.conf.json`
- `web/index.html` (`#versionTag`)

## Datenmodell und Persistenz

### Profil (Tauri AppData)

Das Profil wird als JSON gespeichert und beim Start geladen.

Default Keys:

- `kc_apps`
- `kc_pinned_order`
- `kc_cat_order`
- `kc_categories`
- `kc_cat_tabs`
- `kc_super_categories`
- `kc_super_tab_order`
- `kc_super_icon_map`
- `kc_category_icon_map`

### LocalStorage (UI/Runtime Settings)

Zusatzdaten werden lokal gehalten, z. B.:

- Sprache, Theme, Accent, Background-Optionen
- Notes/Clipboard States
- Hotkey- und Voice-Settings
- Rail/UI-Status

## Tauri Commands (Rust Backend)

Folgende Commands sind im Frontend per `window.__TAURI__.core.invoke` nutzbar:

- `open_external`
- `scan_desktop_apps`
- `set_window_icon`
- `load_profile_state`
- `save_profile_state`
- `set_global_shortcut`
- `set_app_shortcuts`
- `get_clipboard_text`
- `get_clipboard_payload`
- `set_clipboard_text`
- `set_clipboard_image`

## Projektstruktur

```text
.
|- web/
|  |- index.html
|  |- styles.css
|  |- app.js
|  |- assets/
|  `- modals/
|     |- add-app.modal.html
|     `- add-app.modal.js
|- src-tauri/
|  |- src/lib.rs
|  |- Cargo.toml
|  |- tauri.conf.json
|  `- icons/
|- scripts/
|  `- export-shared-profile.ps1
`- .github/workflows/release.yml
```

## Troubleshooting

### `Ctrl+Space` oeffnet nichts

- Pruefen, ob die App als Tauri Desktop App laeuft (nicht nur im Browser)
- Pruefen, ob ein anderes Tool den Shortcut global blockiert
- Dev-Konsole/Terminal auf Shortcut-Registerfehler pruefen

### App-Icon wirkt unscharf

- Nur hochaufgeloeste Basisdatei als Quelle nutzen (`app-icon-base.png`)
- Danach `npm run tauri icon <pfad-zur-datei>` ausfuehren
- Build neu starten

### Scan liefert keine Desktop-Apps

- Feature ist fuer Windows implementiert
- Auf anderen Plattformen liefert `scan_desktop_apps` leer zurueck

### Update-Hinweis kommt nicht

- Internetzugriff auf GitHub Releases erforderlich
- `latest.json` muss im letzten Release vorhanden sein

## Lizenz

`package.json` enthaelt aktuell `ISC`.

Wenn du eine eigene Lizenzdatei nutzen willst, lege zusaetzlich eine `LICENSE` im Repo-Root an.
