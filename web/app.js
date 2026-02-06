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

  // Tabs (delegation)
  const tabsEl = document.querySelector(".tabs");
  tabsEl?.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t || t.classList.contains("tab-add-btn") || t.classList.contains("tab-add-ok")) return;
    const tabValue = t.dataset.tab || "all";
    setActiveTab(tabValue);
  });

  // Search
  search?.addEventListener("input", () => {
    searchTerm = (search.value || "").toLowerCase();
    render();
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

  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmClose = document.getElementById("confirmClose");
  const confirmCancel = document.getElementById("confirmCancel");
  const confirmOk = document.getElementById("confirmOk");
  const confirmText = document.getElementById("confirmText");
  let confirmAction = null;

  const addBtn = document.getElementById("addBtn");
  const addBtn2 = document.getElementById("addBtn2");

  const catTabs = document.getElementById("catTabs");
  const catAddToggle = document.getElementById("catAddToggle");
  const catAddInline = document.getElementById("catAddInline");
  const catInlineInput = document.getElementById("catInlineInput");
  const catAddApply = document.getElementById("catAddApply");

  const appType = document.getElementById("appType");
  const appCategory = document.getElementById("appCategory");
  const launchLabel = document.getElementById("launchLabel");
  const launchHelp = document.getElementById("launchHelp");
  const launchField = document.getElementById("launchField");
  const scanField = document.getElementById("scanField");
  const scanSelect = document.getElementById("scanSelect");
  const scanLoading = document.getElementById("scanLoading");

  let editingId = null;

  let scanApps = [];

  async function loadScanApps(){
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
      const t = window.__TAURI__;
      if (!t?.core?.invoke){
        scanApps = [];
        renderScanApps();
        if (scanLoading) scanLoading.classList.add("hidden");
        return;
      }
      scanApps = await t.core.invoke("scan_desktop_apps");
      renderScanApps();
    }catch(e){
      console.error("scan_desktop_apps failed:", e);
      scanApps = [];
      renderScanApps();
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

  function applyTheme(theme){
    const t = theme === "light" ? "light" : "dark";
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
    cyan:   { rgb: "6,182,212", rgb2: "8,145,178" }
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

  function openConfirm(message, onOk){
    if (!confirmOverlay || !confirmText) return;
    confirmText.textContent = message || "Möchtest du diese App wirklich löschen?";
    confirmAction = onOk || null;
    confirmOverlay.classList.add("show");
    confirmOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => confirmOk?.focus(), 0);
  }

  function closeConfirm(){
    if (!confirmOverlay) return;
    confirmOverlay.classList.remove("show");
    confirmOverlay.setAttribute("aria-hidden", "true");
    confirmAction = null;
  }

  addBtn?.addEventListener("click", openModal);
  addBtn2?.addEventListener("click", openModal);
  settingsBtn?.addEventListener("click", openSettings);

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  settingsClose?.addEventListener("click", closeSettings);
  hotkeyCancel?.addEventListener("click", closeSettings);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  settingsOverlay?.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
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
    if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
  });

  async function applyHotkey(value){
    const shortcut = String(value || "").trim();
    localStorage.setItem("kc_hotkey", shortcut);
    try{
      const t = window.__TAURI__;
      if (t?.core?.invoke){
        await t.core.invoke("set_global_shortcut", { shortcut });
      }
    }catch(e){
      console.error("set_global_shortcut failed:", e);
      alert("Hotkey konnte nicht gesetzt werden: " + (e?.message || e));
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

  // Color Picker
  const colorRow = document.getElementById("colorRow");
  const palette = ["#7c3aed","#3b82f6","#10b981","#f59e0b","#ec4899","#06b6d4","#ef4444","#eab308"];
  let selectedColor = palette[0];

  function renderColors() {
    if (!colorRow) return;
    colorRow.innerHTML = "";
    palette.forEach((val) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "color" + (selectedColor === val ? " selected" : "");
      b.style.background = val;
      b.addEventListener("click", () => {
        selectedColor = val;
        renderColors();
      });
      colorRow.appendChild(b);
    });
  }
  renderColors();

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

    selectedColor = app.color || palette[0];
    renderColors();
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
      const u = new URL(url);
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
            <button class="cat-x" type="button" aria-label="Kategorie löschen">×</button>
          `;

          tab.querySelector(".cat-x")?.addEventListener("click", (e) => {
            e.stopPropagation();
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
            });
          });

          catTabs.appendChild(tab);
        });
    }
  }

  function addCategoryFromInput(){
    const val = normalizeCategory(catInlineInput?.value);
    if (!val) return;
    if (categories.some(c => c.toLowerCase() === val.toLowerCase())){
      catInlineInput.value = "";
      return;
    }
    categories.push(val);
    saveCategories(categories);
    categoryTabOrder.push(val);
    saveCategoryTabOrder(categoryTabOrder);
    renderCategories();
    setActiveTab(`cat:${val}`);
    catInlineInput.value = "";
    catAddInline?.classList.add("hidden");
  }

  catAddToggle?.addEventListener("click", () => {
    catAddInline?.classList.toggle("hidden");
    if (!catAddInline?.classList.contains("hidden")) {
      setTimeout(() => catInlineInput?.focus(), 0);
    }
  });
  catAddApply?.addEventListener("click", addCategoryFromInput);
  catInlineInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCategoryFromInput();
    if (e.key === "Escape") catAddInline?.classList.add("hidden");
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
    const badgeMisc = document.getElementById("badgeMisc");
    if (badgeAll) badgeAll.textContent = String(apps.length);
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
          const iconSrc =
            app.icon?.type === "custom" ? app.icon.value :
            app.icon?.type === "favicon" ? app.icon.value :
            "";
          card.innerHTML = `
            <div class="card-top">
              <div class="card-icon">
                ${iconSrc ? `<img src="${iconSrc}" alt="">` : ""}
              </div>
            </div>
            <div class="card-name">${escapeHtml(app.name)}</div>
          `;
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

      const iconSrc =
        app.icon?.type === "custom" ? app.icon.value :
        app.icon?.type === "favicon" ? app.icon.value :
        "";

      const typeBadge = app.type === "desktop" ? "Desktop" : "Web";

      card.innerHTML = `
        <div class="card-top">
          <div class="card-icon">
            ${iconSrc ? `<img src="${iconSrc}" alt="">` : ""}
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
          <span class="pill">
            <span class="dot" style="background:${app.color}"></span>
            ${escapeHtml(app.category)}
          </span>
          <span class="pill">${escapeHtml(typeBadge)}</span>
        </div>

        <div class="card-desc">${escapeHtml(app.description || "")}</div>
      `;

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
  catTabs?.addEventListener("pointerdown", (e) => {
    const tab = e.target.closest(".tab-cat");
    if (!tab) return;
    if (e.target.closest(".cat-x")) return;
    if (e.button !== 0) return;
    tabDrag = {
      tab,
      startX: e.clientX,
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
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tab-cat");
    if (!target || target === tabDrag.tab) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientX < rect.left + rect.width / 2;
    if (tabSlot){
      catTabs.insertBefore(tabSlot, before ? target : target.nextSibling);
    }
    if (tabGhost){
      tabGhost.style.left = (e.clientX - tabGhost.offsetWidth / 2) + "px";
      tabGhost.style.top = (e.clientY - tabGhost.offsetHeight / 2) + "px";
    }
  });

  catTabs?.addEventListener("pointerup", () => {
    if (!tabDrag) return;
    if (tabDrag.moved && tabSlot){
      catTabs.insertBefore(tabDrag.tab, tabSlot);
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
      offsetX: e.clientX - card.getBoundingClientRect().left,
      offsetY: e.clientY - card.getBoundingClientRect().top
    };
    dragId = card.dataset.id;
    card.classList.add("dragging");
    container.classList.add("dragging-active");
    createGhost(card, e.clientX, e.clientY);
    createDropSlot(card, container);
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
    pointerDrag.moved = true;
    const { container, draggingEl, axis, offsetX, offsetY } = pointerDrag;
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
          color: selectedColor,
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
        color: selectedColor,
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
    document.getElementById("appType").value = "web";
    iconState = { type:"favicon", value:"" };
    setIconNone();
    selectedColor = palette[0];
    renderColors();
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
