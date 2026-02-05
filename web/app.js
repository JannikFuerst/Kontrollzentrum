console.log("app.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {

  // Tabs + State
  let activeTab = "all";
  let searchTerm = "";

  const grid = document.getElementById("appGrid");
  const empty = document.getElementById("emptyState");
  const search = document.getElementById("search");

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

  let editingId = null;

  let scanApps = [];

  async function loadScanApps(){
    try{
      const t = window.__TAURI__;
      if (!t?.core?.invoke){
        scanApps = [];
        renderScanApps();
        return;
      }
      scanApps = await t.core.invoke("scan_desktop_apps");
      renderScanApps();
    }catch(e){
      console.error("scan_desktop_apps failed:", e);
      scanApps = [];
      renderScanApps();
      alert("Scan fehlgeschlagen: " + (e?.message || e));
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
  }

  function openModal() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("appName")?.focus(), 50);
    syncTypeUI();
    refreshIconFromUrl();
  }

  function closeModal() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    editingId = null;
    if (modalTitle) modalTitle.textContent = "Neue App hinzufügen";
    if (submitBtn) submitBtn.textContent = "Hinzufügen";
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

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
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
    if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
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

  let categories = loadCategories();

  // Merge any existing app categories into list (initial boot)
  apps.forEach(a => {
    const c = normalizeCategory(a?.category);
    if (c && !categories.some(x => x.toLowerCase() === c.toLowerCase())){
      categories.push(c);
    }
  });
  saveCategories(categories);

  function normalizeWebUrl(url){
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) return "https://" + trimmed;
    return trimmed;
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
      categories
        .filter(c => c.toLowerCase() !== "sonstiges")
        .forEach(c => {
          const tab = document.createElement("div");
          tab.className = "tab tab-cat";
          tab.setAttribute("role", "tab");
          tab.dataset.tab = `cat:${c}`;
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

    if (apps.length === 0){
      grid.style.display = "none";
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";
    grid.style.display = "grid";

    grid.innerHTML = "";
    shown.forEach(app => {
      const card = document.createElement("div");
      card.className = "card";
      card.addEventListener("click", () => openLaunch(app));

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
                <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" stroke="white" stroke-opacity="0.9" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M14.5 5.5 18.5 9.5" stroke="white" stroke-opacity="0.9" stroke-width="1.6" stroke-linecap="round"/>
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
