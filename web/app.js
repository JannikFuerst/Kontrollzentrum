console.log("app.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {
  // Tabs + State
  let activeTab = "all";
  let searchTerm = "";

  const grid = document.getElementById("appGrid");
  const empty = document.getElementById("emptyState");
  const search = document.getElementById("search");

  // Tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      activeTab = tab.dataset.tab || "all";
      render();
    });
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
  const closeBtn = document.getElementById("modalClose");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitBtn = document.getElementById("submitBtn");

  const addBtn = document.getElementById("addBtn");
  const addBtn2 = document.getElementById("addBtn2");

  const appType = document.getElementById("appType");
  const launchLabel = document.getElementById("launchLabel");
  const launchHelp = document.getElementById("launchHelp");

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
  }

  addBtn?.addEventListener("click", openModal);
  addBtn2?.addEventListener("click", openModal);

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
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

    // nur bei "web" oder wenn’s wie URL aussieht -> favicon versuchen
    const isWeb = (appType?.value || "web") === "web";
    if (!isWeb){
      // Desktop: favicon eher sinnlos, also einfach ausblenden (oder lassen wenn user will)
      return setIconNone();
    }

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
      launchLabel.innerHTML = `URL <span class="req">*</span>`;
      appUrl.placeholder = "https://...";
      launchHelp.textContent = "Beispiel: https://notion.so";
    } else {
      launchLabel.innerHTML = `Pfad / URI <span class="req">*</span>`;
      appUrl.placeholder = "z.B. steam://run/730 oder file:///C:/...";
      launchHelp.textContent =
        "Empfohlen: URI (steam://, discord://, spotify://, ms-settings:...). file:/// geht je nach Browser/Windows-Einstellung.";
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

  function openUrl(url){
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function matches(app){
    if (activeTab === "fav" && !app.fav) return false;
    if (activeTab === "misc" && app.category !== "Sonstiges") return false;

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

  function render(){
    const shown = apps.filter(matches);

    // badges
    const badgeAll = document.getElementById("badgeAll");
    const badgeMisc = document.getElementById("badgeMisc");
    if (badgeAll) badgeAll.textContent = String(apps.length);
    if (badgeMisc) badgeMisc.textContent = String(apps.filter(a => a.category === "Sonstiges").length);

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
      card.addEventListener("click", () => openUrl(app.launch));

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

      // Delete
      const del = card.querySelector(".del");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        const ok = confirm(`"${app.name}" wirklich löschen?`);
        if (!ok) return;
        apps = apps.filter(a => a.id !== app.id);
        saveApps(apps);
        render();
      });

      grid.appendChild(card);
    });
  }

  // Submit -> add app
  submitBtn?.addEventListener("click", () => {
    const name = document.getElementById("appName")?.value?.trim();
    const launch = document.getElementById("appUrl")?.value?.trim();
    const cat  = document.getElementById("appCategory")?.value || "Sonstiges";
    const desc = document.getElementById("appDesc")?.value?.trim() || "";
    const type = document.getElementById("appType")?.value || "web";

    if(!name || !launch){
      alert("Bitte Name und URL/Pfad ausfüllen.");
      return;
    }

    // Mini-Validierung
    if (type === "web"){
      const looksLikeWeb = /^https?:\/\//i.test(launch);
      if (!looksLikeWeb){
        alert("Web-Apps brauchen eine URL die mit http:// oder https:// startet.");
        return;
      }
    } else {
      // Desktop: erlauben: protocol:// oder ms-settings: oder file:///
      const ok =
        /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(launch); // irgendein scheme:
      if (!ok){
        alert("Desktop braucht eine URI wie steam://..., discord://..., ms-settings:... oder file:///C:/...");
        return;
      }
    }

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
    saveApps(apps);

    // reset
    document.getElementById("appName").value = "";
    document.getElementById("appUrl").value = "";
    document.getElementById("appDesc").value = "";
    document.getElementById("appCategory").value = "Sonstiges";
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
  setIconNone();
  syncTypeUI();
  render();
});
