# Kontrollzentrum — Open Beta 1.1.6

Dein persoenliches Control Center fuer Web- und Desktop-Apps. Schnell, clean, anpassbar.

## Warum Kontrollzentrum?
- Alles an einem Ort: Web-Apps, Desktop-Apps und Store-Apps
- Sofortiger Zugriff durch Favoriten und Pin-Leiste
- Kategorien und Drag & Drop fuer perfekte Ordnung
- Ein Klick: App starten, bearbeiten oder loeschen
- Globaler Hotkey zum Ein-/Ausblenden
- Starker Look: Light/Dark, Akzentfarben, Backgrounds

## Was du machen kannst
- Apps manuell hinzufuegen oder per Windows-Scan finden
- Kategorien erstellen, sortieren und verwalten
- Favoriten anpinnen fuer schnellen Zugriff
- Apps direkt auf der Karte bearbeiten
- Hintergrund und Akzentfarben individuell anpassen
- Hotkey setzen (z.B. zum schnellen Ein- und Ausblenden)

## Screens
Siehe `web/` fuer UI-Assets und Styling.

## Voraussetzungen
- Node.js + npm
- Rust + Cargo
- Tauri CLI

## Entwicklung
```
npm run tauri dev
```

## Build
```
npm run tauri build
```

## Open Beta
Diese Version ist **Open Beta 1.1.6**.  
Feedback zu UX, Bugs und Ideen ist sehr willkommen.

## License
ISC

## Neu in 1.1.3
- App-Icon Auswahl in den Einstellungen (Standard, Schwarz, Weiss, Blau/Lila)
- Auswahl bleibt gespeichert und wird beim Start automatisch gesetzt


## Neu in 1.1.4
- Custom Background: kein Fehler mehr beim Oeffnen des Dateidialogs

## Neu in 1.1.6
- App-Icon-Themes entfernt (kein zufaelliges Setzen mehr)
- Farbpunkte bei Karten entfernt (keine Standardfarbe mehr)


