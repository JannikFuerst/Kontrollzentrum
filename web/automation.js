(function () {
  function createAutomationSurface(options) {
    const root = options?.root || null;
    const getLang = typeof options?.getLang === "function" ? options.getLang : (() => "de");
    const setExternalHotkeys = typeof options?.setExternalHotkeys === "function"
      ? options.setExternalHotkeys
      : (() => {});
    const escapeHtml = typeof options?.escapeHtml === "function"
      ? options.escapeHtml
      : ((str) => String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;"));

    if (!root) {
      return { render() {} };
    }

    const APPS_FILES_STORAGE_KEY = "kc_apps_files_automations_v1";
    const APPS_FILES_KINDS = ["app", "url", "file", "folder"];

    let selectedAutomationId = "";
    let currentView = "catalog";
    let appsFilesCreateOpen = false;
    let appsFilesDraft = createAppsFilesDraft();
    let appsFilesReorderStepId = null;
    let appsFilesKindMenuStepId = null;
    let appsFilesAppMenuStepId = null;
    let appsFilesAppTypeaheadQuery = "";
    let appsFilesScanLoading = false;
    let appsFilesScanLoaded = false;
    let appsFilesScanError = "";
    let appsFilesScannedApps = [];
    let appsFilesCapturingHotkey = false;
    let appsFilesAutomations = loadAppsFilesAutomations();

    const AUTOMATION_CATALOG = [
      {
        id: "apps-files",
        icon: "\uD83D\uDCC2",
        nameDe: "Apps & Dateien",
        nameEn: "Apps & Files",
        type: "apps_files",
        descDe: "Aktionen zum Starten oder Öffnen von Programmen, Webseiten, Ordnern oder Dateien.",
        descEn: "Actions for launching or opening applications, websites, folders, or files."
      },
      {
        id: "keyboard-input",
        icon: "\u2328\uFE0F",
        nameDe: "Tastatur-Eingabe",
        nameEn: "Keyboard Input",
        type: "keyboard",
        descDe: "Simuliert Tastatureingaben: einzelne Tasten, Kombinationen oder Sequenzen mit Delay.",
        descEn: "Simulates keyboard input: single keys, key combinations, or delayed sequences."
      },
      {
        id: "mouse-input",
        icon: "\uD83D\uDDB1\uFE0F",
        nameDe: "Maus-Eingabe",
        nameEn: "Mouse Input",
        type: "mouse",
        descDe: "Führt Mausbewegungen und Interaktionen aus: Klicks, Scrollen, Bewegung, Drag and Drop.",
        descEn: "Performs mouse movement and interactions: clicks, scrolling, movement, drag and drop."
      },
      {
        id: "automations",
        icon: "\uD83E\uDDE9",
        nameDe: "Profile",
        nameEn: "Profiles",
        type: "automations",
        descDe: "Kombiniert mehrere Aktionen in einem Ablauf, z. B. Keyboard + Maus + Apps + Delays.",
        descEn: "Combines multiple actions in one flow, e.g. keyboard + mouse + apps + delays."
      },
      {
        id: "system",
        icon: "\u2699\uFE0F",
        nameDe: "System",
        nameEn: "System",
        type: "system",
        descDe: "Steuert Systemfunktionen wie Lautstärke, Mikrofon, Mediensteuerung oder Screenshots.",
        descEn: "Controls system functions like volume, microphone, media control, or screenshots."
      }
    ];

    function uid() {
      return `af_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function createDraftStep(kind = "app", target = "") {
      return {
        id: uid(),
        kind: APPS_FILES_KINDS.includes(kind) ? kind : "app",
        target: String(target || "")
      };
    }

    function createAppsFilesDraft() {
      return { name: "", hotkey: "", steps: [createDraftStep()] };
    }

    function normalizeCapturedShortcut(e) {
      const parts = [];
      if (e.ctrlKey) parts.push("Ctrl");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");
      if (e.metaKey) parts.push("Super");

      const numpadByCode = {
        Numpad0: "Numpad0",
        Numpad1: "Numpad1",
        Numpad2: "Numpad2",
        Numpad3: "Numpad3",
        Numpad4: "Numpad4",
        Numpad5: "Numpad5",
        Numpad6: "Numpad6",
        Numpad7: "Numpad7",
        Numpad8: "Numpad8",
        Numpad9: "Numpad9",
        NumpadDecimal: "NumpadDecimal",
        NumpadAdd: "NumpadAdd",
        NumpadSubtract: "NumpadSubtract",
        NumpadMultiply: "NumpadMultiply",
        NumpadDivide: "NumpadDivide",
        NumpadEnter: "NumpadEnter"
      };

      let key = numpadByCode[e.code] || e.key;
      if (key === " ") key = "Space";
      if (String(key || "").length === 1) key = String(key).toUpperCase();
      if (["Control", "Alt", "Shift", "Meta"].includes(key)) return "";
      parts.push(String(key || ""));
      return parts.join("+");
    }

    function stopAppsFilesHotkeyCapture(captureBtn, isDe) {
      if (!appsFilesCapturingHotkey) return;
      appsFilesCapturingHotkey = false;
      document.removeEventListener("keydown", onAppsFilesHotkeyCaptureKeydown, true);
      if (captureBtn) captureBtn.textContent = isDe ? "Aufnehmen" : "Capture";
    }

    function onAppsFilesHotkeyCaptureKeydown(e) {
      if (!appsFilesCapturingHotkey) return;
      const isDe = getLang() === "de";
      const hotkeyInput = root.querySelector("#appsFilesHotkey");
      const captureBtn = root.querySelector("#appsFilesHotkeyCapture");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.key === "Escape") {
        stopAppsFilesHotkeyCapture(captureBtn, isDe);
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        if (hotkeyInput) hotkeyInput.value = "";
        appsFilesDraft.hotkey = "";
        stopAppsFilesHotkeyCapture(captureBtn, isDe);
        return;
      }
      const combo = normalizeCapturedShortcut(e);
      if (!combo) return;
      if (hotkeyInput) hotkeyInput.value = combo;
      appsFilesDraft.hotkey = combo;
      stopAppsFilesHotkeyCapture(captureBtn, isDe);
    }

    function startAppsFilesHotkeyCapture(captureBtn, isDe) {
      stopAppsFilesHotkeyCapture(captureBtn, isDe);
      appsFilesCapturingHotkey = true;
      if (captureBtn) captureBtn.textContent = isDe ? "Drücke Tasten..." : "Press keys...";
      document.addEventListener("keydown", onAppsFilesHotkeyCaptureKeydown, true);
    }

    function loadAppsFilesAutomations() {
      try {
        const raw = localStorage.getItem(APPS_FILES_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((entry) => normalizeAppsFilesAutomation(entry))
          .filter(Boolean);
      } catch {
        return [];
      }
    }

    function saveAppsFilesAutomations() {
      try {
        localStorage.setItem(APPS_FILES_STORAGE_KEY, JSON.stringify(appsFilesAutomations));
      } catch {
        // Ignore storage errors (quota/private mode), UI still works in-memory.
      }
      publishAppsFilesHotkeys();
    }

    function normalizeAppsFilesAutomation(entry) {
      if (!entry || typeof entry !== "object") return null;
      const normalizedSteps = [];
      if (Array.isArray(entry.steps)) {
        entry.steps.forEach((step) => {
          if (!step || typeof step !== "object") return;
          const kind = APPS_FILES_KINDS.includes(step.kind) ? step.kind : "app";
          const target = String(step.target || "").trim();
          if (!target) return;
          normalizedSteps.push({ id: String(step.id || uid()), kind, target });
        });
      }
      // Legacy support: old single-target entries
      if (!normalizedSteps.length) {
        const legacyTarget = String(entry.target || "").trim();
        if (legacyTarget) {
          normalizedSteps.push({
            id: uid(),
            kind: APPS_FILES_KINDS.includes(entry.kind) ? entry.kind : "app",
            target: legacyTarget
          });
        }
      }
      if (!normalizedSteps.length) return null;
      const firstStep = normalizedSteps[0];
      const name = String(entry.name || "").trim() || deriveNameFromTarget(firstStep.target, firstStep.kind);
      const createdAt = Number(entry.createdAt) || Date.now();
      return {
        id: String(entry.id || uid()),
        name,
        hotkey: String(entry.hotkey || "").trim(),
        steps: normalizedSteps,
        createdAt
      };
    }

    function publishAppsFilesHotkeys() {
      const entries = (Array.isArray(appsFilesAutomations) ? appsFilesAutomations : [])
        .map((item) => {
          const shortcut = String(item?.hotkey || "").trim();
          const id = String(item?.id || "").trim();
          if (!shortcut || !id) return null;
          return { shortcut, launch: `kc-automation://${id}` };
        })
        .filter(Boolean);
      setExternalHotkeys(entries);
    }

    function deriveNameFromTarget(target, kind) {
      const raw = String(target || "").trim();
      if (!raw) return kind === "url" ? "Neue URL" : "Neue Aktion";
      if (kind === "url") {
        const noProto = raw.replace(/^https?:\/\//i, "").replace(/\/$/, "");
        return noProto || "Neue URL";
      }
      const normalized = raw.replace(/\\/g, "/").replace(/\/$/, "");
      const parts = normalized.split("/").filter(Boolean);
      return parts[parts.length - 1] || raw;
    }

    function normalizeUrl(url) {
      const value = String(url || "").trim();
      if (!value) return "";
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) return value;
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return value;
      if (/^[\w.-]+\.[a-zA-Z]{2,}/.test(value)) return `https://${value}`;
      return value;
    }

    async function runSingleStep(step) {
      const target = String(step?.target || "").trim();
      if (!target) return;
      const kind = APPS_FILES_KINDS.includes(step?.kind) ? step.kind : "app";
      const launch = kind === "url" ? normalizeUrl(target) : target;
      try {
        const tauriApi = window.__TAURI__;
        if (tauriApi?.core?.invoke) {
          await tauriApi.core.invoke("open_external", { url: launch });
          return;
        }
      } catch (err) {
        console.error("runSingleStep failed:", err);
      }
      if (kind === "url") window.open(launch, "_blank", "noopener,noreferrer");
    }

    async function runAppsFilesAutomation(item) {
      const steps = Array.isArray(item?.steps) ? item.steps : [];
      for (const step of steps) {
        await runSingleStep(step);
      }
    }

    async function runAppsFilesAutomationById(id) {
      const automationId = String(id || "").trim();
      if (!automationId) return;
      const item = appsFilesAutomations.find((entry) => entry.id === automationId);
      if (!item) return;
      await runAppsFilesAutomation(item);
    }

    function appsFilesKindLabel(kind, isDe) {
      if (kind === "url") return isDe ? "Webseite" : "Website";
      if (kind === "file") return isDe ? "Datei" : "File";
      if (kind === "folder") return isDe ? "Ordner" : "Folder";
      return isDe ? "App" : "App";
    }

    function appsFilesKindCode(kind) {
      if (kind === "url") return "URL";
      if (kind === "file") return "FILE";
      if (kind === "folder") return "DIR";
      return "APP";
    }

    function getAutomationPrimaryKind(item) {
      const steps = Array.isArray(item?.steps) ? item.steps : [];
      if (steps.length !== 1) return "flow";
      return APPS_FILES_KINDS.includes(steps[0]?.kind) ? steps[0].kind : "app";
    }

    function getAutomationKindLabel(item, isDe) {
      const steps = Array.isArray(item?.steps) ? item.steps : [];
      if (steps.length <= 1) return appsFilesKindLabel(getAutomationPrimaryKind(item), isDe);
      return isDe ? "Ablauf" : "Flow";
    }

    function getAutomationKindCode(item) {
      const steps = Array.isArray(item?.steps) ? item.steps : [];
      if (steps.length <= 1) return appsFilesKindCode(getAutomationPrimaryKind(item));
      return "FLOW";
    }

    function getAutomationTargetSummary(item) {
      const steps = Array.isArray(item?.steps) ? item.steps : [];
      const labels = steps.map((step) => String(step.target || "").trim()).filter(Boolean);
      if (!labels.length) return "";
      if (labels.length === 1) return labels[0];
      const head = labels.slice(0, 2).join("  •  ");
      const remaining = labels.length - 2;
      return remaining > 0 ? `${head}  •  +${remaining}` : head;
    }

    function formatAppsFilesDate(ts, isDe) {
      try {
        const locale = isDe ? "de-DE" : "en-US";
        return new Date(ts).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
      } catch {
        return "";
      }
    }

    function appsFilesTargetPlaceholder(kind, isDe) {
      if (kind === "url") return isDe ? "z. B. https://notion.so" : "e.g. https://notion.so";
      if (kind === "file") return isDe ? "z. B. C:\\Tools\\script.bat" : "e.g. C:\\Tools\\script.bat";
      if (kind === "folder") return isDe ? "z. B. C:\\Projekte" : "e.g. C:\\Projects";
      return isDe ? "z. B. discord:// oder C:\\Programme\\App.exe" : "e.g. discord:// or C:\\Program Files\\App.exe";
    }

    function normalizeTypeaheadText(value) {
      return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function resetAppsFilesAppTypeahead() {
      appsFilesAppTypeaheadQuery = "";
    }

    function getAppsFilesFilteredScannedApps() {
      const query = normalizeTypeaheadText(appsFilesAppTypeaheadQuery);
      if (!query) return appsFilesScannedApps;
      return appsFilesScannedApps.filter((app) => {
        const name = normalizeTypeaheadText(app?.name || "");
        const launch = normalizeTypeaheadText(app?.launch || "");
        return name.includes(query) || launch.includes(query);
      });
    }

    function appsFilesScanStatusLabel(isDe) {
      if (appsFilesScanLoading) return isDe ? "Desktop wird gescannt..." : "Scanning desktop...";
      if (appsFilesScanError) return isDe ? "Scan fehlgeschlagen" : "Scan failed";
      if (!appsFilesScannedApps.length && appsFilesScanLoaded) return isDe ? "Keine Apps gefunden" : "No apps found";
      return "";
    }

    function getScannedAppLabel(target, isDe) {
      const cleanTarget = String(target || "").trim();
      if (!cleanTarget) {
        return isDe ? "App auswählen" : "Select app";
      }
      const match = appsFilesScannedApps.find((entry) => String(entry?.launch || "").trim() === cleanTarget);
      if (match?.name) return String(match.name);
      return cleanTarget;
    }

    function getAppsFilesAppButtonLabel(step, isDe) {
      const query = String(appsFilesAppTypeaheadQuery || "");
      const hasQuery = Boolean(query);
      const isOpenForStep = appsFilesAppMenuStepId === step?.id;
      if (isOpenForStep && hasQuery) {
        return query;
      }
      return getScannedAppLabel(step?.target, isDe);
    }

    async function loadAppsFilesScannedApps(force = false) {
      if (appsFilesScanLoading) return;
      if (!force && appsFilesScanLoaded && appsFilesScannedApps.length) return;
      appsFilesScanLoading = true;
      appsFilesScanError = "";
      render();
      try {
        const tauriApi = window.__TAURI__;
        if (!tauriApi?.core?.invoke) {
          appsFilesScannedApps = [];
          appsFilesScanLoaded = true;
          return;
        }
        const result = await tauriApi.core.invoke("scan_desktop_apps");
        const normalized = Array.isArray(result)
          ? result
            .map((entry) => ({
              name: String(entry?.name || "").trim(),
              launch: String(entry?.launch || "").trim()
            }))
            .filter((entry) => entry.name && entry.launch)
          : [];
        normalized.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        appsFilesScannedApps = normalized;
        appsFilesScanLoaded = true;
      } catch (err) {
        console.error("scan_desktop_apps failed:", err);
        appsFilesScanError = String(err?.message || err || "scan_failed");
        appsFilesScannedApps = [];
        appsFilesScanLoaded = true;
      } finally {
        appsFilesScanLoading = false;
        render();
      }
    }

    async function browseFilesystemTarget(kind) {
      try {
        const tauriApi = window.__TAURI__;
        if (!tauriApi?.core?.invoke) return "";
        const picked = await tauriApi.core.invoke("pick_filesystem_target", { kind });
        return String(picked || "").trim();
      } catch (err) {
        console.error("pick_filesystem_target failed:", err);
        return "";
      }
    }

    (function bindAutomationHotkeyRunEvent() {
      try {
        const tauriApi = window.__TAURI__;
        if (!tauriApi?.event?.listen) return;
        tauriApi.event.listen("kc://run-automation", async (evt) => {
          const payload = typeof evt?.payload === "string"
            ? evt.payload
            : String(evt?.payload || "");
          if (!payload) return;
          await runAppsFilesAutomationById(payload);
        });
      } catch (err) {
        console.error("bindAutomationHotkeyRunEvent failed:", err);
      }
    })();

    function goBackToCatalog() {
      currentView = "catalog";
      appsFilesCreateOpen = false;
      render();
    }

    function syncBodyViewClass() {
      const inAppsFiles = currentView === "apps-files";
      document.body.classList.toggle("macro-apps-files-view", inAppsFiles);
    }

    document.addEventListener("keydown", (e) => {
      if (currentView !== "apps-files") return;

      const key = String(e.key || "");
      const targetEl = e.target;
      const inEditable =
        targetEl instanceof HTMLElement &&
        (
          targetEl.tagName === "INPUT" ||
          targetEl.tagName === "TEXTAREA" ||
          targetEl.tagName === "SELECT" ||
          targetEl.isContentEditable
        );

      if (appsFilesAppMenuStepId) {
        const step = appsFilesDraft.steps.find((s) => s.id === appsFilesAppMenuStepId);
        if (step?.kind === "app") {
          if (key === "Escape") {
            e.preventDefault();
            if (appsFilesAppTypeaheadQuery) {
              resetAppsFilesAppTypeahead();
            } else {
              appsFilesAppMenuStepId = null;
            }
            render();
            return;
          }

          if (!inEditable) {
            if (key === "Enter") {
              e.preventDefault();
              const filtered = getAppsFilesFilteredScannedApps();
              const first = filtered[0];
              if (!first?.launch) return;
              step.target = String(first.launch).trim();
              appsFilesAppMenuStepId = null;
              resetAppsFilesAppTypeahead();
              render();
              return;
            }

            if (key === "Backspace") {
              e.preventDefault();
              appsFilesAppTypeaheadQuery = appsFilesAppTypeaheadQuery.slice(0, -1);
              render();
              return;
            }

            if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault();
              appsFilesAppTypeaheadQuery += key;
              if (!appsFilesScanLoaded && !appsFilesScanLoading) {
                void loadAppsFilesScannedApps(false);
              }
              render();
              return;
            }
          }
        }
      }

      if (key !== "Escape") return;

      if (appsFilesKindMenuStepId || appsFilesReorderStepId || appsFilesAppMenuStepId) {
        e.preventDefault();
        appsFilesKindMenuStepId = null;
        appsFilesReorderStepId = null;
        appsFilesAppMenuStepId = null;
        resetAppsFilesAppTypeahead();
        render();
        return;
      }

      e.preventDefault();
      goBackToCatalog();
    });

    function renderCatalog() {
      const isDe = getLang() === "de";
      const cardsHtml = AUTOMATION_CATALOG.map((item) => {
        const active = item.id === selectedAutomationId;
        return `
          <article class="automation-card${active ? " active" : ""}" data-automation-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-pressed="${active ? "true" : "false"}">
            <div class="automation-card-icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
            <h3 class="automation-card-title">${escapeHtml(isDe ? (item.nameDe || item.nameEn || "") : (item.nameEn || item.nameDe || ""))}</h3>
            <p class="automation-card-desc">${escapeHtml(isDe ? item.descDe : item.descEn)}</p>
            <span class="automation-card-cta">${isDe ? "Auswählen" : "Select"}</span>
          </article>
        `;
      }).join("");

      root.innerHTML = `
        <section class="automation-shell">
          <div class="automation-head">
            <h2>${isDe ? "Automatisierungsprozesse" : "Automation Processes"}</h2>
            <p>${isDe ? "Wähle einen Prozess und starte deinen Workflow." : "Pick a process and start your workflow."}</p>
          </div>
          <div class="automation-grid">
            ${cardsHtml}
          </div>
        </section>
      `;

      root.querySelectorAll(".automation-card").forEach((card) => {
        const selectCard = () => {
          selectedAutomationId = card.getAttribute("data-automation-id") || "";
          if (selectedAutomationId === "apps-files") {
            currentView = "apps-files";
            render();
            return;
          }
          render();
        };

        card.addEventListener("click", selectCard);
        card.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          selectCard();
        });
      });
    }

    function renderAppsFilesMenu() {
      const isDe = getLang() === "de";
      const automationCount = appsFilesAutomations.length;
      const hasAppStep = appsFilesDraft.steps.some((step) => step.kind === "app");
      if (hasAppStep && !appsFilesScanLoaded && !appsFilesScanLoading) {
        void loadAppsFilesScannedApps(false);
      }
      const entriesHtml = appsFilesAutomations
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => `
          <article class="apps-files-item" data-af-id="${escapeHtml(item.id)}">
            <div class="apps-files-item-main">
              <div class="apps-files-item-top">
                <div class="apps-files-item-title">${escapeHtml(item.name)}</div>
                <div class="apps-files-item-kind">${escapeHtml(getAutomationKindCode(item))}</div>
              </div>
              <div class="apps-files-item-meta">
                <span>${escapeHtml(getAutomationKindLabel(item, isDe))}</span>
                <span class="apps-files-dot" aria-hidden="true"></span>
                <span>${escapeHtml(`${Array.isArray(item.steps) ? item.steps.length : 0} ${isDe ? "Schritte" : "steps"}`)}</span>
                <span class="apps-files-dot" aria-hidden="true"></span>
                <span>${escapeHtml(formatAppsFilesDate(item.createdAt, isDe))}</span>
              </div>
              <div class="apps-files-item-target" title="${escapeHtml(getAutomationTargetSummary(item))}">${escapeHtml(getAutomationTargetSummary(item))}</div>
            </div>
            <div class="apps-files-item-actions">
              <button class="btn-ghost apps-files-run" type="button" data-af-action="run" data-af-id="${escapeHtml(item.id)}">${isDe ? "Starten" : "Run"}</button>
              <button class="btn-ghost apps-files-delete" type="button" data-af-action="delete" data-af-id="${escapeHtml(item.id)}">${isDe ? "Löschen" : "Delete"}</button>
            </div>
          </article>
        `)
        .join("");

      const emptyHtml = `
        <div class="automation-empty apps-files-empty">
          ${isDe
            ? "Noch keine Apps-und-Dateien-Automatisierungen. Erstelle jetzt deine erste."
            : "No apps-and-files automations yet. Create your first one now."}
        </div>
      `;

      const stepRowsHtml = appsFilesDraft.steps.map((step, idx) => {
        const filteredScannedApps = appsFilesAppMenuStepId === step.id
          ? getAppsFilesFilteredScannedApps()
          : appsFilesScannedApps;
        return `
        <div class="apps-step-row" data-step-id="${escapeHtml(step.id)}">
          <div class="apps-step-index-wrap">
            <button class="apps-step-index apps-step-index-btn" type="button" data-step-id="${escapeHtml(step.id)}" aria-label="${isDe ? "Schrittposition wählen" : "Select step position"}">${idx + 1}</button>
            ${appsFilesReorderStepId === step.id && appsFilesDraft.steps.length > 1 ? `
              <div class="apps-step-reorder-menu">
                ${(appsFilesDraft.steps || [])
                  .map((_, posIdx) => posIdx)
                  .map((posIdx) => `
                    <button class="apps-step-jump ${posIdx === idx ? "active" : ""}" type="button" data-step-id="${escapeHtml(step.id)}" data-target-index="${posIdx}">${posIdx + 1}</button>
                  `).join("")}
              </div>
            ` : ""}
          </div>
          <div class="apps-step-kind-wrap">
            <button class="input apps-step-kind-btn" type="button" data-step-id="${escapeHtml(step.id)}" aria-label="${isDe ? "Typ wählen" : "Select type"}">
              <span>${escapeHtml(appsFilesKindLabel(step.kind, isDe))}</span>
              <span class="apps-step-kind-caret" aria-hidden="true">▾</span>
            </button>
            ${appsFilesKindMenuStepId === step.id ? `
              <div class="apps-step-kind-menu">
                ${APPS_FILES_KINDS.map((kind) => `
                  <button class="apps-step-kind-option ${kind === step.kind ? "active" : ""}" type="button" data-step-id="${escapeHtml(step.id)}" data-kind="${escapeHtml(kind)}">${escapeHtml(appsFilesKindLabel(kind, isDe))}</button>
                `).join("")}
              </div>
            ` : ""}
          </div>
          ${step.kind === "app" ? `
            <div class="apps-step-app-picker">
              <div class="apps-step-app-wrap category-select-wrap ${appsFilesAppMenuStepId === step.id ? "open" : ""}">
                <button class="category-select-button apps-step-app-btn" type="button" data-step-id="${escapeHtml(step.id)}" aria-label="${isDe ? "App wählen" : "Select app"}" aria-expanded="${appsFilesAppMenuStepId === step.id ? "true" : "false"}">
                  <span class="category-select-label ${appsFilesAppMenuStepId === step.id && appsFilesAppTypeaheadQuery ? "apps-step-app-label-query" : ""}">${escapeHtml(getAppsFilesAppButtonLabel(step, isDe))}</span>
                </button>
                <div class="category-select-menu apps-step-app-menu ${appsFilesAppMenuStepId === step.id ? "" : "hidden"}">
                  ${appsFilesScanLoading
                    ? `<div class="apps-step-app-status">${escapeHtml(isDe ? "Scanne..." : "Scanning...")}</div>`
                    : ""}
                  ${(!filteredScannedApps.length && !appsFilesScanLoading)
                    ? `<div class="apps-step-app-status">${escapeHtml(appsFilesScanStatusLabel(isDe) || (isDe ? "Keine Apps gefunden" : "No apps found"))}</div>`
                    : ""}
                  ${filteredScannedApps.map((entry) => `
                    <button class="category-select-item apps-step-app-option ${String(entry.launch) === String(step.target || "").trim() ? "selected" : ""}" type="button" data-step-id="${escapeHtml(step.id)}" data-launch="${escapeHtml(entry.launch)}">${escapeHtml(entry.name)}</button>
                  `).join("")}
                </div>
              </div>
              <button class="btn-ghost apps-step-app-refresh" type="button" data-step-id="${escapeHtml(step.id)}" aria-label="${isDe ? "Desktop-Scan aktualisieren" : "Refresh desktop scan"}" title="${isDe ? "Desktop-Scan aktualisieren" : "Refresh desktop scan"}">↻</button>
            </div>
          ` : `
            <div class="apps-step-target-wrap ${step.kind === "file" || step.kind === "folder" ? "with-browse" : ""}">
              <input class="input apps-step-target" data-step-id="${escapeHtml(step.id)}" type="text" value="${escapeHtml(step.target)}" placeholder="${escapeHtml(appsFilesTargetPlaceholder(step.kind, isDe))}" />
              ${step.kind === "file" || step.kind === "folder"
                ? `<button class="btn-ghost apps-step-browse" type="button" data-step-id="${escapeHtml(step.id)}" data-kind="${escapeHtml(step.kind)}">${isDe ? "Durchsuchen" : "Browse"}</button>`
                : ""}
            </div>
          `}
          <button class="btn-ghost apps-step-remove" type="button" data-step-id="${escapeHtml(step.id)}" aria-label="${isDe ? "Entfernen" : "Remove"}" title="${isDe ? "Entfernen" : "Remove"}" ${appsFilesDraft.steps.length <= 1 ? "disabled" : ""}>🗑️</button>
        </div>
      `;
      }).join("");

      const formHtml = `
        <form class="apps-files-form" id="appsFilesForm">
          <div class="apps-files-form-title-row">
            <h3>${isDe ? "Neue Automation" : "New Automation"}</h3>
            <span class="apps-files-form-hint">${isDe ? "Apps, Links, Dateien und Ordner" : "Apps, links, files, and folders"}</span>
          </div>
          <div class="apps-files-form-grid">
            <label class="apps-files-field">
              <span>${isDe ? "Name" : "Name"}</span>
              <input id="appsFilesName" class="input" type="text" value="${escapeHtml(appsFilesDraft.name)}" placeholder="${isDe ? "z. B. Morgen-Setup" : "e.g. Morning setup"}" required />
            </label>
            <label class="apps-files-field">
              <span>${isDe ? "Hotkey" : "Hotkey"}</span>
              <div class="apps-files-hotkey-row">
                <input id="appsFilesHotkey" class="input" type="text" value="${escapeHtml(appsFilesDraft.hotkey || "")}" placeholder="${isDe ? "Drücke 'Aufnehmen'..." : "Press 'Capture'..."}" />
                <button id="appsFilesHotkeyCapture" class="btn-ghost apps-files-hotkey-capture" type="button">${isDe ? (appsFilesCapturingHotkey ? "Drücke Tasten..." : "Aufnehmen") : (appsFilesCapturingHotkey ? "Press keys..." : "Capture")}</button>
              </div>
            </label>
            <div class="apps-files-field apps-files-field-wide">
              <span>${isDe ? "Schritte" : "Steps"}</span>
              <div class="apps-steps-list" id="appsFilesStepsList">${stepRowsHtml}</div>
              <button class="btn-ghost apps-step-add" type="button" id="appsFilesAddStep">${isDe ? "Schritt hinzufügen" : "Add step"}</button>
            </div>
          </div>
          <div class="apps-files-form-actions">
            <button class="btn-ghost" type="button" id="appsFilesCancel">${isDe ? "Abbrechen" : "Cancel"}</button>
            <button class="btn-primary" type="submit">${isDe ? "Hinzufügen" : "Add"}</button>
          </div>
        </form>
      `;

      root.innerHTML = `
        <section class="automation-shell apps-files-shell">
          <div class="apps-files-topbar">
            <div class="apps-files-heading">
              <button class="btn-ghost automation-back" id="appsFilesBack" type="button" aria-label="${isDe ? "Zurück" : "Back"}" title="${isDe ? "Zurück" : "Back"}">
              <span class="automation-back-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M15 6L8 12L15 18Z" fill="currentColor"></path>
                </svg>
              </span>
              </button>
              <div class="apps-files-heading-text">
                <h2>Apps & Dateien</h2>
                <p>${isDe ? "Baue und verwalte deine Start-Automationen an einem Ort." : "Build and manage your launch automations in one place."}</p>
              </div>
            </div>
          </div>

          <div class="apps-files-layout">
            <section class="apps-files-list-panel">
              <div class="apps-files-panel-head">
                <h3>${isDe ? "Bestehende Automationen" : "Existing automations"}</h3>
                <span>${automationCount}</span>
              </div>
              <div class="apps-files-list">
                ${entriesHtml || emptyHtml}
              </div>
            </section>
            <aside class="apps-files-compose-panel show">
              ${formHtml}
            </aside>
          </div>
        </section>
      `;

      const backBtn = root.querySelector("#appsFilesBack");
      const form = root.querySelector("#appsFilesForm");
      const nameInput = root.querySelector("#appsFilesName");
      const hotkeyInput = root.querySelector("#appsFilesHotkey");
      const hotkeyCaptureBtn = root.querySelector("#appsFilesHotkeyCapture");
      const cancelBtn = root.querySelector("#appsFilesCancel");
      const addStepBtn = root.querySelector("#appsFilesAddStep");

      nameInput?.addEventListener("input", () => {
        appsFilesDraft.name = String(nameInput.value || "");
      });
      hotkeyInput?.addEventListener("input", () => {
        appsFilesDraft.hotkey = String(hotkeyInput.value || "");
      });
      hotkeyCaptureBtn?.addEventListener("click", () => {
        if (appsFilesCapturingHotkey) {
          stopAppsFilesHotkeyCapture(hotkeyCaptureBtn, isDe);
        } else {
          startAppsFilesHotkeyCapture(hotkeyCaptureBtn, isDe);
        }
      });

      backBtn?.addEventListener("click", () => {
        goBackToCatalog();
      });

      cancelBtn?.addEventListener("click", () => {
        stopAppsFilesHotkeyCapture(hotkeyCaptureBtn, isDe);
        appsFilesDraft = createAppsFilesDraft();
        render();
      });

      addStepBtn?.addEventListener("click", () => {
        stopAppsFilesHotkeyCapture(hotkeyCaptureBtn, isDe);
        appsFilesDraft.steps.push(createDraftStep());
        appsFilesReorderStepId = null;
        appsFilesKindMenuStepId = null;
        appsFilesAppMenuStepId = null;
        resetAppsFilesAppTypeahead();
        render();
      });

      root.querySelectorAll(".apps-step-kind-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          if (!stepId) return;
          appsFilesKindMenuStepId = appsFilesKindMenuStepId === stepId ? null : stepId;
          appsFilesReorderStepId = null;
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
        });
      });

      root.querySelectorAll(".apps-step-kind-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          const kind = btn.getAttribute("data-kind") || "";
          const step = appsFilesDraft.steps.find((s) => s.id === stepId);
          if (!step) return;
          step.kind = APPS_FILES_KINDS.includes(kind) ? kind : "app";
          if (step.kind !== "app") {
            appsFilesAppMenuStepId = null;
            resetAppsFilesAppTypeahead();
          }
          appsFilesKindMenuStepId = null;
          render();
        });
      });

      const handleAppsFilesAppTypeaheadKey = (e) => {
        const row = e.target.closest(".apps-step-row");
        if (!row) return;
        const stepId = row.getAttribute("data-step-id") || "";
        if (!stepId) return;
        const step = appsFilesDraft.steps.find((s) => s.id === stepId);
        if (!step || step.kind !== "app") return;
        if (!appsFilesScannedApps.length) return;
        const key = String(e.key || "");
        if (key === "Escape") {
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
          return;
        }
        if (key === "Enter") {
          if (appsFilesAppMenuStepId !== stepId) return;
          e.preventDefault();
          e.stopPropagation();
          const filtered = getAppsFilesFilteredScannedApps();
          const first = filtered[0];
          if (!first?.launch) return;
          step.target = String(first.launch).trim();
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
          return;
        }
        if (key === "Backspace") {
          e.preventDefault();
          e.stopPropagation();
          appsFilesAppTypeaheadQuery = appsFilesAppTypeaheadQuery.slice(0, -1);
        } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          e.stopPropagation();
          if (appsFilesAppMenuStepId !== stepId) {
            appsFilesAppMenuStepId = stepId;
          }
          appsFilesAppTypeaheadQuery += key;
        } else {
          return;
        }
        render();
      };

      root.querySelectorAll(".apps-step-app-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          if (!stepId) return;
          const willOpen = appsFilesAppMenuStepId !== stepId;
          appsFilesAppMenuStepId = willOpen ? stepId : null;
          resetAppsFilesAppTypeahead();
          appsFilesKindMenuStepId = null;
          appsFilesReorderStepId = null;
          if (!appsFilesScanLoaded && !appsFilesScanLoading) {
            void loadAppsFilesScannedApps(false);
          }
          render();
        });
        btn.addEventListener("keydown", handleAppsFilesAppTypeaheadKey);
      });
      root.querySelectorAll(".apps-step-app-menu").forEach((menu) => {
        menu.addEventListener("keydown", handleAppsFilesAppTypeaheadKey);
      });

      root.querySelectorAll(".apps-step-app-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          const launch = btn.getAttribute("data-launch") || "";
          const step = appsFilesDraft.steps.find((s) => s.id === stepId);
          if (!step) return;
          step.target = String(launch || "").trim();
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
        });
      });

      root.querySelectorAll(".apps-step-app-refresh").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          if (!stepId) return;
          appsFilesAppMenuStepId = stepId;
          void loadAppsFilesScannedApps(true);
        });
      });

      root.querySelectorAll(".apps-step-target").forEach((input) => {
        input.addEventListener("input", () => {
          const stepId = input.getAttribute("data-step-id") || "";
          const step = appsFilesDraft.steps.find((s) => s.id === stepId);
          if (!step) return;
          step.target = input.value || "";
        });
      });

      root.querySelectorAll(".apps-step-browse").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          const kind = btn.getAttribute("data-kind") || "";
          const step = appsFilesDraft.steps.find((s) => s.id === stepId);
          if (!step) return;
          const picked = await browseFilesystemTarget(kind);
          if (!picked) return;
          step.target = picked;
          render();
        });
      });

      root.querySelectorAll(".apps-step-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          if (!stepId) return;
          appsFilesDraft.steps = appsFilesDraft.steps.filter((s) => s.id !== stepId);
          if (!appsFilesDraft.steps.length) appsFilesDraft.steps = [createDraftStep()];
          if (appsFilesReorderStepId === stepId) appsFilesReorderStepId = null;
          if (appsFilesKindMenuStepId === stepId) appsFilesKindMenuStepId = null;
          if (appsFilesAppMenuStepId === stepId) {
            appsFilesAppMenuStepId = null;
            resetAppsFilesAppTypeahead();
          }
          render();
        });
      });

      root.querySelectorAll(".apps-step-index-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          if (!stepId || appsFilesDraft.steps.length < 2) return;
          appsFilesReorderStepId = appsFilesReorderStepId === stepId ? null : stepId;
          appsFilesKindMenuStepId = null;
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
        });
      });

      root.querySelectorAll(".apps-step-jump").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = btn.getAttribute("data-step-id") || "";
          const targetIdx = Number(btn.getAttribute("data-target-index"));
          const fromIdx = appsFilesDraft.steps.findIndex((s) => s.id === stepId);
          if (fromIdx < 0 || Number.isNaN(targetIdx)) return;
          if (targetIdx < 0 || targetIdx >= appsFilesDraft.steps.length) return;
          if (fromIdx === targetIdx) {
            appsFilesReorderStepId = null;
            appsFilesKindMenuStepId = null;
            appsFilesAppMenuStepId = null;
            resetAppsFilesAppTypeahead();
            render();
            return;
          }
          const steps = [...appsFilesDraft.steps];
          const [moved] = steps.splice(fromIdx, 1);
          steps.splice(targetIdx, 0, moved);
          appsFilesDraft.steps = steps;
          appsFilesReorderStepId = null;
          appsFilesKindMenuStepId = null;
          appsFilesAppMenuStepId = null;
          resetAppsFilesAppTypeahead();
          render();
        });
      });

      form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = String(nameInput?.value || "").trim();
        const hotkey = String(hotkeyInput?.value || "").trim();
        const steps = (appsFilesDraft.steps || [])
          .map((step) => ({
            id: String(step.id || uid()),
            kind: APPS_FILES_KINDS.includes(step.kind) ? step.kind : "app",
            target: String(step.target || "").trim()
          }))
          .filter((step) => step.target);
        if (!name || !steps.length) return;

        appsFilesAutomations.push({
          id: uid(),
          name,
          hotkey,
          steps,
          createdAt: Date.now()
        });
        saveAppsFilesAutomations();

        stopAppsFilesHotkeyCapture(hotkeyCaptureBtn, isDe);
        appsFilesDraft = createAppsFilesDraft();
        appsFilesReorderStepId = null;
        appsFilesKindMenuStepId = null;
        appsFilesAppMenuStepId = null;
        resetAppsFilesAppTypeahead();
        render();
      });

      root.querySelectorAll("[data-af-action='run']").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-af-id") || "";
          const item = appsFilesAutomations.find((entry) => entry.id === id);
          if (!item) return;
          await runAppsFilesAutomation(item);
        });
      });

      root.querySelectorAll("[data-af-action='delete']").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-af-id") || "";
          if (!id) return;
          appsFilesAutomations = appsFilesAutomations.filter((entry) => entry.id !== id);
          saveAppsFilesAutomations();
          render();
        });
      });
    }

    function render() {
      syncBodyViewClass();
      if (currentView === "apps-files") {
        renderAppsFilesMenu();
        return;
      }
      renderCatalog();
    }

    function reset() {
      stopAppsFilesHotkeyCapture(null, getLang() === "de");
      selectedAutomationId = "";
      currentView = "catalog";
      appsFilesCreateOpen = false;
      appsFilesDraft = createAppsFilesDraft();
      appsFilesReorderStepId = null;
      appsFilesKindMenuStepId = null;
      appsFilesAppMenuStepId = null;
      resetAppsFilesAppTypeahead();
      syncBodyViewClass();
    }

    publishAppsFilesHotkeys();

    return { render, reset };
  }

  window.AutomationSurface = {
    create: createAutomationSurface
  };
})();
