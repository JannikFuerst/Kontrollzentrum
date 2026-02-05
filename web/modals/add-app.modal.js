export function initAddAppModal({ onSubmit } = {}) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const submitBtn = document.getElementById('submitBtn');

  const iconUpload = document.getElementById('iconUpload');
  const iconUploadBtn = document.getElementById('iconUploadBtn');
  const iconRemove = document.getElementById('iconRemove');

  const appUrl = document.getElementById('appUrl');
  const appName = document.getElementById('appName');
  const appCategory = document.getElementById('appCategory');
  const appDesc = document.getElementById('appDesc');

  const iconPreviewImg = document.getElementById('iconPreviewImg');

  // state
  let iconState = { type: "favicon", value: "" }; // or: {type:"custom", value:"dataurl"} or {type:"none"}

  function openModal(){
    modalOverlay.classList.add('show');
    modalOverlay.setAttribute('aria-hidden','false');
    setTimeout(() => appName.focus(), 50);
    refreshIconFromUrl(); // initial
  }

  function closeModal(){
    modalOverlay.classList.remove('show');
    modalOverlay.setAttribute('aria-hidden','true');
  }

  function setIconNone(){
    iconState = { type:"none", value:"" };
    iconPreviewImg.removeAttribute("src");
    iconPreviewImg.style.opacity = "0";
  }

  function setIconFavicon(url){
    const fav = faviconUrl(url);
    iconState = { type:"favicon", value: fav };
    iconPreviewImg.src = fav;
    iconPreviewImg.style.opacity = "1";
  }

  function setIconCustom(dataUrl){
    iconState = { type:"custom", value: dataUrl };
    iconPreviewImg.src = dataUrl;
    iconPreviewImg.style.opacity = "1";
  }

  function refreshIconFromUrl(){
    // Wenn user ein custom icon gesetzt hat, nicht überschreiben.
    if(iconState.type === "custom") return;

    const url = appUrl.value.trim();
    if(!url){
      // Wenn keine URL: Icon ausblenden (optional)
      setIconNone();
      // aber state für auto bleibt "favicon" erst wenn url da ist
      iconState = { type:"favicon", value:"" };
      return;
    }
    setIconFavicon(url);
  }

  // events
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modalOverlay.classList.contains('show')) closeModal();
  });

  iconUploadBtn.addEventListener('click', () => iconUpload.click());

  iconUpload.addEventListener('change', async (e) => {
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

  iconRemove.addEventListener('click', () => {
    // zurück auf favicon (wenn url da), sonst none
    iconState = { type:"favicon", value:"" };
    refreshIconFromUrl();
  });

  appUrl.addEventListener('input', () => {
    // kleine debounce nicht nötig, favicon ist nur URL-String
    refreshIconFromUrl();
  });

  submitBtn.addEventListener('click', () => {
    const name = appName.value.trim();
    const url  = appUrl.value.trim();
    if(!name || !url){
      alert("Bitte Name und URL ausfüllen.");
      return;
    }

    const payload = {
      name,
      url,
      category: appCategory.value,
      color: window.__selectedColor || "#7c3aed",
      description: appDesc.value.trim(),
      icon: iconState, // {type:"favicon"|"custom"|"none", value:"..."}
    };

    if(typeof onSubmit === "function") onSubmit(payload);

    closeModal();
  });

  // return API
  return { openModal, closeModal };
}

function faviconUrl(url){
  // simplest: google s2 favicon service
  // (works for most sites, incl. Notion etc.)
  // Later: we can switch to <domain>/favicon.ico fallback.
  try{
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;
  }catch{
    return "";
  }
}

function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
