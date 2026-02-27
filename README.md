# Kontrollzentrum

**Version 2.0.7**  
**Status: vorerst finale Version (Wartungsmodus)**

Kontrollzentrum ist dein persönliches Operations-Dashboard für den digitalen Alltag: alle wichtigen Web-Apps an einem Ort, sofort startklar, ohne Reibung. Statt Tabs, Bookmarks, Zettel und mentalem Chaos bekommst du eine klare Startfläche, die täglich Zeit spart und Fokus zurückbringt.

Das ist kein "noch ein Launcher". Kontrollzentrum ist ein Arbeits- und Lebensbeschleuniger: schneller Zugriff, weniger Kontextwechsel, weniger Sucherei, mehr Output.

## Feature-Highlights

- Zentrale App-Übersicht mit Karten-Grid statt chaotischer Bookmark-Sammlungen
- Klare Navigation über Tabs: `Alle`, `Favoriten`, `Hotkeys`
- Blitzschnelle Suche und Filterlogik über Kategorien und Tabs
- Add-App-Modal mit strukturierten Eingaben und Icon-Workflow
- Persistenz vollständig lokal über `localStorage` (`kc_apps`)
- Favoriten-Stern (gelb aktiv), Ein-Klick-Start in neuem Tab, Löschen mit Confirm


## Warum Kontrollzentrum?

| Problem | Lösung mit Kontrollzentrum | Ergebnis im Alltag |
|---|---|---|
| Zu viele Tools, zu viele Tabs, zu viel Reibung | Einheitliche Startfläche mit Karten-Grid | Schnellere Starts, weniger Kontextwechsel |
| Wichtige Links gehen unter | Favoriten und Kategorien machen Prioritäten sichtbar | Kritische Apps sind immer 1 Klick entfernt |
| Zeitverlust durch Suchen | Kombination aus Tab-Filter + Suche | Sofortiges Finden statt Rumklicken |
| Unklare Tool-Landschaft im Team/Privat | Strukturierte App-Pflege über Modal | Konsistenz und bessere Routinen |

Kurz gesagt: Kontrollzentrum reduziert Mikro-Entscheidungen und Klickwege. Das summiert sich jeden Tag zu mehr Fokuszeit.

## Kernfeatures im Detail

### 1) App-Hub mit Karten-Grid

- Jede App erscheint als Karte im Grid und bleibt visuell eindeutig identifizierbar.
- Ein Klick auf die Karte öffnet die hinterlegte URL in einem neuen Tab.
- So ersetzt du "Bookmark-Ordner + Suchleiste + Tab-Chaos" durch einen klaren, schnellen Zugriffspunkt.

### 2) Tabs und Filterlogik (`Alle` / `Favoriten` / `Sonstiges`)

- `Alle` zeigt den kompletten Bestand deiner hinterlegten Apps.
- `Favoriten` zeigt nur priorisierte Apps für schnellen Daily-Zugriff.
- `Sonstiges` bündelt Einträge, die (noch) nicht in einer eigenen Kategorie geführt werden.
- Die Tab-Filter greifen direkt auf denselben Datenbestand zu, ohne Duplikate oder getrennte Listen.

### 3) Suche

- Die Suche filtert in Echtzeit und reduziert den sichtbaren App-Bestand sofort.
- In Kombination mit Tabs entsteht ein präziser Workflow: erst Bereich eingrenzen, dann gezielt suchen.
- Ergebnis: Auch bei wachsender App-Sammlung bleibt die Bedienung schnell und kontrollierbar.

### 4) Add-App-Modal (`add-app.modal.html` + `add-app.modal.js`)

Beim Anlegen einer neuen App werden strukturierte Metadaten gepflegt:

- `Name`
- `URL`
- `Kategorie`
- `Farbe`
- `Beschreibung`

Icon-Optionen im Modal:

- Automatisch per Favicon (Google s2-Service)
- Oder Upload eines eigenen Icons

Das Modal reduziert Eingabefehler, hält Einträge konsistent und sorgt für eine saubere, langfristig wartbare App-Sammlung.

### 5) Kartenaktionen

- Klick auf Karte: öffnet Ziel-URL im neuen Tab
- Favoriten-Stern: aktiv = gelb, inaktiv = neutral
- Löschen (`🗑`): immer mit Confirm-Dialog zur Absicherung

Damit bleibt die Oberfläche schnell bedienbar, ohne Risiko für versehentliche Datenverluste.

### 6) Persistenz und Datenlogik

- Alle App-Daten werden lokal unter dem Key `kc_apps` gespeichert.
- Favoriten-Status, Filterrelevanz und Kartenbestand stammen aus diesem lokalen Zustand.
- Löschen entfernt den Eintrag direkt aus `kc_apps` und damit dauerhaft aus der Oberfläche.

## Projektstruktur (relevanter Kern)

```text
web/
  index.html
  styles.css
  app.js
  modals/
    add-app.modal.html
    add-app.modal.js
```

Dateiverantwortung:

- `web/index.html`: Grundlayout, Topbar, Tabs, Suchfelder, Grid-Container, Modal-Root
- `web/styles.css`: komplettes Styling für Layout, Karten, Tabs, Modal, Zustände
- `web/app.js`: App-State, Rendering, Filterlogik, Kartenaktionen, LocalStorage-Handling
- `web/modals/add-app.modal.html`: Struktur des Add-App-Modals
- `web/modals/add-app.modal.js`: Modal-Interaktionen und Submit-Logik

## Installation / Setup

