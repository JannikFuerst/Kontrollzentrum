console.log("app.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {

  // Tabs + State
  let activeTab = "all";
  let searchTerm = "";

  const grid = document.getElementById("appGrid");
  const empty = document.getElementById("emptyState");
  const pinnedSection = document.getElementById("pinnedSection");
  const pinnedRow = document.getElementById("pinnedRow");
  const search = document.getElementById("search");
  const versionTag = document.getElementById("versionTag");
  const notesToggle = document.getElementById("notesToggle");
  const notesPanel = document.getElementById("notesPanel");
  const clipboardToggle = document.getElementById("clipboardToggle");
  const clipboardPanel = document.getElementById("clipboardPanel");
  const notesText = document.getElementById("notesText");
  const notesClear = document.getElementById("notesClear");
  const notesDelete = document.getElementById("notesDelete");
  const notesLock = document.getElementById("notesLock");
  const notesStatus = document.getElementById("notesStatus");
  const notesPages = document.getElementById("notesPages");
  const clipboardList = document.getElementById("clipboardList");
  const clipboardEmpty = document.getElementById("clipboardEmpty");
  const clipboardClearAll = document.getElementById("clipboardClearAll");
  const clipboardModeBadge = document.getElementById("clipboardModeBadge");
  const layout = document.querySelector(".layout");

  // Tabs (delegation)
  const tabsEl = document.querySelector(".tabs");
  tabsEl?.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t || t.classList.contains("tab-add-btn") || t.classList.contains("tab-add-ok")) return;
    const tabValue = t.dataset.tab || "all";
    setActiveTab(tabValue);
  });

  // Horizontal scroll with mouse wheel on category/tabs row
  tabsEl?.addEventListener("wheel", (e) => {
    if (!tabsEl) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!isHorizontal && e.deltaY === 0) return;
    // Prevent page scroll when the tabs can scroll horizontally
    if (tabsEl.scrollWidth > tabsEl.clientWidth){
      e.preventDefault();
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      tabsEl.scrollLeft += delta;
    }
  }, { passive: false });

  // Horizontal scroll with mouse wheel on pinned row (hover over cards)
  pinnedRow?.addEventListener("wheel", (e) => {
    if (!pinnedRow) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!isHorizontal && e.deltaY === 0) return;
    if (pinnedRow.scrollWidth > pinnedRow.clientWidth){
      e.preventDefault();
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      pinnedRow.scrollLeft += delta;
    }
  }, { passive: false });

  // Search
  search?.addEventListener("input", () => {
    searchTerm = (search.value || "").toLowerCase();
    render();
  });

  // Ctrl+F / Cmd+F focuses app search (prevent system find-in-page)
  document.addEventListener("keydown", (e) => {
    const isFind = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f";
    if (!isFind) return;
    e.preventDefault();
    if (search){
      search.focus();
      search.select();
    }
  });

  // Modal HTML reinladen (Cache-buster)
  const modalRoot = document.getElementById("modalRoot");
  try {
    const resp = await fetch("./modals/add-app.modal.html?v=" + Date.now());
    if (!resp.ok) throw new Error("Modal HTML HTTP " + resp.status);
    modalRoot.innerHTML = await resp.text();
  } catch (e) {
    console.error(e);
    alert("Modal konnte nicht geladen werden. Check Console (F12).");
    return;
  }

  // Modal-Elemente
  const overlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const closeBtn = document.getElementById("modalClose");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitBtn = document.getElementById("submitBtn");

  const settingsBtn = document.getElementById("settingsBtn");
  const settingsOverlay = document.getElementById("settingsOverlay");
  const settingsClose = document.getElementById("settingsClose");
  const hotkeyInput = document.getElementById("hotkeyInput");
  const hotkeyCapture = document.getElementById("hotkeyCapture");
  const hotkeySave = document.getElementById("hotkeySave");
  const hotkeyCancel = document.getElementById("hotkeyCancel");
  const themeToggle = document.getElementById("themeToggle");
  const accentRow = document.getElementById("accentRow");
  const bgChoices = document.getElementById("bgChoices");
  const bgUpload = document.getElementById("bgUpload");
  const bgUploadBtn = document.getElementById("bgUploadBtn");
  const bgUploadName = document.getElementById("bgUploadName");
  const bgUploadRow = document.getElementById("bgUploadRow");
  const bgDuoControls = document.getElementById("bgDuoControls");
  const bgDuoTop = document.getElementById("bgDuoTop");
  const bgDuoBottom = document.getElementById("bgDuoBottom");
  const bgError = document.getElementById("bgError");
  const clipboardRetentionMode = document.getElementById("clipboardRetentionMode");
  const clipboardTimeCycle = document.getElementById("clipboardTimeCycle");
  const clipboardMaxItems = document.getElementById("clipboardMaxItems");
  const clipboardTimeWrap = document.getElementById("clipboardTimeWrap");
  const clipboardCountWrap = document.getElementById("clipboardCountWrap");

  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmClose = document.getElementById("confirmClose");
  const confirmCancel = document.getElementById("confirmCancel");
  const confirmOk = document.getElementById("confirmOk");
  const confirmText = document.getElementById("confirmText");
  const confirmTitle = document.getElementById("confirmTitle");
  let confirmAction = null;

  const addBtn = document.getElementById("addBtn");
  const addBtn2 = document.getElementById("addBtn2");

  const catTabs = document.getElementById("catTabs");
  const catAddToggle = document.getElementById("catAddToggle");
  const catManageOverlay = document.getElementById("catManageOverlay");
  const catManageClose = document.getElementById("catManageClose");
  const catManageCancel = document.getElementById("catManageCancel");
  const catManageList = document.getElementById("catManageList");
  const catManageInput = document.getElementById("catManageInput");
  const catManageAdd = document.getElementById("catManageAdd");

  const appType = document.getElementById("appType");
  const appCategory = document.getElementById("appCategory");
  const launchLabel = document.getElementById("launchLabel");
  const launchHelp = document.getElementById("launchHelp");
  const launchField = document.getElementById("launchField");
  const scanField = document.getElementById("scanField");
  const scanSelect = document.getElementById("scanSelect");
  const scanLoading = document.getElementById("scanLoading");
  const scanRefresh = document.getElementById("scanRefresh");

  let editingId = null;

  let scanApps = [];
  const SCAN_CACHE_KEY = "kc_scan_cache_v5";
  const SCAN_CACHE_TTL = 1000 * 60 * 60 * 6; // 6h

  function loadScanCache(){
    try{
      const raw = JSON.parse(localStorage.getItem(SCAN_CACHE_KEY) || "null");
      if (!raw || !Array.isArray(raw.apps) || typeof raw.ts !== "number") return null;
      return raw;
    }catch{
      return null;
    }
  }

  function saveScanCache(list){
    try{
      localStorage.setItem(SCAN_CACHE_KEY, JSON.stringify({ ts: Date.now(), apps: list }));
    }catch{
      // ignore cache write errors
    }
  }

  async function loadScanApps(force = false){
    try{
      if (scanSelect){
        scanSelect.disabled = true;
        scanSelect.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Scanne…";
        scanSelect.appendChild(opt);
      }
      if (scanLoading) scanLoading.classList.remove("hidden");

      const cache = force ? null : loadScanCache();
      if (cache){
        scanApps = cache.apps || [];
        renderScanApps();
        const age = Date.now() - cache.ts;
        if (age < SCAN_CACHE_TTL){
          if (scanLoading) scanLoading.classList.add("hidden");
          return;
        }
      }

      const t = window.__TAURI__;
      if (!t?.core?.invoke){
        scanApps = [];
        renderScanApps();
        if (scanLoading) scanLoading.classList.add("hidden");
        return;
      }
      scanApps = await t.core.invoke("scan_desktop_apps");
      saveScanCache(scanApps);
      renderScanApps();
    }catch(e){
      console.error("scan_desktop_apps failed:", e);
      const cache = loadScanCache();
      if (cache && Array.isArray(cache.apps)){
        scanApps = cache.apps;
        renderScanApps();
      } else {
        scanApps = [];
        renderScanApps();
      }
      alert("Scan fehlgeschlagen: " + (e?.message || e));
    } finally {
      if (scanLoading) scanLoading.classList.add("hidden");
    }
  }

  function renderScanApps(){
    if (!scanSelect) return;
    scanSelect.innerHTML = "";
    if (!scanApps.length){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Keine Apps gefunden";
      scanSelect.appendChild(opt);
      scanSelect.disabled = true;
      return;
    }
    scanSelect.disabled = false;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "";
    placeholder.selected = true;
    scanSelect.appendChild(placeholder);
    scanApps.forEach(app => {
      const opt = document.createElement("option");
      opt.value = app.launch || app.path || "";
      opt.textContent = app.name || app.title || "Unbekannt";
      scanSelect.appendChild(opt);
    });
    applyScanSelectionIcon();
  }

  function applyScanSelectionIcon(){
    if (!scanSelect) return;
    const selected = scanSelect.value || "";
    const app = scanApps.find(a => a.launch === selected);
    if (app?.icon){
      setIconCustom(app.icon);
    } else {
      setIconNone();
    }
  }

  function openModal() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("appName")?.focus(), 50);
    syncTypeUI();
    refreshIconFromUrl();
  }

  // Version tag (Tauri)
  try{
    const t = window.__TAURI__;
    if (t?.app?.getVersion){
      const v = await t.app.getVersion();
      if (versionTag && v) versionTag.textContent = "v" + v;
    }
  }catch{
    // keep default text
  }

  // Notes (localStorage)
  const NOTES_KEY = "kc_notes";
  const NOTES_PAGE_KEY = "kc_notes_page";
  const NOTES_PAGE_COUNT_KEY = "kc_notes_pages";
  const NOTES_LOCK_KEY = "kc_notes_lock";
  let notesSaveTimer = null;
  let activeNotesPage = localStorage.getItem(NOTES_PAGE_KEY) || "1";
  let notesPageCount = parseInt(localStorage.getItem(NOTES_PAGE_COUNT_KEY) || "1", 10);
  let notesLocked = false;
  if (Number.isNaN(notesPageCount) || notesPageCount < 1) notesPageCount = 1;
  if (notesPageCount > 9) notesPageCount = 9;

  function syncSidePanelsLayout(){
    if (!layout) return;
    const notesOpen = Boolean(notesPanel?.classList.contains("show"));
    const clipboardOpen = Boolean(clipboardPanel?.classList.contains("show"));
    layout.classList.toggle("notes-open", notesOpen);
    layout.classList.toggle("clipboard-open", clipboardOpen);
  }

  function openNotes(){
    if (!notesPanel) return;
    closeClipboard();
    notesPanel.classList.add("show");
    notesPanel.setAttribute("aria-hidden", "false");
    if (notesToggle) notesToggle.setAttribute("aria-expanded", "true");
    syncSidePanelsLayout();
    setTimeout(() => notesText?.focus(), 0);
  }

  function closeNotes(){
    if (!notesPanel) return;
    notesPanel.classList.remove("show");
    notesPanel.setAttribute("aria-hidden", "true");
    if (notesToggle) notesToggle.setAttribute("aria-expanded", "false");
    syncSidePanelsLayout();
  }

  function setNotesStatus(text){
    if (notesStatus) notesStatus.textContent = text;
  }

  function notesKeyForPage(page){
    return `${NOTES_KEY}_${page}`;
  }
  function notesLockKeyForPage(page){
    return `${NOTES_LOCK_KEY}_${page}`;
  }

  function setActiveNotesPage(page){
    const p = String(page || "1");
    activeNotesPage = p;
    localStorage.setItem(NOTES_PAGE_KEY, p);
    if (notesPages){
      notesPages.querySelectorAll(".notes-page").forEach(btn => {
        const isActive = btn.dataset.page === p;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }
    notesLocked = localStorage.getItem(notesLockKeyForPage(activeNotesPage)) === "1";
    syncNotesDeleteState();
    syncNotesLockState();
  }

  function saveNotesPageCount(){
    localStorage.setItem(NOTES_PAGE_COUNT_KEY, String(notesPageCount));
  }

  function syncNotesDeleteState(){
    if (!notesDelete) return;
    const disabled = notesPageCount <= 1 || notesLocked;
    notesDelete.disabled = disabled;
    if (notesLocked){
      notesDelete.title = "Bearbeitung gesperrt";
    } else if (notesPageCount <= 1){
      notesDelete.title = "Mindestens eine Seite muss bleiben";
    } else {
      notesDelete.title = "Seite löschen";
    }
  }

  function syncNotesLockState(){
    if (!notesLock) return;
    notesLock.dataset.locked = notesLocked ? "true" : "false";
    notesLock.setAttribute("aria-pressed", notesLocked ? "true" : "false");
    notesLock.setAttribute("aria-label", notesLocked ? "Bearbeitung gesperrt" : "Bearbeitung entsperrt");
    if (notesClear) notesClear.disabled = notesLocked;
    if (notesDelete) notesDelete.disabled = notesLocked || notesPageCount <= 1;
  }

  function rebuildNotesPages(){
    if (!notesPages) return;
    notesPages.innerHTML = "";
    for (let i = 1; i <= notesPageCount; i++){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "notes-page";
      btn.dataset.page = String(i);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.textContent = String(i);
      notesPages.appendChild(btn);
    }
    if (notesPageCount < 9){
      const add = document.createElement("button");
      add.type = "button";
      add.className = "notes-page-add";
      add.setAttribute("aria-label", "Seite hinzufügen");
      add.textContent = "+";
      notesPages.appendChild(add);
    }
    setActiveNotesPage(activeNotesPage);
    syncNotesDeleteState();
    syncNotesLockState();
  }

  function loadNotes(){
    const saved = localStorage.getItem(notesKeyForPage(activeNotesPage)) || "";
    if (notesText) notesText.value = saved;
    setNotesStatus(saved ? "Gespeichert" : "Leer");
  }

  function saveNotes(value){
    localStorage.setItem(notesKeyForPage(activeNotesPage), value || "");
    setNotesStatus(value ? "Gespeichert" : "Leer");
  }

  if (notesToggle && notesPanel){
    notesToggle.addEventListener("click", () => {
      if (notesPanel.classList.contains("show")){
        closeNotes();
      } else {
        openNotes();
      }
    });
  }

  notesText?.addEventListener("input", () => {
    const value = notesText.value || "";
    setNotesStatus("Speichert...");
    if (notesSaveTimer) clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(() => saveNotes(value), 300);
  });

  notesClear?.addEventListener("click", () => {
    if (!notesText) return;
    if (notesLocked) return;
    const doClear = () => {
      notesText.value = "";
      saveNotes("");
      notesText.focus();
    };
    if (typeof openConfirm === "function"){
      openConfirm("Diese Seite wirklich leeren?", doClear, "Leeren", "Leeren bestätigen");
    } else {
      doClear();
    }
  });

  notesDelete?.addEventListener("click", () => {
    if (notesPageCount <= 1 || notesLocked) return;
    const doDelete = () => {
      if (notesSaveTimer) {
        clearTimeout(notesSaveTimer);
        notesSaveTimer = null;
      }
      const currentPage = parseInt(activeNotesPage, 10) || 1;
      saveNotes(notesText?.value || "");
      localStorage.removeItem(notesKeyForPage(currentPage));
      for (let i = currentPage; i < notesPageCount; i++){
        const nextVal = localStorage.getItem(notesKeyForPage(i + 1)) || "";
        localStorage.setItem(notesKeyForPage(i), nextVal);
      }
      localStorage.removeItem(notesKeyForPage(notesPageCount));
      notesPageCount -= 1;
      if (notesPageCount < 1) notesPageCount = 1;
      saveNotesPageCount();
      if (currentPage > notesPageCount) {
        activeNotesPage = String(notesPageCount);
      }
      rebuildNotesPages();
      loadNotes();
    };
    if (typeof openConfirm === "function"){
      openConfirm("Diese Seite wirklich löschen?", doDelete);
    } else {
      doDelete();
    }
  });

  notesLock?.addEventListener("click", () => {
    notesLocked = !notesLocked;
    localStorage.setItem(notesLockKeyForPage(activeNotesPage), notesLocked ? "1" : "0");
    syncNotesLockState();
    syncNotesDeleteState();
  });

  notesPages?.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;
    if (target.classList.contains("notes-page-add")){
      if (notesPageCount >= 9) return;
      if (notesSaveTimer) {
        clearTimeout(notesSaveTimer);
        notesSaveTimer = null;
        saveNotes(notesText?.value || "");
      }
      notesPageCount += 1;
      saveNotesPageCount();
      activeNotesPage = String(notesPageCount);
      rebuildNotesPages();
      loadNotes();
      return;
    }
    if (!target.classList.contains("notes-page")) return;
    const page = target.dataset.page || "1";
    if (page === activeNotesPage) return;
    if (notesSaveTimer) {
      clearTimeout(notesSaveTimer);
      notesSaveTimer = null;
      saveNotes(notesText?.value || "");
    }
    setActiveNotesPage(page);
    loadNotes();
  });

  if (notesPageCount < 1) notesPageCount = 1;
  if (notesPageCount > 9) notesPageCount = 9;
  if ((parseInt(activeNotesPage, 10) || 1) > notesPageCount){
    activeNotesPage = String(notesPageCount);
  }
  saveNotesPageCount();
  rebuildNotesPages();
  setActiveNotesPage(activeNotesPage);
  loadNotes();
  syncSidePanelsLayout();

  const CLIPBOARD_ITEMS_KEY = "kc_clipboard_items";
  const CLIPBOARD_RETENTION_MODE_KEY = "kc_clipboard_retention_mode";
  const CLIPBOARD_RETENTION_TIME_KEY = "kc_clipboard_retention_hours";
  const CLIPBOARD_RETENTION_COUNT_KEY = "kc_clipboard_retention_count";
  let clipboardItems = [];
  let clipboardPollTimer = null;
  let clipboardPruneTimer = null;
  let clipboardPolling = false;
  let lastClipboardText = "";
  let suppressClipboardText = "";
  let suppressClipboardUntil = 0;

  function loadClipboardItems(){
    try{
      const raw = JSON.parse(localStorage.getItem(CLIPBOARD_ITEMS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .map((item) => ({
          id: String(item?.id || ""),
          text: String(item?.text || ""),
          ts: Number(item?.ts || 0)
        }))
        .filter((item) => item.id && item.text && Number.isFinite(item.ts));
    }catch{
      return [];
    }
  }

  function saveClipboardItems(){
    localStorage.setItem(CLIPBOARD_ITEMS_KEY, JSON.stringify(clipboardItems));
  }

  function getClipboardRetentionSettings(){
    const modeRaw = (localStorage.getItem(CLIPBOARD_RETENTION_MODE_KEY) || "count").toLowerCase();
    const mode = ["count", "time", "unlimited"].includes(modeRaw) ? modeRaw : "count";
    const hours = Math.max(1, parseInt(localStorage.getItem(CLIPBOARD_RETENTION_TIME_KEY) || "24", 10) || 24);
    const maxItems = Math.max(1, parseInt(localStorage.getItem(CLIPBOARD_RETENTION_COUNT_KEY) || "100", 10) || 100);
    return { mode, hours, maxItems };
  }

  function saveClipboardRetentionSettings({ mode, hours, maxItems }){
    const safeMode = ["count", "time", "unlimited"].includes(mode) ? mode : "count";
    const safeHours = Math.max(1, parseInt(hours, 10) || 24);
    const safeMaxItems = Math.max(1, parseInt(maxItems, 10) || 100);
    localStorage.setItem(CLIPBOARD_RETENTION_MODE_KEY, safeMode);
    localStorage.setItem(CLIPBOARD_RETENTION_TIME_KEY, String(safeHours));
    localStorage.setItem(CLIPBOARD_RETENTION_COUNT_KEY, String(safeMaxItems));
  }

  function syncClipboardSettingsUI(){
    const cfg = getClipboardRetentionSettings();
    if (clipboardRetentionMode) clipboardRetentionMode.value = cfg.mode;
    if (clipboardTimeCycle) clipboardTimeCycle.value = String(cfg.hours);
    if (clipboardMaxItems) clipboardMaxItems.value = String(cfg.maxItems);
    if (clipboardTimeWrap) clipboardTimeWrap.classList.toggle("hidden", cfg.mode !== "time");
    if (clipboardCountWrap) clipboardCountWrap.classList.toggle("hidden", cfg.mode !== "count");
  }

  function updateClipboardModeBadge(){
    if (!clipboardModeBadge) return;
    const cfg = getClipboardRetentionSettings();
    if (cfg.mode === "time"){
      clipboardModeBadge.textContent = `Zeit: ${cfg.hours}h`;
      return;
    }
    if (cfg.mode === "count"){
      clipboardModeBadge.textContent = `Anzahl: ${cfg.maxItems}`;
      return;
    }
    clipboardModeBadge.textContent = "Nur manuell";
  }

  function formatClipboardTime(ts){
    const d = new Date(ts);
    return d.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function pruneClipboardByPolicy(){
    const cfg = getClipboardRetentionSettings();
    const now = Date.now();
    if (cfg.mode === "count"){
      if (clipboardItems.length > cfg.maxItems){
        clipboardItems = clipboardItems.slice(0, cfg.maxItems);
      }
    } else if (cfg.mode === "time"){
      const cutoff = now - (cfg.hours * 60 * 60 * 1000);
      clipboardItems = clipboardItems.filter((item) => item.ts >= cutoff);
    }
  }

  function persistAndRenderClipboard(){
    pruneClipboardByPolicy();
    saveClipboardItems();
    renderClipboardItems();
  }

  function renderClipboardItems(){
    if (!clipboardList || !clipboardEmpty) return;
    clipboardList.innerHTML = "";
    clipboardEmpty.style.display = clipboardItems.length ? "none" : "block";

    clipboardItems.forEach((item) => {
      const row = document.createElement("div");
      row.className = "clip-item";
      row.innerHTML = `
        <div class="clip-text">${escapeHtml(item.text)}</div>
        <div class="clip-actions">
          <button class="clip-btn" type="button" data-action="copy">Kopieren</button>
          <button class="clip-btn danger" type="button" data-action="delete">Löschen</button>
          <span class="clip-time">${escapeHtml(formatClipboardTime(item.ts))}</span>
        </div>
      `;

      const copyBtn = row.querySelector("[data-action='copy']");
      copyBtn?.addEventListener("click", async () => {
        if (copyBtn.disabled) return;
        const text = item.text || "";
        try{
          const t = window.__TAURI__;
          if (t?.core?.invoke){
            await t.core.invoke("set_clipboard_text", { text });
          } else if (navigator.clipboard?.writeText){
            await navigator.clipboard.writeText(text);
          }
          suppressClipboardText = text;
          suppressClipboardUntil = Date.now() + 3000;
          copyBtn.disabled = true;
          copyBtn.textContent = "Kopiert";
          setTimeout(() => {
            copyBtn.disabled = false;
            copyBtn.textContent = "Kopieren";
          }, 3000);
        }catch(e){
          console.error("clipboard copy failed:", e);
        }
      });

      row.querySelector("[data-action='delete']")?.addEventListener("click", () => {
        clipboardItems = clipboardItems.filter((x) => x.id !== item.id);
        persistAndRenderClipboard();
      });

      clipboardList.appendChild(row);
    });
  }

  function addClipboardEntry(text){
    const normalized = String(text || "").replace(/\r\n/g, "\n");
    if (!normalized.trim()) return;
    const existingIdx = clipboardItems.findIndex((item) => item.text === normalized);
    if (existingIdx === 0){
      clipboardItems[0].ts = Date.now();
      persistAndRenderClipboard();
      return;
    }
    if (existingIdx > 0){
      clipboardItems.splice(existingIdx, 1);
    }
    clipboardItems.unshift({
      id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)),
      text: normalized,
      ts: Date.now()
    });
    persistAndRenderClipboard();
  }

  async function readClipboardText(){
    const t = window.__TAURI__;
    if (t?.core?.invoke){
      try{
        const value = await t.core.invoke("get_clipboard_text");
        return typeof value === "string" ? value : "";
      }catch(e){
        console.error("get_clipboard_text failed:", e);
        return "";
      }
    }
    return "";
  }

  async function pollClipboardNow(){
    if (clipboardPolling) return;
    clipboardPolling = true;
    try{
      const text = await readClipboardText();
      if (!text) return;
      const now = Date.now();
      if (text === suppressClipboardText && now < suppressClipboardUntil) return;
      if (text === suppressClipboardText && now >= suppressClipboardUntil){
        suppressClipboardText = "";
        suppressClipboardUntil = 0;
      }
      if (text === lastClipboardText) return;
      lastClipboardText = text;
      addClipboardEntry(text);
    } finally {
      clipboardPolling = false;
    }
  }

  function startClipboardPolling(){
    if (clipboardPollTimer) clearInterval(clipboardPollTimer);
    if (clipboardPruneTimer) clearInterval(clipboardPruneTimer);
    pollClipboardNow();
    clipboardPollTimer = setInterval(pollClipboardNow, 1300);
    clipboardPruneTimer = setInterval(() => {
      const before = clipboardItems.length;
      pruneClipboardByPolicy();
      if (clipboardItems.length !== before){
        saveClipboardItems();
        renderClipboardItems();
      }
    }, 60 * 1000);
  }

  function openClipboard(){
    if (!clipboardPanel) return;
    closeNotes();
    clipboardPanel.classList.add("show");
    clipboardPanel.setAttribute("aria-hidden", "false");
    if (clipboardToggle) clipboardToggle.setAttribute("aria-expanded", "true");
    syncSidePanelsLayout();
    updateClipboardModeBadge();
    renderClipboardItems();
  }

  function closeClipboard(){
    if (!clipboardPanel) return;
    clipboardPanel.classList.remove("show");
    clipboardPanel.setAttribute("aria-hidden", "true");
    if (clipboardToggle) clipboardToggle.setAttribute("aria-expanded", "false");
    syncSidePanelsLayout();
  }

  if (clipboardToggle && clipboardPanel){
    clipboardToggle.addEventListener("click", () => {
      if (clipboardPanel.classList.contains("show")){
        closeClipboard();
      } else {
        openClipboard();
      }
    });
  }

  clipboardClearAll?.addEventListener("click", () => {
    const doClearAll = () => {
      clipboardItems = [];
      saveClipboardItems();
      renderClipboardItems();
    };
    if (typeof openConfirm === "function"){
      openConfirm("Clipboard-Verlauf wirklich leeren?", doClearAll, "Leeren", "Leeren bestätigen");
    } else {
      doClearAll();
    }
  });

  clipboardRetentionMode?.addEventListener("change", () => {
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode.value,
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "100"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  });

  clipboardTimeCycle?.addEventListener("change", () => {
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "time",
      hours: clipboardTimeCycle.value,
      maxItems: clipboardMaxItems?.value || "100"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  });

  clipboardMaxItems?.addEventListener("change", () => {
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "count",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems.value
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  });

  saveClipboardRetentionSettings(getClipboardRetentionSettings());
  clipboardItems = loadClipboardItems();
  persistAndRenderClipboard();
  syncClipboardSettingsUI();
  updateClipboardModeBadge();
  startClipboardPolling();

  function applyTheme(theme){
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("kc_theme", t);
  }

  const ACCENTS = {
    purple: { rgb: "124,58,237", rgb2: "168,85,247" },
    blue:   { rgb: "59,130,246", rgb2: "37,99,235" },
    green:  { rgb: "16,185,129", rgb2: "5,150,105" },
    yellow: { rgb: "245,158,11", rgb2: "217,119,6" },
    pink:   { rgb: "236,72,153", rgb2: "219,39,119" },
    teal:   { rgb: "20,184,166", rgb2: "13,148,136" },
    orange: { rgb: "249,115,22", rgb2: "234,88,12" },
    red:    { rgb: "239,68,68", rgb2: "220,38,38" },
    cyan:   { rgb: "6,182,212", rgb2: "8,145,178" },
    gray:   { rgb: "100,116,139", rgb2: "71,85,105" }
  };

  function applyAccent(name){
    const key = ACCENTS[name] ? name : "purple";
    const val = ACCENTS[key];
    document.documentElement.style.setProperty("--accent-rgb", val.rgb);
    document.documentElement.style.setProperty("--accent2-rgb", val.rgb2);
    localStorage.setItem("kc_accent", key);
    if (accentRow){
      accentRow.querySelectorAll(".accent-btn").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.accent === key);
      });
    }
  }

  // Theme init
  const savedTheme = localStorage.getItem("kc_theme") || "dark";
  applyTheme(savedTheme);
  if (themeToggle) themeToggle.checked = savedTheme === "light";
  const savedAccent = localStorage.getItem("kc_accent") || "purple";
  applyAccent(savedAccent);

  const BG_MODES = ["theme", "mono", "duo", "custom"];
  const BG_SIZES = [
    { w: 1920, h: 1080 }, // FHD
    { w: 2560, h: 1440 }, // WQHD
    { w: 3840, h: 2160 }, // 4K
    { w: 5184, h: 3456 }  // 5K 3:2
  ];

  function applyBackground(mode){
    let m = mode || "theme";
    if (m === "calm") m = "mono";
    if (m === "warm") m = "duo";
    if (!BG_MODES.includes(m)) m = "theme";
    document.documentElement.classList.remove("bg-theme", "bg-mono", "bg-duo", "bg-custom");
    document.documentElement.classList.add("bg-" + m);
    localStorage.setItem("kc_bg_mode", m);
  }

  function applyCustomBackground(dataUrl){
    if (!dataUrl) {
      document.documentElement.style.removeProperty("--custom-bg");
      localStorage.removeItem("kc_bg_custom");
      return;
    }
    document.documentElement.style.setProperty("--custom-bg", `url("${dataUrl}")`);
    localStorage.setItem("kc_bg_custom", dataUrl);
  }

  function syncBackgroundUI(mode){
    if (!bgChoices) return;
    const m = BG_MODES.includes(mode) ? mode : "theme";
    bgChoices.querySelectorAll("input[name='bgMode']").forEach((input) => {
      input.checked = input.value === m;
    });
    if (bgUploadRow){
      bgUploadRow.classList.toggle("hidden", m !== "custom");
    }
    if (bgDuoControls){
      bgDuoControls.classList.toggle("hidden", m !== "duo");
    }
    if (bgUploadName){
      const has = Boolean(localStorage.getItem("kc_bg_custom"));
      bgUploadName.value = has ? "Custom Hintergrund aktiv" : "Kein Bild gewählt";
    }
  }

  function applyDuoColors(topKey, bottomKey){
    const top = ACCENTS[topKey] ? topKey : "purple";
    const bottom = ACCENTS[bottomKey] ? bottomKey : "blue";
    const topRgb = ACCENTS[top].rgb;
    const bottomRgb = ACCENTS[bottom].rgb;
    document.documentElement.style.setProperty("--duo-top", `rgba(${topRgb},0.22)`);
    document.documentElement.style.setProperty("--duo-bottom", `rgba(${bottomRgb},0.20)`);
    localStorage.setItem("kc_bg_duo_top", top);
    localStorage.setItem("kc_bg_duo_bottom", bottom);
    if (bgDuoTop){
      bgDuoTop.querySelectorAll(".bg-duo-color").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.accent === top);
      });
    }
    if (bgDuoBottom){
      bgDuoBottom.querySelectorAll(".bg-duo-color").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.accent === bottom);
      });
    }
  }

  function renderDuoPalette(container, onPick){
    if (!container) return;
    container.innerHTML = "";
    Object.keys(ACCENTS).forEach(key => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color bg-duo-color";
      btn.dataset.accent = key;
      btn.style.background = `rgb(${ACCENTS[key].rgb})`;
      btn.addEventListener("click", () => onPick(key));
      container.appendChild(btn);
    });
  }

  const savedBgMode = localStorage.getItem("kc_bg_mode") || "theme";
  const savedBgCustom = localStorage.getItem("kc_bg_custom") || "";
  const savedDuoTop = localStorage.getItem("kc_bg_duo_top") || "purple";
  const savedDuoBottom = localStorage.getItem("kc_bg_duo_bottom") || "blue";
  if (savedBgCustom) applyCustomBackground(savedBgCustom);
  renderDuoPalette(bgDuoTop, (key) => applyDuoColors(key, localStorage.getItem("kc_bg_duo_bottom") || "blue"));
  renderDuoPalette(bgDuoBottom, (key) => applyDuoColors(localStorage.getItem("kc_bg_duo_top") || "purple", key));
  applyDuoColors(savedDuoTop, savedDuoBottom);
  applyBackground(savedBgMode);
  syncBackgroundUI(savedBgMode);

  // Apply saved hotkey on boot (Tauri)
  try{
    const savedHotkey = localStorage.getItem("kc_hotkey") || "";
    if (savedHotkey){
      const t = window.__TAURI__;
      if (t?.core?.invoke){
        await t.core.invoke("set_global_shortcut", { shortcut: savedHotkey });
      }
    }
  }catch{
    // ignore
  }

  function closeModal() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    editingId = null;
    if (modalTitle) modalTitle.textContent = "Neue App hinzufügen";
    if (submitBtn) submitBtn.textContent = "Hinzufügen";
  }

  function openSettings(){
    if (!settingsOverlay) return;
    const saved = localStorage.getItem("kc_hotkey") || "";
    if (hotkeyInput) hotkeyInput.value = saved;
    if (themeToggle) themeToggle.checked = (localStorage.getItem("kc_theme") || "dark") === "light";
    applyAccent(localStorage.getItem("kc_accent") || "purple");
    const bgMode = localStorage.getItem("kc_bg_mode") || "theme";
    syncBackgroundUI(bgMode);
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    showBgError(false);
    settingsOverlay.classList.add("show");
    settingsOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => hotkeyInput?.focus(), 0);
  }

  function closeSettings(){
    if (!settingsOverlay) return;
    settingsOverlay.classList.remove("show");
    settingsOverlay.setAttribute("aria-hidden", "true");
    stopHotkeyCapture();
  }

  function openCatManage(){
    if (!catManageOverlay) return;
    renderCategoryManager();
    catManageOverlay.classList.add("show");
    catManageOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => catManageInput?.focus(), 0);
  }

  function closeCatManage(){
    if (!catManageOverlay) return;
    catManageOverlay.classList.remove("show");
    catManageOverlay.setAttribute("aria-hidden", "true");
  }

  function openConfirm(message, onOk, okLabel = "Löschen", title = "Löschen bestätigen"){
    if (!confirmOverlay || !confirmText) return;
    confirmText.textContent = message || "Möchtest du diese App wirklich löschen?";
    if (confirmOk) confirmOk.textContent = okLabel || "Löschen";
    if (confirmTitle) confirmTitle.textContent = title || "Löschen bestätigen";
    confirmAction = onOk || null;
    confirmOverlay.classList.add("show");
    confirmOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => confirmOk?.focus(), 0);
  }

  function closeConfirm(){
    if (!confirmOverlay) return;
    confirmOverlay.classList.remove("show");
    confirmOverlay.setAttribute("aria-hidden", "true");
    if (confirmOk) confirmOk.textContent = "Löschen";
    if (confirmTitle) confirmTitle.textContent = "Löschen bestätigen";
    confirmAction = null;
  }

  addBtn?.addEventListener("click", openModal);
  addBtn2?.addEventListener("click", openModal);
  settingsBtn?.addEventListener("click", openSettings);
  catAddToggle?.addEventListener("click", openCatManage);

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  settingsClose?.addEventListener("click", closeSettings);
  hotkeyCancel?.addEventListener("click", closeSettings);
  catManageClose?.addEventListener("click", closeCatManage);
  catManageCancel?.addEventListener("click", closeCatManage);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  settingsOverlay?.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });
  catManageOverlay?.addEventListener("click", (e) => {
    if (e.target === catManageOverlay) closeCatManage();
  });

  confirmClose?.addEventListener("click", closeConfirm);
  confirmCancel?.addEventListener("click", closeConfirm);
  confirmOk?.addEventListener("click", () => {
    const action = confirmAction;
    closeConfirm();
    if (typeof action === "function") action();
  });

  confirmOverlay?.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) closeConfirm();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && confirmOverlay?.classList.contains("show")) {
      closeConfirm();
      return;
    }
    if (e.key === "Escape" && settingsOverlay?.classList.contains("show")) {
      closeSettings();
      return;
    }
    if (e.key === "Escape" && catManageOverlay?.classList.contains("show")) {
      closeCatManage();
      return;
    }
    if (e.key === "Escape" && overlay.classList.contains("show")) {
      closeModal();
      return;
    }
    if (e.key === "Escape" && notesPanel?.classList.contains("show")) {
      closeNotes();
      return;
    }
    if (e.key === "Escape" && clipboardPanel?.classList.contains("show")) {
      closeClipboard();
    }
  });

  async function applyHotkey(value){
    const shortcut = String(value || "").trim();
    const current = localStorage.getItem("kc_hotkey") || "";
    if (shortcut === current) return;
    localStorage.setItem("kc_hotkey", shortcut);
    try{
      const t = window.__TAURI__;
      if (t?.core?.invoke){
        await t.core.invoke("set_global_shortcut", { shortcut });
      }
    }catch(e){
      console.error("set_global_shortcut failed:", e);
    }
  }

  let capturingHotkey = false;
  function stopHotkeyCapture(){
    if (!capturingHotkey) return;
    capturingHotkey = false;
    document.removeEventListener("keydown", onHotkeyKeydown, true);
    if (hotkeyCapture) hotkeyCapture.textContent = "Aufnehmen";
  }

  function startHotkeyCapture(){
    capturingHotkey = true;
    if (hotkeyCapture) hotkeyCapture.textContent = "Drücke Tasten…";
    document.addEventListener("keydown", onHotkeyKeydown, true);
  }

  function normalizeKey(e){
    const parts = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Super");
    let key = e.key;
    if (key === " ") key = "Space";
    if (key.length === 1) key = key.toUpperCase();
    if (["Control","Alt","Shift","Meta"].includes(key)) return "";
    parts.push(key);
    return parts.join("+");
  }

  function onHotkeyKeydown(e){
    if (!capturingHotkey) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // block browser/system defaults while capturing
    if (e.altKey && e.code === "Space") {
      // prevent system menu in Windows
    }
    if (e.key === "Escape"){
      stopHotkeyCapture();
      return;
    }
    const combo = normalizeKey(e);
    if (!combo) return;
    if (hotkeyInput) hotkeyInput.value = combo;
    stopHotkeyCapture();
  }

  hotkeyCapture?.addEventListener("click", () => {
    if (capturingHotkey) {
      stopHotkeyCapture();
    } else {
      startHotkeyCapture();
    }
  });

  hotkeySave?.addEventListener("click", async () => {
    const val = hotkeyInput?.value || "";
    await applyHotkey(val);
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "count",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "100"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
    closeSettings();
  });

  themeToggle?.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "light" : "dark");
  });

  accentRow?.addEventListener("click", (e) => {
    const btn = e.target.closest(".accent-btn");
    if (!btn) return;
    applyAccent(btn.dataset.accent);
  });

  bgChoices?.addEventListener("change", (e) => {
    const input = e.target.closest("input[name='bgMode']");
    if (!input) return;
    const mode = input.value || "theme";
    showBgError(false);
    applyBackground(mode);
    syncBackgroundUI(mode);
    if (mode === "custom" && !localStorage.getItem("kc_bg_custom")){
      bgUpload?.click();
    }
  });

  function showBgError(show){
    if (!bgError) return;
    bgError.classList.toggle("hidden", !show);
  }

  bgUploadBtn?.addEventListener("click", () => bgUpload?.click());

  bgUpload?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = /image\/(png|jpeg|jpg|webp)/.test(file.type);
    if (!ok){
      showBgError(true);
      if (bgUploadName) bgUploadName.value = "Falsches Dateiformat";
      bgUpload.value = "";
      return;
    }
    try{
      const dataUrl = await fileToDataUrl(file);
      const size = await getImageSize(dataUrl);
      const match = size && BG_SIZES.some(s => s.w === size.w && s.h === size.h);
      if (!match){
        showBgError(true);
        if (bgUploadName) bgUploadName.value = `Falsche Größe (${size?.w || "?"}x${size?.h || "?"})`;
        bgUpload.value = "";
        return;
      }
      showBgError(false);
      applyCustomBackground(dataUrl);
      applyBackground("custom");
      syncBackgroundUI("custom");
      if (bgUploadName) bgUploadName.value = file.name;
      bgUpload.value = "";
    }catch{
      showBgError(true);
      if (bgUploadName) bgUploadName.value = "Bild konnte nicht gelesen werden";
      bgUpload.value = "";
    }
  });


  function applyIconStateFromApp(app){
    if (!app?.icon || app.icon.type === "none"){
      setIconNone();
      return;
    }
    if (app.icon.type === "custom"){
      setIconCustom(app.icon.value || "");
      return;
    }
    if (app.icon.type === "favicon"){
      iconState = { type:"favicon", value: app.icon.value || "" };
      if (iconPreviewImg){
        if (iconState.value){
          iconPreviewImg.src = iconState.value;
          iconPreviewImg.style.opacity = "1";
        } else {
          iconPreviewImg.removeAttribute("src");
          iconPreviewImg.style.opacity = "0";
        }
      }
    }
  }

  function openEditModal(app){
    if (!app) return;
    editingId = app.id;
    if (modalTitle) modalTitle.textContent = "App bearbeiten";
    if (submitBtn) submitBtn.textContent = "Speichern";

    document.getElementById("appName").value = app.name || "";
    document.getElementById("appUrl").value = app.launch || "";
    document.getElementById("appDesc").value = app.description || "";
    if (appCategory) appCategory.value = app.category || "Sonstiges";
    document.getElementById("appType").value = app.type === "desktop" ? "desktop" : "web";

    applyIconStateFromApp(app);

    openModal();
  }

  // Icon: favicon default + upload + remove
  const appUrl = document.getElementById("appUrl");
  const iconUpload = document.getElementById("iconUpload");
  const iconUploadBtn = document.getElementById("iconUploadBtn");
  const iconRemove = document.getElementById("iconRemove");
  const iconPreviewImg = document.getElementById("iconPreviewImg");

  let iconState = { type: "favicon", value: "" }; // custom | none

  function faviconUrl(url){
    try{
      const normalized = normalizeWebUrl(url);
      const u = new URL(normalized);
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;
    }catch{
      return "";
    }
  }

  function setIconNone(){
    iconState = { type:"none", value:"" };
    iconPreviewImg?.removeAttribute("src");
    if (iconPreviewImg) iconPreviewImg.style.opacity = "0";
  }

  function setIconFavicon(url){
    const fav = faviconUrl(url);
    iconState = { type:"favicon", value: fav };
    if (iconPreviewImg){
      iconPreviewImg.src = fav;
      iconPreviewImg.style.opacity = "1";
    }
  }

  function setIconCustom(dataUrl){
    iconState = { type:"custom", value: dataUrl };
    if (iconPreviewImg){
      iconPreviewImg.src = dataUrl;
      iconPreviewImg.style.opacity = "1";
    }
  }

  function refreshIconFromUrl(){
    if (iconState.type === "custom") return;

    const raw = appUrl?.value?.trim() || "";
    if (!raw) return setIconNone();

    const isWeb = (appType?.value || "web") === "web";
    if (!isWeb) return setIconNone();

    setIconFavicon(raw);
  }

  appUrl?.addEventListener("input", refreshIconFromUrl);

  iconUploadBtn?.addEventListener("click", () => iconUpload?.click());

  iconUpload?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;

    const ok = /image\/(png|jpeg|jpg|webp)/.test(file.type);
    if(!ok){
      alert("Bitte PNG/JPG/WebP wählen.");
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setIconCustom(dataUrl);
    iconUpload.value = "";
  });

  iconRemove?.addEventListener("click", () => {
    iconState = { type:"favicon", value:"" };
    refreshIconFromUrl();
  });

  function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function getImageSize(dataUrl){
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }

  // Typ UI (Label/Placeholder/Help)
  function syncTypeUI(){
    const t = appType?.value || "web";
    if (!launchLabel || !appUrl || !launchHelp) return;

    if (t === "web"){
      launchField?.classList.remove("hidden");
      scanField?.classList.add("hidden");
      launchLabel.innerHTML = `URL <span class="req">*</span>`;
      appUrl.placeholder = "https://...";
      launchHelp.textContent = "Beispiel: https://notion.so oder discord.com/app";
    } else if (t === "desktop"){
      launchField?.classList.remove("hidden");
      scanField?.classList.add("hidden");
      launchLabel.innerHTML = `Pfad / URI <span class="req">*</span>`;
      appUrl.placeholder = "z.B. discord:// oder steam://run/730 oder file:///C:/...";
      launchHelp.textContent =
        "Empfohlen: URI (discord://, steam://, spotify://, ms-settings:...). file:/// geht je nach Windows-Einstellung.";
    } else if (t === "scan"){
      launchField?.classList.add("hidden");
      scanField?.classList.remove("hidden");
      loadScanApps();
    }

    refreshIconFromUrl();
  }
  appType?.addEventListener("change", syncTypeUI);
  scanSelect?.addEventListener("change", applyScanSelectionIcon);
  scanRefresh?.addEventListener("click", () => loadScanApps(true));

  // Storage
  function loadApps(){
    try{
      return JSON.parse(localStorage.getItem("kc_apps") || "[]");
    }catch{
      return [];
    }
  }

  function saveApps(list){
    localStorage.setItem("kc_apps", JSON.stringify(list));
  }

  let apps = loadApps();

  function loadPinnedOrder(){
    try{
      const raw = JSON.parse(localStorage.getItem("kc_pinned_order") || "[]");
      return Array.isArray(raw) ? raw : [];
    }catch{
      return [];
    }
  }

  function savePinnedOrder(list){
    localStorage.setItem("kc_pinned_order", JSON.stringify(list));
  }

  function loadCategoryOrders(){
    try{
      const raw = JSON.parse(localStorage.getItem("kc_cat_order") || "{}");
      return raw && typeof raw === "object" ? raw : {};
    }catch{
      return {};
    }
  }

  function saveCategoryOrders(map){
    localStorage.setItem("kc_cat_order", JSON.stringify(map));
  }

  let pinnedOrder = loadPinnedOrder();
  let categoryOrders = loadCategoryOrders();

  const defaultCategories = ["Sonstiges", "Social", "Tools", "Gaming", "Media", "Work"];

  function normalizeCategory(name){
    return String(name || "").trim().replace(/\s+/g, " ");
  }

  function loadCategories(){
    let list = [];
    try{
      const raw = JSON.parse(localStorage.getItem("kc_categories") || "[]");
      if (Array.isArray(raw)) list = raw.map(normalizeCategory).filter(Boolean);
    }catch{
      list = [];
    }
    if (!list.length) list = [...defaultCategories];
    if (!list.some(c => c.toLowerCase() === "sonstiges")) list.unshift("Sonstiges");
    const seen = new Set();
    list = list.filter(c => {
      const key = c.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return list;
  }

  function saveCategories(list){
    localStorage.setItem("kc_categories", JSON.stringify(list));
  }

  function loadCategoryTabOrder(){
    try{
      const raw = JSON.parse(localStorage.getItem("kc_cat_tabs") || "[]");
      return Array.isArray(raw) ? raw : [];
    }catch{
      return [];
    }
  }
  function saveCategoryTabOrder(list){
    localStorage.setItem("kc_cat_tabs", JSON.stringify(list));
  }

  let categories = loadCategories();
  let categoryTabOrder = loadCategoryTabOrder();

  // Merge any existing app categories into list (initial boot)
  apps.forEach(a => {
    const c = normalizeCategory(a?.category);
    if (c && !categories.some(x => x.toLowerCase() === c.toLowerCase())){
      categories.push(c);
    }
  });
  saveCategories(categories);
  categoryTabOrder = categoryTabOrder.filter(c => categories.some(x => x.toLowerCase() === c.toLowerCase()));
  categories
    .filter(c => c.toLowerCase() !== "sonstiges")
    .forEach(c => {
      if (!categoryTabOrder.some(x => x.toLowerCase() === c.toLowerCase())) {
        categoryTabOrder.push(c);
      }
    });
  saveCategoryTabOrder(categoryTabOrder);

  function normalizeWebUrl(url){
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) return "https://" + trimmed;
    return trimmed;
  }

  function orderByList(items, orderIds){
    const map = new Map(items.map(i => [i.id, i]));
    const ordered = [];
    orderIds.forEach(id => {
      const it = map.get(id);
      if (it) ordered.push(it);
    });
    items.forEach(i => {
      if (!orderIds.includes(i.id)) ordered.push(i);
    });
    return ordered;
  }

  function renderCategories(){
    if (appCategory){
      appCategory.innerHTML = "";
      categories.forEach(c => {
        const opt = document.createElement("option");
        opt.textContent = c;
        opt.value = c;
        appCategory.appendChild(opt);
      });
      if (!appCategory.value && categories.length) appCategory.value = categories[0];
    }

    if (catTabs){
      catTabs.innerHTML = "";
      const userCats = categories.filter(c => c.toLowerCase() !== "sonstiges");
      const ordered = orderByList(userCats.map(name => ({ id: name, name })), categoryTabOrder)
        .map(x => x.name);

      ordered.forEach(c => {
          const tab = document.createElement("div");
          tab.className = "tab tab-cat";
          tab.setAttribute("role", "tab");
          tab.dataset.tab = `cat:${c}`;
          tab.dataset.cat = c;
          tab.innerHTML = `
            <span>${escapeHtml(c)}</span>
            <span class="badge" data-cat-badge="${escapeHtml(c)}">0</span>
          `;

          catTabs.appendChild(tab);
        });
    }
  }

  function renderCategoryManager(){
    if (!catManageList) return;
    catManageList.innerHTML = "";
    const sorted = [...categories]
      .filter(c => c.toLowerCase() !== "sonstiges")
      .sort((a, b) => a.localeCompare(b, "de"));
    sorted.forEach((c) => {
      const row = document.createElement("div");
      row.className = "cat-item";
      row.innerHTML = `
        <div class="cat-name">${escapeHtml(c)}</div>
        <button class="cat-del" type="button" ${c === "Sonstiges" ? "disabled" : ""}>Löschen</button>
      `;
      const delBtn = row.querySelector(".cat-del");
      if (delBtn && c !== "Sonstiges") {
        delBtn.addEventListener("click", () => {
          openConfirm(`Kategorie "${c}" löschen? Apps werden nach "Sonstiges" verschoben.`, () => {
            categories = categories.filter(x => x.toLowerCase() !== c.toLowerCase());
            apps = apps.map(a => (a.category === c ? { ...a, category: "Sonstiges" } : a));
            saveApps(apps);
            saveCategories(categories);
            categoryTabOrder = categoryTabOrder.filter(x => x.toLowerCase() !== c.toLowerCase());
            saveCategoryTabOrder(categoryTabOrder);
            if (activeTab === `cat:${c}`) setActiveTab("misc");
            renderCategories();
            render();
            renderCategoryManager();
          });
        });
      }
      catManageList.appendChild(row);
    });
  }

  function addCategoryFromInput(){
    const val = normalizeCategory(catManageInput?.value);
    if (!val) return;
    if (categories.some(c => c.toLowerCase() === val.toLowerCase())){
      if (catManageInput) catManageInput.value = "";
      return;
    }
    categories.push(val);
    saveCategories(categories);
    categoryTabOrder.push(val);
    saveCategoryTabOrder(categoryTabOrder);
    renderCategories();
    setActiveTab(`cat:${val}`);
    if (catManageInput) catManageInput.value = "";
    renderCategoryManager();
  }

  catManageAdd?.addEventListener("click", addCategoryFromInput);
  catManageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCategoryFromInput();
  });

  async function openLaunch(app){
    const raw = String(app?.launch || "").trim();
    if (!raw) return;

    const launch = app.type === "web" ? normalizeWebUrl(raw) : raw;
    console.log("[openLaunch]", { id: app?.id, type: app?.type, raw, launch });

    // TAURI invoke -> Rust command -> Shell open (zuverlässig)
    try{
      const t = window.__TAURI__;
      if (!t?.core?.invoke){
        alert("Tauri API nicht verfÃ¼gbar (window.__TAURI__.core.invoke fehlt).");
        return;
      }
      await t.core.invoke("open_external", { url: launch });
      return;
    }catch(e){
      console.error("Tauri invoke(open_external) failed:", e);
      alert("Konnte nicht öffnen: " + (e?.message || e));
    }

    // Fallback (Live Server / Browser)
    window.open(launch, "_blank", "noopener,noreferrer");
  }

  function matches(app){
    if (activeTab === "fav" && !app.fav) return false;
    if (activeTab === "misc" && app.category !== "Sonstiges") return false;
    if (activeTab.startsWith("cat:")){
      const cat = activeTab.slice(4);
      if (app.category !== cat) return false;
    }

    if (searchTerm){
      const hay = (app.name + " " + app.launch + " " + app.category + " " + (app.description || "")).toLowerCase();
      if (!hay.includes(searchTerm)) return false;
    }
    return true;
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function getInitials(name){
    const raw = String(name || "").trim();
    if (!raw) return "?";
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function faviconAltUrl(url){
    try{
      const normalized = normalizeWebUrl(url);
      const u = new URL(normalized);
      return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(u.hostname)}.ico`;
    }catch{
      return "";
    }
  }

  function getIconCandidates(app){
    if (app?.icon?.type === "custom" && app.icon.value){
      return { primary: app.icon.value, alt: "" };
    }
    if (app?.type === "web"){
      const primary = faviconUrl(app.launch || "");
      const alt = faviconAltUrl(app.launch || "");
      return { primary, alt };
    }
    if (app?.icon?.type === "favicon" && app.icon.value){
      return { primary: app.icon.value, alt: "" };
    }
    return { primary: "", alt: "" };
  }

  function fillIcon(iconBox, app){
    if (!iconBox) return;
    iconBox.innerHTML = "";
    const { primary, alt } = getIconCandidates(app);
    const fallback = document.createElement("div");
    fallback.className = "icon-fallback";
    fallback.textContent = getInitials(app?.name);
    if (primary){
      const img = document.createElement("img");
      img.src = primary;
      img.alt = "";
      img.decoding = "async";
      img.loading = "lazy";
      img.dataset.alt = alt || "";
      img.addEventListener("load", () => {
        iconBox.classList.add("has-img");
      });
      img.addEventListener("error", () => {
        const next = img.dataset.alt || "";
        if (next){
          img.dataset.alt = "";
          img.src = next;
          return;
        }
        img.remove();
        iconBox.classList.remove("has-img");
      });
      iconBox.appendChild(img);
      iconBox.classList.add("has-img");
    } else {
      iconBox.classList.remove("has-img");
    }
    iconBox.appendChild(fallback);
  }

  function setActiveTab(tabValue){
    activeTab = tabValue || "all";
    document.querySelectorAll(".tab").forEach(t => {
      const isActive = t.dataset.tab === activeTab;
      if (isActive) {
        t.classList.add("active");
        t.setAttribute("aria-selected", "true");
      } else {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      }
    });
    render();
  }

  let suppressClickId = null;

  function render(){
    const shown = apps.filter(matches);

    // badges
    const badgeAll = document.getElementById("badgeAll");
    const badgeFav = document.getElementById("badgeFav");
    const badgeMisc = document.getElementById("badgeMisc");
    if (badgeAll) badgeAll.textContent = String(apps.length);
    if (badgeFav) badgeFav.textContent = String(apps.filter(a => a.fav).length);
    if (badgeMisc) badgeMisc.textContent = String(apps.filter(a => a.category === "Sonstiges").length);
    const catBadges = document.querySelectorAll("[data-cat-badge]");
    catBadges.forEach(el => {
      const cat = el.getAttribute("data-cat-badge") || "";
      const count = apps.filter(a => a.category === cat).length;
      el.textContent = String(count);
    });

    if (!grid || !empty) return;

    // pinned (favorites)
    if (pinnedSection && pinnedRow){
      const pinned = apps.filter(a => a.fav);
      const pinnedOrdered = orderByList(pinned, pinnedOrder);
      if (pinned.length){
        pinnedSection.style.display = "block";
        pinnedRow.innerHTML = "";
        pinnedOrdered.forEach(app => {
          const card = document.createElement("div");
          card.className = "card mini";
          card.dataset.id = app.id;
          card.classList.add("draggable");
          card.addEventListener("click", () => openLaunch(app));
          card.innerHTML = `
            <div class="card-top">
              <div class="card-icon">
              </div>
            </div>
            <div class="card-name">${escapeHtml(app.name)}</div>
          `;
          fillIcon(card.querySelector(".card-icon"), app);
          pinnedRow.appendChild(card);
        });
      } else {
        pinnedSection.style.display = "none";
      }
    }

    if (apps.length === 0){
      grid.style.display = "none";
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";
    grid.style.display = "grid";

    grid.innerHTML = "";
    const reorderEnabled = canReorder();
    let orderedShown = shown;
    if (activeTab.startsWith("cat:")){
      const cat = activeTab.slice(4);
      const orderIds = categoryOrders[cat] || [];
      orderedShown = orderByList(shown, orderIds);
    }
    orderedShown.forEach(app => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = app.id;
      if (reorderEnabled) card.classList.add("draggable");
      card.addEventListener("click", () => {
        if (suppressClickId === app.id){
          suppressClickId = null;
          return;
        }
        openLaunch(app);
      });

      const typeBadge = app.type === "desktop" ? "Desktop" : "Web";

      card.innerHTML = `
        <div class="card-top">
          <div class="card-icon">
          </div>

          <div class="card-actions">
            <button class="star ${app.fav ? "active" : ""}" type="button" aria-label="Favorit">★</button>
            <button class="edit" type="button" aria-label="Bearbeiten" title="Bearbeiten">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M14.5 5.5 18.5 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="del" type="button" aria-label="Löschen" title="Löschen">🗑</button>
          </div>
        </div>

        <div class="card-name">${escapeHtml(app.name)}</div>

        <div class="card-meta">
          <span class="pill">${escapeHtml(app.category)}</span>
          <span class="pill">${escapeHtml(typeBadge)}</span>
        </div>

        <div class="card-desc">${escapeHtml(app.description || "")}</div>
      `;
      fillIcon(card.querySelector(".card-icon"), app);

      // Fav
      const star = card.querySelector(".star");
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        app.fav = !app.fav;
        saveApps(apps);
        render();
      });

      // Edit
      const editBtn = card.querySelector(".edit");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(app);
      });

      // Delete
      const del = card.querySelector(".del");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        openConfirm(`"${app.name}" wirklich löschen?`, () => {
          apps = apps.filter(a => a.id !== app.id);
          saveApps(apps);
          render();
        });
      });

      grid.appendChild(card);
    });
  }

  // Drag & Drop ordering (only when no filter/search)
  let dragId = null;
  let dragOverId = null;
  let pointerDrag = null;
  let dropSlot = null;
  let dragGhost = null;

  function canReorder(){
    return activeTab.startsWith("cat:") && !searchTerm;
  }

  function activeCategoryName(){
    return activeTab.startsWith("cat:") ? activeTab.slice(4) : "";
  }

  // Category tab drag ordering (only user categories)
  let tabDrag = null;
  let tabGhost = null;
  let tabSlot = null;
  let tabReflowRaf = 0;
  let tabReflowRects = null;
  let tabLastReorderTs = 0;
  const TAB_REORDER_INTERVAL = 70;
  catTabs?.addEventListener("pointerdown", (e) => {
    const tab = e.target.closest(".tab-cat");
    if (!tab) return;
    if (e.button !== 0) return;
    tabDrag = {
      tab,
      startX: e.clientX,
      startY: e.clientY,
      moved: false
    };
    tab.setPointerCapture?.(e.pointerId);
  });

  catTabs?.addEventListener("pointermove", (e) => {
    if (!tabDrag) return;
    const dx = e.clientX - tabDrag.startX;
    const dy = e.clientY - tabDrag.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (!tabDrag.moved) {
      if (dist < 6) return;
      tabDrag.moved = true;
      createTabGhost(tabDrag.tab, e.clientX, e.clientY);
      createTabSlot(tabDrag.tab);
    }
    const now = performance.now();
    if (now - tabLastReorderTs < TAB_REORDER_INTERVAL) {
      if (tabGhost){
        tabGhost.style.left = (e.clientX - tabGhost.offsetWidth / 2) + "px";
        tabGhost.style.top = (e.clientY - tabGhost.offsetHeight / 2) + "px";
      }
      return;
    }
    tabLastReorderTs = now;

    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tab-cat");
    if (!target || target === tabDrag.tab) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientX < rect.left + rect.width / 2;
    if (tabSlot){
      const rects = recordTabRects();
      catTabs.insertBefore(tabSlot, before ? target : target.nextSibling);
      scheduleTabReflow(rects);
    }
    if (tabGhost){
      tabGhost.style.left = (e.clientX - tabGhost.offsetWidth / 2) + "px";
      tabGhost.style.top = (e.clientY - tabGhost.offsetHeight / 2) + "px";
    }
  });

  catTabs?.addEventListener("pointerup", () => {
    if (!tabDrag) return;
    if (tabDrag.moved && tabSlot){
      const rects = recordTabRects();
      catTabs.insertBefore(tabDrag.tab, tabSlot);
      scheduleTabReflow(rects);
      tabDrag.tab.style.display = "";
      tabSlot.remove();
    }
    if (tabDrag.moved){
      const newOrder = Array.from(catTabs.querySelectorAll(".tab-cat")).map(el => el.dataset.cat).filter(Boolean);
      categoryTabOrder = newOrder;
      saveCategoryTabOrder(categoryTabOrder);
      if (tabGhost && tabGhost.parentElement) tabGhost.parentElement.removeChild(tabGhost);
      tabGhost = null;
      tabSlot = null;
    }
    tabDrag = null;
  });

  function createTabGhost(tab, x, y){
    tabGhost = tab.cloneNode(true);
    tabGhost.classList.add("tab-ghost");
    const rect = tab.getBoundingClientRect();
    tabGhost.style.width = rect.width + "px";
    tabGhost.style.height = rect.height + "px";
    tabGhost.style.left = (x - rect.width / 2) + "px";
    tabGhost.style.top = (y - rect.height / 2) + "px";
    document.body.appendChild(tabGhost);
    tab.style.display = "none";
  }

  function createTabSlot(tab){
    tabSlot = document.createElement("div");
    tabSlot.className = "tab-slot";
    tabSlot.style.width = tab.offsetWidth + "px";
    tabSlot.style.height = tab.offsetHeight + "px";
    catTabs.insertBefore(tabSlot, tab.nextSibling);
  }

  function recordTabRects(){
    const rects = new Map();
    catTabs?.querySelectorAll(".tab-cat").forEach(t => {
      rects.set(t, t.getBoundingClientRect());
    });
    return rects;
  }

  function animateTabReflow(rects){
    if (!rects) return;
    catTabs?.querySelectorAll(".tab-cat").forEach(t => {
      const first = rects.get(t);
      if (!first) return;
      const last = t.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (dx || dy){
        t.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0, 0)" }
          ],
          { duration: 220, easing: "cubic-bezier(0.2,0,0,1)" }
        );
      }
    });
  }

  function scheduleTabReflow(rects){
    tabReflowRects = rects;
    if (tabReflowRaf) return;
    tabReflowRaf = requestAnimationFrame(() => {
      tabReflowRaf = 0;
      const r = tabReflowRects;
      tabReflowRects = null;
      animateTabReflow(r);
    });
  }

  function beginPointerDrag(e, container, mode){
    if (e.button !== 0) return;
    const card = e.target.closest(".card");
    if (!card) return;
    if (e.target.closest(".card-actions")) return;
    if (mode === "category" && !canReorder()) return;
    if (mode === "pinned" && !apps.some(a => a.fav)) return;

    pointerDrag = {
      mode,
      container,
      draggingEl: card,
      draggingId: card.dataset.id,
      moved: false,
      axis: mode === "pinned" ? "x" : "auto",
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - card.getBoundingClientRect().left,
      offsetY: e.clientY - card.getBoundingClientRect().top
    };
    dragId = card.dataset.id;
    card.setPointerCapture?.(e.pointerId);
  }

  function createGhost(card, x, y){
    const rect = card.getBoundingClientRect();
    dragGhost = card.cloneNode(true);
    dragGhost.classList.add("drag-ghost");
    dragGhost.style.width = rect.width + "px";
    dragGhost.style.height = rect.height + "px";
    dragGhost.style.left = x - (pointerDrag?.offsetX || 0) + "px";
    dragGhost.style.top = y - (pointerDrag?.offsetY || 0) + "px";
    document.body.appendChild(dragGhost);
  }

  function createDropSlot(card, container){
    dropSlot = document.createElement("div");
    dropSlot.className = "drop-slot";
    dropSlot.style.width = card.offsetWidth + "px";
    dropSlot.style.height = card.offsetHeight + "px";
    // Replace the card with the slot in the layout
    container.replaceChild(dropSlot, card);
    card.style.display = "none";
  }

  function onPointerMove(e){
    if (!pointerDrag) return;
    const { container, draggingEl, axis, offsetX, offsetY, startX, startY } = pointerDrag;
    if (!pointerDrag.moved){
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 6) return;
      pointerDrag.moved = true;
      draggingEl.classList.add("dragging");
      container.classList.add("dragging-active");
      createGhost(draggingEl, e.clientX, e.clientY);
      createDropSlot(draggingEl, container);
    }
    if (dragGhost){
      dragGhost.style.left = (e.clientX - offsetX) + "px";
      dragGhost.style.top = (e.clientY - offsetY) + "px";
    }
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".card");
    if (!target || target === draggingEl || !container.contains(target)) return;

    document.querySelectorAll(".card.drag-over").forEach(el => el.classList.remove("drag-over"));
    target.classList.add("drag-over");

    const rect = target.getBoundingClientRect();
    let before = false;
    if (axis === "x"){
      before = e.clientX < rect.left + rect.width / 2;
    } else if (axis === "auto"){
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.abs(e.clientX - cx);
      const dy = Math.abs(e.clientY - cy);
      if (dx > dy) {
        before = e.clientX < cx;
      } else {
        before = e.clientY < cy;
      }
    } else {
      before = e.clientY < rect.top + rect.height / 2;
    }
    if (dropSlot){
      container.insertBefore(dropSlot, before ? target : target.nextSibling);
    }
  }

  function onPointerUp(e){
    if (!pointerDrag) return;
    const { container, draggingEl, mode, moved } = pointerDrag;
    draggingEl.classList.remove("dragging");
    container.classList.remove("dragging-active");
    document.querySelectorAll(".card.drag-over").forEach(el => el.classList.remove("drag-over"));

    if (!moved){
      pointerDrag = null;
      dragId = null;
      dragOverId = null;
      return;
    }

    if (moved){
      suppressClickId = draggingEl.dataset.id || null;
      // Insert the dragged card at slot position
      if (dropSlot && dropSlot.parentElement === container){
        container.insertBefore(draggingEl, dropSlot);
      }
      draggingEl.style.display = "";
      let newOrder = Array.from(container.querySelectorAll(".card")).map(el => el.dataset.id);
      if (mode === "category"){
        const cat = activeCategoryName();
        if (cat){
          categoryOrders[cat] = newOrder;
          saveCategoryOrders(categoryOrders);
        }
      } else if (mode === "pinned"){
        pinnedOrder = newOrder;
        savePinnedOrder(pinnedOrder);
      }
      render();
    }

    if (dropSlot && dropSlot.parentElement){
      dropSlot.parentElement.removeChild(dropSlot);
    }
    dropSlot = null;
    if (dragGhost && dragGhost.parentElement){
      dragGhost.parentElement.removeChild(dragGhost);
    }
    dragGhost = null;

    pointerDrag = null;
    dragId = null;
    dragOverId = null;
  }

  grid?.addEventListener("pointerdown", (e) => beginPointerDrag(e, grid, "category"));
  pinnedRow?.addEventListener("pointerdown", (e) => beginPointerDrag(e, pinnedRow, "pinned"));
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // Submit -> add app
  submitBtn?.addEventListener("click", () => {
    let name = document.getElementById("appName")?.value?.trim();
    let launch = document.getElementById("appUrl")?.value?.trim();
    let cat  = document.getElementById("appCategory")?.value || "Sonstiges";
    const desc = document.getElementById("appDesc")?.value?.trim() || "";
    const typeRaw = document.getElementById("appType")?.value || "web";
    let type = typeRaw;
    const isEdit = Boolean(editingId);

    if (typeRaw === "scan"){
      const selected = scanSelect?.value || "";
      if (!selected){
        alert("Bitte eine App aus dem Scan wählen.");
        return;
      }
      launch = selected;
      type = "desktop";
      if (!name){
        const opt = scanSelect?.selectedOptions?.[0];
        name = opt?.textContent?.trim() || "";
      }
      const app = scanApps.find(a => a.launch === selected);
      if (app?.icon){
        iconState = { type:"custom", value: app.icon };
      }
    }

    if(!name || !launch){
      alert("Bitte Name und URL/Pfad ausfüllen.");
      return;
    }
    if (!categories.some(c => c.toLowerCase() === String(cat).toLowerCase())){
      cat = "Sonstiges";
    }

    // Mini-Validierung
    if (type === "web"){
      const looksLikeSomething =
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(launch) || /^https?:\/\//i.test(launch);
      if (!looksLikeSomething){
        alert("Web-Apps brauchen eine URL/Domain (z.B. discord.com/app oder https://discord.com/app).");
        return;
      }
      launch = normalizeWebUrl(launch);
    } else {
      const ok = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(launch);
      if (!ok){
        alert("Desktop braucht eine URI wie discord://, steam://..., ms-settings:... oder file:///C:/...");
        return;
      }
    }

    if (isEdit){
      const idx = apps.findIndex(a => a.id === editingId);
      if (idx !== -1){
        const old = apps[idx];
        apps[idx] = {
          ...old,
          name,
          type,          // "web" | "desktop"
          launch,        // url / uri / file:///
          category: cat,
          description: desc,
          icon: iconState
        };
      }
    } else {
      const app = {
        id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
        name,
        type,          // "web" | "desktop"
        launch,        // url / uri / file:///
        category: cat,
        description: desc,
        fav: false,
        icon: iconState,
        createdAt: Date.now()
      };

      apps.unshift(app);
    }
    saveApps(apps);

    // reset
    document.getElementById("appName").value = "";
    document.getElementById("appUrl").value = "";
    document.getElementById("appDesc").value = "";
    if (appCategory){
      if (categories.some(c => c.toLowerCase() === "sonstiges")) {
        appCategory.value = "Sonstiges";
      } else if (categories.length){
        appCategory.value = categories[0];
      }
    }
    document.getElementById("appType").value = "scan";
    iconState = { type:"favicon", value:"" };
    setIconNone();
    syncTypeUI();

    closeModal();
    render();
  });

  // initial
  renderCategories();
  setIconNone();
  syncTypeUI();
  render();
});
