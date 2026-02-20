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
  const voiceSettingsBtn = document.getElementById("voiceSettingsBtn");
  const languageBtn = document.getElementById("languageBtn");
  const languageMenu = document.getElementById("languageMenu");

  const LANG_KEY = "kc_lang";
  const i18n = {
    de: {
      language: "Sprache",
      settings_aria: "Einstellungen",
      settings_title_btn: "Einstellungen",
      voice_settings_aria: "Sprachsteuerung",
      voice_settings_title_btn: "Sprachsteuerung",
      voice_settings_title: "Sprachsteuerung",
      notes_toggle: "Notizen",
      clipboard_toggle: "Clipboard",
      notes_heading: "Notizen",
      notes_add_page_aria: "Seite hinzufügen",
      notes_placeholder: "Deine Notizen...",
      notes_delete_page: "Seite löschen",
      notes_clear_page: "Seite leeren",
      clipboard_heading: "Clipboard Verlauf",
      clipboard_mode_unlimited: "Unbegrenzt",
      clipboard_mode_time: "Zeit: {value}h",
      clipboard_mode_count: "Anzahl: {value}",
      clipboard_mode_manual: "Nur manuell",
      clipboard_copy: "Kopieren",
      clipboard_clear: "Leeren",
      clipboard_empty: "Noch keine Einträge.",
      app_title: "Kontrollzentrum",
      search_placeholder: "Apps durchsuchen (STRG+F)...",
      add_app: "App hinzufügen",
      add: "Hinzufügen",
      save: "Speichern",
      cancel: "Abbrechen",
      close: "Schließen",
      close_aria: "Schließen",
      tab_all: "Alle",
      tab_favorites: "Favoriten",
      tab_misc: "Sonstiges",
      manage_categories_aria: "Kategorien verwalten",
      pinned_heading: "Angepinnt",
      empty_title: "Noch keine Apps",
      empty_subtitle: "Füge deine erste App hinzu",
      scan_loading: "Scanne...",
      scan_none: "Keine Apps gefunden",
      unknown: "Unbekannt",
      modal_load_error: "Modal konnte nicht geladen werden. Check Console (F12).",
      scan_failed: "Scan fehlgeschlagen: {message}",
      notes_status_saved: "Gespeichert",
      notes_status_empty: "Leer",
      notes_status_saving: "Speichert...",
      notes_delete_title_locked: "Bearbeitung gesperrt",
      notes_delete_title_min: "Mindestens eine Seite muss bleiben",
      notes_delete_title_default: "Seite löschen",
      notes_lock_locked: "Bearbeitung gesperrt",
      notes_lock_unlocked: "Bearbeitung entsperrt",
      confirm_clear_page: "Diese Seite wirklich leeren?",
      confirm_clear_action: "Leeren",
      confirm_clear_title: "Leeren bestätigen",
      confirm_delete_page: "Diese Seite wirklich löschen?",
      confirm_delete_default_label: "Löschen",
      confirm_delete_default_title: "Löschen bestätigen",
      confirm_delete_default_message: "Möchtest du diese App wirklich löschen?",
      update_available_title: "Update verfügbar",
      update_available_message: "Neue Version verfügbar: v{latest} (aktuell: v{current}).",
      update_available_action: "UPDATE",
      update_available_dismiss: "Nein danke",
      clipboard_clear_confirm: "Clipboard-Verlauf wirklich leeren?",
      category_delete_btn: "Löschen",
      confirm_delete_category: "Kategorie \"{name}\" löschen? Apps werden nach \"Sonstiges\" verschoben.",
      alert_tauri_missing: "Tauri API nicht verfügbar (window.__TAURI__.core.invoke fehlt).",
      alert_open_failed: "Konnte nicht öffnen: {message}",
      card_type_desktop: "Desktop",
      card_type_web: "Web",
      aria_favorite: "Favorit",
      aria_edit: "Bearbeiten",
      title_edit: "Bearbeiten",
      aria_delete: "Löschen",
      title_delete: "Löschen",
      confirm_delete_app: "\"{name}\" wirklich löschen?",
      alert_scan_choose: "Bitte eine App aus dem Scan wählen.",
      alert_fill_required: "Bitte Name und URL/Pfad ausfüllen.",
      alert_web_invalid: "Web-Apps brauchen eine URL/Domain (z.B. discord.com/app oder https://discord.com/app).",
      alert_desktop_invalid: "Desktop braucht eine URI wie discord://, steam://..., ms-settings:... oder file:///C:/..."
      ,
      modal_add_title: "Neue App hinzufügen",
      modal_edit_title: "App bearbeiten",
      modal_icon_optional: "Icon (optional)",
      modal_icon_remove: "Icon entfernen",
      modal_icon_upload: "Icon hochladen",
      modal_icon_auto: "Standard: automatisch aus URL (Favicon)",
      modal_icon_custom_help: "Oder eigenes PNG/JPG hochladen.",
      modal_name_label: "Name *",
      modal_name_placeholder: "z.B. Notion / Discord",
      modal_type_label: "Typ",
      modal_type_web: "Web (https://...)",
      modal_type_desktop: "Desktop (URI / file://)",
      modal_type_scan: "Desktop (Scan Vorschläge)",
      modal_category_label: "Kategorie",
      modal_url_label: "URL *",
      modal_url_placeholder: "https://...",
      modal_url_example: "Beispiel: https://notion.so",
      modal_found_apps: "Gefundene Apps",
      modal_scan_refresh: "Scan aktualisieren",
      modal_scan_help: "Wähle eine App aus dem Windows-Scan.",
      modal_description_label: "Beschreibung",
      modal_description_placeholder: "Optional",
      cat_manage_title: "Kategorien verwalten",
      cat_new_label: "Neue Kategorie",
      cat_new_placeholder: "z.B. Lernen, Finanzen...",
      cat_manage_help: "Löschen verschiebt Apps automatisch nach \"Sonstiges\".",
      cat_existing_label: "Vorhandene Kategorien",
      settings_title: "Einstellungen",
      settings_hotkey_label: "Hotkey (App ein/ausblenden)",
      settings_hotkey_placeholder: "Drücke 'Aufnehmen'...",
      settings_capture: "Aufnehmen",
      settings_capture_listen: "Drücke Tasten...",
      settings_hotkey_help: "Klicke auf \"Aufnehmen\" und drücke die gewünschte Kombination.",
      settings_voice_activation: "Sprachaktivierung",
      settings_voice_wake_mode_label: "Ansprache",
      settings_voice_wake_mode_standard: "Standard (Kontrollzentrum / Control Center)",
      settings_voice_wake_mode_custom: "Custom",
      settings_voice_wake_label: "Ansprech-String",
      settings_voice_wake_placeholder: "z.B. Kontrollzentrum, Control Center",
      settings_voice_wake_help: "Ein oder mehrere Wake-Words, mit Komma getrennt.",
      settings_voice_enabled: "Aktivieren",
      settings_voice_status_on: "Aktiviert",
      settings_voice_status_off: "Deaktiviert",
      settings_voice_on: "An",
      settings_voice_off: "Aus",
      settings_voice_mic: "Mikrofon",
      settings_voice_mic_help: "Falls die Erkennung nicht reagiert, bitte dieses Mikrofon in Windows als Standard-Aufnahmegeraet setzen.",
      settings_voice_voice: "Stimme",
      settings_voice_voice_help: "Wähle eine der verfügbaren Systemstimmen aus.",
      settings_voice_none: "Keine Stimme (nur Sound)",
      settings_voice_male: "Mann",
      settings_voice_female: "Frau",
      settings_voice_default_voice: "Automatisch (Sprache)",
      settings_voice_no_voice: "Keine Stimmen gefunden",
      settings_voice_tone: "Aktivierungston",
      settings_voice_tone_help: "Wähle den Sound beim Aktivieren von Sprachbefehlen.",
      settings_voice_tone_soft_low: "Neon Pulse",
      settings_voice_tone_deep_click: "Glass Click",
      settings_voice_tone_duo_console: "Nova Sweep",
      settings_voice_tone_warm_ping: "Aurora Chime",
      settings_voice_tone_short_thud: "Short Thud",
      settings_voice_command_hint: "Sage z.B.: \"Kontrollzentrum starte CS2\" oder \"Control Center open Steam\".",
      settings_voice_no_mic: "Keine Mikrofone gefunden",
      settings_voice_default_mic: "Systemstandard",
      settings_clipboard_label: "Clipboard Verlauf",
      settings_clip_count: "Nach Anzahl löschen",
      settings_clip_time: "Nach Zeit löschen",
      settings_clip_unlimited: "Unbegrenzt (manuell)",
      settings_clip_time_window: "Zeitfenster",
      settings_hours_4: "4 Stunden",
      settings_hours_8: "8 Stunden",
      settings_hours_24: "24 Stunden",
      settings_hours_48: "48 Stunden",
      settings_clip_max: "Max. Einträge",
      settings_clip_help: "Der Verlauf bleibt lokal auf diesem Gerät und kann jederzeit mit \"Leeren\" gelöscht werden.",
      settings_theme: "Theme",
      settings_light_mode: "Light Mode",
      settings_accent: "Akzentfarbe",
      settings_background: "Hintergrund",
      settings_bg_standard: "Standard",
      settings_bg_mono: "Mono",
      settings_bg_duo: "Duo",
      settings_bg_custom: "Custom",
      settings_duo_colors: "Duo Farben",
      settings_duo_top: "Oben rechts",
      settings_duo_bottom: "Unten links",
      settings_no_image: "Kein Bild gewählt",
      settings_custom_image_active: "Custom Hintergrund aktiv",
      settings_upload_image: "Bild hochladen",
      settings_allowed_sizes: "Erlaubte Größe: 1920x1080, 2560x1440, 3840x2160, 5184x3456",
      settings_bg_error: "Bild hat falsches Format. Bitte 1920x1080, 2560x1440, 3840x2160 oder 5184x3456 verwenden.",
      modal_path_label: "Pfad / URI *",
      modal_path_placeholder: "z.B. discord:// oder steam://run/730 oder file:///C:/...",
      modal_path_help: "Empfohlen: URI (discord://, steam://, spotify://, ms-settings:...). file:/// geht je nach Windows-Einstellung.",
      modal_web_help: "Beispiel: https://notion.so oder discord.com/app",
      voice_opening: "{name} wird geoeffnet.",
      voice_not_understood: "Befehl nicht verstanden.",
      voice_app_not_found: "App nicht gefunden: {name}.",
      voice_listening: "Ich hoere zu."
    },
    en: {
      language: "Language",
      settings_aria: "Settings",
      settings_title_btn: "Settings",
      voice_settings_aria: "Voice control",
      voice_settings_title_btn: "Voice control",
      voice_settings_title: "Voice control",
      notes_toggle: "Notes",
      clipboard_toggle: "Clipboard",
      notes_heading: "Notes",
      notes_add_page_aria: "Add page",
      notes_placeholder: "Your notes...",
      notes_delete_page: "Delete page",
      notes_clear_page: "Clear page",
      clipboard_heading: "Clipboard History",
      clipboard_mode_unlimited: "Unlimited",
      clipboard_mode_time: "Time: {value}h",
      clipboard_mode_count: "Count: {value}",
      clipboard_mode_manual: "Manual only",
      clipboard_copy: "Copy",
      clipboard_clear: "Clear",
      clipboard_empty: "No entries yet.",
      app_title: "Control Center",
      search_placeholder: "Search apps (CTRL+F)...",
      add_app: "Add app",
      add: "Add",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      close_aria: "Close",
      tab_all: "All",
      tab_favorites: "Favorites",
      tab_misc: "Misc",
      manage_categories_aria: "Manage categories",
      pinned_heading: "Pinned",
      empty_title: "No apps yet",
      empty_subtitle: "Add your first app",
      scan_loading: "Scanning...",
      scan_none: "No apps found",
      unknown: "Unknown",
      modal_load_error: "Could not load modal. Check console (F12).",
      scan_failed: "Scan failed: {message}",
      notes_status_saved: "Saved",
      notes_status_empty: "Empty",
      notes_status_saving: "Saving...",
      notes_delete_title_locked: "Editing locked",
      notes_delete_title_min: "At least one page must remain",
      notes_delete_title_default: "Delete page",
      notes_lock_locked: "Editing locked",
      notes_lock_unlocked: "Editing unlocked",
      confirm_clear_page: "Clear this page?",
      confirm_clear_action: "Clear",
      confirm_clear_title: "Confirm clear",
      confirm_delete_page: "Delete this page?",
      confirm_delete_default_label: "Delete",
      confirm_delete_default_title: "Confirm delete",
      confirm_delete_default_message: "Do you want to delete this app?",
      update_available_title: "Update available",
      update_available_message: "A new version is available: v{latest} (current: v{current}).",
      update_available_action: "UPDATE",
      update_available_dismiss: "No thanks",
      clipboard_clear_confirm: "Clear clipboard history?",
      category_delete_btn: "Delete",
      confirm_delete_category: "Delete category \"{name}\"? Apps will be moved to \"Sonstiges\".",
      alert_tauri_missing: "Tauri API is unavailable (window.__TAURI__.core.invoke missing).",
      alert_open_failed: "Could not open: {message}",
      card_type_desktop: "Desktop",
      card_type_web: "Web",
      aria_favorite: "Favorite",
      aria_edit: "Edit",
      title_edit: "Edit",
      aria_delete: "Delete",
      title_delete: "Delete",
      confirm_delete_app: "Delete \"{name}\"?",
      alert_scan_choose: "Please select an app from scan.",
      alert_fill_required: "Please fill name and URL/path.",
      alert_web_invalid: "Web apps need a URL/domain (e.g. discord.com/app or https://discord.com/app).",
      alert_desktop_invalid: "Desktop apps need a URI like discord://, steam://..., ms-settings:... or file:///C:/...",
      modal_add_title: "Add new app",
      modal_edit_title: "Edit app",
      modal_icon_optional: "Icon (optional)",
      modal_icon_remove: "Remove icon",
      modal_icon_upload: "Upload icon",
      modal_icon_auto: "Default: automatic from URL (favicon)",
      modal_icon_custom_help: "Or upload your own PNG/JPG.",
      modal_name_label: "Name *",
      modal_name_placeholder: "e.g. Notion / Discord",
      modal_type_label: "Type",
      modal_type_web: "Web (https://...)",
      modal_type_desktop: "Desktop (URI / file://)",
      modal_type_scan: "Desktop (scan suggestions)",
      modal_category_label: "Category",
      modal_url_label: "URL *",
      modal_url_placeholder: "https://...",
      modal_url_example: "Example: https://notion.so",
      modal_found_apps: "Found apps",
      modal_scan_refresh: "Refresh scan",
      modal_scan_help: "Choose an app from the Windows scan.",
      modal_description_label: "Description",
      modal_description_placeholder: "Optional",
      cat_manage_title: "Manage categories",
      cat_new_label: "New category",
      cat_new_placeholder: "e.g. Learning, Finance...",
      cat_manage_help: "Deleting moves apps automatically to \"Sonstiges\".",
      cat_existing_label: "Existing categories",
      settings_title: "Settings",
      settings_hotkey_label: "Hotkey (toggle app)",
      settings_hotkey_placeholder: "Press 'Capture'...",
      settings_capture: "Capture",
      settings_capture_listen: "Press keys...",
      settings_hotkey_help: "Click \"Capture\" and press the desired combination.",
      settings_voice_activation: "Voice activation",
      settings_voice_wake_mode_label: "Addressing",
      settings_voice_wake_mode_standard: "Default (Kontrollzentrum / Control Center)",
      settings_voice_wake_mode_custom: "Custom",
      settings_voice_wake_label: "Wake phrase",
      settings_voice_wake_placeholder: "e.g. Kontrollzentrum, Control Center",
      settings_voice_wake_help: "One or more wake words, separated by commas.",
      settings_voice_enabled: "Enable",
      settings_voice_status_on: "Enabled",
      settings_voice_status_off: "Disabled",
      settings_voice_on: "On",
      settings_voice_off: "Off",
      settings_voice_mic: "Microphone",
      settings_voice_mic_help: "If recognition does not react, set this microphone as your default recording device in Windows.",
      settings_voice_voice: "Voice",
      settings_voice_voice_help: "Choose one of the available system voices.",
      settings_voice_none: "No voice (sound only)",
      settings_voice_male: "Man",
      settings_voice_female: "Woman",
      settings_voice_default_voice: "Automatic (language)",
      settings_voice_no_voice: "No voices found",
      settings_voice_tone: "Activation tone",
      settings_voice_tone_help: "Choose the cue sound when voice command mode starts.",
      settings_voice_tone_soft_low: "Neon Pulse",
      settings_voice_tone_deep_click: "Glass Click",
      settings_voice_tone_duo_console: "Nova Sweep",
      settings_voice_tone_warm_ping: "Aurora Chime",
      settings_voice_tone_short_thud: "Short Thud",
      settings_voice_command_hint: "Say e.g.: \"Kontrollzentrum starte CS2\" or \"Control Center open Steam\".",
      settings_voice_no_mic: "No microphones found",
      settings_voice_default_mic: "System default",
      settings_clipboard_label: "Clipboard history",
      settings_clip_count: "Delete by count",
      settings_clip_time: "Delete by time",
      settings_clip_unlimited: "Unlimited (manual)",
      settings_clip_time_window: "Time window",
      settings_hours_4: "4 hours",
      settings_hours_8: "8 hours",
      settings_hours_24: "24 hours",
      settings_hours_48: "48 hours",
      settings_clip_max: "Max entries",
      settings_clip_help: "History stays local on this device and can be cleared anytime.",
      settings_theme: "Theme",
      settings_light_mode: "Light mode",
      settings_accent: "Accent color",
      settings_background: "Background",
      settings_bg_standard: "Default",
      settings_bg_mono: "Mono",
      settings_bg_duo: "Duo",
      settings_bg_custom: "Custom",
      settings_duo_colors: "Duo colors",
      settings_duo_top: "Top right",
      settings_duo_bottom: "Bottom left",
      settings_no_image: "No image selected",
      settings_custom_image_active: "Custom background active",
      settings_upload_image: "Upload image",
      settings_allowed_sizes: "Allowed sizes: 1920x1080, 2560x1440, 3840x2160, 5184x3456",
      settings_bg_error: "Invalid image size. Use 1920x1080, 2560x1440, 3840x2160 or 5184x3456.",
      modal_path_label: "Path / URI *",
      modal_path_placeholder: "e.g. discord:// or steam://run/730 or file:///C:/...",
      modal_path_help: "Recommended: URI (discord://, steam://, spotify://, ms-settings:...). file:/// depends on Windows settings.",
      modal_web_help: "Example: https://notion.so or discord.com/app",
      voice_opening: "Opening {name}.",
      voice_not_understood: "I could not understand the command.",
      voice_app_not_found: "App not found: {name}.",
      voice_listening: "Listening."
    }
  };
  let currentLang = localStorage.getItem(LANG_KEY) || "de";
  if (!i18n[currentLang]) currentLang = "de";

  function t(key, vars){
    const dict = i18n[currentLang] || i18n.de;
    const fallback = i18n.de[key] || key;
    const raw = dict[key] || fallback;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  function applyI18nToDom(){
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (key) el.setAttribute("aria-label", t(key));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });
    if (languageBtn){
      languageBtn.setAttribute("aria-label", t("language"));
      languageBtn.setAttribute("title", t("language"));
    }
    if (languageMenu){
      languageMenu.querySelectorAll(".lang-item").forEach((item) => {
        const isActive = item.dataset.lang === currentLang;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-checked", isActive ? "true" : "false");
      });
    }
  }

  function closeLanguageMenu(){
    if (!languageMenu || !languageBtn) return;
    languageMenu.classList.remove("show");
    languageMenu.setAttribute("aria-hidden", "true");
    languageBtn.setAttribute("aria-expanded", "false");
  }

  function toggleLanguageMenu(){
    if (!languageMenu || !languageBtn) return;
    const willOpen = !languageMenu.classList.contains("show");
    languageMenu.classList.toggle("show", willOpen);
    languageMenu.setAttribute("aria-hidden", willOpen ? "false" : "true");
    languageBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  function setLanguage(lang){
    if (!i18n[lang] || lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, currentLang);
    applyI18nToDom();
    applyModalI18n();
    updateVoiceActivationStatusLabel();
    syncNotesDeleteState();
    syncNotesLockState();
    updateClipboardModeBadge();
    renderClipboardItems();
    renderCategories();
    renderCategoryManager();
    render();
  }

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

  languageBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLanguageMenu();
  });
  languageMenu?.addEventListener("click", (e) => {
    const item = e.target.closest(".lang-item");
    if (!item) return;
    setLanguage(item.dataset.lang || "de");
    closeLanguageMenu();
  });
  document.addEventListener("click", (e) => {
    if (!languageMenu || !languageBtn) return;
    const inMenu = languageMenu.contains(e.target);
    const inBtn = languageBtn.contains(e.target);
    if (!inMenu && !inBtn) closeLanguageMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLanguageMenu();
  });
  applyI18nToDom();

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
    applyI18nToDom();
  } catch (e) {
    console.error(e);
    alert(t("modal_load_error"));
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
  const voiceSettingsOverlay = document.getElementById("voiceSettingsOverlay");
  const voiceSettingsClose = document.getElementById("voiceSettingsClose");
  const voiceSettingsCancel = document.getElementById("voiceSettingsCancel");
  const voiceSettingsSave = document.getElementById("voiceSettingsSave");
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
  const voiceActivationToggle = document.getElementById("voiceActivationToggle");
  const voiceActivationState = document.getElementById("voiceActivationState");
  const voiceWakeModeSelect = document.getElementById("voiceWakeModeSelect");
  const voiceWakeCustomWrap = document.getElementById("voiceWakeCustomWrap");
  const voiceWakeInput = document.getElementById("voiceWakeInput");
  const voiceCommandHint = document.getElementById("voiceCommandHint");
  const voiceMicWrap = document.getElementById("voiceMicWrap");
  const voiceMicSelect = document.getElementById("voiceMicSelect");
  const voiceSelect = document.getElementById("voiceSelect");
  const voiceToneSelect = document.getElementById("voiceToneSelect");

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

  function setText(sel, key){
    const el = document.querySelector(sel);
    if (el) el.textContent = t(key);
  }
  function setHtml(sel, key){
    const el = document.querySelector(sel);
    if (el) el.innerHTML = t(key);
  }
  function setPh(sel, key){
    const el = document.querySelector(sel);
    if (el) el.setAttribute("placeholder", t(key));
  }
  function setAttr(sel, attr, key){
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, t(key));
  }
  function applyModalI18n(){
    setText("#settingsTitle", "settings_title");
    setText("#voiceSettingsTitle", "voice_settings_title");
    setText("#catManageTitle", "cat_manage_title");
    if (editingId){
      setText("#modalTitle", "modal_edit_title");
      setText("#submitBtn", "save");
    } else {
      setText("#modalTitle", "modal_add_title");
      setText("#submitBtn", "add");
    }
    setText("#cancelBtn", "cancel");
    setText("#hotkeyCancel", "cancel");
    setText("#hotkeySave", "save");
    setText("#voiceSettingsCancel", "cancel");
    setText("#voiceSettingsSave", "save");
    setText("#catManageAdd", "add");
    setText("#catManageCancel", "close");
    setText("#hotkeyCapture", "settings_capture");
    setText("#confirmCancel", "cancel");

    setAttr("#modalClose", "aria-label", "close_aria");
    setAttr("#settingsClose", "aria-label", "close_aria");
    setAttr("#voiceSettingsClose", "aria-label", "close_aria");
    setAttr("#catManageClose", "aria-label", "close_aria");
    setAttr("#confirmClose", "aria-label", "close_aria");
    setAttr("#scanRefresh", "title", "modal_scan_refresh");
    setAttr("#scanRefresh", "aria-label", "modal_scan_refresh");
    setAttr("#iconRemove", "title", "modal_icon_remove");
    setAttr("#iconRemove", "aria-label", "modal_icon_remove");
    setAttr("#iconUploadBtn", "title", "modal_icon_upload");
    setAttr("#iconUploadBtn", "aria-label", "modal_icon_upload");

    setText("#settingsOverlay [data-i18n='settings_hotkey_label']", "settings_hotkey_label");
    setText("#settingsOverlay [data-i18n='settings_hotkey_help']", "settings_hotkey_help");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_activation']", "settings_voice_activation");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_wake_mode_label']", "settings_voice_wake_mode_label");
    setText("#voiceWakeModeSelect option[value='standard']", "settings_voice_wake_mode_standard");
    setText("#voiceWakeModeSelect option[value='custom']", "settings_voice_wake_mode_custom");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_wake_label']", "settings_voice_wake_label");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_wake_help']", "settings_voice_wake_help");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_mic']", "settings_voice_mic");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_mic_help']", "settings_voice_mic_help");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_voice']", "settings_voice_voice");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_voice_help']", "settings_voice_voice_help");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_tone']", "settings_voice_tone");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_tone_help']", "settings_voice_tone_help");
    setText("#voiceSelect option[value='__none__']", "settings_voice_none");
    setText("#voiceSelect option[value='__male__']", "settings_voice_male");
    setText("#voiceSelect option[value='__female__']", "settings_voice_female");
    setText("#voiceToneSelect option[value='soft_low']", "settings_voice_tone_soft_low");
    setText("#voiceToneSelect option[value='deep_click']", "settings_voice_tone_deep_click");
    setText("#voiceToneSelect option[value='duo_console']", "settings_voice_tone_duo_console");
    setText("#voiceToneSelect option[value='warm_ping']", "settings_voice_tone_warm_ping");
    setText("#voiceToneSelect option[value='short_thud']", "settings_voice_tone_short_thud");
    setText("#voiceSettingsOverlay [data-i18n='settings_voice_command_hint']", "settings_voice_command_hint");
    setPh("#voiceWakeInput", "settings_voice_wake_placeholder");
    setText("#settingsOverlay [data-i18n='settings_clipboard_label']", "settings_clipboard_label");
    setText("#settingsOverlay [data-i18n='settings_clip_time_window']", "settings_clip_time_window");
    setText("#settingsOverlay [data-i18n='settings_clip_max']", "settings_clip_max");
    setText("#settingsOverlay [data-i18n='settings_clip_help']", "settings_clip_help");
    setText("#settingsOverlay [data-i18n='settings_theme']", "settings_theme");
    setText("#settingsOverlay [data-i18n='settings_light_mode']", "settings_light_mode");
    setText("#settingsOverlay [data-i18n='settings_accent']", "settings_accent");
    setText("#settingsOverlay [data-i18n='settings_background']", "settings_background");
    setText("#settingsOverlay [data-i18n='settings_bg_standard']", "settings_bg_standard");
    setText("#settingsOverlay [data-i18n='settings_bg_mono']", "settings_bg_mono");
    setText("#settingsOverlay [data-i18n='settings_bg_duo']", "settings_bg_duo");
    setText("#settingsOverlay [data-i18n='settings_bg_custom']", "settings_bg_custom");
    setText("#settingsOverlay [data-i18n='settings_duo_colors']", "settings_duo_colors");
    setText("#settingsOverlay [data-i18n='settings_duo_top']", "settings_duo_top");
    setText("#settingsOverlay [data-i18n='settings_duo_bottom']", "settings_duo_bottom");
    setText("#settingsOverlay [data-i18n='settings_allowed_sizes']", "settings_allowed_sizes");
    setText("#settingsOverlay [data-i18n='settings_bg_error']", "settings_bg_error");
    setPh("#hotkeyInput", "settings_hotkey_placeholder");
    setPh("#bgUploadName", "settings_no_image");
    setText("#bgUploadBtn", "settings_upload_image");

    setText("#clipboardRetentionMode option[value='count']", "settings_clip_count");
    setText("#clipboardRetentionMode option[value='time']", "settings_clip_time");
    setText("#clipboardTimeCycle option[value='4']", "settings_hours_4");
    setText("#clipboardTimeCycle option[value='8']", "settings_hours_8");
    setText("#clipboardTimeCycle option[value='24']", "settings_hours_24");
    setText("#clipboardTimeCycle option[value='48']", "settings_hours_48");
    updateVoiceActivationStatusLabel();
    const defaultMicOpt = document.querySelector("#voiceMicSelect option[value='']");
    if (defaultMicOpt) defaultMicOpt.textContent = t("settings_voice_default_mic");
    const defaultVoiceOpt = document.querySelector("#voiceSelect option[value='']");
    if (defaultVoiceOpt) defaultVoiceOpt.textContent = t("settings_voice_default_voice");

    setText("#modalOverlay [data-i18n='modal_icon_optional']", "modal_icon_optional");
    setText("#modalOverlay [data-i18n='modal_icon_auto']", "modal_icon_auto");
    setText("#modalOverlay [data-i18n='modal_icon_custom_help']", "modal_icon_custom_help");
    setHtml("#modalOverlay [data-i18n='modal_name_label']", "modal_name_label");
    setPh("#appName", "modal_name_placeholder");
    setText("#modalOverlay [data-i18n='modal_type_label']", "modal_type_label");
    setText("#appType option[value='web']", "modal_type_web");
    setText("#appType option[value='desktop']", "modal_type_desktop");
    setText("#appType option[value='scan']", "modal_type_scan");
    setText("#modalOverlay [data-i18n='modal_category_label']", "modal_category_label");
    setHtml("#launchLabel", "modal_url_label");
    setPh("#appUrl", "modal_url_placeholder");
    setText("#launchHelp", "modal_url_example");
    setText("#modalOverlay [data-i18n='modal_found_apps']", "modal_found_apps");
    setText("#modalOverlay [data-i18n='modal_scan_help']", "modal_scan_help");
    setText("#modalOverlay [data-i18n='modal_description_label']", "modal_description_label");
    setPh("#appDesc", "modal_description_placeholder");

    setText("#catManageOverlay [data-i18n='cat_new_label']", "cat_new_label");
    setPh("#catManageInput", "cat_new_placeholder");
    setText("#catManageOverlay [data-i18n='cat_manage_help']", "cat_manage_help");
    setText("#catManageOverlay [data-i18n='cat_existing_label']", "cat_existing_label");
  }

  let editingId = null;

  let scanApps = [];
  const SCAN_CACHE_KEY = "kc_scan_cache_v9";
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

  function applyScanCacheToUi(){
    const cache = loadScanCache();
    scanApps = cache?.apps || [];
    renderScanApps();
  }

  async function loadScanApps(force = false){
    try{
      if (scanSelect){
        scanSelect.disabled = true;
        scanSelect.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = t("scan_loading");
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

      const tauriApi = window.__TAURI__;
      if (!tauriApi?.core?.invoke){
        scanApps = [];
        renderScanApps();
        if (scanLoading) scanLoading.classList.add("hidden");
        return;
      }
      scanApps = await tauriApi.core.invoke("scan_desktop_apps");
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
      alert(t("scan_failed", { message: e?.message || e }));
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
      opt.textContent = t("scan_none");
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
      opt.textContent = app.name || app.title || t("unknown");
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

  const UPDATE_ENDPOINT = "https://github.com/JannikFuerst/Kontrollzentrum/releases/latest/download/latest.json";
  const UPDATE_RELEASES_URL = "https://github.com/JannikFuerst/Kontrollzentrum/releases";

  function compareSemver(a, b){
    const parse = (v) =>
      String(v || "")
        .trim()
        .replace(/^v/i, "")
        .split(/[.-]/)
        .slice(0, 3)
        .map((x) => {
          const n = parseInt(x, 10);
          return Number.isFinite(n) ? n : 0;
        });
    const aa = parse(a);
    const bb = parse(b);
    for (let i = 0; i < 3; i++){
      const av = aa[i] || 0;
      const bv = bb[i] || 0;
      if (av > bv) return 1;
      if (av < bv) return -1;
    }
    return 0;
  }

  async function openUpdateReleasePage(){
    const tauriApi = window.__TAURI__;
    try{
      if (tauriApi?.core?.invoke){
        await tauriApi.core.invoke("open_external", { url: UPDATE_RELEASES_URL });
        return;
      }
    }catch{
      // ignore and use browser fallback
    }
    window.open(UPDATE_RELEASES_URL, "_blank", "noopener,noreferrer");
  }

  async function checkForUpdateOnStartup(){
    try{
      const tauriApi = window.__TAURI__;
      if (!tauriApi?.app?.getVersion) return;
      const currentVersion = await tauriApi.app.getVersion();
      if (!currentVersion) return;

      const resp = await fetch(`${UPDATE_ENDPOINT}?_=${Date.now()}`, { cache: "no-store" });
      if (!resp.ok) return;
      const data = await resp.json();
      const latestVersion = String(data?.version || "").trim();
      if (!latestVersion) return;
      if (compareSemver(latestVersion, currentVersion) <= 0) return;

      openConfirm(
        t("update_available_message", { latest: latestVersion, current: currentVersion }),
        () => { openUpdateReleasePage(); },
        t("update_available_action"),
        t("update_available_title"),
        t("update_available_dismiss")
      );
    }catch{
      // silent fail if update check is unavailable
    }
  }

  // Version tag (Tauri)
  try{
    const tauriApi = window.__TAURI__;
    if (tauriApi?.app?.getVersion){
      const v = await tauriApi.app.getVersion();
      if (versionTag && v) versionTag.textContent = "v" + v;
    }
  }catch{
    // keep default text
  }
  setTimeout(() => { checkForUpdateOnStartup(); }, 900);

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
      notesDelete.title = t("notes_delete_title_locked");
    } else if (notesPageCount <= 1){
      notesDelete.title = t("notes_delete_title_min");
    } else {
      notesDelete.title = t("notes_delete_title_default");
    }
  }

  function syncNotesLockState(){
    if (!notesLock) return;
    notesLock.dataset.locked = notesLocked ? "true" : "false";
    notesLock.setAttribute("aria-pressed", notesLocked ? "true" : "false");
    notesLock.setAttribute("aria-label", notesLocked ? t("notes_lock_locked") : t("notes_lock_unlocked"));
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
      add.setAttribute("aria-label", t("notes_add_page_aria"));
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
    setNotesStatus(saved ? t("notes_status_saved") : t("notes_status_empty"));
  }

  function saveNotes(value){
    localStorage.setItem(notesKeyForPage(activeNotesPage), value || "");
    setNotesStatus(value ? t("notes_status_saved") : t("notes_status_empty"));
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
    setNotesStatus(t("notes_status_saving"));
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
      openConfirm(t("confirm_clear_page"), doClear, t("confirm_clear_action"), t("confirm_clear_title"));
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
      openConfirm(t("confirm_delete_page"), doDelete);
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
  const CLIPBOARD_ALLOWED_COUNTS = [5, 10, 25, 50];
  let clipboardItems = [];
  let clipboardPollTimer = null;
  let clipboardPruneTimer = null;
  let clipboardPolling = false;
  let lastClipboardSig = "";
  let suppressClipboardSig = "";
  let suppressClipboardUntil = 0;

  function normalizeClipboardCount(value){
    const n = parseInt(String(value || ""), 10);
    if (!Number.isFinite(n)) return 25;
    if (CLIPBOARD_ALLOWED_COUNTS.includes(n)) return n;
    let best = CLIPBOARD_ALLOWED_COUNTS[0];
    let bestDist = Math.abs(best - n);
    CLIPBOARD_ALLOWED_COUNTS.forEach((candidate) => {
      const dist = Math.abs(candidate - n);
      if (dist < bestDist){
        best = candidate;
        bestDist = dist;
      }
    });
    return best;
  }

  function loadClipboardItems(){
    try{
      const raw = JSON.parse(localStorage.getItem(CLIPBOARD_ITEMS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .map((item) => ({
          id: String(item?.id || ""),
          kind: item?.kind === "image" ? "image" : "text",
          text: String(item?.text || ""),
          dataUrl: String(item?.dataUrl || item?.data_url || ""),
          sig: String(item?.sig || ""),
          ts: Number(item?.ts || 0)
        }))
        .filter((item) => {
          if (!item.id || !Number.isFinite(item.ts)) return false;
          if (item.kind === "image") return Boolean(item.dataUrl);
          return Boolean(item.text);
        });
    }catch{
      return [];
    }
  }

  function saveClipboardItems(){
    localStorage.setItem(CLIPBOARD_ITEMS_KEY, JSON.stringify(clipboardItems));
  }

  function getClipboardRetentionSettings(){
    const modeRaw = (localStorage.getItem(CLIPBOARD_RETENTION_MODE_KEY) || "count").toLowerCase();
    const mode = ["count", "time"].includes(modeRaw) ? modeRaw : "count";
    const hours = Math.max(1, parseInt(localStorage.getItem(CLIPBOARD_RETENTION_TIME_KEY) || "24", 10) || 24);
    const maxItems = normalizeClipboardCount(localStorage.getItem(CLIPBOARD_RETENTION_COUNT_KEY) || "25");
    return { mode, hours, maxItems };
  }

  function saveClipboardRetentionSettings({ mode, hours, maxItems }){
    const safeMode = ["count", "time"].includes(mode) ? mode : "count";
    const safeHours = Math.max(1, parseInt(hours, 10) || 24);
    const safeMaxItems = normalizeClipboardCount(maxItems);
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
      clipboardModeBadge.textContent = t("clipboard_mode_time", { value: cfg.hours });
      return;
    }
    clipboardModeBadge.textContent = t("clipboard_mode_count", { value: cfg.maxItems });
  }

  function formatClipboardTime(ts){
    const d = new Date(ts);
    const locale = currentLang === "en" ? "en-US" : "de-DE";
    return d.toLocaleString(locale, {
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
      if (item.kind === "image"){
        row.innerHTML = `
          <div class="clip-image-wrap">
            <img class="clip-image" src="${escapeHtml(item.dataUrl || "")}" alt="Clipboard image" loading="lazy" />
          </div>
          <div class="clip-actions">
            <button class="clip-btn" type="button" data-action="copy">${escapeHtml(t("clipboard_copy"))}</button>
            <button class="clip-btn danger" type="button" data-action="delete">${escapeHtml(t("category_delete_btn"))}</button>
            <span class="clip-time">${escapeHtml(formatClipboardTime(item.ts))}</span>
          </div>
        `;
      } else {
        row.innerHTML = `
          <div class="clip-text">${escapeHtml(item.text)}</div>
          <div class="clip-actions">
            <button class="clip-btn" type="button" data-action="copy">${escapeHtml(t("clipboard_copy"))}</button>
            <button class="clip-btn danger" type="button" data-action="delete">${escapeHtml(t("category_delete_btn"))}</button>
            <span class="clip-time">${escapeHtml(formatClipboardTime(item.ts))}</span>
          </div>
        `;
      }

      const copyBtn = row.querySelector("[data-action='copy']");
      copyBtn?.addEventListener("click", async () => {
        if (copyBtn.disabled) return;
        try{
          const tauriApi = window.__TAURI__;
          if (item.kind === "image"){
            if (!tauriApi?.core?.invoke || !item.dataUrl) return;
            await tauriApi.core.invoke("set_clipboard_image", { dataUrl: item.dataUrl });
          } else if (tauriApi?.core?.invoke){
            const text = item.text || "";
            await tauriApi.core.invoke("set_clipboard_text", { text });
          } else if (navigator.clipboard?.writeText && item.kind === "text"){
            const text = item.text || "";
            await navigator.clipboard.writeText(text);
          }
          suppressClipboardSig = item.sig || "";
          suppressClipboardUntil = Date.now() + 3000;
          copyBtn.disabled = true;
          setTimeout(() => {
            copyBtn.disabled = false;
          }, 900);
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

  function addClipboardEntry(entry){
    if (!entry) return;
    const now = Date.now();
    const existingIdx = clipboardItems.findIndex((item) => item.sig && item.sig === entry.sig);
    if (existingIdx === 0){
      clipboardItems[0].ts = now;
      persistAndRenderClipboard();
      return;
    }
    if (existingIdx > 0){
      clipboardItems.splice(existingIdx, 1);
    }
    clipboardItems.unshift({
      id: (crypto?.randomUUID ? crypto.randomUUID() : String(now) + Math.random().toString(16).slice(2)),
      kind: entry.kind,
      text: entry.text || "",
      dataUrl: entry.dataUrl || "",
      sig: entry.sig || "",
      ts: now
    });
    persistAndRenderClipboard();
  }

  function addClipboardTextEntry(text, sig = ""){
    const normalized = String(text || "").replace(/\r\n/g, "\n");
    if (!normalized.trim()) return;
    addClipboardEntry({
      kind: "text",
      text: normalized,
      sig: sig || `txt:${normalized}`
    });
  }

  function addClipboardImageEntry(dataUrl, sig = ""){
    const url = String(dataUrl || "").trim();
    if (!url) return;
    addClipboardEntry({
      kind: "image",
      dataUrl: url,
      sig: sig || `img:${url.slice(0, 120)}:${url.length}`
    });
  }

  async function readClipboardPayload(){
    const tauriApi = window.__TAURI__;
    if (tauriApi?.core?.invoke){
      try{
        const value = await tauriApi.core.invoke("get_clipboard_payload");
        if (!value || typeof value !== "object") return null;
        const kind = String(value.kind || "");
        const sig = String(value.sig || "");
        if (kind === "image"){
          return {
            kind: "image",
            dataUrl: String(value.data_url || value.dataUrl || ""),
            sig
          };
        }
        if (kind === "text"){
          return {
            kind: "text",
            text: String(value.text || ""),
            sig
          };
        }
        return null;
      }catch(e){
        console.error("get_clipboard_payload failed:", e);
        return null;
      }
    }
    return null;
  }

  async function pollClipboardNow(){
    if (clipboardPolling) return;
    clipboardPolling = true;
    try{
      const payload = await readClipboardPayload();
      if (!payload) return;
      const sig = String(payload.sig || "");
      if (!sig) return;
      const now = Date.now();
      if (sig === suppressClipboardSig && now < suppressClipboardUntil) return;
      if (sig === suppressClipboardSig && now >= suppressClipboardUntil){
        suppressClipboardSig = "";
        suppressClipboardUntil = 0;
      }
      if (sig === lastClipboardSig) return;
      lastClipboardSig = sig;
      if (payload.kind === "image"){
        addClipboardImageEntry(payload.dataUrl, sig);
      } else {
        addClipboardTextEntry(payload.text, sig);
      }
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
      openConfirm(t("clipboard_clear_confirm"), doClearAll, t("confirm_clear_action"), t("confirm_clear_title"));
    } else {
      doClearAll();
    }
  });

  clipboardRetentionMode?.addEventListener("change", () => {
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode.value,
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "25"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  });

  clipboardTimeCycle?.addEventListener("change", () => {
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "time",
      hours: clipboardTimeCycle.value,
      maxItems: clipboardMaxItems?.value || "25"
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
      bgUploadName.value = has ? t("settings_custom_image_active") : t("settings_no_image");
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
      const tauriApi = window.__TAURI__;
      if (tauriApi?.core?.invoke){
        await tauriApi.core.invoke("set_global_shortcut", { shortcut: savedHotkey });
      }
    }
  }catch{
    // ignore
  }

  const VOICE_ENABLED_KEY = "kc_voice_enabled";
  const VOICE_MIC_KEY = "kc_voice_mic";
  const VOICE_NAME_KEY = "kc_voice_name";
  const VOICE_TONE_KEY = "kc_voice_tone";
  const VOICE_WAKE_KEY = "kc_voice_wake";
  const VOICE_WAKE_MODE_KEY = "kc_voice_wake_mode";
  const VOICE_TONES = new Set(["soft_low", "deep_click", "duo_console", "warm_ping", "short_thud"]);
  const DEFAULT_WAKE_INPUT = "Kontrollzentrum, Control Center";

  function normalizeWakeMode(value){
    return String(value || "").toLowerCase() === "custom" ? "custom" : "standard";
  }

  function loadVoiceSettings(){
    const rawEnabled = (localStorage.getItem(VOICE_ENABLED_KEY) || "1").toLowerCase();
    const enabled = rawEnabled !== "0" && rawEnabled !== "false" && rawEnabled !== "off";
    const micId = localStorage.getItem(VOICE_MIC_KEY) || "";
    const voiceName = sanitizeVoiceChoice(localStorage.getItem(VOICE_NAME_KEY) || "");
    const toneRaw = localStorage.getItem(VOICE_TONE_KEY) || "soft_low";
    const toneId = VOICE_TONES.has(toneRaw) ? toneRaw : "soft_low";
    const wakePhrase = localStorage.getItem(VOICE_WAKE_KEY) || DEFAULT_WAKE_INPUT;
    const rawWakeMode = localStorage.getItem(VOICE_WAKE_MODE_KEY) || "";
    const inferredMode = wakePhrase && wakePhrase.trim() !== DEFAULT_WAKE_INPUT ? "custom" : "standard";
    const wakeMode = rawWakeMode ? normalizeWakeMode(rawWakeMode) : inferredMode;
    return { enabled, micId, voiceName, toneId, wakePhrase, wakeMode };
  }

  function saveVoiceSettings({ enabled, micId, voiceName, toneId, wakePhrase, wakeMode }){
    const mode = normalizeWakeMode(wakeMode);
    localStorage.setItem(VOICE_ENABLED_KEY, enabled ? "1" : "0");
    localStorage.setItem(VOICE_MIC_KEY, micId || "");
    localStorage.setItem(VOICE_NAME_KEY, sanitizeVoiceChoice(voiceName || ""));
    localStorage.setItem(VOICE_TONE_KEY, VOICE_TONES.has(toneId) ? toneId : "soft_low");
    localStorage.setItem(VOICE_WAKE_MODE_KEY, mode);
    localStorage.setItem(VOICE_WAKE_KEY, mode === "custom" ? String(wakePhrase || "").trim() : DEFAULT_WAKE_INPUT);
  }

  function getVoiceSettingsFromUI(){
    const enabled = Boolean(voiceActivationToggle?.checked);
    const micId = String(voiceMicSelect?.value || "");
    const voiceName = sanitizeVoiceChoice(String(voiceSelect?.value || ""));
    const toneRaw = String(voiceToneSelect?.value || "soft_low");
    const toneId = VOICE_TONES.has(toneRaw) ? toneRaw : "soft_low";
    const wakeMode = normalizeWakeMode(voiceWakeModeSelect?.value || "standard");
    const wakePhrase = String(voiceWakeInput?.value || "").trim();
    return { enabled, micId, voiceName, toneId, wakePhrase, wakeMode };
  }

  function updateWakeModeUI(mode){
    const wakeMode = normalizeWakeMode(mode || "standard");
    if (voiceWakeModeSelect) voiceWakeModeSelect.value = wakeMode;
    if (voiceWakeCustomWrap) voiceWakeCustomWrap.classList.toggle("hidden", wakeMode !== "custom");
  }

  function updateVoiceActivationStatusLabel(){
    if (!voiceActivationState) return;
    const enabled = Boolean(voiceActivationToggle?.checked);
    voiceActivationState.textContent = enabled ? t("settings_voice_status_on") : t("settings_voice_status_off");
  }

  function applyVoiceSettingsToUI(settings){
    if (voiceActivationToggle) voiceActivationToggle.checked = Boolean(settings?.enabled);
    if (voiceCommandHint) voiceCommandHint.classList.toggle("hidden", !Boolean(settings?.enabled));
    if (voiceMicWrap) voiceMicWrap.classList.toggle("hidden", !Boolean(settings?.enabled));
    if (voiceToneSelect){
      const toneId = VOICE_TONES.has(settings?.toneId) ? settings.toneId : "soft_low";
      voiceToneSelect.value = toneId;
    }
    updateWakeModeUI(settings?.wakeMode || "standard");
    if (voiceWakeInput){
      voiceWakeInput.value = String(settings?.wakePhrase || DEFAULT_WAKE_INPUT);
    }
    updateVoiceActivationStatusLabel();
  }

  function refreshVoiceList(preferredVoiceName = ""){
    if (!voiceSelect) return;
    voiceSelect.innerHTML = "";
    const autoOpt = document.createElement("option");
    autoOpt.value = "";
    autoOpt.textContent = t("settings_voice_default_voice");
    voiceSelect.appendChild(autoOpt);

    const noneOpt = document.createElement("option");
    noneOpt.value = "__none__";
    noneOpt.textContent = t("settings_voice_none");
    voiceSelect.appendChild(noneOpt);

    const maleOpt = document.createElement("option");
    maleOpt.value = "__male__";
    maleOpt.textContent = t("settings_voice_male");
    voiceSelect.appendChild(maleOpt);

    const femaleOpt = document.createElement("option");
    femaleOpt.value = "__female__";
    femaleOpt.textContent = t("settings_voice_female");
    voiceSelect.appendChild(femaleOpt);

    const known = new Set(Array.from(voiceSelect.options).map((opt) => opt.value));
    voiceSelect.value = known.has(preferredVoiceName) ? preferredVoiceName : "";
  }

  async function requestMicPermissionForLabels(){
    if (!navigator.mediaDevices?.getUserMedia) return;
    let stream = null;
    try{
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }catch{
      // ignore permission errors
    } finally {
      stream?.getTracks?.().forEach((t) => t.stop());
    }
  }

  async function refreshVoiceMicList(preferredMicId = "", askPermission = false){
    if (!voiceMicSelect || !navigator.mediaDevices?.enumerateDevices) return;
    if (askPermission) await requestMicPermissionForLabels();

    let inputs = [];
    try{
      const devices = await navigator.mediaDevices.enumerateDevices();
      inputs = devices.filter((d) => d.kind === "audioinput");
    }catch{
      inputs = [];
    }

    voiceMicSelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = t("settings_voice_default_mic");
    voiceMicSelect.appendChild(defaultOpt);

    if (!inputs.length){
      const noneOpt = document.createElement("option");
      noneOpt.value = "__none__";
      noneOpt.textContent = t("settings_voice_no_mic");
      noneOpt.disabled = true;
      voiceMicSelect.appendChild(noneOpt);
      voiceMicSelect.value = "";
      return;
    }

    inputs.forEach((device, idx) => {
      const opt = document.createElement("option");
      opt.value = device.deviceId || "";
      const label = (device.label || "").trim();
      opt.textContent = label || `Mic ${idx + 1}`;
      voiceMicSelect.appendChild(opt);
    });

    const known = new Set(Array.from(voiceMicSelect.options).map((opt) => opt.value));
    voiceMicSelect.value = known.has(preferredMicId) ? preferredMicId : "";
  }

  function closeModal() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    editingId = null;
    if (modalTitle) modalTitle.textContent = t("modal_add_title");
    if (submitBtn) submitBtn.textContent = t("add");
  }

  async function openSettings(){
    if (!settingsOverlay) return;
    applyModalI18n();
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

  async function openVoiceSettings(){
    if (!voiceSettingsOverlay) return;
    closeSettings();
    applyModalI18n();
    const voiceSettings = loadVoiceSettings();
    applyVoiceSettingsToUI(voiceSettings);
    await refreshVoiceMicList(voiceSettings.micId, voiceSettings.enabled);
    refreshVoiceList(voiceSettings.voiceName);
    voiceSettingsOverlay.classList.add("show");
    voiceSettingsOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => voiceActivationToggle?.focus(), 0);
  }

  function closeSettings(){
    if (!settingsOverlay) return;
    settingsOverlay.classList.remove("show");
    settingsOverlay.setAttribute("aria-hidden", "true");
    stopHotkeyCapture();
  }

  function closeVoiceSettings(){
    if (!voiceSettingsOverlay) return;
    voiceSettingsOverlay.classList.remove("show");
    voiceSettingsOverlay.setAttribute("aria-hidden", "true");
  }

  function openCatManage(){
    if (!catManageOverlay) return;
    applyModalI18n();
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

  function openConfirm(
    message,
    onOk,
    okLabel = t("confirm_delete_default_label"),
    title = t("confirm_delete_default_title"),
    cancelLabel = t("cancel")
  ){
    if (!confirmOverlay || !confirmText) return;
    confirmText.textContent = message || t("confirm_delete_default_message");
    if (confirmOk) confirmOk.textContent = okLabel || t("confirm_delete_default_label");
    if (confirmCancel) confirmCancel.textContent = cancelLabel || t("cancel");
    if (confirmTitle) confirmTitle.textContent = title || t("confirm_delete_default_title");
    confirmAction = onOk || null;
    confirmOverlay.classList.add("show");
    confirmOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => confirmOk?.focus(), 0);
  }

  function closeConfirm(){
    if (!confirmOverlay) return;
    confirmOverlay.classList.remove("show");
    confirmOverlay.setAttribute("aria-hidden", "true");
    if (confirmOk) confirmOk.textContent = t("confirm_delete_default_label");
    if (confirmCancel) confirmCancel.textContent = t("cancel");
    if (confirmTitle) confirmTitle.textContent = t("confirm_delete_default_title");
    confirmAction = null;
  }

  addBtn?.addEventListener("click", openModal);
  addBtn2?.addEventListener("click", openModal);
  settingsBtn?.addEventListener("click", openSettings);
  voiceSettingsBtn?.addEventListener("click", openVoiceSettings);
  catAddToggle?.addEventListener("click", openCatManage);

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  settingsClose?.addEventListener("click", closeSettings);
  hotkeyCancel?.addEventListener("click", closeSettings);
  voiceSettingsClose?.addEventListener("click", closeVoiceSettings);
  voiceSettingsCancel?.addEventListener("click", closeVoiceSettings);
  catManageClose?.addEventListener("click", closeCatManage);
  catManageCancel?.addEventListener("click", closeCatManage);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  settingsOverlay?.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });
  voiceSettingsOverlay?.addEventListener("click", (e) => {
    if (e.target === voiceSettingsOverlay) closeVoiceSettings();
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
    if (e.key === "Escape" && voiceSettingsOverlay?.classList.contains("show")) {
      closeVoiceSettings();
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
      const tauriApi = window.__TAURI__;
      if (tauriApi?.core?.invoke){
        await tauriApi.core.invoke("set_global_shortcut", { shortcut });
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
    if (hotkeyCapture) hotkeyCapture.textContent = t("settings_capture");
  }

  function startHotkeyCapture(){
    capturingHotkey = true;
    if (hotkeyCapture) hotkeyCapture.textContent = t("settings_capture_listen");
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

  function onVoiceActivationChange(){
    const enabled = Boolean(voiceActivationToggle?.checked);
    if (voiceCommandHint) voiceCommandHint.classList.toggle("hidden", !enabled);
    if (voiceMicWrap) voiceMicWrap.classList.toggle("hidden", !enabled);
    updateVoiceActivationStatusLabel();
    if (enabled) refreshVoiceMicList(String(voiceMicSelect?.value || ""), true);
  }

  voiceActivationToggle?.addEventListener("change", onVoiceActivationChange);
  voiceWakeModeSelect?.addEventListener("change", () => {
    updateWakeModeUI(voiceWakeModeSelect.value);
  });

  hotkeySave?.addEventListener("click", async () => {
    const val = hotkeyInput?.value || "";
    await applyHotkey(val);
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "count",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "25"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
    closeSettings();
  });

  voiceSettingsSave?.addEventListener("click", () => {
    const voiceSettings = getVoiceSettingsFromUI();
    saveVoiceSettings(voiceSettings);
    applyVoiceRuntimeSettings(voiceSettings);
    closeVoiceSettings();
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
    applyModalI18n();
    editingId = app.id;
    if (modalTitle) modalTitle.textContent = t("modal_edit_title");
    if (submitBtn) submitBtn.textContent = t("save");

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
    const typeValue = appType?.value || "web";
    if (!launchLabel || !appUrl || !launchHelp) return;

    if (typeValue === "web"){
      launchField?.classList.remove("hidden");
      scanField?.classList.add("hidden");
      launchLabel.innerHTML = `URL <span class="req">*</span>`;
      appUrl.placeholder = t("modal_url_placeholder");
      launchHelp.textContent = t("modal_web_help");
    } else if (typeValue === "desktop"){
      launchField?.classList.remove("hidden");
      scanField?.classList.add("hidden");
      launchLabel.innerHTML = `${t("modal_path_label").replace(" *","")} <span class="req">*</span>`;
      appUrl.placeholder = t("modal_path_placeholder");
      launchHelp.textContent = t("modal_path_help");
    } else if (typeValue === "scan"){
      launchField?.classList.add("hidden");
      scanField?.classList.remove("hidden");
      // No auto-scan on open/change. User triggers scan manually via refresh.
      applyScanCacheToUi();
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
        opt.textContent = c === "Sonstiges" ? t("tab_misc") : c;
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
        <button class="cat-del" type="button" ${c === "Sonstiges" ? "disabled" : ""}>${escapeHtml(t("category_delete_btn"))}</button>
      `;
      const delBtn = row.querySelector(".cat-del");
      if (delBtn && c !== "Sonstiges") {
        delBtn.addEventListener("click", () => {
          openConfirm(t("confirm_delete_category", { name: c }), () => {
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
      const tauriApi = window.__TAURI__;
      if (!tauriApi?.core?.invoke){
        alert(t("alert_tauri_missing"));
        return;
      }
      await tauriApi.core.invoke("open_external", { url: launch });
      return;
    }catch(e){
      console.error("Tauri invoke(open_external) failed:", e);
      alert(t("alert_open_failed", { message: e?.message || e }));
    }

    // Fallback (Live Server / Browser)
    window.open(launch, "_blank", "noopener,noreferrer");
  }

  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const DEFAULT_WAKE_PHRASES = ["kontrollzentrum", "kontroll zentrum", "control center", "controlcenter"];
  const COMMAND_VERBS = new Set(["starte", "start", "oeffne", "offne", "open", "launch", "run"]);
  const COMMAND_FILLERS = new Set([
    "bitte", "please", "mal", "doch", "den", "die", "das", "dem", "der", "ein", "eine",
    "the", "a", "an", "to", "app", "programm", "program", "kannst", "du", "can", "you"
  ]);
  const STATIC_APP_ALIASES = {
    cs2: [
      "cs2", "cs 2", "counter strike", "counter strike 2", "counter-strike", "counter-strike 2",
      "counter strike global offensive", "counter-strike global offensive", "cs go", "csgo",
      "counter strike go"
    ],
    sevenzip: ["7zip", "7 zip", "7-zip", "seven zip", "sieben zip"],
    steam: ["steam"],
    whatsapp: ["whatsapp", "whats app"]
  };
  const CANONICAL_APP_HINTS = {
    cs2: [
      "cs2", "counter strike", "counter strike global offensive", "csgo", "cs go",
      "steam://run/730", "730"
    ],
    sevenzip: ["7zip", "7 zip", "7 z", "7z", "7zfm", "7 zip file manager"],
    steam: ["steam", "steam://"],
    whatsapp: ["whatsapp", "whats app"]
  };

  let wakeRecognition = null;
  let commandRecognition = null;
  let wakeShouldRun = false;
  let commandModeActive = false;
  let commandTimeoutTimer = null;
  let voiceCooldownUntil = 0;
  let voiceBootstrapped = false;
  let selectedVoice = null;
  let selectedVoiceName = "";
  let selectedToneId = "soft_low";
  let wakePhrases = DEFAULT_WAKE_PHRASES.slice();
  let voiceEnabled = true;
  let selectedMicId = "";

  function normalizeSpeechText(input){
    return String(input || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripCommandFillers(tokens){
    let out = tokens.slice();
    while (out.length && COMMAND_FILLERS.has(out[0])) out.shift();
    while (out.length && COMMAND_FILLERS.has(out[out.length - 1])) out.pop();
    return out;
  }

  function addWakeVariant(set, value){
    const normalized = normalizeSpeechText(value);
    if (!normalized) return;
    set.add(normalized);
    const compact = normalized.replace(/\s+/g, "");
    if (compact && compact !== normalized) set.add(compact);
  }

  function createWakeVariants(phrase){
    const base = normalizeSpeechText(phrase);
    if (!base) return [];
    const variants = new Set();
    addWakeVariant(variants, base);
    addWakeVariant(variants, base.replace(/y/g, "i"));
    addWakeVariant(variants, base.replace(/i/g, "y"));
    addWakeVariant(variants, base.replace(/v/g, "w"));
    addWakeVariant(variants, base.replace(/w/g, "v"));
    addWakeVariant(variants, base.replace(/ph/g, "f"));
    addWakeVariant(variants, base.replace(/f/g, "ph"));
    return Array.from(variants);
  }

  function simplifyWakeText(value){
    return normalizeSpeechText(value)
      .replace(/y/g, "i")
      .replace(/ph/g, "f")
      .replace(/th/g, "t")
      .replace(/ck/g, "k")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshteinDistance(a, b){
    const aa = String(a || "");
    const bb = String(b || "");
    if (!aa) return bb.length;
    if (!bb) return aa.length;
    const dp = Array.from({ length: aa.length + 1 }, () => new Array(bb.length + 1).fill(0));
    for (let i = 0; i <= aa.length; i++) dp[i][0] = i;
    for (let j = 0; j <= bb.length; j++) dp[0][j] = j;
    for (let i = 1; i <= aa.length; i++){
      for (let j = 1; j <= bb.length; j++){
        const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[aa.length][bb.length];
  }

  function computeWakeSimilarity(candidate, phrase){
    const c = simplifyWakeText(candidate).replace(/\s+/g, "");
    const p = simplifyWakeText(phrase).replace(/\s+/g, "");
    if (!c || !p) return 0;
    if (c === p) return 1;
    if (c.includes(p) || p.includes(c)) return 0.92;
    const maxLen = Math.max(c.length, p.length);
    const dist = levenshteinDistance(c, p);
    return 1 - dist / maxLen;
  }

  function isWakeFuzzyAccept(candidate, phrase){
    const c = simplifyWakeText(candidate).replace(/\s+/g, "");
    const p = simplifyWakeText(phrase).replace(/\s+/g, "");
    if (!c || !p) return false;
    const dist = levenshteinDistance(c, p);
    const maxLen = Math.max(c.length, p.length);
    const similarity = 1 - dist / maxLen;
    const maxDist = maxLen <= 5 ? 1 : (maxLen <= 10 ? 2 : 3);
    if (dist > maxDist) return false;
    if (similarity < 0.68) return false;
    if (c[0] !== p[0] && similarity < 0.86) return false;
    return true;
  }

  function buildWakePhrases(rawInput){
    const raw = String(rawInput || "").trim();
    const parts = raw
      .split(/[,\n;|]+/)
      .map((p) => normalizeSpeechText(p))
      .filter(Boolean);
    const unique = new Set();
    parts.forEach((phrase) => {
      createWakeVariants(phrase).forEach((variant) => unique.add(variant));
    });
    if (!unique.size){
      DEFAULT_WAKE_PHRASES.forEach((phrase) => {
        createWakeVariants(phrase).forEach((variant) => unique.add(variant));
      });
    }
    return Array.from(unique);
  }

  function applyWakePhrases(rawInput){
    wakePhrases = buildWakePhrases(rawInput);
  }

  function resolveWakeInput(settings){
    const mode = normalizeWakeMode(settings?.wakeMode || "standard");
    if (mode !== "custom") return DEFAULT_WAKE_INPUT;
    const custom = String(settings?.wakePhrase || "").trim();
    return custom || DEFAULT_WAKE_INPUT;
  }

  function findWakeTailFuzzy(normalizedText){
    const tokens = String(normalizedText || "").split(" ").filter(Boolean);
    if (!tokens.length) return null;
    let best = null;
    for (const phrase of wakePhrases){
      const phraseTokens = phrase.split(" ").filter(Boolean);
      const targetLen = Math.max(1, phraseTokens.length || 1);
      for (let start = 0; start < tokens.length; start++){
        for (let delta = -1; delta <= 1; delta++){
          const len = Math.max(1, targetLen + delta);
          const end = start + len;
          if (end > tokens.length) continue;
          const candidate = tokens.slice(start, end).join(" ");
          if (!isWakeFuzzyAccept(candidate, phrase)) continue;
          let score = computeWakeSimilarity(candidate, phrase);
          if (Math.abs(delta) === 1) score -= 0.02;
          if (score < 0.68) continue;
          if (!best || score > best.score){
            best = { score, end };
          }
        }
      }
    }
    if (!best) return null;
    return tokens.slice(best.end).join(" ").trim();
  }

  function findWakeTail(normalizedText){
    for (const phrase of wakePhrases){
      const idx = normalizedText.indexOf(phrase);
      if (idx === -1) continue;
      return normalizedText.slice(idx + phrase.length).trim();
    }
    return findWakeTailFuzzy(normalizedText);
  }

  function parseVoiceCommand(rawText){
    const normalized = normalizeSpeechText(rawText);
    if (!normalized) return null;

    let tokens = stripCommandFillers(normalized.split(" ").filter(Boolean));
    if (!tokens.length) return null;

    if (tokens.length >= 2 && tokens[0] === "mach" && tokens[1] === "auf"){
      tokens = tokens.slice(2);
    } else if (COMMAND_VERBS.has(tokens[0])){
      tokens = tokens.slice(1);
    }

    tokens = stripCommandFillers(tokens);
    if (!tokens.length) return null;
    return { target: tokens.join(" ") };
  }

  function buildAliasMap(){
    const aliasMap = new Map();
    Object.entries(STATIC_APP_ALIASES).forEach(([canonical, aliases]) => {
      aliases.forEach((alias) => aliasMap.set(normalizeSpeechText(alias), canonical));
    });
    return aliasMap;
  }

  function pickCanonicalApp(canonical){
    const hints = CANONICAL_APP_HINTS[canonical] || [];
    let best = null;
    let bestScore = 0;
    apps.forEach((app) => {
      const name = normalizeSpeechText(app?.name);
      const launch = normalizeSpeechText(app?.launch);
      const hay = `${name} ${launch}`;
      let score = 0;
      hints.forEach((hint) => {
        const needle = normalizeSpeechText(hint);
        if (!needle) return;
        if (name === needle) score = Math.max(score, 100);
        else if (name.includes(needle)) score = Math.max(score, 85);
        else if (hay.includes(needle)) score = Math.max(score, 70);
      });
      if (score > bestScore){
        bestScore = score;
        best = app;
      }
    });
    return best;
  }

  function resolveAppByPhrase(targetPhrase){
    const normalizedTarget = normalizeSpeechText(targetPhrase);
    if (!normalizedTarget) return null;

    const aliasMap = buildAliasMap();
    const canonical = aliasMap.get(normalizedTarget) || null;
    if (canonical){
      const app = pickCanonicalApp(canonical);
      if (app) return app;
    }

    let best = null;
    let bestScore = 0;
    apps.forEach((app) => {
      const name = normalizeSpeechText(app?.name);
      const launch = normalizeSpeechText(app?.launch);
      if (!name && !launch) return;
      let score = 0;
      if (name === normalizedTarget) score = 120;
      else if (name.includes(normalizedTarget)) score = 95;
      else if (normalizedTarget.includes(name) && name.length > 2) score = 90;
      else if (launch.includes(normalizedTarget)) score = 70;
      if (score > bestScore){
        bestScore = score;
        best = app;
      }
    });
    return best;
  }

  function playListeningBeep(){
    try{
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      const ctx = new AudioCtor();
      const now = ctx.currentTime;
      let stopAt = now + 0.24;

      const master = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.value = 0.9;
      master.connect(ctx.destination);
      filter.connect(master);

      function addTone(type, fStart, fEnd, startOffset, duration, peak){
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + startOffset;
        const end = start + duration;
        osc.type = type;
        osc.frequency.setValueAtTime(fStart, start);
        if (Number.isFinite(fEnd) && fEnd > 0 && fEnd !== fStart){
          osc.frequency.exponentialRampToValueAtTime(fEnd, end);
        }
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + Math.min(0.02, duration * 0.35));
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(start);
        osc.stop(end);
      }

      if (selectedToneId === "short_thud"){
        addTone("triangle", 300, 220, 0, 0.12, 0.26);
        filter.frequency.setValueAtTime(720, now);
        filter.Q.value = 1.1;
        stopAt = now + 0.13;
      } else if (selectedToneId === "deep_click"){
        // Glass Click: crisp transient + short shimmer.
        filter.frequency.setValueAtTime(2100, now);
        filter.Q.value = 1.05;
        addTone("square", 980, 620, 0, 0.05, 0.16);
        addTone("triangle", 740, 520, 0.018, 0.08, 0.11);
        addTone("sine", 1560, 1180, 0.008, 0.04, 0.06);
        stopAt = now + 0.16;
      } else if (selectedToneId === "duo_console"){
        // Nova Sweep: modern double sweep with soft digital body.
        filter.frequency.setValueAtTime(1500, now);
        filter.Q.value = 0.82;
        addTone("triangle", 360, 640, 0, 0.12, 0.16);
        addTone("sine", 720, 1180, 0.03, 0.13, 0.11);
        addTone("sine", 510, 420, 0.02, 0.11, 0.07);
        stopAt = now + 0.23;
      } else if (selectedToneId === "warm_ping"){
        // Aurora Chime: airy, satisfying two-step chime.
        filter.frequency.setValueAtTime(2400, now);
        filter.Q.value = 0.7;
        addTone("sine", 640, 930, 0, 0.11, 0.14);
        addTone("sine", 930, 1240, 0.065, 0.12, 0.12);
        addTone("triangle", 480, 410, 0.01, 0.16, 0.06);
        stopAt = now + 0.27;
      } else {
        // Neon Pulse (default): fresh soft pulse with upward energy.
        filter.frequency.setValueAtTime(1700, now);
        filter.Q.value = 0.92;
        addTone("triangle", 420, 760, 0, 0.1, 0.15);
        addTone("sine", 720, 980, 0.045, 0.1, 0.12);
        addTone("sine", 520, 470, 0.015, 0.13, 0.06);
        stopAt = now + 0.22;
      }

      setTimeout(() => ctx.close(), Math.max(120, Math.ceil((stopAt - now) * 1000) + 80));
    }catch{
      // ignore audio errors
    }
  }

  function pickSpeechVoice(preferredName = ""){
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices.length) return null;
    const wanted = String(preferredName || "").trim();
    if (wanted === "__none__") return null;
    if (wanted === "__male__") return pickGenderVoice(voices, "male");
    if (wanted === "__female__") return pickGenderVoice(voices, "female");
    if (wanted){
      const explicit = voices.find(v => String(v.name || "") === wanted);
      if (explicit) return explicit;
    }
    const langPrefix = currentLang === "en" ? "en" : "de";
    return voices.find(v => String(v.lang || "").toLowerCase().startsWith(langPrefix)) || voices[0];
  }

  function pickGenderVoice(voices, gender){
    const langOrder = currentLang === "en" ? ["en", "de"] : ["de", "en"];
    const ordered = voices
      .slice()
      .sort((a, b) => {
        const aLang = String(a?.lang || "").toLowerCase();
        const bLang = String(b?.lang || "").toLowerCase();
        const aRank = langOrder.findIndex((p) => aLang.startsWith(p));
        const bRank = langOrder.findIndex((p) => bLang.startsWith(p));
        const aScore = aRank === -1 ? 99 : aRank;
        const bScore = bRank === -1 ? 99 : bRank;
        return aScore - bScore;
      });

    // Score voices so "man" cannot accidentally match "woMAN".
    const femaleStrong = ["katja", "zira", "jenny", "aria", "sara", "susan", "female", "frau", "woman", "weiblich"];
    const maleStrong = ["stefan", "david", "mark", "guy", "male", "mann", "maennlich"];

    let best = null;
    let bestScore = -1;
    for (const voice of ordered){
      const name = String(voice?.name || "").toLowerCase().trim();
      if (!name) continue;

      let score = 10;
      const hasFemaleStrong = femaleStrong.some((needle) => name.includes(needle));
      const hasMaleStrong = maleStrong.some((needle) => name.includes(needle));
      const hasWordWoman = /\bwoman\b/.test(name);
      const hasWordMan = /\bman\b/.test(name);

      if (gender === "female"){
        if (hasFemaleStrong || hasWordWoman) score += 120;
        if (hasMaleStrong || hasWordMan) score -= 60;
      } else {
        if (hasMaleStrong || hasWordMan) score += 120;
        if (hasFemaleStrong || hasWordWoman) score -= 60;
      }

      const lang = String(voice?.lang || "").toLowerCase();
      if ((currentLang === "de" && lang.startsWith("de")) || (currentLang === "en" && lang.startsWith("en"))){
        score += 15;
      }

      if (score > bestScore){
        bestScore = score;
        best = voice;
      }
    }
    return best || ordered[0] || voices[0];
  }

  function getSpeechProfile(){
    return { rate: 0.9, pitch: 0.95, volume: 0.78 };
  }

  function sanitizeVoiceChoice(value){
    const raw = String(value || "").trim();
    if (raw === "__none__" || raw === "__male__" || raw === "__female__") return raw;
    const lowered = raw.toLowerCase();
    if (lowered === "none" || lowered.includes("keine stimme")) return "__none__";
    if (lowered.includes("stefan")) return "__male__";
    if (lowered.includes("katja")) return "__female__";
    if (lowered.includes("hedda")) return "";
    if (lowered.includes("male") || lowered.includes("mann") || lowered === "man") return "__male__";
    if (lowered.includes("female") || lowered.includes("frau") || lowered === "woman") return "__female__";
    if (!raw) return "";
    if (raw.startsWith("__")) return "";
    return raw;
  }

  function getVoiceLangForRecognition(choice){
    const resolved = sanitizeVoiceChoice(choice);
    if (resolved !== "__male__" && resolved !== "__female__") return currentLang;
    const picked = pickSpeechVoice(resolved);
    const lang = String(picked?.lang || "").toLowerCase();
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
    return currentLang;
  }

  function getRecognitionLocale(){
    const lang = getVoiceLangForRecognition(selectedVoiceName);
    return lang === "en" ? "en-US" : "de-DE";
  }

  function applyRecognitionLang(){
    const locale = getRecognitionLocale();
    if (wakeRecognition) wakeRecognition.lang = locale;
    if (commandRecognition) commandRecognition.lang = locale;
  }

  function getSpeechOutputLocale(){
    const lang = getVoiceLangForRecognition(selectedVoiceName);
    return lang === "en" ? "en-US" : "de-DE";
  }

  function speakFeedback(text){
    if (selectedVoiceName === "__none__") return;
    if (!window.speechSynthesis || !text) return;
    try{
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      selectedVoice = pickSpeechVoice(selectedVoiceName);
      if (selectedVoice) msg.voice = selectedVoice;
      msg.lang = getSpeechOutputLocale();
      const speechProfile = getSpeechProfile();
      msg.rate = speechProfile.rate;
      msg.pitch = speechProfile.pitch;
      msg.volume = speechProfile.volume;
      window.speechSynthesis.speak(msg);
    }catch{
      // ignore speech errors
    }
  }

  function playCommandOutcomeTone(kind){
    try{
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      const ctx = new AudioCtor();
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const makeOsc = (type, frequency, at, dur) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, at);
        osc.connect(gain);
        osc.start(at);
        osc.stop(at + dur);
      };

      if (kind === "success"){
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        makeOsc("sine", 720, now, 0.08);
        makeOsc("sine", 920, now + 0.085, 0.11);
      } else {
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        makeOsc("triangle", 240, now, 0.1);
        makeOsc("triangle", 180, now + 0.09, 0.12);
      }

      setTimeout(() => ctx.close(), 320);
    }catch{
      // ignore audio errors
    }
  }

  function clearCommandTimeout(){
    if (!commandTimeoutTimer) return;
    clearTimeout(commandTimeoutTimer);
    commandTimeoutTimer = null;
  }

  function stopCommandListening(){
    clearCommandTimeout();
    commandModeActive = false;
    if (!commandRecognition) return;
    try{ commandRecognition.stop(); }catch{}
  }

  function stopWakeListening(){
    wakeShouldRun = false;
    if (!wakeRecognition) return;
    try{ wakeRecognition.stop(); }catch{}
  }

  function startWakeListening(){
    if (!SpeechRecognitionCtor || !voiceEnabled) return;
    if (!wakeRecognition){
      wakeRecognition = new SpeechRecognitionCtor();
      wakeRecognition.continuous = true;
      wakeRecognition.interimResults = false;
      wakeRecognition.maxAlternatives = 3;
      wakeRecognition.lang = getRecognitionLocale();

      wakeRecognition.onresult = (event) => {
        if (Date.now() < voiceCooldownUntil || commandModeActive) return;
        for (let i = event.resultIndex; i < event.results.length; i++){
          const result = event.results[i];
          if (!result.isFinal) continue;
          let matchedTail = null;
          const altCount = Math.min(result.length || 0, 3);
          for (let alt = 0; alt < altCount; alt++){
            const spoken = result[alt]?.transcript || "";
            const normalized = normalizeSpeechText(spoken);
            const tail = findWakeTail(normalized);
            if (tail === null) continue;
            matchedTail = tail;
            break;
          }
          if (matchedTail === null) continue;
          handleWakeDetected(matchedTail);
          break;
        }
      };

      wakeRecognition.onerror = () => {
        // auto-restart handled in onend
      };

      wakeRecognition.onend = () => {
        if (!wakeShouldRun || commandModeActive || !voiceEnabled) return;
        setTimeout(() => {
          if (!wakeShouldRun || commandModeActive || !voiceEnabled) return;
          try{ wakeRecognition.start(); }catch{}
        }, 450);
      };
    }
    wakeShouldRun = true;
    try{ wakeRecognition.start(); }catch{}
  }

  function startCommandWindow(){
    if (!SpeechRecognitionCtor || !voiceEnabled) return;
    commandModeActive = true;
    stopWakeListening();
    playListeningBeep();

    if (!commandRecognition){
      commandRecognition = new SpeechRecognitionCtor();
      commandRecognition.continuous = false;
      commandRecognition.interimResults = false;
      commandRecognition.maxAlternatives = 1;
      commandRecognition.lang = getRecognitionLocale();
    }

    let commandHandled = false;
    commandRecognition.onresult = async (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++){
        const result = event.results[i];
        if (!result.isFinal) continue;
        const transcript = result[0]?.transcript || "";
        commandHandled = true;
        await executeVoiceCommand(transcript);
        try{ commandRecognition.stop(); }catch{}
        break;
      }
    };

    commandRecognition.onend = () => {
      clearCommandTimeout();
      commandModeActive = false;
      voiceCooldownUntil = Date.now() + 700;
      if (!commandHandled){
        if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
        speakFeedback(t("voice_not_understood"));
      }
      startWakeListening();
    };

    commandRecognition.onerror = () => {
      // onend handles restart flow
    };

    clearCommandTimeout();
    commandTimeoutTimer = setTimeout(() => {
      try{ commandRecognition.stop(); }catch{}
    }, 4200);

    try{ commandRecognition.start(); }catch{
      commandModeActive = false;
      startWakeListening();
    }
  }

  function handleWakeDetected(tail){
    if (!voiceEnabled || Date.now() < voiceCooldownUntil || commandModeActive) return;
    const parsedTail = parseVoiceCommand(tail);
    if (parsedTail){
      voiceCooldownUntil = Date.now() + 700;
      executeVoiceCommand(tail);
      return;
    }
    startCommandWindow();
  }

  async function executeVoiceCommand(transcript){
    const parsed = parseVoiceCommand(transcript);
    if (!parsed){
      if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
      speakFeedback(t("voice_not_understood"));
      return;
    }
    const app = resolveAppByPhrase(parsed.target);
    if (!app){
      if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
      speakFeedback(t("voice_app_not_found", { name: parsed.target }));
      return;
    }
    await openLaunch(app);
    if (selectedVoiceName === "__none__") playCommandOutcomeTone("success");
    speakFeedback(t("voice_opening", { name: app.name || parsed.target }));
  }

  function bootstrapVoiceControl(){
    if (voiceBootstrapped) return;
    voiceBootstrapped = true;
    const settings = loadVoiceSettings();
    voiceEnabled = Boolean(settings.enabled);
    selectedMicId = settings.micId || "";
    selectedVoiceName = sanitizeVoiceChoice(settings.voiceName || "");
    selectedToneId = VOICE_TONES.has(settings.toneId) ? settings.toneId : "soft_low";
    applyWakePhrases(resolveWakeInput(settings));
    if (!SpeechRecognitionCtor){
      console.warn("SpeechRecognition API not available in this runtime.");
      return;
    }
    selectedVoice = pickSpeechVoice(selectedVoiceName);
    applyRecognitionLang();
    if (voiceEnabled) startWakeListening();
  }

  function applyVoiceRuntimeSettings(settings){
    voiceEnabled = Boolean(settings?.enabled);
    selectedMicId = settings?.micId || "";
    selectedVoiceName = sanitizeVoiceChoice(settings?.voiceName || "");
    selectedToneId = VOICE_TONES.has(settings?.toneId) ? settings.toneId : "soft_low";
    applyWakePhrases(resolveWakeInput(settings));
    selectedVoice = pickSpeechVoice(selectedVoiceName);
    applyRecognitionLang();
    if (!voiceEnabled){
      stopWakeListening();
      stopCommandListening();
      return;
    }
    bootstrapVoiceControl();
    startWakeListening();
  }

  if (window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = () => {
      selectedVoice = pickSpeechVoice(selectedVoiceName);
      const current = loadVoiceSettings();
      refreshVoiceList(current.voiceName || selectedVoiceName);
    };
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
      const launch = String(app?.launch || "").toLowerCase();
      const isSteamLaunch = launch.startsWith("steam://run/");
      if (isSteamLaunch) img.classList.add("steam-art");
      let fallbackAlt = alt || "";
      if (!fallbackAlt && isSteamLaunch && typeof primary === "string"){
        if (primary.includes("/library_600x900.jpg")){
          fallbackAlt = primary.replace("/library_600x900.jpg", "/header.jpg");
        } else if (primary.includes("/header.jpg")){
          fallbackAlt = primary.replace("/header.jpg", "/library_600x900.jpg");
        }
      }
      img.dataset.alt = fallbackAlt;
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

      const typeBadge = app.type === "desktop" ? t("card_type_desktop") : t("card_type_web");

      card.innerHTML = `
        <div class="card-top">
          <div class="card-icon">
          </div>

          <div class="card-actions">
            <button class="star ${app.fav ? "active" : ""}" type="button" aria-label="${escapeHtml(t("aria_favorite"))}">★</button>
            <button class="edit" type="button" aria-label="${escapeHtml(t("aria_edit"))}" title="${escapeHtml(t("title_edit"))}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M14.5 5.5 18.5 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="del" type="button" aria-label="${escapeHtml(t("aria_delete"))}" title="${escapeHtml(t("title_delete"))}">🗑</button>
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
        openConfirm(t("confirm_delete_app", { name: app.name }), () => {
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
        alert(t("alert_scan_choose"));
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
      alert(t("alert_fill_required"));
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
        alert(t("alert_web_invalid"));
        return;
      }
      launch = normalizeWebUrl(launch);
    } else {
      const ok = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(launch);
      if (!ok){
        alert(t("alert_desktop_invalid"));
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
  setTimeout(bootstrapVoiceControl, 900);
  document.addEventListener("pointerdown", bootstrapVoiceControl, { once: true });
});


