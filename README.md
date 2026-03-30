# Kontrollzentrum

Zentrale Windows-/Desktop-Oberflaeche auf Basis von Tauri 2 und Vanilla JavaScript fuer App-Starts, Kategorien, globale Hotkeys, Schnellstart, Sprachsteuerung sowie Makroautomatisierung.

**Version:** `3.5.0`

## Inhalt

1. [Kurzueberblick](#kurzueberblick)
2. [Wofuer das Projekt gedacht ist](#wofuer-das-projekt-gedacht-ist)
3. [Hauptfunktionen](#hauptfunktionen)
4. [Die beiden Arbeitsbereiche](#die-beiden-arbeitsbereiche)
5. [Appstart im Detail](#appstart-im-detail)
6. [Makroautomatisierung im Detail](#makroautomatisierung-im-detail)
7. [Hotkeys und Trigger](#hotkeys-und-trigger)
8. [UI, Sprache, Theme und Watermark](#ui-sprache-theme-und-watermark)
9. [Datenhaltung und Persistenz](#datenhaltung-und-persistenz)
10. [Rust-/Tauri-Commands](#rust-tauri-commands)
11. [Projektstruktur](#projektstruktur)
12. [Voraussetzungen](#voraussetzungen)
13. [Lokale Entwicklung](#lokale-entwicklung)
14. [Build und Release](#build-und-release)
15. [Versionierung auf 3.5.0](#versionierung-auf-350)
16. [Plattformhinweise und Grenzen](#plattformhinweise-und-grenzen)
17. [Troubleshooting](#troubleshooting)
18. [Lizenz](#lizenz)

## Kurzueberblick

`Kontrollzentrum` ist eine Desktop-App, die zwei Dinge miteinander verbindet:

1. Einen schnellen Launcher fuer Web-Apps, Desktop-Apps, Kategorien, Favoriten und Schnellzugriffe.
2. Eine Makro-Ebene fuer wiederkehrende Ablaeufe aus Apps/Dateien, Tastatur, Maus und Systemaktionen.

Das Projekt ist bewusst nicht als reine Bookmark-Sammlung gebaut, sondern als alltaegliches Steuerpult fuer wiederkehrende Arbeitsablaeufe.

## Wofuer das Projekt gedacht ist

Die App ist sinnvoll, wenn du:

- viele Web- und Desktop-Apps ueber den Tag verteilt startest,
- Programme nicht mehr ueber Startmenue, Browser-Lesezeichen und Taskleiste zusammensuchen willst,
- globale Hotkeys fuer einzelne Apps oder komplette Makros nutzen moechtest,
- deine Arbeitsoberflaeche optisch anpassen willst,
- Notizen, Clipboard-Verlauf und Sprachbefehle direkt im selben Tool haben willst.

Typische Szenarien:

- Arbeitsstart mit Browser, Chat, Projektboard und IDE per Hotkey.
- Gaming-/Streaming-Setup mit Discord, Steam, OBS und Begleittools.
- Wiederkehrende Makros fuer Eingaben, Klicks oder Systemaktionen.
- Team- oder Privat-Launcher fuer zentrale Websites, Dateien und Tools.

## Hauptfunktionen

### Launcher und Organisation

- Web-Apps und Desktop-Apps in einer gemeinsamen Oberflaeche.
- Favoriten und angepinnte Apps.
- Kategorien und Ueberkategorien.
- Drag-and-drop fuer Karten, Kategorien und Ueberkategorien.
- Kontextmenues fuer App- und Kategorieaktionen.
- Quick Launcher / Quick Start als schnelle Overlay-Suche.
- Fuzzy- und phonetic-artiges Matching fuer schnellere Treffer.

### Desktop-Integration

- Globale Hotkeys zum Ein-/Ausblenden des Hauptfensters.
- Eigener Hotkey fuer den Quick Launcher.
- Pro-App-Hotkeys fuer direkte Starts.
- Windows-Desktop-Scan fuer Startmenue-, Desktop- und weitere App-Quellen.
- Systemnahes Oeffnen externer Ziele ueber Tauri Shell.

### Produktivitaetsfunktionen

- Notizen-Seitenleiste mit mehreren Seiten.
- Clipboard-Historie fuer Text und Bilder.
- Retention-Regeln fuer Clipboard nach Zeit oder Anzahl.
- DE/EN Umschaltung.
- Accent-, Theme- und Background-Konfiguration.
- Sprachsteuerung mit Wake-Words, Mikrofonwahl, Voice-Ausgabe und Aktivierungston.

### Makroautomatisierung

- `Apps & Dateien` Automationen.
- `Tastatur-Eingabe` Automationen.
- `Maus-Eingabe` Automationen.
- `System` Automationen.
- `Profile` als groessere Makros, die mehrere Bausteine miteinander verknuepfen.
- Trigger-Modi fuer Makros wie `once`, `hold` und `toggle`.
- Hotkey-Erfassung inklusive Konfliktpruefung fuer Automationen.

## Die beiden Arbeitsbereiche

Die App besitzt zwei Hauptbereiche, zwischen denen ueber das Oberflaechenmenue gewechselt wird.

### 1. Steuerung / Appstart

Dieser Bereich ist der klassische Launcher:

- Suche ueber alle Apps.
- Filter nach Favoriten, Kategorien und Ueberkategorien.
- Kartenansicht mit Icon, Titel, Ziel und Aktionen.
- Angepinnte Reihe fuer besonders wichtige Apps.
- Add/Edit-Modal fuer neue Eintraege.

### 2. Makroautomatisierung

Dieser Bereich verwaltet wiederverwendbare Aktionen und zusammengesetzte Ablaeufe:

- Einzelne Launch-Makros fuer Apps, Dateien, Ordner und URLs.
- Eingabe-Makros fuer Tastatur und Maus.
- System-Makros fuer Lautstaerke, Medien und Sperr-/Screenshot-Aktionen.
- Profile fuer groessere Flows mit mehreren Bausteinen.

Die aktive Surface wird in `localStorage` gespeichert (`kc_surface_mode_v1`), damit die App beim naechsten Start an derselben Stelle weiterarbeitet.

## Appstart im Detail

### Apps hinzufuegen und bearbeiten

Neue Eintraege werden ueber das Add/Edit-Modal gepflegt. Dort lassen sich unter anderem setzen:

- Name
- Ziel (`https://`, App-URI, Datei/Programmziel)
- Typ (`web`, `desktop`, `scan`)
- Kategorie
- eigenes Icon / Favicon / Scan-Icon
- App-Hotkey

Wenn `scan` genutzt wird, kann eine gefundene Desktop-App direkt ueber die Scanauswahl uebernommen werden.

### Kategorien und Ueberkategorien

Es gibt zwei Organisationsebenen:

- Kategorien fuer die normale App-Struktur.
- Ueberkategorien fuer hoehere Gruppierung ueber mehrere Kategorien hinweg.

Beide Ebenen koennen sortiert und teilweise mit Icons versehen werden. Die Reihenfolge wird im gespeicherten Profil gehalten.

### Favoriten, Pinned Row und Kontextmenues

- Favoriten koennen speziell gefiltert werden.
- Angepinnte Apps erscheinen in einer separaten oberen Reihe.
- Kontextmenues erlauben Bearbeiten, Loeschen, Favorisieren und Verwaltungsaktionen.

### Quick Launcher / Quick Start

Der Quick Launcher ist das schnelle Overlay zum Starten von Eintraegen direkt ueber die Tastatur.

Eigenschaften:

- global aufrufbar,
- eigene Trefferliste,
- Tastaturnavigation ueber `ArrowUp`, `ArrowDown`, `Enter`, `Escape`,
- Ziel fuer schnellen Fokuswechsel ohne komplette Navigation durch die Hauptoberflaeche.

Standard-Hotkey:

- macOS: `Super+Space`
- Windows/Linux: `Ctrl+Space`

Der Hotkey ist konfigurierbar und wird unter `kc_quick_launcher_hotkey` gespeichert.

### Notizen und Clipboard

#### Notizen

Die Notizleiste bietet:

- mehrere Seiten,
- Seitenwechsel ueber kleine Tabs,
- Lock/Unlock fuer Bearbeitung,
- Seiten loeschen/leeren,
- Statusanzeige fuer Speichern/Leerzustand.

Wichtige LocalStorage-Keys:

- `kc_notes`
- `kc_notes_page`
- `kc_notes_pages`
- `kc_notes_lock`

#### Clipboard-Verlauf

Die Clipboard-Funktion kann Text und Bildinhalte verwalten. Die Historie unterstuetzt mehrere Modi:

- manuell,
- nach maximaler Anzahl,
- nach Zeitfenster in Stunden.

Wichtige LocalStorage-Keys:

- `kc_clipboard_items`
- `kc_clipboard_retention_mode`
- `kc_clipboard_retention_hours`
- `kc_clipboard_retention_count`

### Sprachsteuerung

Die Sprachsteuerung ist direkt in die App integriert und umfasst:

- Aktivieren/Deaktivieren,
- Mikrofonwahl,
- Wake-Words,
- Sprachausgabe / Systemstimme,
- Aktivierungston,
- Befehle wie App-Starts ueber gesprochene Eingaben.

Wichtige Einstellungen in `localStorage`:

- `kc_voice_enabled`
- `kc_voice_mic`
- `kc_voice_name`
- `kc_voice_tone`
- `kc_voice_wake`
- `kc_voice_wake_mode`

## Makroautomatisierung im Detail

Die Makrooberflaeche liegt in [`web/automation.js`](web/automation.js) und organisiert mehrere Bibliotheken.

### Apps & Dateien

Storage-Key: `kc_apps_files_automations_v1`

Unterstuetzte Schrittarten:

- `app`
- `url`
- `file`
- `folder`
- `delay`

Sinnvoll fuer:

- mehrere Apps nacheinander oeffnen,
- Websites, Dateien und Ordner kombinieren,
- Startsequenzen fuer Arbeits- oder Gaming-Setups.

### Tastatur-Eingabe

Storage-Key: `kc_keyboard_automations_v1`

Unterstuetzte Schrittarten:

- `key`
- `combo`
- `delay`

Backend-Seite: `run_keyboard_sequence`

Damit lassen sich z. B. Tastendruecke, Tastenkombinationen und verzoegerte Abfolgen definieren.

### Maus-Eingabe

Storage-Key: `kc_mouse_automations_v1`

Unterstuetzte Schrittarten:

- `click`
- `down`
- `up`
- `move`
- `scroll`
- `delay`

Unterstuetzte Maustasten:

- `left`
- `right`
- `middle`
- `x1`
- `x2`

Backend-Seite: `run_mouse_sequence`

### System

Storage-Key: `kc_system_automations_v1`

Unterstuetzte Schrittarten:

- `volume`
- `media`
- `action`
- `delay`

Aktuell im Code vorhandene Aktionen:

- Lautstaerke: `volume_up`, `volume_down`, `volume_mute`
- Medien: `media_play_pause`, `media_next`, `media_previous`
- Aktionen: `screenshot_image`, `lock_screen`

Backend-Seite: `run_system_sequence`

### Profile

Storage-Key: `kc_profile_automations_v1`

Profile sind die oberste Makroebene. Ein Profil kann mehrere bereits vorhandene Bausteine zu einem groesseren Flow zusammensetzen:

- Apps & Dateien
- Tastatur
- Maus
- System
- Delay-Schritte

Trigger-Modi:

- `once`: einmaliger Lauf
- `hold`: laeuft waehrend des Haltens
- `toggle`: startet/stoppt als Umschalter

Profile eignen sich fuer komplette Szenarien wie:

- Streaming-Start
- Arbeitsumgebung oeffnen
- Spielstart inkl. Zusatztools
- wiederkehrende Test- oder Setup-Ablaeufe

## Hotkeys und Trigger

Im Projekt gibt es mehrere Hotkey-Ebenen.

### 1. Fenster-Hotkey

Der globale Toggle-Hotkey blendet das Hauptfenster ein oder aus.

Backend-Command:

- `set_global_shortcut`

### 2. Quick-Launcher-Hotkey

Oeffnet direkt den Quick Launcher.

Speicherung:

- `kc_quick_launcher_hotkey`

### 3. App-Hotkeys

Jede App kann einen eigenen Hotkey erhalten.

Backend-Command:

- `set_app_shortcuts`

### 4. Automations-Hotkeys

Jede Automation bzw. jedes Profil kann einen eigenen Hotkey besitzen. Hotkey-Konflikte werden in der UI erkannt und gemeldet.

### 5. Maus-Hotkeys fuer Automationen

Im Rust-Backend ist ausserdem eine Windows-spezifische Mouse-Hook-Logik vorhanden, damit bestimmte Automationen auch ueber Maus-Buttons und Modifikator-Kombinationen ausgelost werden koennen.

## UI, Sprache, Theme und Watermark

### Sprache

Die App unterstuetzt Deutsch und Englisch. Die Sprachumschaltung betrifft:

- UI-Texte,
- Tooltips,
- Modal-Inhalte,
- Teile der Sprachsteuerung.

Storage-Key:

- `kc_lang`

### Theme und Accent

Unterstuetzt werden mindestens:

- Theme-Modus
- Mono-Background
- Duo-Background
- Custom-Background
- vordefinierte Accent-Farben
- Custom-Accent ueber Farbrad und Helligkeit

Wichtige Keys:

- `kc_accent`
- `kc_accent_custom_base`
- `kc_accent_custom_brightness`
- `kc_bg_mode`

### Watermark unten rechts

Unten rechts im Fenster befindet sich eine feste `corner-meta`-Watermark. Sie zeigt jetzt explizit:

- den App-Namen `Kontrollzentrum`,
- die aktuelle Versionsnummer,
- den Credit `made by Jannik Fuerst`.

Die sichtbare Versionszeile wird ueber `window.__TAURI__.app.getVersion()` in [`web/app.js`](web/app.js) gesetzt und hat einen Fallback-Wert in [`web/index.html`](web/index.html).

## Datenhaltung und Persistenz

Das Projekt verwendet zwei Hauptspeicherorte.

### 1. Profilspeicherung ueber Tauri / AppData

App-bezogene Kerndaten werden als Profil ueber das Rust-Backend geladen und gespeichert.

Relevante Keys innerhalb des Profils:

- `kc_apps`
- `kc_pinned_order`
- `kc_cat_order`
- `kc_categories`
- `kc_cat_tabs`
- `kc_super_categories`
- `kc_super_tab_order`
- `kc_super_icon_map`
- `kc_category_icon_map`

Das Export-Skript [`scripts/export-shared-profile.ps1`](scripts/export-shared-profile.ps1) kopiert das Live-Profil aus `%APPDATA%\com.jannik.kontrollzentrum\profile.json` nach [`src-tauri/profile.shared.json`](src-tauri/profile.shared.json).

### 2. LocalStorage fuer UI- und Laufzeitdaten

LocalStorage haelt vor allem:

- Surface-Auswahl,
- Sprache,
- Quick-Launcher-Hotkey,
- Scan-Cache,
- Notes,
- Clipboard-Historie,
- Theme/Accent/Background,
- Voice-Einstellungen,
- Automationsbibliotheken.

Wichtige Keys im Frontend:

- `kc_surface_mode_v1`
- `kc_quick_launcher_hotkey`
- `kc_cat_rail_collapsed`
- `kc_scan_cache_v9`
- `kc_notes`
- `kc_notes_page`
- `kc_notes_pages`
- `kc_notes_lock`
- `kc_clipboard_items`
- `kc_clipboard_retention_mode`
- `kc_clipboard_retention_hours`
- `kc_clipboard_retention_count`
- `kc_accent`
- `kc_accent_custom_base`
- `kc_accent_custom_brightness`
- `kc_bg_mode`
- `kc_voice_enabled`
- `kc_voice_mic`
- `kc_voice_name`
- `kc_voice_tone`
- `kc_voice_wake`
- `kc_voice_wake_mode`
- `kc_apps_files_automations_v1`
- `kc_keyboard_automations_v1`
- `kc_mouse_automations_v1`
- `kc_system_automations_v1`
- `kc_profile_automations_v1`

## Rust-/Tauri-Commands

Die folgenden Commands sind im Backend registriert und stehen dem Frontend ueber Tauri zur Verfuegung:

- `open_external`
  Oeffnet externe Ziele ueber die Tauri-Shell.

- `run_keyboard_sequence`
  Fuehrt Tastatursequenzen aus.

- `run_mouse_sequence`
  Fuehrt Maussequenzen aus.

- `run_system_sequence`
  Fuehrt Systemaktionen aus.

- `pick_filesystem_target`
  Oeffnet Dateidialoge fuer Datei- oder Ordnerauswahl.

- `set_window_icon`
  Setzt das Fenstericon aus einem Data-URL-Bild.

- `load_profile_state`
  Laedt das gespeicherte Tauri-Profil.

- `save_profile_state`
  Speichert das Tauri-Profil.

- `get_clipboard_text`
  Liest Text aus der Zwischenablage.

- `get_clipboard_payload`
  Liest Text oder Bilddaten aus der Zwischenablage.

- `set_clipboard_text`
  Schreibt Text in die Zwischenablage.

- `set_clipboard_image`
  Schreibt ein Bild in die Zwischenablage.

- `scan_desktop_apps`
  Sucht Desktop-Apps unterstuetzt durch Windows-spezifische Quellen.

- `set_global_shortcut`
  Registriert den globalen Fenster-Hotkey.

- `set_app_shortcuts`
  Registriert App- und Automations-Hotkeys.

## Projektstruktur

```text
.
|- .github/
|  `- workflows/
|     `- release.yml
|- scripts/
|  `- export-shared-profile.ps1
|- src-tauri/
|  |- capabilities/
|  |- gen/
|  |- icons/
|  |- src/
|  |  |- lib.rs
|  |  `- main.rs
|  |- Cargo.toml
|  |- Cargo.lock
|  |- profile.shared.json
|  `- tauri.conf.json
|- web/
|  |- assets/
|  |- modals/
|  |  |- add-app.modal.html
|  |  `- add-app.modal.js
|  |- app.js
|  |- automation.js
|  |- index.html
|  `- styles.css
|- package.json
|- package-lock.json
`- README.md
```

## Voraussetzungen

Fuer Entwicklung und Build werden benoetigt:

- Node.js 20+
- Rust Stable Toolchain
- Tauri 2 Voraussetzungen fuer das jeweilige System
- unter Windows: WebView2 Runtime

## Lokale Entwicklung

### Installation

```bash
npm install
```

### Dev-Start

```bash
npm run tauri dev
```

Was dabei passiert:

- das Frontend wird lokal ueber `http://127.0.0.1:1420` serviert,
- Tauri startet die Desktop-App,
- Rust-Backend und Web-UI laufen zusammen.

### Weitere Skripte

```bash
npm run build
npm run profile:export
```

Bedeutung:

- `npm run build` baut die App ueber Tauri.
- `npm run profile:export` exportiert das Live-Profil nach `src-tauri/profile.shared.json`.

Hinweis:

- Es ist aktuell kein eigener Linter- oder Testlauf in `package.json` hinterlegt.
- Validierung erfolgt derzeit hauptsaechlich ueber den Build bzw. Lauf der App.

## Build und Release

### Lokaler Produktionsbuild

```bash
npm run build
```

Bundle-Ausgaben liegen typischerweise unter:

- `src-tauri/target/release/bundle/`

### GitHub-Release

Der Workflow liegt in [`release.yml`](.github/workflows/release.yml).

Trigger:

- Push eines Tags nach Muster `v*.*.*`

Ablauf:

1. Checkout des Repositories auf `windows-latest`.
2. Node-Setup mit Version 20.
3. `npm ci` fuer Frontend-Abhaengigkeiten.
4. Build und Release ueber `tauri-apps/tauri-action@v0`.

Fuer signierte Releases werden folgende Secrets genutzt:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- `GITHUB_TOKEN`

### Auto-Update

In [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json) ist der Update-Endpunkt auf GitHub Releases konfiguriert:

- `https://github.com/JannikFuerst/Kontrollzentrum/releases/latest/download/latest.json`

Die UI prueft beim Start auf Updates und vergleicht `latest.json` mit der lokal installierten App-Version.

## Versionierung auf 3.5.0

Fuer dieses Release wurde die Version konsistent auf `3.5.0` angehoben.

Betroffene Dateien:

- [`package.json`](package.json)
- [`package-lock.json`](package-lock.json)
- [`src-tauri/Cargo.toml`](src-tauri/Cargo.toml)
- [`src-tauri/Cargo.lock`](src-tauri/Cargo.lock)
- [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json)
- [`web/index.html`](web/index.html)
- [`README.md`](README.md)

Fuer den GitHub-Release-Workflow sollte das Tag als `v3.5.0` gepusht werden, weil genau dieses Format den Release-Workflow startet.

## Plattformhinweise und Grenzen

- Die App ist klar auf Desktop-Nutzung ausgelegt.
- Desktop-Scan ist in der Praxis vor allem fuer Windows relevant.
- Tastatur-, Maus- und Systemsequenzen sind im Rust-Backend aktuell nur fuer Windows implementiert.
- Sprachsteuerung benoetigt Browser-/WebView-Mikrofonzugriff.
- Ohne Tauri-Umgebung funktionieren bestimmte Features im reinen Browser nicht oder nur eingeschraenkt.

## Troubleshooting

### Der globale Hotkey reagiert nicht

- Pruefen, ob ein anderes Tool denselben Shortcut blockiert.
- Pruefen, ob die App als Desktop-App und nicht nur im Browser laeuft.
- Bei neuen Hotkeys einmal die App neu fokussieren oder neu starten.

### Der Quick Launcher oeffnet sich nicht

- Quick-Launcher-Hotkey in den Einstellungen kontrollieren.
- Konflikte mit Betriebssystem- oder Drittanbieter-Shortcuts ausschliessen.

### Desktop-Scan findet keine Apps

- Funktion ist fuer Windows gedacht.
- Startmenue-/Desktop-Eintraege muessen lokal verfuegbar sein.
- Bei sehr neuen Installationen hilft oft ein erneuter Scan oder App-Neustart.

### Sprachsteuerung reagiert nicht

- Mikrofonzugriff in Windows und in der WebView erlauben.
- das richtige Mikrofon im Voice-Dialog waehlen,
- Wake-Wort kontrollieren,
- pruefen, ob Voice-Control aktiviert ist.

### Clipboard bleibt leer

- Clipboard-Funktion funktioniert nur mit Tauri-Bridge vollstaendig.
- Bei Bilddaten auf gueltige Data-URL/Clipboard-Inhalte achten.

### Update-Hinweis erscheint nicht

- Es muss ein GitHub Release mit `latest.json` vorhanden sein.
- Internetzugriff auf GitHub darf nicht blockiert sein.
- Die lokale Version darf nicht bereits gleich oder neuer sein.

## Lizenz

Laut [`package.json`](package.json) ist aktuell `ISC` eingetragen.

Wenn du spaeter eine eigene Lizenzdatei pflegen willst, kannst du zusaetzlich eine `LICENSE` im Repo-Root anlegen.






