# Kontrollzentrum 2.0.0

**Der schnellste Weg von Idee zu Aktion auf deinem Windows-Desktop.**  
Kontrollzentrum 2.0.0 ist dein persönlicher Command-Hub für Web-Apps, Desktop-Apps und Spiele. Statt zwischen Browser, Startmenü, Desktop und zig Fenstern zu springen, steuerst du alles aus einer eleganten Oberfläche mit Suche, Hotkeys und Sprachbefehlen.

## Warum Kontrollzentrum?

Weil du keine Zeit für Klick-Marathons hast.

- **Ein zentraler Startpunkt** für Web- und Desktop-Apps
- **Sofortzugriff** per Suche, App-Hotkey oder Sprachbefehl
- **Saubere Organisation** mit Favoriten, Kategorien und Überkategorien
- **Produktiv-Extras** wie Notizen und Clipboard-Verlauf direkt integriert
- **Volle Kontrolle über Look & Feel** mit Theme-, Farb- und Hintergrund-Anpassung

## Neu in 2.0.0

Version **2.0.0** bringt Kontrollzentrum auf ein neues Level:

- Überarbeitete Oberfläche mit klarerem Flow und schnellerem Handling
- Überkategorien inkl. Icon-System und flexibler Sortierung
- Deutlich ausgebautes Drag-and-Drop für Apps und Kategorien
- Stärkere Sprachsteuerung mit besserem Matching für App-Namen und Launch-URIs
- Erweiterte Clipboard-Funktionen (Text + Bilder) inklusive Retention-Optionen
- Verbesserter Scan für Windows-Apps und Steam-Games (inkl. Cover/Icon-Fallbacks)
- Update-Check beim Start mit GitHub-Release-Anbindung

## Alle Funktionen im Überblick

### 1. App-Hub für alles

- Web-Apps (`https://...`) und Desktop-Apps (URI wie `discord://`, `steam://`, `ms-settings:` oder `file:///...`) in einer einheitlichen Grid-Ansicht
- Apps hinzufügen, bearbeiten, löschen und kategorisieren
- Automatische Favicons für Web-Apps + optional eigenes Icon (Upload)
- Schneller Launch direkt aus der Karte

### 2. Scannen statt eintippen

- Windows-App-Scan über Startmenü/App-Quellen
- Steam-Game-Scan inkl. `steam://run/<appid>` Launchlinks
- Icon-Erkennung lokal, inklusive Fallbacks
- Scan-Ergebnisse als Vorschläge direkt beim Hinzufügen nutzbar

### 3. Favoriten, Pins und Reihenfolge

- Apps als Favoriten markieren
- Eigener angepinnter Bereich für deine wichtigsten Tools
- Drag-and-Drop Sortierung für:
  - Favoriten-Reihenfolge
  - App-Reihenfolge innerhalb von Kategorien
  - Kategorie-Reihenfolge

### 4. Kategorien und Überkategorien

- Eigene Kategorien erstellen und verwalten
- Überkategorien für größere Strukturen (z. B. „Arbeit“, „Gaming“, „Privat“)
- Kategorien per Kontextmenü zwischen Überkategorien verschieben
- Icon-Auswahl für Kategorien/Überkategorien (inkl. Upload)
- Kategorien ein-/ausklappen und per Suche filtern

### 5. Suche und Hotkeys

- Hauptsuche über alle Apps (`STRG+F`)
- Kategorie-/Tab-Suche (`STRG+G`)
- **Globaler Hotkey** zum Ein-/Ausblenden des gesamten Kontrollzentrums
- **Pro-App Hotkeys** für direkten Start einzelner Apps

### 6. Sprachsteuerung (DE + EN)

- Wake-Word-Modus mit Standard-Ansprache („Kontrollzentrum / Control Center“) oder Custom-Wake-Words
- Befehle wie „starte/open/launch ...“
- Mikrofon-Auswahl und Voice-/Sound-Feedback konfigurierbar
- Stimmwahl (Systemstimmen, männlich/weiblich, optional nur Sound)
- Mehrere Aktivierungstöne
- Robustes Matching auch bei ähnlichen App-Namen

### 7. Notizen direkt im Hub

- Seitliche Notizleiste mit mehreren Seiten
- Seiten anlegen, löschen, leeren
- Seitenweise Sperren/Entsperren (Lock)
- Auto-Save mit Statusanzeige

### 8. Clipboard-Verlauf mit Mehrwert

- Verlauf für **Text und Bilder**
- Einträge mit einem Klick zurück in die Zwischenablage kopieren
- „Alles leeren“-Funktion
- Retention steuerbar nach:
  - maximaler Anzahl
  - Zeitfenster (z. B. 4/8/24/48 Stunden)

### 9. Design & Personalisierung

- Deutsch/Englisch Umschaltung
- Light/Dark Theme
- Akzentfarben + individuelle Farbe mit Helligkeitssteuerung
- Hintergrundmodi: Standard, Mono, Duo, Custom-Bild

### 10. Update-Ready

- GitHub-Updater integriert
- Beim Start wird auf Wunsch geprüft, ob eine neuere Version verfügbar ist
- Build erzeugt Installer + Updater-Artefakte

## Datenschutz

Kontrollzentrum ist auf lokale Nutzung ausgelegt:

- Deine App-Liste, Notizen, Kategorien, Hotkeys, Clipboard-Verlauf und UI-Einstellungen werden lokal auf deinem Gerät gespeichert.
- Keine Cloud-Pflicht. Kein Konto-Zwang. Kein Abo-Modell im Weg.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (`web/`)
- **Desktop Runtime:** Tauri v2 (`src-tauri/`)
- **Backend:** Rust (Scan, Clipboard, Global Shortcut, externe Launches)

## Voraussetzungen

- Windows 10/11
- Node.js + npm
- Rust Toolchain + Cargo

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Wenn PowerShell-Skripte blockieren:

```bash
cmd /c npm run dev
```

## Build (Release + Updater)

```bash
npm run build
```

## Projektstruktur

- `web/` Frontend (UI, Styles, Modals, App-Logik)
- `src-tauri/` Tauri-Konfiguration, Rust-Commands, Bundling/Updater

## Download

Aktuelle Releases:

- https://github.com/JannikFuerst/Kontrollzentrum/releases

## Lizenz

ISC

---

**Kontrollzentrum 2.0.0** ist nicht einfach ein Launcher.  
Es ist dein persönliches Kontrollpanel für Fokus, Tempo und einen Desktop, der endlich so arbeitet wie du.