### Option A: Schnellstart im Browser

```bash
# Repository klonen
git clone <REPO_URL>
cd Kontrollzentrum
```

Dann `web/index.html` direkt im Browser öffnen.

### Option B: Empfohlen für lokale Entwicklung (Live Server)

1. Projekt in VS Code öffnen
2. Extension `Live Server` installieren
3. `web/index.html` mit "Open with Live Server" starten

Vorteil: zuverlässigeres Verhalten bei lokalen Assets und saubereres Testing als bei reinem `file://`.

### Option C: Optional über Tauri-Dev-Umgebung

```bash
npm install
npm run dev
```

## Nutzung

### Erste Schritte (Step-by-Step)

1. App hinzufügen über `App hinzufügen`
2. Im Modal `Name`, `URL`, `Kategorie`, `Farbe`, `Beschreibung` setzen
3. Icon wählen: automatisch per Favicon oder eigenes Icon hochladen
4. Speichern und prüfen, ob die Karte im Grid erscheint
5. Mit Stern als Favorit markieren (gelb = aktiv)
6. Über Tabs und Suche den Bestand filtern
7. Nicht mehr benötigte Einträge über `🗑` löschen und Confirm bestätigen

### Power-Workflows

| Workflow | Ablauf | Nutzen |
|---|---|---|
| Setup in 5 Minuten | Top-Apps erfassen, Kategorien setzen, Favoriten markieren | Sofort produktiv ohne langes Onboarding |
| Daily Use | Start über `Favoriten`, danach Suche für Long-Tail-Apps | Konstanter Fokus im Tagesgeschäft |
| Focus Mode | Nur Favoriten pflegen, Rest bewusst in `Alle` belassen | Weniger visuelle Ablenkung, schnellere Entscheidungen |

## Datenhaltung & Datenschutz

Kontrollzentrum speichert lokal im Browser (LocalStorage), insbesondere unter:

- `kc_apps`

Wichtige Punkte:

- Keine Cloud-Pflicht
- Keine externe Datenbank
- Keine Account-Abhängigkeit
- Offline-freundlich für die lokale Oberfläche und gespeicherte Konfiguration

Hinweis: Für automatische Favicons wird ein externer Favicon-Dienst genutzt (Google s2), sofern diese Option verwendet wird.

## Konfiguration & Erweiterbarkeit

| Ziel | Datei | Was du dort anpasst |
|---|---|---|
| Look and Feel | `web/styles.css` | Farben, Abstände, Kartenoptik, UI-States |
| Logik/State | `web/app.js` | Filter, Tab-Verhalten, Kartenaktionen, Storage-Flows |
| Modal-Felder/Struktur | `web/modals/add-app.modal.html` | Eingabefelder, Feldreihenfolge, Labels |
| Modal-Verhalten | `web/modals/add-app.modal.js` | Validierung, Icon-Handling, Submit-Payload |
| Grundlayout | `web/index.html` | Header, Tab-Bereiche, Suchfelder, Grid-Container |

Typische Erweiterungen:

- Neue Kategorien oder andere Standard-Kategorisierung
- Angepasste Kartenstile pro Kategorie/Farbe
- Eigene Validierungsregeln im Add-App-Flow

## Troubleshooting / FAQ

### Favicon wird nicht angezeigt

- Prüfe, ob die URL korrekt und erreichbar ist.
- Manche Seiten liefern kein verwertbares Favicon.
- Lösung: eigenes Icon im Modal hochladen.

### Karte öffnet nichts

- URL auf korrektes Format prüfen (`https://...`).
- Bei lokalem `file://` kann Browser-Sicherheitsverhalten einschränken.
- Teste den Flow über Live Server.

### App ist "verschwunden"

- Prüfe aktiven Tab (`Alle`, `Favoriten`, `Sonstiges`).
- Prüfe Suchfeld auf aktiven Filtertext.
- Prüfe, ob die App versehentlich gelöscht wurde.

### LocalStorage zurücksetzen

Nur App-Daten entfernen:

```js
localStorage.removeItem("kc_apps");
location.reload();
```

Alle Kontrollzentrum-Keys entfernen:

```js
Object.keys(localStorage)
  .filter((k) => k.startsWith("kc_"))
  .forEach((k) => localStorage.removeItem(k));
location.reload();
```

## Roadmap / Status

`2.0.7` ist voraussichtlich die letzte Version auf absehbare Zeit.

Das Projekt ist im Wartungsmodus:

- Fokus auf Stabilität
- Fehlerbehebungen bei Bedarf
- Keine aktiv geplanten großen Feature-Offensiven

Der bestehende Funktionsumfang ist bewusst auf Effizienz, Robustheit und klare Bedienung ausgerichtet.

## Contributing

Auch im Wartungsmodus sind Beiträge möglich.

- Bugs und Verbesserungsvorschläge gern als Issue einreichen
- PRs für konkrete Fixes und nachvollziehbare Verbesserungen sind willkommen
- Für größere Änderungen zuerst kurz abstimmen, damit Scope und Richtung klar sind

## Lizenz

**TBD** (separate `LICENSE`-Datei derzeit nicht vorhanden).  
Hinweis: In `package.json` ist aktuell `ISC` als Lizenzfeld gesetzt.

## Start now

Wenn du täglich mit vielen Tools arbeitest und schneller, klarer und fokussierter durch deinen digitalen Tag gehen willst, starte jetzt mit Kontrollzentrum.

Klonen, öffnen, 5 Minuten Setup machen, jeden Tag profitieren.
