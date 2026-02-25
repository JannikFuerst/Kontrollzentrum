console.log("app.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {

  // Tabs + State
  let activeTab = "all";
  let searchTerm = "";
  let categorySearchTerm = "";

  const grid = document.getElementById("appGrid");
  const empty = document.getElementById("emptyState");
  const pinnedSection = document.getElementById("pinnedSection");
  const pinnedRow = document.getElementById("pinnedRow");
  const search = document.getElementById("search");
  const categorySearch = document.getElementById("categorySearch");
  const categorySearchWrap = document.querySelector(".category-search");
  const catCollapseToggle = document.getElementById("catCollapseToggle");
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
  const CAT_RAIL_COLLAPSED_KEY = "kc_cat_rail_collapsed";
  let catRailCollapsed = localStorage.getItem(CAT_RAIL_COLLAPSED_KEY) === "1";

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
      category_search_placeholder: "Durchsuchen (STRG+G)...",
      add_app: "App hinzufügen",
      add: "Hinzufügen",
      save: "Speichern",
      cancel: "Abbrechen",
      close: "Schließen",
      close_aria: "Schließen",
      tab_all: "Alle",
      tab_favorites: "Favoriten",
      tab_hotkeys: "Hotkeys",
      tab_misc: "Sonstiges",
      manage_categories_aria: "Kategorie hinzufügen",
      pinned_heading: "Angepinnt",
      empty_title: "Noch keine Apps",
      empty_subtitle: "Füge deine erste App hinzu",
      scan_loading: "Scanne...",
      scan_none: "Keine Apps gefunden",
      scan_select_placeholder: "App auswählen",
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
      super_limit_title: "Limit erreicht",
      super_limit_message: "Du kannst maximal {max} Überkategorien erstellen.",
      super_limit_ok: "Verstanden",
      update_available_title: "Update verfügbar",
      update_available_message: "Neue Version verfügbar: v{latest} (aktuell: v{current}).",
      update_available_action: "UPDATE",
      update_available_dismiss: "Nein danke",
      clipboard_clear_confirm: "Clipboard-Verlauf wirklich leeren?",
      category_delete_btn: "Löschen",
      confirm_delete_category: "Kategorie \"{name}\" löschen? Apps bleiben unter \"Alle\" sichtbar.",
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
      app_ctx_add_favorite: "Zu Favoriten hinzufügen",
      app_ctx_remove_favorite: "Aus Favoriten entfernen",
      app_ctx_edit: "Bearbeiten",
      app_ctx_delete: "Löschen",
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
      modal_icon_upload_tip: "Icon hochladen (JPG/PNG)",
      modal_icon_auto: "Standard: automatisch aus URL (Favicon)",
      modal_icon_custom_help: "Oder eigenes PNG/JPG hochladen.",
      modal_name_label: "Name",
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
      modal_app_hotkey_label: "App Hotkey",
      modal_app_hotkey_placeholder: "Drücke 'Aufnehmen'...",
      modal_app_hotkey_clear: "Hotkey entfernen",
      cat_manage_title: "Kategorien verwalten",
      cat_new_label: "Neue Kategorie",
      cat_new_placeholder: "z.B. Lernen, Finanzen...",
      cat_manage_help: "Gelöschte Kategorien sind nicht mehr auswählbar, Apps bleiben unter \"Alle\" sichtbar.",
      cat_existing_label: "Vorhandene Kategorien",
      cat_kind_sub: "Unterkategorie",
      cat_kind_super: "Überkategorie",
      cat_new_placeholder_super: "z.B. Games, Arbeit...",
      cat_manage_help_super: "Überkategorien bündeln Unterkategorien (z.B. Games / Steam).",
      cat_ctx_remove_super: "Aus Überkategorie entfernen",
      cat_ctx_move_to_super: "Zu Überkategorie verschieben",
      cat_ctx_delete_category: "Kategorie löschen",
      cat_ctx_delete_super: "Überkategorie löschen",
      cat_ctx_no_super: "Keine Überkategorie vorhanden",
      super_icon_title: "Icon wählen",
      super_icon_search_placeholder: "Icons durchsuchen...",
      super_icon_empty: "Keine passenden Icons gefunden.",
      super_icon_upload: "Eigenes Icon hochladen",
      super_icon_use: "Verwenden",
      category_icon_btn: "Icon",
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
      settings_voice_wake_label: "Aktivierungswort",
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
      settings_voice_enable_info_title: "Sprachsteuerung aktiviert",
      settings_voice_enable_info_message: "Sag zuerst dein Aktivierungswort und warte dann kurz auf den Signalton, bevor du den Befehl sprichst. Funktioniert nur, wenn Mikrofonzugriff erlaubt ist.",
      settings_voice_mic_denied_title: "Mikrofonzugriff benötigt",
      settings_voice_mic_denied_message: "Sprachsteuerung kann nur aktiviert werden, wenn Mikrofonzugriff erlaubt und nicht blockiert ist.",
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
      settings_accent_custom: "Individuelle Farbe",
      settings_accent_brightness: "Helligkeit",
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
      settings_allowed_sizes: "Alle Bildgroessen sind erlaubt",
      settings_bg_error: "Bild konnte nicht geladen werden. Bitte ein gueltiges Bildformat verwenden.",
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
      category_search_placeholder: "Search (CTRL+G)...",
      add_app: "Add app",
      add: "Add",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      close_aria: "Close",
      tab_all: "All",
      tab_favorites: "Favorites",
      tab_hotkeys: "Hotkeys",
      tab_misc: "Misc",
      manage_categories_aria: "Add category",
      pinned_heading: "Pinned",
      empty_title: "No apps yet",
      empty_subtitle: "Add your first app",
      scan_loading: "Scanning...",
      scan_none: "No apps found",
      scan_select_placeholder: "Select app",
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
      super_limit_title: "Limit reached",
      super_limit_message: "You can create up to {max} supercategories.",
      super_limit_ok: "Got it",
      update_available_title: "Update available",
      update_available_message: "A new version is available: v{latest} (current: v{current}).",
      update_available_action: "UPDATE",
      update_available_dismiss: "No thanks",
      clipboard_clear_confirm: "Clear clipboard history?",
      category_delete_btn: "Delete",
      confirm_delete_category: "Delete category \"{name}\"? Apps remain visible under \"All\".",
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
      app_ctx_add_favorite: "Add to favorites",
      app_ctx_remove_favorite: "Remove from favorites",
      app_ctx_edit: "Edit",
      app_ctx_delete: "Delete",
      alert_scan_choose: "Please select an app from scan.",
      alert_fill_required: "Please fill name and URL/path.",
      alert_web_invalid: "Web apps need a URL/domain (e.g. discord.com/app or https://discord.com/app).",
      alert_desktop_invalid: "Desktop apps need a URI like discord://, steam://..., ms-settings:... or file:///C:/...",
      modal_add_title: "Add new app",
      modal_edit_title: "Edit app",
      modal_icon_optional: "Icon (optional)",
      modal_icon_remove: "Remove icon",
      modal_icon_upload: "Upload icon",
      modal_icon_upload_tip: "Upload icon (JPG/PNG)",
      modal_icon_auto: "Default: automatic from URL (favicon)",
      modal_icon_custom_help: "Or upload your own PNG/JPG.",
      modal_name_label: "Name",
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
      modal_app_hotkey_label: "App hotkey",
      modal_app_hotkey_placeholder: "Press 'Capture'...",
      modal_app_hotkey_clear: "Remove hotkey",
      cat_manage_title: "Manage categories",
      cat_new_label: "New category",
      cat_new_placeholder: "e.g. Learning, Finance...",
      cat_manage_help: "Deleted categories are no longer selectable; apps remain visible under \"All\".",
      cat_existing_label: "Existing categories",
      cat_kind_sub: "Subcategory",
      cat_kind_super: "Supercategory",
      cat_new_placeholder_super: "e.g. Games, Work...",
      cat_manage_help_super: "Supercategories group subcategories (e.g. Games / Steam).",
      cat_ctx_remove_super: "Remove from supercategory",
      cat_ctx_move_to_super: "Move to supercategory",
      cat_ctx_delete_category: "Delete category",
      cat_ctx_delete_super: "Delete supercategory",
      cat_ctx_no_super: "No supercategory available",
      super_icon_title: "Choose icon",
      super_icon_search_placeholder: "Search icons...",
      super_icon_empty: "No matching icons found.",
      super_icon_upload: "Upload custom icon",
      super_icon_use: "Use icon",
      category_icon_btn: "Icon",
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
      settings_voice_wake_label: "Activation words",
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
      settings_voice_enable_info_title: "Voice control enabled",
      settings_voice_enable_info_message: "Say your activation word first and briefly wait for the cue tone before speaking the command. Works only if microphone access is allowed.",
      settings_voice_mic_denied_title: "Microphone access required",
      settings_voice_mic_denied_message: "Voice control can only be enabled when microphone access is allowed and not blocked.",
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
      settings_accent_custom: "Custom color",
      settings_accent_brightness: "Brightness",
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
      settings_allowed_sizes: "All image sizes are allowed",
      settings_bg_error: "Image could not be loaded. Please use a valid image format.",
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
    if (voiceSettingsBtn){
      voiceSettingsBtn.dataset.tip = t("voice_settings_title_btn");
      voiceSettingsBtn.removeAttribute("title");
    }
    if (languageBtn){
      languageBtn.setAttribute("aria-label", t("language"));
      languageBtn.dataset.tip = t("language");
      languageBtn.removeAttribute("title");
    }
    const settingsTopBtn = document.getElementById("settingsBtn");
    if (settingsTopBtn){
      settingsTopBtn.dataset.tip = t("settings_title_btn");
      settingsTopBtn.removeAttribute("title");
    }
    if (notesToggle){
      notesToggle.dataset.tip = t("notes_toggle");
      notesToggle.setAttribute("aria-label", t("notes_toggle"));
      notesToggle.removeAttribute("title");
    }
    if (clipboardToggle){
      clipboardToggle.dataset.tip = t("clipboard_toggle");
      clipboardToggle.setAttribute("aria-label", t("clipboard_toggle"));
      clipboardToggle.removeAttribute("title");
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
  const tabsWrapEl = document.querySelector(".tabs-wrap");
  const overTabs = document.getElementById("overTabs");
  const tabsEl = document.querySelector(".tabs");
  let overTabSuppressClickUntil = 0;
  const superHoverTooltip = document.createElement("div");
  superHoverTooltip.className = "super-hover-tooltip";
  superHoverTooltip.hidden = true;
  document.body.appendChild(superHoverTooltip);
  let superHoverTooltipTab = null;
  const railHoverTooltip = document.createElement("div");
  railHoverTooltip.className = "rail-hover-tooltip";
  railHoverTooltip.hidden = true;
  document.body.appendChild(railHoverTooltip);
  let railHoverTooltipTab = null;

  function getSuperTooltipLabel(tab){
    if (!tab) return "";
    return (tab.dataset.tip || tab.dataset.label || "").trim();
  }

  function positionSuperTooltip(tab){
    if (!tab || !superHoverTooltip) return;
    const rect = tab.getBoundingClientRect();
    superHoverTooltip.style.left = `${Math.round(rect.right + 12)}px`;
    superHoverTooltip.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
  }

  function showSuperTooltip(tab){
    const label = getSuperTooltipLabel(tab);
    if (!label){
      hideSuperTooltip();
      return;
    }
    superHoverTooltip.textContent = label;
    superHoverTooltip.hidden = false;
    superHoverTooltip.classList.add("show");
    superHoverTooltipTab = tab;
    positionSuperTooltip(tab);
  }

  function hideSuperTooltip(){
    superHoverTooltipTab = null;
    superHoverTooltip.classList.remove("show");
    superHoverTooltip.hidden = true;
  }

  function getRailTooltipLabel(tab){
    if (!tab) return "";
    return (tab.dataset.tip || "").trim();
  }

  function positionRailTooltip(tab){
    if (!tab || !railHoverTooltip) return;
    const rect = tab.getBoundingClientRect();
    railHoverTooltip.style.left = `${Math.round(rect.right + 20)}px`;
    railHoverTooltip.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
  }

  function showRailTooltip(tab){
    if (!catRailCollapsed) return;
    const label = getRailTooltipLabel(tab);
    if (!label){
      hideRailTooltip();
      return;
    }
    railHoverTooltip.textContent = label;
    railHoverTooltip.hidden = false;
    railHoverTooltip.classList.add("show");
    railHoverTooltipTab = tab;
    positionRailTooltip(tab);
  }

  function hideRailTooltip(){
    railHoverTooltipTab = null;
    railHoverTooltip.classList.remove("show");
    railHoverTooltip.hidden = true;
  }

  overTabs?.addEventListener("pointerover", (e) => {
    const tab = e.target.closest(".tab[data-super]");
    if (!tab || !overTabs.contains(tab)) return;
    showSuperTooltip(tab);
  });
  overTabs?.addEventListener("pointermove", () => {
    if (!superHoverTooltipTab) return;
    positionSuperTooltip(superHoverTooltipTab);
  });
  overTabs?.addEventListener("pointerout", (e) => {
    if (!superHoverTooltipTab) return;
    const rel = e.relatedTarget;
    const next = rel && rel.closest ? rel.closest(".tab[data-super]") : null;
    if (next && overTabs.contains(next)){
      showSuperTooltip(next);
      return;
    }
    hideSuperTooltip();
  });
  overTabs?.addEventListener("pointercancel", hideSuperTooltip);
  tabsEl?.addEventListener("pointerover", (e) => {
    const tab = e.target.closest(".tab-cat[data-tip], .tabs > .tab[data-tab][data-tip]");
    if (!tab || !tabsEl.contains(tab)) return;
    showRailTooltip(tab);
  });
  tabsEl?.addEventListener("pointermove", () => {
    if (!railHoverTooltipTab) return;
    positionRailTooltip(railHoverTooltipTab);
  });
  tabsEl?.addEventListener("pointerout", (e) => {
    if (!railHoverTooltipTab) return;
    const rel = e.relatedTarget;
    const next = rel && rel.closest ? rel.closest(".tab-cat[data-tip], .tabs > .tab[data-tab][data-tip]") : null;
    if (next && tabsEl.contains(next)){
      showRailTooltip(next);
      return;
    }
    hideRailTooltip();
  });
  tabsEl?.addEventListener("pointercancel", hideRailTooltip);

  function applyCategoryRailState(){
    if (tabsWrapEl){
      tabsWrapEl.classList.toggle("cat-collapsed", catRailCollapsed);
    }
    if (layout){
      layout.classList.toggle("cat-rail-collapsed", catRailCollapsed);
    }
    if (catCollapseToggle){
      const label = catRailCollapsed
        ? (currentLang === "de" ? "Kategorien ausklappen" : "Expand categories")
        : (currentLang === "de" ? "Kategorien einklappen" : "Collapse categories");
      catCollapseToggle.textContent = catRailCollapsed ? "⮜" : "⮞";
      catCollapseToggle.setAttribute("aria-label", label);
      catCollapseToggle.setAttribute("title", label);
    }
  }

  function saveCategoryRailState(){
    localStorage.setItem(CAT_RAIL_COLLAPSED_KEY, catRailCollapsed ? "1" : "0");
  }

  function setCategoryRailCollapsed(nextValue, options = {}){
    const next = Boolean(nextValue);
    const focusSearch = Boolean(options.focusSearch);
    const changed = catRailCollapsed !== next;
    catRailCollapsed = next;
    if (changed) saveCategoryRailState();
    applyCategoryRailState();
    if (changed) renderCategories();
    if (focusSearch && !catRailCollapsed && categorySearch){
      categorySearch.focus();
      categorySearch.select();
    }
  }
  tabsWrapEl?.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t || t.classList.contains("tab-add-btn") || t.classList.contains("tab-collapse-btn") || t.classList.contains("tab-add-ok")) return;
    if (t.dataset.super && Date.now() < overTabSuppressClickUntil) return;
    if (t.dataset.super){
      setActiveSuper(t.dataset.super);
      return;
    }
    const tabValue = t.dataset.tab || "all";
    setActiveTab(tabValue);
  });

  // Horizontal scroll with mouse wheel on category/tabs row
  tabsEl?.addEventListener("wheel", (e) => {
    if (!tabsEl) return;
    // In desktop vertical rail mode keep native vertical scrolling.
    if (tabsEl.scrollHeight > tabsEl.clientHeight + 1){
      return;
    }
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

  categorySearch?.addEventListener("input", () => {
    categorySearchTerm = (categorySearch.value || "").toLowerCase().trim();
    renderCategories();
  });
  categorySearchWrap?.addEventListener("click", (e) => {
    if (!catRailCollapsed) return;
    e.preventDefault();
    setCategoryRailCollapsed(false, { focusSearch: true });
  });
  categorySearch?.addEventListener("focus", () => {
    if (!catRailCollapsed) return;
    setCategoryRailCollapsed(false, { focusSearch: true });
  });
  catCollapseToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryRailCollapsed(!catRailCollapsed);
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

  // Ctrl+F / Cmd+F focuses app search, Ctrl+G / Cmd+G focuses category search.
  document.addEventListener("keydown", (e) => {
    const withMod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    const isAppFind = withMod && key === "f";
    const isCategoryFind = withMod && key === "g";
    if (!isAppFind && !isCategoryFind) return;
    e.preventDefault();
    if (isAppFind && search){
      search.focus();
      search.select();
      return;
    }
    if (isCategoryFind && categorySearch){
      setCategoryRailCollapsed(false, { focusSearch: true });
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
  const accentCustomTrigger = document.getElementById("accentCustomTrigger");
  const accentCustomOverlay = document.getElementById("accentCustomOverlay");
  const accentCustomClose = document.getElementById("accentCustomClose");
  const accentCustom = document.getElementById("accentCustom");
  const accentWheel = document.getElementById("accentWheel");
  const accentWheelWrap = document.getElementById("accentWheelWrap");
  const accentWheelThumb = document.getElementById("accentWheelThumb");
  const accentBrightness = document.getElementById("accentBrightness");
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
  const clipboardModeCountBtn = document.getElementById("clipboardModeCountBtn");
  const clipboardModeTimeBtn = document.getElementById("clipboardModeTimeBtn");
  const clipboardTimeButtons = document.getElementById("clipboardTimeButtons");
  const clipboardCountButtons = document.getElementById("clipboardCountButtons");
  const clipboardTimeCycle = document.getElementById("clipboardTimeCycle");
  const clipboardMaxItems = document.getElementById("clipboardMaxItems");
  const clipboardTimeWrap = document.getElementById("clipboardTimeWrap");
  const clipboardCountWrap = document.getElementById("clipboardCountWrap");
  const voiceActivationToggle = document.getElementById("voiceActivationToggle");
  const voiceActivationOff = document.getElementById("voiceActivationOff");
  const voiceActivationOn = document.getElementById("voiceActivationOn");
  const voiceWakeModeSelect = document.getElementById("voiceWakeModeSelect");
  const voiceWakeCustomWrap = document.getElementById("voiceWakeCustomWrap");
  const voiceWakeInput = document.getElementById("voiceWakeInput");
  const voiceMicWrap = document.getElementById("voiceMicWrap");
  const voiceMicSelect = document.getElementById("voiceMicSelect");
  const voiceModeBtn = document.getElementById("voiceModeBtn");
  const voiceModeIcon = document.getElementById("voiceModeIcon");
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
  const catManageHelp = document.getElementById("catManageHelp");
  const catKindSwitch = document.getElementById("catKindSwitch");
  const catKindSub = document.getElementById("catKindSub");
  const catKindSuper = document.getElementById("catKindSuper");
  const superIconOverlay = document.getElementById("superIconOverlay");
  const superIconClose = document.getElementById("superIconClose");
  const superIconCancel = document.getElementById("superIconCancel");
  const superIconSave = document.getElementById("superIconSave");
  const superIconGrid = document.getElementById("superIconGrid");
  const superIconPreview = document.getElementById("superIconPreview");
  const superIconSearch = document.getElementById("superIconSearch");
  const superIconEmpty = document.getElementById("superIconEmpty");
  const superIconForLabel = document.getElementById("superIconForLabel");
  const superIconUpload = document.getElementById("superIconUpload");
  const superIconUploadBtn = document.getElementById("superIconUploadBtn");
  const catSuperIconPick = document.getElementById("catSuperIconPick");
  const catSuperIconMark = document.getElementById("catSuperIconMark");

  const appType = document.getElementById("appType");
  const appTypeToggleBtn = document.getElementById("appTypeToggleBtn");
  const appTypeToggleLabel = document.getElementById("appTypeToggleLabel");
  const appHotkeyInput = document.getElementById("appHotkey");
  const appHotkeyCapture = document.getElementById("appHotkeyCapture");
  const appHotkeyClear = document.getElementById("appHotkeyClear");
  const appCategory = document.getElementById("appCategory");
  const appCategoryButton = document.getElementById("appCategoryButton");
  const appCategoryLabel = document.getElementById("appCategoryLabel");
  const appCategoryMenu = document.getElementById("appCategoryMenu");
  const launchLabel = document.getElementById("launchLabel");
  const launchHelp = document.getElementById("launchHelp");
  const launchField = document.getElementById("launchField");
  const scanField = document.getElementById("scanField");
  const scanSelect = document.getElementById("scanSelect");
  const scanSelectButton = document.getElementById("scanSelectButton");
  const scanSelectLabel = document.getElementById("scanSelectLabel");
  const scanSelectMenu = document.getElementById("scanSelectMenu");
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
    setAttr("#accentCustomClose", "aria-label", "close_aria");
    setAttr("#voiceSettingsClose", "aria-label", "close_aria");
    setAttr("#catManageClose", "aria-label", "close_aria");
    setAttr("#confirmClose", "aria-label", "close_aria");
    setAttr("#scanRefresh", "title", "modal_scan_refresh");
    setAttr("#scanRefresh", "aria-label", "modal_scan_refresh");
    setAttr("#iconRemove", "aria-label", "modal_icon_remove");
    setAttr("#iconUploadBtn", "aria-label", "modal_icon_upload");
    setAttr("#iconRemove", "data-tip", "modal_icon_remove");
    setAttr("#iconUploadBtn", "data-tip", "modal_icon_upload_tip");
    document.querySelector("#iconRemove")?.removeAttribute("title");
    document.querySelector("#iconUploadBtn")?.removeAttribute("title");

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
    setText("#settingsOverlay [data-i18n='settings_accent_custom']", "settings_accent_custom");
    setText("#settingsOverlay [data-i18n='settings_accent_brightness']", "settings_accent_brightness");
    setAttr("#accentCustomTrigger", "aria-label", "settings_accent_custom");
    setAttr("#accentCustomTrigger", "title", "settings_accent_custom");
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

    setAttr("#clipboardModeCountBtn", "aria-label", "settings_clip_count");
    setAttr("#clipboardModeTimeBtn", "aria-label", "settings_clip_time");
    setAttr("#clipboardModeCountBtn", "data-tip", "settings_clip_count");
    setAttr("#clipboardModeTimeBtn", "data-tip", "settings_clip_time");
    document.querySelector("#clipboardModeCountBtn")?.removeAttribute("title");
    document.querySelector("#clipboardModeTimeBtn")?.removeAttribute("title");
    setText("#clipboardTimeCycle option[value='4']", "settings_hours_4");
    setText("#clipboardTimeCycle option[value='8']", "settings_hours_8");
    setText("#clipboardTimeCycle option[value='24']", "settings_hours_24");
    setText("#clipboardTimeCycle option[value='48']", "settings_hours_48");
    updateVoiceActivationStatusLabel();
    const defaultMicOpt = document.querySelector("#voiceMicSelect option[value='']");
    if (defaultMicOpt) defaultMicOpt.textContent = t("settings_voice_default_mic");
    setAttr("#voiceModeBtn", "aria-label", "settings_voice_voice");
    updateVoiceModeButton(voiceUiChoice);

    setText("#modalOverlay [data-i18n='modal_icon_optional']", "modal_icon_optional");
    setText("#modalOverlay [data-i18n='modal_icon_auto']", "modal_icon_auto");
    setText("#modalOverlay [data-i18n='modal_icon_custom_help']", "modal_icon_custom_help");
    setHtml("#modalOverlay [data-i18n='modal_name_label']", "modal_name_label");
    setPh("#appName", "modal_name_placeholder");
    setText("#modalOverlay [data-i18n='modal_type_label']", "modal_type_label");
    setText("#appType option[value='web']", "modal_type_web");
    setText("#appType option[value='scan']", "modal_type_scan");
    setText("#modalOverlay [data-i18n='modal_category_label']", "modal_category_label");
    setHtml("#launchLabel", "modal_url_label");
    setPh("#appUrl", "modal_url_placeholder");
    setText("#launchHelp", "modal_url_example");
    setText("#modalOverlay [data-i18n='modal_found_apps']", "modal_found_apps");
    setText("#modalOverlay [data-i18n='modal_scan_help']", "modal_scan_help");
    setText("#modalOverlay [data-i18n='modal_app_hotkey_label']", "modal_app_hotkey_label");
    setPh("#appHotkey", "modal_app_hotkey_placeholder");
    setAttr("#appHotkeyClear", "aria-label", "modal_app_hotkey_clear");
    setAttr("#appHotkeyClear", "data-tip", "modal_app_hotkey_clear");
    if (!capturingAppHotkey) setText("#appHotkeyCapture", "settings_capture");

    setText("#catManageOverlay [data-i18n='cat_new_label']", "cat_new_label");
    setPh("#catManageInput", "cat_new_placeholder");
    setText("#catManageOverlay [data-i18n='cat_manage_help']", "cat_manage_help");
    setText("#catManageOverlay [data-i18n='cat_existing_label']", "cat_existing_label");
    setText("#catKindSub", "cat_kind_sub");
    setText("#catKindSuper", "cat_kind_super");
    setText("#superIconTitle", "super_icon_title");
    setPh("#superIconSearch", "super_icon_search_placeholder");
    setText("#superIconEmpty", "super_icon_empty");
    setText("#superIconUploadBtn", "super_icon_upload");
    setText("#superIconSave", "super_icon_use");
    document.querySelectorAll(".cat-icon-pick .cat-icon-text").forEach((el) => {
      el.textContent = t("category_icon_btn");
    });
    syncAppTypeToggleUi();
    syncAppCategoryUi();
    syncScanSelectUi();
    updateCatManageModeUi();
  }

  let editingId = null;

  let scanApps = [];
  let scanPrefillValue = "";
  let scanPrefillLabel = "";
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

  function syncScanSelectUi(){
    if (!scanSelect || !scanSelectLabel) return;
    const selected = scanSelect.selectedOptions?.[0];
    const text = (selected?.textContent || "").trim();
    scanSelectLabel.textContent = text || t("scan_select_placeholder");
  }

  let scanTypeaheadQuery = "";
  let scanTypeaheadTimer = 0;

  function resetScanTypeahead(){
    scanTypeaheadQuery = "";
    if (scanTypeaheadTimer){
      clearTimeout(scanTypeaheadTimer);
      scanTypeaheadTimer = 0;
    }
  }

  function normalizeTypeaheadText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function selectScanOptionByValue(value, closeMenu = false){
    if (!scanSelect) return;
    scanSelect.value = value || "";
    applyScanSelectionIcon();
    if (scanSelectMenu){
      let selectedEl = null;
      scanSelectMenu.querySelectorAll(".category-select-item").forEach((el) => {
        const active = el.dataset.value === String(value || "");
        if (active) selectedEl = el;
        el.classList.toggle("selected", active);
        el.setAttribute("aria-selected", active ? "true" : "false");
      });
      selectedEl?.scrollIntoView({ block: "nearest" });
    }
    if (closeMenu) closeScanSelectMenu();
  }

  function handleScanTypeaheadKey(e){
    if (!scanApps.length || !scanSelect || scanSelect.disabled) return;
    if (e.key === "Escape"){
      resetScanTypeahead();
      closeScanSelectMenu();
      return;
    }
    if (e.key === "Backspace"){
      e.preventDefault();
      e.stopPropagation();
      scanTypeaheadQuery = scanTypeaheadQuery.slice(0, -1);
      if (!scanTypeaheadQuery){
        selectScanOptionByValue("", false);
        return;
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey){
      e.preventDefault();
      e.stopPropagation();
      if (scanSelectMenu?.classList.contains("hidden")) openScanSelectMenu();
      scanTypeaheadQuery += e.key;
    } else {
      return;
    }
    if (scanTypeaheadTimer) clearTimeout(scanTypeaheadTimer);
    scanTypeaheadTimer = setTimeout(() => { scanTypeaheadQuery = ""; }, 900);

    const query = normalizeTypeaheadText(scanTypeaheadQuery);
    if (!query) return;

    const starts = scanApps.find((app) =>
      normalizeTypeaheadText(app?.name || app?.title || "").startsWith(query)
    );
    const contains = starts || scanApps.find((app) =>
      normalizeTypeaheadText(app?.name || app?.title || "").includes(query)
    );
    if (!contains) return;

    const value = contains.launch || contains.path || "";
    if (!value) return;
    selectScanOptionByValue(value, false);
  }

  function positionDropdownMenu(menuEl, buttonEl){
    if (!menuEl || !buttonEl || !buttonEl.parentElement) return;
    const wrap = buttonEl.parentElement;
    const rect = buttonEl.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight || 0;
    const margin = 10;
    const below = Math.max(0, viewH - rect.bottom - margin);
    const above = Math.max(0, rect.top - margin);
    const isScanMenu = menuEl === scanSelectMenu;
    let openUp = above > (below + 24);
    if (isScanMenu){
      openUp = above >= 180 || above > below;
    }
    wrap.classList.toggle("open-up", openUp);
    const room = openUp ? above : below;
    const max = Math.max(160, Math.min(440, room - 8));
    menuEl.style.maxHeight = `${max}px`;
  }

  function closeScanSelectMenu(){
    if (!scanSelectMenu || !scanSelectButton || !scanSelectButton.parentElement) return;
    scanSelectMenu.classList.add("hidden");
    scanSelectButton.setAttribute("aria-expanded", "false");
    scanSelectButton.parentElement.classList.remove("open");
    scanSelectButton.parentElement.classList.remove("open-up");
    scanSelectMenu.style.maxHeight = "";
    resetScanTypeahead();
  }

  function openScanSelectMenu(){
    if (!scanSelectMenu || !scanSelectButton || !scanSelectButton.parentElement) return;
    if (scanSelect.disabled) return;
    scanSelectMenu.classList.remove("hidden");
    scanSelectButton.setAttribute("aria-expanded", "true");
    scanSelectButton.parentElement.classList.add("open");
    positionDropdownMenu(scanSelectMenu, scanSelectButton);
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
      if (scanSelectMenu){
        scanSelectMenu.innerHTML = "";
        closeScanSelectMenu();
      }
      syncScanSelectUi();
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
    if (scanSelectMenu){
      scanSelectMenu.innerHTML = "";
    }
    if (!scanApps.length){
      if (scanPrefillValue){
        const prefillOpt = document.createElement("option");
        prefillOpt.value = scanPrefillValue;
        prefillOpt.textContent = scanPrefillLabel || scanPrefillValue;
        scanSelect.appendChild(prefillOpt);
        if (scanSelectMenu){
          const prefillItem = document.createElement("button");
          prefillItem.type = "button";
          prefillItem.className = "category-select-item";
          prefillItem.dataset.value = scanPrefillValue;
          prefillItem.textContent = prefillOpt.textContent;
          prefillItem.setAttribute("aria-selected", "false");
          prefillItem.addEventListener("click", () => {
            selectScanOptionByValue(scanPrefillValue, true);
          });
          scanSelectMenu.appendChild(prefillItem);
        }
        scanSelect.disabled = false;
        selectScanOptionByValue(scanPrefillValue, false);
      } else {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = t("scan_none");
        scanSelect.appendChild(opt);
        scanSelect.disabled = true;
        syncScanSelectUi();
      }
      closeScanSelectMenu();
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

      if (scanSelectMenu){
        const item = document.createElement("button");
        item.type = "button";
        item.className = "category-select-item";
        item.dataset.value = opt.value;
        item.textContent = opt.textContent;
        item.setAttribute("aria-selected", "false");
        item.addEventListener("click", () => {
          selectScanOptionByValue(opt.value, true);
        });
        scanSelectMenu.appendChild(item);
      }
    });
    if (scanPrefillValue){
      const exists = Array.from(scanSelect.options).some((opt) => opt.value === scanPrefillValue);
      if (!exists){
        const fallbackOpt = document.createElement("option");
        fallbackOpt.value = scanPrefillValue;
        fallbackOpt.textContent = scanPrefillLabel || scanPrefillValue;
        scanSelect.appendChild(fallbackOpt);
        if (scanSelectMenu){
          const fallbackItem = document.createElement("button");
          fallbackItem.type = "button";
          fallbackItem.className = "category-select-item";
          fallbackItem.dataset.value = scanPrefillValue;
          fallbackItem.textContent = fallbackOpt.textContent;
          fallbackItem.setAttribute("aria-selected", "false");
          fallbackItem.addEventListener("click", () => {
            selectScanOptionByValue(scanPrefillValue, true);
          });
          scanSelectMenu.appendChild(fallbackItem);
        }
      }
      selectScanOptionByValue(scanPrefillValue, false);
      return;
    }
    applyScanSelectionIcon();
    syncScanSelectUi();
  }

  function applyScanSelectionIcon(){
    if (!scanSelect) return;
    const selected = scanSelect.value || "";
    const app = scanApps.find(a => (a.launch || a.path || "") === selected);
    if (iconState?.type === "custom"){
      syncScanSelectUi();
      return;
    }
    if (scanSelectMenu){
      scanSelectMenu.querySelectorAll(".category-select-item").forEach((el) => {
        const active = el.dataset.value === selected;
        el.classList.toggle("selected", active);
        el.setAttribute("aria-selected", active ? "true" : "false");
      });
    }
    syncScanSelectUi();
    if (app?.icon){
      setIconCustom(app.icon);
    } else {
      setIconNone();
    }
  }

  function openModal() {
    if (!editingId && appCategory){
      appCategory.value = "";
    }
    if (!editingId){
      scanPrefillValue = "";
      scanPrefillLabel = "";
    }
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    stopAppHotkeyCapture();
    closeAppCategoryMenu();
    closeScanSelectMenu();
    syncAppCategoryUi();
    syncScanSelectUi();
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
  let railAutoCollapsedBySidePanel = false;
  let sidePanelSwitching = false;

  function ensureRailCollapsedForSidePanel(){
    if (catRailCollapsed) return;
    railAutoCollapsedBySidePanel = true;
    setCategoryRailCollapsed(true);
  }

  function restoreRailIfSidePanelsClosed(){
    if (sidePanelSwitching) return;
    const notesOpen = Boolean(notesPanel?.classList.contains("show"));
    const clipboardOpen = Boolean(clipboardPanel?.classList.contains("show"));
    if (notesOpen || clipboardOpen) return;
    if (!railAutoCollapsedBySidePanel) return;
    railAutoCollapsedBySidePanel = false;
    setCategoryRailCollapsed(false);
  }

  function openNotes(){
    if (!notesPanel) return;
    sidePanelSwitching = true;
    closeClipboard();
    sidePanelSwitching = false;
    notesPanel.classList.add("show");
    notesPanel.setAttribute("aria-hidden", "false");
    if (notesToggle) notesToggle.setAttribute("aria-expanded", "true");
    ensureRailCollapsedForSidePanel();
    syncSidePanelsLayout();
    setTimeout(() => notesText?.focus(), 0);
  }

  function closeNotes(){
    if (!notesPanel) return;
    notesPanel.classList.remove("show");
    notesPanel.setAttribute("aria-hidden", "true");
    if (notesToggle) notesToggle.setAttribute("aria-expanded", "false");
    syncSidePanelsLayout();
    restoreRailIfSidePanelsClosed();
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
    if (clipboardModeCountBtn){
      const active = cfg.mode === "count";
      clipboardModeCountBtn.classList.toggle("active", active);
      clipboardModeCountBtn.setAttribute("aria-pressed", active ? "true" : "false");
    }
    if (clipboardModeTimeBtn){
      const active = cfg.mode === "time";
      clipboardModeTimeBtn.classList.toggle("active", active);
      clipboardModeTimeBtn.setAttribute("aria-pressed", active ? "true" : "false");
    }
    if (clipboardTimeButtons){
      clipboardTimeButtons.querySelectorAll(".clipboard-option-btn").forEach((btn) => {
        const active = String(btn.dataset.value || "") === String(cfg.hours);
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
    if (clipboardCountButtons){
      clipboardCountButtons.querySelectorAll(".clipboard-option-btn").forEach((btn) => {
        const active = String(btn.dataset.value || "") === String(cfg.maxItems);
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
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
    sidePanelSwitching = true;
    closeNotes();
    sidePanelSwitching = false;
    clipboardPanel.classList.add("show");
    clipboardPanel.setAttribute("aria-hidden", "false");
    if (clipboardToggle) clipboardToggle.setAttribute("aria-expanded", "true");
    ensureRailCollapsedForSidePanel();
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
    restoreRailIfSidePanelsClosed();
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

  function onClipboardRetentionModeChanged(){
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "count",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "25"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  }

  clipboardRetentionMode?.addEventListener("change", onClipboardRetentionModeChanged);
  clipboardModeCountBtn?.addEventListener("click", () => {
    if (clipboardRetentionMode) clipboardRetentionMode.value = "count";
    onClipboardRetentionModeChanged();
  });
  clipboardModeTimeBtn?.addEventListener("click", () => {
    if (clipboardRetentionMode) clipboardRetentionMode.value = "time";
    onClipboardRetentionModeChanged();
  });

  clipboardTimeButtons?.addEventListener("click", (e) => {
    const btn = e.target.closest(".clipboard-option-btn");
    if (!btn) return;
    if (clipboardTimeCycle) clipboardTimeCycle.value = String(btn.dataset.value || "24");
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "time",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "25"
    });
    syncClipboardSettingsUI();
    updateClipboardModeBadge();
    persistAndRenderClipboard();
  });

  clipboardCountButtons?.addEventListener("click", (e) => {
    const btn = e.target.closest(".clipboard-option-btn");
    if (!btn) return;
    if (clipboardMaxItems) clipboardMaxItems.value = String(btn.dataset.value || "25");
    saveClipboardRetentionSettings({
      mode: clipboardRetentionMode?.value || "count",
      hours: clipboardTimeCycle?.value || "24",
      maxItems: clipboardMaxItems?.value || "25"
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
    const t = "dark";
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
  const UI_ACCENTS = new Set(["purple", "blue", "green", "pink", "red"]);
  const ACCENT_CUSTOM_BASE_KEY = "kc_accent_custom_base";
  const ACCENT_CUSTOM_BRIGHTNESS_KEY = "kc_accent_custom_brightness";
  let accentWheelCtx = null;
  let accentBaseRgb = { r: 124, g: 58, b: 237 };
  let accentBrightnessValue = 100;

  function clampChannel(value){
    return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
  }

  function parseRgbTriplet(value){
    const m = String(value || "").trim().match(/^(\d{1,3}),(\d{1,3}),(\d{1,3})$/);
    if (!m) return null;
    return {
      r: clampChannel(m[1]),
      g: clampChannel(m[2]),
      b: clampChannel(m[3])
    };
  }

  function rgbToTriplet(rgb){
    return `${clampChannel(rgb?.r)},${clampChannel(rgb?.g)},${clampChannel(rgb?.b)}`;
  }

  function setAccentVars(rgb, rgb2){
    document.documentElement.style.setProperty("--accent-rgb", rgb);
    document.documentElement.style.setProperty("--accent2-rgb", rgb2);
  }

  function computeAccentFromBase(base, brightness){
    const factor = Math.max(0.4, Math.min(1.4, Number(brightness || 100) / 100));
    const r = clampChannel(base.r * factor);
    const g = clampChannel(base.g * factor);
    const b = clampChannel(base.b * factor);
    const d = 0.82;
    return {
      rgb: `${r},${g},${b}`,
      rgb2: `${clampChannel(r * d)},${clampChannel(g * d)},${clampChannel(b * d)}`
    };
  }

  function loadCustomAccentState(){
    const savedBase = parseRgbTriplet(localStorage.getItem(ACCENT_CUSTOM_BASE_KEY));
    if (savedBase) accentBaseRgb = savedBase;
    const savedBrightness = parseInt(localStorage.getItem(ACCENT_CUSTOM_BRIGHTNESS_KEY) || "100", 10);
    accentBrightnessValue = Number.isFinite(savedBrightness) ? Math.max(40, Math.min(140, savedBrightness)) : 100;
    if (accentBrightness) accentBrightness.value = String(accentBrightnessValue);
  }

  function updateAccentSelectionUi(activeKey){
    if (accentRow){
      accentRow.querySelectorAll(".accent-btn").forEach((btn) => {
        btn.classList.toggle("selected", btn.dataset.accent === activeKey);
      });
    }
    if (accentCustomTrigger){
      accentCustomTrigger.classList.toggle("selected", activeKey === "custom");
      accentCustomTrigger.setAttribute("aria-pressed", activeKey === "custom" ? "true" : "false");
    }
    if (accentCustom){
      accentCustom.classList.toggle("selected", activeKey === "custom");
    }
  }

  function applyCustomAccent(persist = true){
    const tone = computeAccentFromBase(accentBaseRgb, accentBrightnessValue);
    setAccentVars(tone.rgb, tone.rgb2);
    updateAccentSelectionUi("custom");
    if (!persist) return;
    localStorage.setItem("kc_accent", "custom");
    localStorage.setItem(ACCENT_CUSTOM_BASE_KEY, rgbToTriplet(accentBaseRgb));
    localStorage.setItem(ACCENT_CUSTOM_BRIGHTNESS_KEY, String(accentBrightnessValue));
  }

  function applyAccent(name){
    if (name === "custom"){
      applyCustomAccent(true);
      return;
    }
    const key = UI_ACCENTS.has(name) && ACCENTS[name] ? name : "purple";
    const val = ACCENTS[key];
    setAccentVars(val.rgb, val.rgb2);
    localStorage.setItem("kc_accent", key);
    updateAccentSelectionUi(key);
  }

  // Theme init
  applyTheme("dark");
  if (themeToggle) themeToggle.checked = false;
  loadCustomAccentState();
  const savedAccent = localStorage.getItem("kc_accent") || "purple";
  applyAccent(savedAccent);

  const BG_MODES = ["theme", "mono", "duo", "custom"];
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
  const VOICE_MODE_ORDER = ["__none__", "__female__", "__male__"];
  const DEFAULT_WAKE_INPUT = "Kontrollzentrum, Control Center";
  let voiceUiChoice = "__none__";

  function normalizeWakeMode(){
    return "custom";
  }

  function normalizeVoiceMode(value){
    const normalized = sanitizeVoiceChoice(value);
    return VOICE_MODE_ORDER.includes(normalized) ? normalized : "__none__";
  }

  function nextVoiceMode(value){
    const current = normalizeVoiceMode(value);
    const idx = VOICE_MODE_ORDER.indexOf(current);
    const nextIdx = (idx + 1) % VOICE_MODE_ORDER.length;
    return VOICE_MODE_ORDER[nextIdx];
  }

  function getVoiceModeIconGlyph(value){
    const mode = normalizeVoiceMode(value);
    if (mode === "__female__") return "🙍‍♀️";
    if (mode === "__male__") return "🙍‍♂️";
    return "🎵";
  }

  function voiceModeLabelKey(value){
    const mode = normalizeVoiceMode(value);
    if (mode === "__female__") return "settings_voice_female";
    if (mode === "__male__") return "settings_voice_male";
    return "settings_voice_none";
  }

  function updateVoiceModeButton(value){
    voiceUiChoice = normalizeVoiceMode(value);
    if (voiceModeIcon) voiceModeIcon.textContent = getVoiceModeIconGlyph(voiceUiChoice);
    if (voiceModeBtn){
      const label = t(voiceModeLabelKey(voiceUiChoice));
      voiceModeBtn.dataset.mode = voiceUiChoice;
      voiceModeBtn.setAttribute("data-tip", label);
      voiceModeBtn.removeAttribute("title");
      voiceModeBtn.setAttribute("aria-label", label);
    }
  }

  function loadVoiceSettings(){
    const rawEnabled = (localStorage.getItem(VOICE_ENABLED_KEY) || "1").toLowerCase();
    const enabled = rawEnabled !== "0" && rawEnabled !== "false" && rawEnabled !== "off";
    const micId = localStorage.getItem(VOICE_MIC_KEY) || "";
    const voiceName = sanitizeVoiceChoice(localStorage.getItem(VOICE_NAME_KEY) || "");
    const toneId = "soft_low";
    const wakePhrase = localStorage.getItem(VOICE_WAKE_KEY) || DEFAULT_WAKE_INPUT;
    const wakeMode = normalizeWakeMode();
    return { enabled, micId, voiceName, toneId, wakePhrase, wakeMode };
  }

  function saveVoiceSettings({ enabled, micId, voiceName, toneId, wakePhrase, wakeMode }){
    const mode = normalizeWakeMode(wakeMode);
    localStorage.setItem(VOICE_ENABLED_KEY, enabled ? "1" : "0");
    localStorage.setItem(VOICE_MIC_KEY, micId || "");
    localStorage.setItem(VOICE_NAME_KEY, sanitizeVoiceChoice(voiceName || ""));
    localStorage.setItem(VOICE_TONE_KEY, "soft_low");
    localStorage.setItem(VOICE_WAKE_MODE_KEY, mode);
    const normalizedWake = String(wakePhrase || "").trim() || DEFAULT_WAKE_INPUT;
    localStorage.setItem(VOICE_WAKE_KEY, normalizedWake);
  }

  function getVoiceSettingsFromUI(){
    const enabled = Boolean(voiceActivationToggle?.checked);
    const micId = String(voiceMicSelect?.value || "");
    const voiceName = normalizeVoiceMode(voiceUiChoice);
    const toneId = "soft_low";
    const wakeMode = normalizeWakeMode();
    const wakePhrase = String(voiceWakeInput?.value || "").trim();
    return { enabled, micId, voiceName, toneId, wakePhrase, wakeMode };
  }

  function updateWakeModeUI(){
    if (voiceWakeModeSelect) voiceWakeModeSelect.value = "custom";
    if (voiceWakeCustomWrap) voiceWakeCustomWrap.classList.remove("hidden");
  }

  function updateVoiceActivationStatusLabel(){
    const enabled = Boolean(voiceActivationToggle?.checked);
    if (voiceActivationOn){
      voiceActivationOn.classList.toggle("active", enabled);
      voiceActivationOn.setAttribute("aria-pressed", enabled ? "true" : "false");
    }
    if (voiceActivationOff){
      voiceActivationOff.classList.toggle("active", !enabled);
      voiceActivationOff.setAttribute("aria-pressed", enabled ? "false" : "true");
    }
  }

  function applyVoiceSettingsToUI(settings){
    if (voiceActivationToggle) voiceActivationToggle.checked = Boolean(settings?.enabled);
    if (voiceMicWrap) voiceMicWrap.classList.toggle("hidden", !Boolean(settings?.enabled));
    if (voiceToneSelect){
      const toneId = VOICE_TONES.has(settings?.toneId) ? settings.toneId : "soft_low";
      voiceToneSelect.value = toneId;
    }
    updateWakeModeUI();
    if (voiceWakeInput){
      voiceWakeInput.value = String(settings?.wakePhrase || DEFAULT_WAKE_INPUT);
    }
    updateVoiceModeButton(settings?.voiceName || "__none__");
    updateVoiceActivationStatusLabel();
  }

  function refreshVoiceList(preferredVoiceName = ""){
    updateVoiceModeButton(preferredVoiceName || "__none__");
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
    stopAppHotkeyCapture();
    closeAppCategoryMenu();
    closeScanSelectMenu();
    scanPrefillValue = "";
    scanPrefillLabel = "";
    editingId = null;
    if (modalTitle) modalTitle.textContent = t("modal_add_title");
    if (submitBtn) submitBtn.textContent = t("add");
  }

  async function openSettings(){
    if (!settingsOverlay) return;
    applyModalI18n();
    const saved = localStorage.getItem("kc_hotkey") || "";
    if (hotkeyInput) hotkeyInput.value = saved;
    if (themeToggle) themeToggle.checked = false;
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
    setTimeout(() => (voiceActivationOn || voiceActivationOff || voiceActivationToggle)?.focus?.(), 0);
  }

  function closeSettings(){
    if (!settingsOverlay) return;
    settingsOverlay.classList.remove("show");
    settingsOverlay.setAttribute("aria-hidden", "true");
    closeAccentCustomPopup();
    stopHotkeyCapture();
  }

  function closeVoiceSettings(){
    if (!voiceSettingsOverlay) return;
    voiceSettingsOverlay.classList.remove("show");
    voiceSettingsOverlay.setAttribute("aria-hidden", "true");
  }

  function updateCatManageModeUi(){
    const isSuper = catManageMode === "super";
    [catKindSub, catKindSuper].forEach((btn) => {
      if (!btn) return;
      const active = btn.dataset.kind === catManageMode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (catManageInput){
      catManageInput.placeholder = isSuper ? t("cat_new_placeholder_super") : t("cat_new_placeholder");
    }
    if (catManageHelp){
      catManageHelp.textContent = isSuper ? t("cat_manage_help_super") : t("cat_manage_help");
    }
    if (catSuperIconPick){
      catSuperIconPick.classList.remove("hidden");
    }
    updateCatSuperIconButton();
  }

  function updateCatSuperIconButton(){
    if (!catSuperIconMark) return;
    const draftIcon = catManageMode === "super" ? draftSuperIcon : draftCategoryIcon;
    if (draftIcon?.type === "emoji"){
      catSuperIconMark.textContent = draftIcon.value;
      return;
    }
    if (draftIcon?.type === "image"){
      catSuperIconMark.textContent = "IMG";
      return;
    }
    const typed = normalizeCategory(catManageInput?.value);
    catSuperIconMark.textContent = (typed ? typed.charAt(0).toUpperCase() : "?");
  }

  function setCatManageMode(nextMode){
    catManageMode = nextMode === "super" ? "super" : "sub";
    updateCatManageModeUi();
    renderCategoryManager();
  }

  function getSuperIcon(superName){
    const key = normalizeSuperName(superName);
    const existing = superIconMap[key];
    if (existing && existing.type === "emoji" && existing.value) return existing;
    if (existing && existing.type === "image" && existing.value) return existing;
    return null;
  }

  function getCategoryIcon(categoryName){
    const key = normalizeSuperName(categoryName);
    const existing = categoryIconMap[key];
    if (existing && existing.type === "emoji" && existing.value) return existing;
    if (existing && existing.type === "image" && existing.value) return existing;
    return null;
  }

  function updateSuperIconPreview(){
    if (!superIconPreview) return;
    superIconPreview.innerHTML = "";
    if (!pendingSuperIcon){
      superIconPreview.textContent = "?";
      return;
    }
    if (pendingSuperIcon.type === "image"){
      const img = document.createElement("img");
      img.src = pendingSuperIcon.value;
      img.alt = "";
      superIconPreview.appendChild(img);
      return;
    }
    superIconPreview.textContent = pendingSuperIcon.value;
  }

  function normalizeIconSearchValue(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function renderSuperIconGrid(){
    if (!superIconGrid) return;
    superIconGrid.innerHTML = "";
    const query = normalizeIconSearchValue(superIconQuery);
    const filtered = SUPER_ICON_PRESETS.filter((item) => {
      if (!query) return true;
      if (normalizeIconSearchValue(item.emoji).includes(query)) return true;
      return (item.tags || []).some((tag) => normalizeIconSearchValue(tag).includes(query));
    });
    filtered.forEach((item) => {
      const emoji = item.emoji;
      const btn = document.createElement("button");
      btn.className = "super-icon-item";
      btn.type = "button";
      btn.textContent = emoji;
      const active = pendingSuperIcon?.type === "emoji" && pendingSuperIcon?.value === emoji;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.addEventListener("click", () => {
        pendingSuperIcon = { type: "emoji", value: emoji };
        updateSuperIconPreview();
        renderSuperIconGrid();
        if (superIconSave) superIconSave.disabled = false;
      });
      superIconGrid.appendChild(btn);
    });
    if (superIconEmpty){
      superIconEmpty.classList.toggle("hidden", filtered.length > 0);
    }
  }

  function openSuperIconPicker(superName, mode = "edit", target = "super"){
    if (!superIconOverlay) return;
    pendingSuperTarget = target === "category" ? "category" : "super";
    pendingSuperMode = mode === "create" ? "create" : "edit";
    pendingSuperName = normalizeCategory(superName || catManageInput?.value || "");
    if (pendingSuperTarget === "category"){
      pendingSuperIcon = pendingSuperMode === "create"
        ? (draftCategoryIcon ? { ...draftCategoryIcon } : null)
        : getCategoryIcon(pendingSuperName);
    } else {
      pendingSuperIcon = pendingSuperMode === "create"
        ? (draftSuperIcon ? { ...draftSuperIcon } : null)
        : getSuperIcon(pendingSuperName);
    }
    if (superIconForLabel){
      superIconForLabel.textContent = pendingSuperName || t(pendingSuperTarget === "category" ? "cat_kind_sub" : "cat_kind_super");
    }
    superIconQuery = "";
    if (superIconSearch) superIconSearch.value = "";
    updateSuperIconPreview();
    renderSuperIconGrid();
    if (superIconUpload) superIconUpload.value = "";
    if (superIconSave) superIconSave.disabled = !pendingSuperIcon;
    superIconOverlay.classList.add("show");
    superIconOverlay.setAttribute("aria-hidden", "false");
  }
function closeSuperIconPicker(){
    if (!superIconOverlay) return;
    superIconOverlay.classList.remove("show");
    superIconOverlay.setAttribute("aria-hidden", "true");
    pendingSuperName = "";
    pendingSuperIcon = null;
    pendingSuperTarget = "super";
    superIconQuery = "";
    if (superIconSearch) superIconSearch.value = "";
  }

  function applySuperCategoryWithIcon(){
    const superName = normalizeCategory(pendingSuperName);
    if (pendingSuperTarget === "category"){
      if (pendingSuperMode === "create"){
        draftCategoryIcon = pendingSuperIcon ? { ...pendingSuperIcon } : null;
        updateCatSuperIconButton();
        closeSuperIconPicker();
        catManageInput?.focus();
        return;
      }
      if (!superName || !pendingSuperIcon) return;
      const catKey = normalizeSuperName(superName);
      categoryIconMap[catKey] = { ...pendingSuperIcon };
      saveCategoryIconMap(categoryIconMap);
      renderCategories();
      renderCategoryManager();
      closeSuperIconPicker();
      return;
    }
    if (pendingSuperMode === "create"){
      draftSuperIcon = pendingSuperIcon ? { ...pendingSuperIcon } : null;
      updateCatSuperIconButton();
      closeSuperIconPicker();
      catManageInput?.focus();
      return;
    }
    if (!superName || !pendingSuperIcon) return;
    const superKey = normalizeSuperName(superName);
    superIconMap[superKey] = { ...pendingSuperIcon };
    saveSuperIconMap(superIconMap);
    renderCategories();
    renderCategoryManager();
    closeSuperIconPicker();
  }
function openCatManage(){
    if (!catManageOverlay) return;
    applyModalI18n();
    draftSuperIcon = null;
    draftCategoryIcon = null;
    setCatManageMode("sub");
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
    cancelLabel = t("cancel"),
    options = {}
  ){
    if (!confirmOverlay || !confirmText) return;
    const singleButton = Boolean(options?.singleButton);
    confirmText.textContent = message || t("confirm_delete_default_message");
    if (confirmOk) confirmOk.textContent = okLabel || t("confirm_delete_default_label");
    if (confirmCancel){
      confirmCancel.textContent = cancelLabel || t("cancel");
      confirmCancel.classList.toggle("hidden", singleButton);
    }
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
    if (confirmCancel){
      confirmCancel.textContent = t("cancel");
      confirmCancel.classList.remove("hidden");
    }
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
  superIconClose?.addEventListener("click", closeSuperIconPicker);
  superIconCancel?.addEventListener("click", closeSuperIconPicker);
  superIconSave?.addEventListener("click", applySuperCategoryWithIcon);
  superIconSearch?.addEventListener("input", () => {
    superIconQuery = superIconSearch.value || "";
    renderSuperIconGrid();
  });
  superIconUploadBtn?.addEventListener("click", () => superIconUpload?.click());
  superIconUpload?.addEventListener("change", async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      if (!/^data:image\//i.test(result)) return;
      pendingSuperIcon = { type: "image", value: result };
      updateSuperIconPreview();
      renderSuperIconGrid();
      if (superIconSave) superIconSave.disabled = false;
    };
    reader.readAsDataURL(file);
  });

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
  superIconOverlay?.addEventListener("click", (e) => {
    if (e.target === superIconOverlay) closeSuperIconPicker();
  });
  document.addEventListener("click", (e) => {
    if (appCategoryMenu && appCategoryButton){
      const inMenu = appCategoryMenu.contains(e.target);
      const inBtn = appCategoryButton.contains(e.target);
      if (!inMenu && !inBtn) closeAppCategoryMenu();
    }
    if (scanSelectMenu && scanSelectButton){
      const inMenu = scanSelectMenu.contains(e.target);
      const inBtn = scanSelectButton.contains(e.target);
      if (!inMenu && !inBtn) closeScanSelectMenu();
    }
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
    if (e.key === "Escape" && appCategoryMenu && !appCategoryMenu.classList.contains("hidden")) {
      closeAppCategoryMenu();
      return;
    }
    if (e.key === "Escape" && scanSelectMenu && !scanSelectMenu.classList.contains("hidden")) {
      closeScanSelectMenu();
      return;
    }
    if (e.key === "Escape" && accentCustomOverlay?.classList.contains("show")) {
      closeAccentCustomPopup();
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
    if (e.key === "Escape" && superIconOverlay?.classList.contains("show")) {
      closeSuperIconPicker();
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

  function normalizeShortcutText(value){
    return String(value || "").replace(/\s+/g, "").toLowerCase();
  }

  function isTypingTarget(target){
    const el = target instanceof Element ? target : null;
    if (!el) return false;
    if (el.closest("input, textarea, select")) return true;
    if (el.closest("[contenteditable='true']")) return true;
    return false;
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

  let capturingAppHotkey = false;
  function stopAppHotkeyCapture(){
    if (!capturingAppHotkey) return;
    capturingAppHotkey = false;
    document.removeEventListener("keydown", onAppHotkeyKeydown, true);
    if (appHotkeyCapture) appHotkeyCapture.textContent = t("settings_capture");
  }

  function startAppHotkeyCapture(){
    capturingAppHotkey = true;
    if (appHotkeyCapture) appHotkeyCapture.textContent = t("settings_capture_listen");
    document.addEventListener("keydown", onAppHotkeyKeydown, true);
  }

  function onAppHotkeyKeydown(e){
    if (!capturingAppHotkey) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.key === "Escape"){
      stopAppHotkeyCapture();
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete"){
      if (appHotkeyInput) appHotkeyInput.value = "";
      stopAppHotkeyCapture();
      return;
    }
    const combo = normalizeKey(e);
    if (!combo) return;
    if (appHotkeyInput) appHotkeyInput.value = combo;
    stopAppHotkeyCapture();
  }

  hotkeyCapture?.addEventListener("click", () => {
    if (capturingHotkey) {
      stopHotkeyCapture();
    } else {
      startHotkeyCapture();
    }
  });
  window.addEventListener("resize", () => {
    if (appCategoryMenu && !appCategoryMenu.classList.contains("hidden")) {
      positionDropdownMenu(appCategoryMenu, appCategoryButton);
    }
    if (scanSelectMenu && !scanSelectMenu.classList.contains("hidden")) {
      positionDropdownMenu(scanSelectMenu, scanSelectButton);
    }
  });
  appHotkeyCapture?.addEventListener("click", () => {
    if (capturingAppHotkey){
      stopAppHotkeyCapture();
    } else {
      startAppHotkeyCapture();
    }
  });
  appHotkeyClear?.addEventListener("click", () => {
    stopAppHotkeyCapture();
    if (appHotkeyInput) appHotkeyInput.value = "";
  });

  function onVoiceActivationChange(){
    const enabled = Boolean(voiceActivationToggle?.checked);
    if (voiceMicWrap) voiceMicWrap.classList.toggle("hidden", !enabled);
    updateVoiceActivationStatusLabel();
    if (enabled) refreshVoiceMicList(String(voiceMicSelect?.value || ""), true);
  }

  function showVoiceActivationInfoPopup(){
    openConfirm(
      t("settings_voice_enable_info_message"),
      () => {},
      t("ok"),
      t("settings_voice_enable_info_title"),
      "",
      { singleButton: true }
    );
  }
  function showVoiceMicDeniedPopup(){
    openConfirm(
      t("settings_voice_mic_denied_message"),
      () => {},
      t("ok"),
      t("settings_voice_mic_denied_title"),
      "",
      { singleButton: true }
    );
  }

  voiceActivationToggle?.addEventListener("change", onVoiceActivationChange);
  voiceModeBtn?.addEventListener("click", () => {
    updateVoiceModeButton(nextVoiceMode(voiceUiChoice));
  });
  voiceActivationOff?.addEventListener("click", () => {
    if (voiceActivationToggle) voiceActivationToggle.checked = false;
    onVoiceActivationChange();
  });
  voiceActivationOn?.addEventListener("click", async () => {
    const wasEnabled = Boolean(voiceActivationToggle?.checked);
    if (!wasEnabled){
      const micAllowed = await ensureVoiceMicAccess(true);
      if (!micAllowed){
        if (voiceActivationToggle) voiceActivationToggle.checked = false;
        onVoiceActivationChange();
        showVoiceMicDeniedPopup();
        return;
      }
    }
    if (voiceActivationToggle) voiceActivationToggle.checked = true;
    onVoiceActivationChange();
    if (!wasEnabled) showVoiceActivationInfoPopup();
  });
  voiceWakeModeSelect?.addEventListener("change", () => {
    updateWakeModeUI(voiceWakeModeSelect.value);
  });

  hotkeySave?.addEventListener("click", async () => {
    try{
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
    }finally{
      closeSettings();
    }
  });

  voiceSettingsSave?.addEventListener("click", () => {
    const voiceSettings = getVoiceSettingsFromUI();
    saveVoiceSettings(voiceSettings);
    applyVoiceRuntimeSettings(voiceSettings);
    closeVoiceSettings();
  });

  themeToggle?.addEventListener("change", () => {
    applyTheme("dark");
  });

  function openAccentCustomPopup(){
    if (!accentCustomOverlay) return;
    accentCustomOverlay.classList.remove("hidden");
    accentCustomOverlay.classList.add("show");
    accentCustomOverlay.setAttribute("aria-hidden", "false");
    setAccentWheelThumbFromBase();
  }

  function closeAccentCustomPopup(){
    if (!accentCustomOverlay) return;
    accentCustomOverlay.classList.add("hidden");
    accentCustomOverlay.classList.remove("show");
    accentCustomOverlay.setAttribute("aria-hidden", "true");
  }

  accentRow?.addEventListener("click", (e) => {
    const btn = e.target.closest(".accent-btn");
    if (!btn) return;
    applyAccent(btn.dataset.accent);
  });
  accentCustomTrigger?.addEventListener("click", () => {
    openAccentCustomPopup();
  });
  accentCustomClose?.addEventListener("click", closeAccentCustomPopup);
  accentCustomOverlay?.addEventListener("click", (e) => {
    if (e.target === accentCustomOverlay) closeAccentCustomPopup();
  });

  function drawAccentWheel(){
    if (!accentWheel) return;
    const ctx = accentWheel.getContext("2d");
    if (!ctx) return;
    accentWheelCtx = ctx;
    const w = accentWheel.width;
    const h = accentWheel.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const hue = ctx.createConicGradient(0, cx, cy);
    hue.addColorStop(0, "#ff0000");
    hue.addColorStop(1 / 6, "#ffff00");
    hue.addColorStop(2 / 6, "#00ff00");
    hue.addColorStop(3 / 6, "#00ffff");
    hue.addColorStop(4 / 6, "#0000ff");
    hue.addColorStop(5 / 6, "#ff00ff");
    hue.addColorStop(1, "#ff0000");
    ctx.fillStyle = hue;
    ctx.fillRect(0, 0, w, h);

    const radialWhite = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    radialWhite.addColorStop(0, "rgba(255,255,255,1)");
    radialWhite.addColorStop(0.55, "rgba(255,255,255,0)");
    radialWhite.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = radialWhite;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function setAccentWheelThumb(x, y){
    if (!accentWheelThumb || !accentWheelWrap) return;
    const rect = accentWheelWrap.getBoundingClientRect();
    accentWheelThumb.style.left = `${Math.max(0, Math.min(rect.width, x))}px`;
    accentWheelThumb.style.top = `${Math.max(0, Math.min(rect.height, y))}px`;
  }

  function setAccentWheelThumbFromBase(){
    if (!accentWheelCtx || !accentWheel || !accentWheelWrap) return;
    const w = accentWheel.width;
    const h = accentWheel.height;
    let best = { d: Number.POSITIVE_INFINITY, x: w / 2, y: h / 2 };
    const target = accentBaseRgb;
    const step = 4;
    for (let y = 0; y < h; y += step){
      for (let x = 0; x < w; x += step){
        const data = accentWheelCtx.getImageData(x, y, 1, 1).data;
        if (data[3] === 0) continue;
        const d = Math.abs(data[0] - target.r) + Math.abs(data[1] - target.g) + Math.abs(data[2] - target.b);
        if (d < best.d) best = { d, x, y };
      }
    }
    const rect = accentWheelWrap.getBoundingClientRect();
    const scaleX = rect.width / w;
    const scaleY = rect.height / h;
    setAccentWheelThumb(best.x * scaleX, best.y * scaleY);
  }

  function pickAccentFromWheelEvent(event){
    if (!accentWheel || !accentWheelCtx || !accentWheelWrap) return;
    const wrapRect = accentWheelWrap.getBoundingClientRect();
    const canvasRect = accentWheel.getBoundingClientRect();
    const scaleX = accentWheel.width / canvasRect.width;
    const scaleY = accentWheel.height / canvasRect.height;
    const centerX = canvasRect.left + canvasRect.width / 2;
    const centerY = canvasRect.top + canvasRect.height / 2;
    const maxRadius = canvasRect.width / 2;

    let px = event.clientX;
    let py = event.clientY;
    const dx = px - centerX;
    const dy = py - centerY;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius){
      px = centerX + (dx / dist) * maxRadius;
      py = centerY + (dy / dist) * maxRadius;
    }

    const cx = Math.max(0, Math.min(accentWheel.width - 1, Math.round((px - canvasRect.left) * scaleX)));
    const cy = Math.max(0, Math.min(accentWheel.height - 1, Math.round((py - canvasRect.top) * scaleY)));
    const data = accentWheelCtx.getImageData(cx, cy, 1, 1).data;
    accentBaseRgb = { r: data[0], g: data[1], b: data[2] };
    setAccentWheelThumb(px - wrapRect.left, py - wrapRect.top);
    applyAccent("custom");
  }

  drawAccentWheel();
  setAccentWheelThumbFromBase();

  let accentWheelDragging = false;
  accentWheelWrap?.addEventListener("pointerdown", (e) => {
    accentWheelDragging = true;
    pickAccentFromWheelEvent(e);
  });
  window.addEventListener("pointermove", (e) => {
    if (!accentWheelDragging) return;
    pickAccentFromWheelEvent(e);
  });
  window.addEventListener("pointerup", () => {
    accentWheelDragging = false;
  });

  accentBrightness?.addEventListener("input", () => {
    accentBrightnessValue = Math.max(40, Math.min(140, parseInt(accentBrightness.value || "100", 10) || 100));
    applyAccent("custom");
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
    if (appHotkeyInput) appHotkeyInput.value = String(app.hotkey || "");
    if (app.type === "desktop"){
      scanPrefillValue = String(app.launch || "");
      scanPrefillLabel = String(app.name || app.launch || "");
    } else {
      scanPrefillValue = "";
      scanPrefillLabel = "";
    }
    if (appCategory){
      const preferred = String(app.category || "");
      const hasPreferred = Array.from(appCategory.options).some((opt) => opt.value === preferred);
      appCategory.value = hasPreferred ? preferred : (appCategory.options[0]?.value || "");
    }
    document.getElementById("appType").value = app.type === "desktop" ? "scan" : "web";

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

  appCategoryButton?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!appCategoryMenu || !appCategoryButton) return;
    const isOpen = !appCategoryMenu.classList.contains("hidden");
    if (isOpen){
      closeAppCategoryMenu();
    } else {
      closeScanSelectMenu();
      openAppCategoryMenu();
    }
  });
  appTypeToggleBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!appType) return;
    appType.value = appType.value === "scan" ? "web" : "scan";
    syncTypeUI();
  });
  scanSelectButton?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!scanSelectMenu || !scanSelectButton) return;
    const isOpen = !scanSelectMenu.classList.contains("hidden");
    if (isOpen){
      closeScanSelectMenu();
    } else {
      closeAppCategoryMenu();
      openScanSelectMenu();
    }
  });
  scanSelectButton?.addEventListener("keydown", handleScanTypeaheadKey);
  scanSelectMenu?.addEventListener("keydown", handleScanTypeaheadKey);
  appCategory?.addEventListener("change", syncAppCategoryUi);

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
    const typeValue = appType?.value || "web";
    syncAppTypeToggleUi();
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
  function repairMojibakeString(input){
    const value = String(input ?? "");
    if (!/[ÃÂðâ]/.test(value)) return value;
    try{
      const bytes = new Uint8Array(Array.from(value).map((ch) => ch.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return /�/.test(decoded) ? value : decoded;
    }catch{
      return value;
    }
  }

  function repairMojibakeValue(value){
    if (typeof value === "string") return repairMojibakeString(value);
    if (Array.isArray(value)) return value.map(repairMojibakeValue);
    if (value && typeof value === "object"){
      const out = {};
      Object.keys(value).forEach((k) => {
        out[k] = repairMojibakeValue(value[k]);
      });
      return out;
    }
    return value;
  }

  function loadApps(){
    try{
      const raw = JSON.parse(localStorage.getItem("kc_apps") || "[]");
      return Array.isArray(raw) ? raw.map((item) => repairMojibakeValue(item)) : [];
    }catch{
      return [];
    }
  }

  function saveApps(list){
    localStorage.setItem("kc_apps", JSON.stringify(list));
  }

  let apps = loadApps();
  saveApps(apps);

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
  const SUPER_ALL = "__all__";
  const SUPER_GENERAL = "General";
  const MAX_SUPER_CATEGORIES = 11;
  const SUPER_CATEGORIES_KEY = "kc_super_categories";
  const SUPER_ICON_MAP_KEY = "kc_super_icon_map";
  const CATEGORY_ICON_MAP_KEY = "kc_category_icon_map";
  const SUPER_TAB_ORDER_KEY = "kc_super_tab_order";
  const SUPER_ICON_PRESETS = [
    { emoji: "🎮", tags: ["game", "gaming", "spiele"] }, { emoji: "🕹️", tags: ["arcade", "game", "retro"] },
    { emoji: "👾", tags: ["pixel", "game", "space"] }, { emoji: "🎯", tags: ["target", "goal", "focus"] },
    { emoji: "🏆", tags: ["trophy", "winner", "cup"] }, { emoji: "⚽", tags: ["football", "soccer", "sport"] },
    { emoji: "🏀", tags: ["basketball", "sport"] }, { emoji: "🏈", tags: ["football", "sport", "nfl"] },
    { emoji: "⚾", tags: ["baseball", "sport"] }, { emoji: "🎾", tags: ["tennis", "sport"] },
    { emoji: "🏐", tags: ["volleyball", "sport"] }, { emoji: "🏓", tags: ["pingpong", "sport"] },
    { emoji: "🏸", tags: ["badminton", "sport"] }, { emoji: "🥊", tags: ["boxing", "fight", "sport"] },
    { emoji: "🏎️", tags: ["race", "car", "motorsport"] }, { emoji: "🚴", tags: ["bike", "cycling", "sport"] },
    { emoji: "🎵", tags: ["music", "audio", "song"] }, { emoji: "🎶", tags: ["music", "song"] },
    { emoji: "🎧", tags: ["headphones", "audio", "sound"] }, { emoji: "🎤", tags: ["microphone", "voice", "podcast"] },
    { emoji: "🎬", tags: ["movie", "film", "video"] }, { emoji: "📺", tags: ["tv", "stream", "video"] },
    { emoji: "🎞️", tags: ["film", "movie", "media"] }, { emoji: "📸", tags: ["camera", "photo", "image"] },
    { emoji: "📷", tags: ["photo", "camera"] }, { emoji: "🎨", tags: ["art", "design", "creative"] },
    { emoji: "🖌️", tags: ["paint", "art", "brush"] }, { emoji: "🧠", tags: ["brain", "learning", "ai"] },
    { emoji: "📚", tags: ["books", "lernen", "study"] }, { emoji: "📖", tags: ["book", "reading"] },
    { emoji: "📝", tags: ["notes", "text", "write"] }, { emoji: "✏️", tags: ["edit", "pencil", "write"] },
    { emoji: "📌", tags: ["pin", "important", "mark"] }, { emoji: "📎", tags: ["clip", "attach", "file"] },
    { emoji: "📁", tags: ["folder", "files", "directory"] }, { emoji: "📂", tags: ["folder", "open", "files"] },
    { emoji: "🗂️", tags: ["archive", "folders", "docs"] }, { emoji: "🗃️", tags: ["storage", "box", "archive"] },
    { emoji: "💼", tags: ["work", "business", "office"] }, { emoji: "🧳", tags: ["travel", "trip", "luggage"] },
    { emoji: "🛠️", tags: ["tools", "settings", "repair"] }, { emoji: "🔧", tags: ["wrench", "tool"] },
    { emoji: "🪛", tags: ["screwdriver", "tool"] }, { emoji: "🧰", tags: ["toolbox", "tools"] },
    { emoji: "⚙️", tags: ["settings", "config", "gear"] }, { emoji: "🔩", tags: ["bolt", "tool", "hardware"] },
    { emoji: "💻", tags: ["laptop", "computer", "pc"] }, { emoji: "🖥️", tags: ["desktop", "monitor", "pc"] },
    { emoji: "🖨️", tags: ["printer", "office"] }, { emoji: "⌨️", tags: ["keyboard", "input"] },
    { emoji: "🖱️", tags: ["mouse", "input"] }, { emoji: "📱", tags: ["phone", "mobile", "smartphone"] },
    { emoji: "📲", tags: ["mobile", "chat", "message"] }, { emoji: "🔋", tags: ["battery", "power"] },
    { emoji: "🌐", tags: ["web", "internet", "browser"] }, { emoji: "🔒", tags: ["lock", "security", "safe"] },
    { emoji: "🔓", tags: ["unlock", "open", "security"] }, { emoji: "🔑", tags: ["key", "security", "access"] },
    { emoji: "🔐", tags: ["security", "password", "lock"] }, { emoji: "🔍", tags: ["search", "find", "zoom"] },
    { emoji: "🔎", tags: ["search", "find"] }, { emoji: "🧪", tags: ["lab", "test", "experiment"] },
    { emoji: "🧬", tags: ["science", "dna", "lab"] }, { emoji: "📊", tags: ["chart", "stats", "analytics"] },
    { emoji: "📈", tags: ["growth", "chart", "business"] }, { emoji: "📉", tags: ["down", "chart"] },
    { emoji: "🧮", tags: ["calc", "calculator", "math"] }, { emoji: "💰", tags: ["money", "finance", "cash"] },
    { emoji: "💳", tags: ["card", "payment", "bank"] }, { emoji: "🏦", tags: ["bank", "finance"] },
    { emoji: "🧾", tags: ["receipt", "invoice", "finance"] }, { emoji: "🛒", tags: ["shop", "cart", "store"] },
    { emoji: "🛍️", tags: ["shopping", "store", "buy"] }, { emoji: "📦", tags: ["package", "shipping", "box"] },
    { emoji: "🚚", tags: ["delivery", "shipping", "logistics"] }, { emoji: "📬", tags: ["mailbox", "mail"] },
    { emoji: "✉️", tags: ["mail", "email", "message"] }, { emoji: "📧", tags: ["email", "mail"] },
    { emoji: "📨", tags: ["incoming", "mail"] }, { emoji: "📩", tags: ["outgoing", "mail"] },
    { emoji: "📰", tags: ["news", "paper", "press"] }, { emoji: "🗞️", tags: ["news", "newspaper"] },
    { emoji: "🗓️", tags: ["calendar", "date", "plan"] }, { emoji: "📅", tags: ["calendar", "schedule"] },
    { emoji: "⏰", tags: ["alarm", "time", "clock"] }, { emoji: "⏱️", tags: ["timer", "time"] },
    { emoji: "🕒", tags: ["clock", "time"] }, { emoji: "✅", tags: ["check", "done", "ok"] },
    { emoji: "☑️", tags: ["checkbox", "done"] }, { emoji: "⭐", tags: ["star", "favorite", "fav"] },
    { emoji: "🌟", tags: ["star", "highlight"] }, { emoji: "🔥", tags: ["fire", "hot", "trend"] },
    { emoji: "💡", tags: ["idea", "light", "brainstorm"] }, { emoji: "🚀", tags: ["rocket", "launch", "start"] },
    { emoji: "🛰️", tags: ["satellite", "space"] }, { emoji: "🧭", tags: ["compass", "navigation"] },
    { emoji: "🗺️", tags: ["map", "travel", "navigation"] }, { emoji: "☁️", tags: ["cloud", "storage", "sync"] },
    { emoji: "🌙", tags: ["moon", "night", "dark"] }, { emoji: "☀️", tags: ["sun", "light", "day"] },
    { emoji: "🌈", tags: ["rainbow", "color"] }, { emoji: "🌊", tags: ["water", "wave", "ocean"] },
    { emoji: "🌳", tags: ["tree", "nature", "green"] }, { emoji: "🍀", tags: ["luck", "nature"] },
    { emoji: "🍎", tags: ["apple", "food", "fruit"] }, { emoji: "🍕", tags: ["pizza", "food"] },
    { emoji: "☕", tags: ["coffee", "drink"] }, { emoji: "🍺", tags: ["beer", "drink"] },
    { emoji: "🏠", tags: ["home", "house"] }, { emoji: "🏢", tags: ["office", "building", "work"] },
    { emoji: "🏬", tags: ["mall", "store", "building"] }, { emoji: "🚗", tags: ["car", "auto", "vehicle"] },
    { emoji: "🚌", tags: ["bus", "transport"] }, { emoji: "🚆", tags: ["train", "transport"] },
    { emoji: "✈️", tags: ["flight", "plane", "travel"] }, { emoji: "🚢", tags: ["ship", "travel"] },
    { emoji: "🎁", tags: ["gift", "present"] }, { emoji: "🧸", tags: ["toy", "cute"] },
    { emoji: "🐶", tags: ["dog", "pet", "animal"] }, { emoji: "🐱", tags: ["cat", "pet", "animal"] },
    { emoji: "🐼", tags: ["panda", "animal"] }, { emoji: "🦊", tags: ["fox", "animal"] },
    { emoji: "🐵", tags: ["monkey", "animal"] }, { emoji: "🐧", tags: ["penguin", "animal"] },
    { emoji: "🐬", tags: ["dolphin", "animal"] }, { emoji: "🦄", tags: ["unicorn", "magic"] },
    { emoji: "🤖", tags: ["robot", "ai", "bot"] }, { emoji: "🧩", tags: ["puzzle", "game", "logic"] },
    { emoji: "🔮", tags: ["magic", "future"] }, { emoji: "🕶️", tags: ["glasses", "style"] },
    { emoji: "🎩", tags: ["hat", "style", "magic"] }, { emoji: "💬", tags: ["chat", "message", "comment"] },
    { emoji: "💭", tags: ["thought", "chat", "note"] }, { emoji: "📞", tags: ["phone", "call"] },
    { emoji: "📡", tags: ["signal", "network", "antenna"] }, { emoji: "📶", tags: ["wifi", "network", "signal"] },
    { emoji: "🧵", tags: ["thread", "textile"] }, { emoji: "🪄", tags: ["magic", "wand"] },
    { emoji: "🪙", tags: ["coin", "money"] }, { emoji: "🪐", tags: ["planet", "space"] },
    { emoji: "🧱", tags: ["brick", "build"] }, { emoji: "📋", tags: ["clipboard", "copy", "paste"] },
    { emoji: "📄", tags: ["document", "file", "text"] }, { emoji: "🗒️", tags: ["notepad", "notes"] },
    { emoji: "📒", tags: ["notebook", "notes"] }, { emoji: "📓", tags: ["notebook", "notes"] },
    { emoji: "📔", tags: ["book", "notes"] }, { emoji: "📕", tags: ["book", "red"] },
    { emoji: "📗", tags: ["book", "green"] }, { emoji: "📘", tags: ["book", "blue"] },
    { emoji: "📙", tags: ["book", "orange"] }, { emoji: "🧷", tags: ["pin", "attach"] },
    { emoji: "📍", tags: ["pin", "location", "map"] }, { emoji: "🧿", tags: ["eye", "symbol"] },
    { emoji: "🔔", tags: ["notification", "bell", "alert"] }, { emoji: "📣", tags: ["announce", "megaphone"] },
    { emoji: "📢", tags: ["announce", "speaker"] }, { emoji: "🔊", tags: ["volume", "sound", "audio"] },
    { emoji: "🔇", tags: ["mute", "audio"] }, { emoji: "🧯", tags: ["safety", "fire"] },
    { emoji: "🩺", tags: ["health", "medical"] }, { emoji: "💊", tags: ["health", "medical"] },
    { emoji: "⚕️", tags: ["medical", "health"] }, { emoji: "🏥", tags: ["hospital", "health"] },
    { emoji: "🎓", tags: ["education", "school", "study"] }, { emoji: "🏫", tags: ["school", "education"] },
    { emoji: "🧑‍💻", tags: ["developer", "code", "programming"] }, { emoji: "👨‍💻", tags: ["developer", "code"] },
    { emoji: "👩‍💻", tags: ["developer", "code"] }, { emoji: "🔗", tags: ["link", "chain", "connect"] },
    { emoji: "📤", tags: ["upload", "export", "send"] }, { emoji: "📥", tags: ["download", "import", "receive"] },
    { emoji: "🗑️", tags: ["delete", "trash", "remove"] }, { emoji: "🧹", tags: ["clean", "clear"] },
    { emoji: "🧼", tags: ["clean", "wash"] }, { emoji: "⚡", tags: ["power", "energy", "fast"] },
    { emoji: "🔌", tags: ["power", "plug"] }, { emoji: "🪫", tags: ["battery", "low"] },
    { emoji: "🛡️", tags: ["shield", "security", "protection"] }, { emoji: "🧲", tags: ["magnet", "tool", "physics"] },
    { emoji: "🪜", tags: ["ladder", "build", "work"] }, { emoji: "🪵", tags: ["wood", "material", "build"] },
    { emoji: "🔬", tags: ["microscope", "science", "lab"] }, { emoji: "🔭", tags: ["telescope", "space", "science"] },
    { emoji: "🧫", tags: ["petri", "lab", "biology"] }, { emoji: "🧹", tags: ["sweep", "clean", "maintenance"] },
    { emoji: "🪣", tags: ["bucket", "clean", "tools"] }, { emoji: "🧨", tags: ["dynamite", "explosive", "fun"] },
    { emoji: "🕯️", tags: ["candle", "light", "calm"] }, { emoji: "🪔", tags: ["lamp", "light", "diya"] },
    { emoji: "🧭", tags: ["navigate", "compass", "travel"] }, { emoji: "🏁", tags: ["finish", "race", "flag"] },
    { emoji: "🚦", tags: ["traffic", "lights", "road"] }, { emoji: "🛣️", tags: ["road", "travel", "route"] },
    { emoji: "🧠", tags: ["focus", "mind", "smart"] }, { emoji: "🫶", tags: ["heart", "care", "support"] },
    { emoji: "❤️", tags: ["love", "heart", "favorite"] }, { emoji: "💜", tags: ["heart", "purple"] },
    { emoji: "💙", tags: ["heart", "blue"] }, { emoji: "💚", tags: ["heart", "green"] },
    { emoji: "🖤", tags: ["heart", "black"] }, { emoji: "💯", tags: ["hundred", "score", "success"] },
    { emoji: "❗", tags: ["warning", "important", "alert"] }, { emoji: "❓", tags: ["question", "help"] },
    { emoji: "‼️", tags: ["important", "alert", "warning"] }, { emoji: "📛", tags: ["name", "label", "tag"] },
    { emoji: "🏷️", tags: ["label", "tag", "marker"] }, { emoji: "🔖", tags: ["bookmark", "save", "mark"] },
    { emoji: "🪪", tags: ["id", "identity", "card"] }, { emoji: "📇", tags: ["index", "contacts", "cards"] },
    { emoji: "📑", tags: ["bookmark", "document", "tabs"] }, { emoji: "📜", tags: ["scroll", "document", "history"] },
    { emoji: "🧾", tags: ["bill", "invoice", "receipt"] }, { emoji: "📐", tags: ["ruler", "measure", "design"] },
    { emoji: "📏", tags: ["measure", "length", "ruler"] }, { emoji: "🧪", tags: ["experiment", "test", "research"] },
    { emoji: "🧑‍🔬", tags: ["scientist", "research", "lab"] }, { emoji: "🧑‍🏫", tags: ["teacher", "education", "school"] },
    { emoji: "🧑‍⚖️", tags: ["law", "justice", "legal"] }, { emoji: "⚖️", tags: ["legal", "balance", "law"] },
    { emoji: "🧑‍🚒", tags: ["firefighter", "rescue", "safety"] }, { emoji: "🧑‍🔧", tags: ["mechanic", "repair", "tools"] },
    { emoji: "🧑‍🍳", tags: ["cook", "kitchen", "food"] }, { emoji: "🍽️", tags: ["meal", "food", "dining"] },
    { emoji: "🥗", tags: ["food", "salad", "healthy"] }, { emoji: "🍔", tags: ["burger", "food", "fastfood"] },
    { emoji: "🌮", tags: ["taco", "food"] }, { emoji: "🍜", tags: ["ramen", "food", "noodles"] },
    { emoji: "🍣", tags: ["sushi", "food"] }, { emoji: "🍰", tags: ["cake", "dessert", "sweet"] },
    { emoji: "🍩", tags: ["donut", "dessert", "sweet"] }, { emoji: "🍼", tags: ["baby", "bottle", "care"] },
    { emoji: "🧃", tags: ["juice", "drink"] }, { emoji: "🥤", tags: ["drink", "soda"] },
    { emoji: "🫗", tags: ["pour", "drink", "liquid"] }, { emoji: "🏋️", tags: ["gym", "fitness", "sport"] },
    { emoji: "🧘", tags: ["yoga", "health", "calm"] }, { emoji: "🏃", tags: ["run", "fitness", "sport"] },
    { emoji: "🚶", tags: ["walk", "fitness", "movement"] }, { emoji: "🛌", tags: ["sleep", "rest", "bed"] },
    { emoji: "🛏️", tags: ["bed", "sleep", "home"] }, { emoji: "🪑", tags: ["chair", "furniture", "home"] },
    { emoji: "🚪", tags: ["door", "entry", "home"] }, { emoji: "🪟", tags: ["window", "home"] },
    { emoji: "🧯", tags: ["extinguisher", "safety", "fire"] }, { emoji: "🪖", tags: ["helmet", "safety", "military"] },
    { emoji: "📯", tags: ["horn", "announce", "audio"] }, { emoji: "🎺", tags: ["trumpet", "music", "instrument"] },
    { emoji: "🎸", tags: ["guitar", "music", "instrument"] }, { emoji: "🎹", tags: ["piano", "music", "instrument"] },
    { emoji: "🥁", tags: ["drums", "music", "instrument"] }, { emoji: "🎻", tags: ["violin", "music", "instrument"] },
    { emoji: "📼", tags: ["video", "tape", "media"] }, { emoji: "💿", tags: ["disk", "media", "cd"] },
    { emoji: "📀", tags: ["dvd", "media", "disk"] }, { emoji: "🧿", tags: ["symbol", "amulet", "eye"] },
    { emoji: "📟", tags: ["pager", "device", "retro"] }, { emoji: "☎️", tags: ["phone", "call", "contact"] },
    { emoji: "📠", tags: ["fax", "office", "communication"] }, { emoji: "📳", tags: ["vibrate", "phone", "mobile"] },
    { emoji: "📴", tags: ["offline", "phone", "disable"] }, { emoji: "🛜", tags: ["wifi", "network", "internet"] },
    { emoji: "🧑‍💼", tags: ["office", "business", "work"] }, { emoji: "👥", tags: ["team", "users", "group"] },
    { emoji: "👤", tags: ["user", "profile", "account"] }, { emoji: "🫂", tags: ["community", "team", "social"] },
    { emoji: "💻", tags: ["coding", "dev", "workspace"] }, { emoji: "🗄️", tags: ["cabinet", "archive", "storage"] },
    { emoji: "🗑", tags: ["trash", "delete", "remove"] }, { emoji: "🗳️", tags: ["inbox", "collect", "archive"] },
    { emoji: "🧺", tags: ["basket", "organize", "sort"] }, { emoji: "🧴", tags: ["tools", "utility", "clean"] },
    { emoji: "🧠", tags: ["knowledge", "ideas", "thinking"] }, { emoji: "📔", tags: ["journal", "notes", "log"] },
    { emoji: "📒", tags: ["planner", "notes", "organizer"] }, { emoji: "📃", tags: ["page", "doc", "document"] },
    { emoji: "📜", tags: ["policy", "terms", "document"] }, { emoji: "📂", tags: ["project", "files", "folder"] },
    { emoji: "🧾", tags: ["billing", "receipt", "finance"] }, { emoji: "📌", tags: ["bookmark", "pin", "save"] },
    { emoji: "🔁", tags: ["sync", "repeat", "refresh"] }, { emoji: "🔄", tags: ["reload", "sync", "update"] },
    { emoji: "↗️", tags: ["open", "external", "link"] }, { emoji: "↘️", tags: ["download", "direction", "arrow"] },
    { emoji: "⛓️", tags: ["link", "chain", "connection"] }, { emoji: "🧷", tags: ["attach", "pin", "fasten"] },
    { emoji: "🪪", tags: ["credentials", "id", "identity"] }, { emoji: "👮", tags: ["security", "privacy", "safe"] },
    { emoji: "🔏", tags: ["signed", "security", "lock"] }, { emoji: "🛂", tags: ["access", "control", "security"] },
    { emoji: "🧯", tags: ["emergency", "safety", "protection"] }, { emoji: "🚨", tags: ["alert", "emergency", "warning"] },
    { emoji: "⚠️", tags: ["warning", "alert", "attention"] }, { emoji: "🆘", tags: ["help", "emergency", "support"] },
    { emoji: "🗨️", tags: ["chat", "message", "comment"] }, { emoji: "🗯️", tags: ["talk", "speech", "chat"] },
    { emoji: "💼", tags: ["portfolio", "business", "career"] }, { emoji: "📉", tags: ["report", "analytics", "stats"] },
    { emoji: "🧭", tags: ["navigation", "guide", "direction"] }, { emoji: "🧪", tags: ["qa", "testing", "check"] },
    { emoji: "🧱", tags: ["blocks", "builder", "construction"] }, { emoji: "🧬", tags: ["research", "science", "lab"] },
    { emoji: "🧑‍⚕️", tags: ["medical", "doctor", "health"] }, { emoji: "🧑‍🚀", tags: ["space", "astro", "explore"] },
    { emoji: "🛰", tags: ["satellite", "signal", "space"] }, { emoji: "🛸", tags: ["ufo", "space", "fun"] },
    { emoji: "📍", tags: ["location", "pin", "place"] }, { emoji: "🗺", tags: ["maps", "route", "travel"] },
    { emoji: "🧳", tags: ["trip", "travel", "tour"] }, { emoji: "🏝️", tags: ["island", "travel", "vacation"] },
    { emoji: "🏞️", tags: ["landscape", "nature", "travel"] }, { emoji: "🏕️", tags: ["camp", "outdoor", "nature"] },
    { emoji: "🧊", tags: ["cold", "ice", "cool"] }, { emoji: "🌋", tags: ["volcano", "hot", "nature"] },
    { emoji: "🌪️", tags: ["storm", "weather", "wind"] }, { emoji: "⛈️", tags: ["rain", "storm", "weather"] },
    { emoji: "🌤️", tags: ["weather", "sun", "cloud"] }, { emoji: "🌥️", tags: ["weather", "cloud"] },
    { emoji: "📶", tags: ["signal", "network", "reception"] }, { emoji: "🧾", tags: ["expenses", "receipt", "accounting"] },
    { emoji: "💹", tags: ["stocks", "market", "trading"] }, { emoji: "🏷", tags: ["label", "price", "tag"] },
    { emoji: "🪪", tags: ["auth", "identity", "account"] }, { emoji: "🧿", tags: ["protect", "symbol", "amulet"] },
    { emoji: "🔰", tags: ["beginner", "badge", "new"] }, { emoji: "🆕", tags: ["new", "fresh", "latest"] },
    { emoji: "🆗", tags: ["ok", "confirm", "good"] }, { emoji: "🆒", tags: ["cool", "highlight", "special"] }
  ];
  let activeSuper = SUPER_ALL;
  let catManageMode = "sub";

  function normalizeCategory(name){
    return String(name || "").trim().replace(/\s+/g, " ");
  }

  function splitCategoryPath(name){
    const normalized = normalizeCategory(name);
    if (!normalized) return { full: "", super: SUPER_GENERAL, leaf: "", label: "" };
    const parts = normalized
      .split(/\s*(?:\/|>)\s*/g)
      .map((p) => normalizeCategory(p))
      .filter(Boolean);
    if (parts.length >= 2){
      return {
        full: normalized,
        super: parts[0],
        leaf: parts[parts.length - 1],
        label: parts.slice(1).join(" / ")
      };
    }
    return { full: normalized, super: SUPER_GENERAL, leaf: normalized, label: normalized };
  }

  function normalizeSuperName(name){
    return normalizeCategory(String(name || "")).toLowerCase();
  }

  function superCategoryLimitMessage(){
    return t("super_limit_message", { max: MAX_SUPER_CATEGORIES });
  }

  function showSuperCategoryLimitPopup(){
    openConfirm(
      superCategoryLimitMessage(),
      null,
      t("super_limit_ok"),
      t("super_limit_title"),
      t("cancel"),
      { singleButton: true }
    );
  }

  function wouldExceedSuperLimit(superName){
    const key = normalizeSuperName(superName);
    if (!key || key === normalizeSuperName(SUPER_ALL) || key === normalizeSuperName(SUPER_GENERAL)) return false;
    if (superCategories.some((name) => normalizeSuperName(name) === key)) return false;
    return superCategories.length >= MAX_SUPER_CATEGORIES;
  }

  function loadSuperCategories(){
    try{
      const raw = JSON.parse(localStorage.getItem(SUPER_CATEGORIES_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      const seen = new Set();
      return raw
        .map((name) => normalizeCategory(name))
        .filter((name) => {
          if (!name) return false;
          const lower = normalizeSuperName(name);
          if (lower === normalizeSuperName(SUPER_ALL) || lower === normalizeSuperName(SUPER_GENERAL)) return false;
          if (seen.has(lower)) return false;
          seen.add(lower);
          return true;
        });
    }catch{
      return [];
    }
  }

  function saveSuperCategories(list){
    localStorage.setItem(SUPER_CATEGORIES_KEY, JSON.stringify(list));
  }

  function loadSuperTabOrder(){
    try{
      const raw = JSON.parse(localStorage.getItem(SUPER_TAB_ORDER_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      const seen = new Set();
      return raw
        .map((name) => normalizeSuperName(name))
        .filter((name) => {
          if (!name) return false;
          if (name === normalizeSuperName(SUPER_ALL) || name === normalizeSuperName(SUPER_GENERAL)) return false;
          if (seen.has(name)) return false;
          seen.add(name);
          return true;
        });
    }catch{
      return [];
    }
  }

  function saveSuperTabOrder(list){
    localStorage.setItem(SUPER_TAB_ORDER_KEY, JSON.stringify(Array.isArray(list) ? list : []));
  }

  function loadSuperIconMap(){
    try{
      const raw = JSON.parse(localStorage.getItem(SUPER_ICON_MAP_KEY) || "{}");
      if (!raw || typeof raw !== "object") return {};
      const clean = {};
      Object.keys(raw).forEach((key) => {
        const lower = normalizeSuperName(key);
        if (!lower) return;
        const entry = repairMojibakeValue(raw[key]);
        if (!entry || typeof entry !== "object") return;
        if (entry.type === "emoji" && typeof entry.value === "string" && entry.value.trim()){
          clean[lower] = { type: "emoji", value: repairMojibakeString(entry.value).trim() };
          return;
        }
        if (entry.type === "image" && typeof entry.value === "string" && /^data:image\//i.test(entry.value)){
          clean[lower] = { type: "image", value: entry.value };
        }
      });
      return clean;
    }catch{
      return {};
    }
  }

  function saveSuperIconMap(map){
    localStorage.setItem(SUPER_ICON_MAP_KEY, JSON.stringify(map || {}));
  }

  function loadCategoryIconMap(){
    try{
      const raw = JSON.parse(localStorage.getItem(CATEGORY_ICON_MAP_KEY) || "{}");
      if (!raw || typeof raw !== "object") return {};
      const clean = {};
      Object.keys(raw).forEach((key) => {
        const lower = normalizeSuperName(key);
        if (!lower) return;
        const entry = repairMojibakeValue(raw[key]);
        if (!entry || typeof entry !== "object") return;
        if (entry.type === "emoji" && typeof entry.value === "string" && entry.value.trim()){
          clean[lower] = { type: "emoji", value: repairMojibakeString(entry.value).trim() };
          return;
        }
        if (entry.type === "image" && typeof entry.value === "string" && /^data:image\//i.test(entry.value)){
          clean[lower] = { type: "image", value: entry.value };
        }
      });
      return clean;
    }catch{
      return {};
    }
  }

  function saveCategoryIconMap(map){
    localStorage.setItem(CATEGORY_ICON_MAP_KEY, JSON.stringify(map || {}));
  }

  function getOrderedUserCategories(){
    const userCats = categories.filter(c => c.toLowerCase() !== "sonstiges");
    return orderByList(userCats.map(name => ({ id: name, name })), categoryTabOrder).map(x => x.name);
  }

  function getVisibleCategoriesForSuper(superName){
    const ordered = getOrderedUserCategories();
    if (!superName || superName === SUPER_ALL) return ordered;
    const wanted = normalizeSuperName(superName);
    return ordered.filter((cat) => normalizeSuperName(splitCategoryPath(cat).super) === wanted);
  }

  function buildSuperMeta(){
    const ordered = getOrderedUserCategories();
    const map = new Map();
    ordered.forEach((cat) => {
      const path = splitCategoryPath(cat);
      if (!map.has(path.super)){
        map.set(path.super, { name: path.super, count: 0, categories: [] });
      }
      const group = map.get(path.super);
      group.categories.push(cat);
      group.count += apps.filter((a) => a.category === cat).length;
    });
    superCategories.forEach((name) => {
      const key = normalizeSuperName(name);
      if (!key || map.has(name) || Array.from(map.keys()).some((k) => normalizeSuperName(k) === key)) return;
      map.set(name, { name, count: 0, categories: [] });
    });
    const groups = Array.from(map.values()).filter((group) => normalizeSuperName(group.name) !== normalizeSuperName(SUPER_GENERAL));
    const orderedGroups = orderByList(
      groups.map((group) => ({ id: normalizeSuperName(group.name), group })),
      superTabOrder
    ).map((entry) => entry.group);
    const nextOrder = orderedGroups.map((group) => normalizeSuperName(group.name)).filter(Boolean);
    if (JSON.stringify(nextOrder) !== JSON.stringify(superTabOrder)){
      superTabOrder = nextOrder;
      saveSuperTabOrder(superTabOrder);
    }
    return orderedGroups;
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
  let superCategories = loadSuperCategories();
  let superTabOrder = loadSuperTabOrder();
  let superIconMap = loadSuperIconMap();
  let categoryIconMap = loadCategoryIconMap();
  saveSuperIconMap(superIconMap);
  saveCategoryIconMap(categoryIconMap);
  let pendingSuperName = "";
  let pendingSuperIcon = null;
  let pendingSuperMode = "edit";
  let pendingSuperTarget = "super";
  let superIconQuery = "";
  let draftSuperIcon = null;
  let draftCategoryIcon = null;

  // Merge any existing app categories into list (initial boot)
  apps.forEach(a => {
    const c = normalizeCategory(a?.category);
    if (c && !categories.some(x => x.toLowerCase() === c.toLowerCase())){
      categories.push(c);
    }
  });
  saveCategories(categories);
  categories.forEach((cat) => {
    const s = splitCategoryPath(cat).super;
    const lower = normalizeSuperName(s);
    if (!s || lower === normalizeSuperName(SUPER_GENERAL) || lower === normalizeSuperName(SUPER_ALL)) return;
    if (!superCategories.some((x) => normalizeSuperName(x) === lower)) superCategories.push(s);
    if (!superTabOrder.includes(lower)) superTabOrder.push(lower);
  });
  saveSuperCategories(superCategories);
  saveSuperTabOrder(superTabOrder);
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

  function updateCategoryTabTooltip(tab, count = 0){
    if (!tab) return;
    const cat = String(tab.dataset.cat || "");
    if (!cat) return;
    const path = splitCategoryPath(cat);
    const label = path.label || cat;
    const value = `${label} (${count})`;
    tab.dataset.tip = value;
    tab.removeAttribute("title");
    tab.setAttribute("aria-label", value);
  }

  function formatCategoryOptionLabel(categoryValue){
    const c = String(categoryValue || "");
    if (!c) return t("tab_all");
    if (c === "Sonstiges") return t("tab_misc");
    const path = splitCategoryPath(c);
    return path.super === SUPER_GENERAL ? path.label : `${path.super} / ${path.label}`;
  }

  function syncAppCategoryUi(){
    if (!appCategoryLabel || !appCategory) return;
    const val = appCategory.value || "";
    appCategoryLabel.textContent = formatCategoryOptionLabel(val);
  }

  function syncAppTypeToggleUi(){
    if (!appType || !appTypeToggleLabel) return;
    const typeValue = appType.value === "web" ? "web" : "scan";
    appType.value = typeValue;
    appTypeToggleLabel.textContent = typeValue === "web" ? t("modal_type_web") : t("modal_type_scan");
    if (appTypeToggleBtn) appTypeToggleBtn.dataset.mode = typeValue;
  }

  function closeAppCategoryMenu(){
    if (!appCategoryMenu || !appCategoryButton || !appCategoryButton.parentElement) return;
    appCategoryMenu.classList.add("hidden");
    appCategoryButton.setAttribute("aria-expanded", "false");
    appCategoryButton.parentElement.classList.remove("open");
    appCategoryButton.parentElement.classList.remove("open-up");
    appCategoryMenu.style.maxHeight = "";
  }

  function openAppCategoryMenu(){
    if (!appCategoryMenu || !appCategoryButton || !appCategoryButton.parentElement) return;
    appCategoryMenu.classList.remove("hidden");
    appCategoryButton.setAttribute("aria-expanded", "true");
    appCategoryButton.parentElement.classList.add("open");
    positionDropdownMenu(appCategoryMenu, appCategoryButton);
  }

  function renderCategories(){
    hideSuperTooltip();
    hideRailTooltip();
    closeCategoryContextMenu();
    if (appCategory){
      appCategory.innerHTML = "";
      if (appCategoryMenu) appCategoryMenu.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.textContent = t("tab_all");
      allOpt.value = "";
      appCategory.appendChild(allOpt);
      if (appCategoryMenu){
        const allItem = document.createElement("button");
        allItem.type = "button";
        allItem.className = "category-select-item";
        allItem.dataset.value = "";
        allItem.textContent = t("tab_all");
        const selected = String(appCategory.value || "") === "";
        allItem.classList.toggle("selected", selected);
        allItem.setAttribute("aria-selected", selected ? "true" : "false");
        allItem.addEventListener("click", () => {
          appCategory.value = "";
          syncAppCategoryUi();
          closeAppCategoryMenu();
          if (appCategoryMenu){
            appCategoryMenu.querySelectorAll(".category-select-item").forEach((el) => {
              const active = el.dataset.value === "";
              el.classList.toggle("selected", active);
              el.setAttribute("aria-selected", active ? "true" : "false");
            });
          }
        });
        appCategoryMenu.appendChild(allItem);
      }
      const selectableCategories = categories.filter((c) => String(c).toLowerCase() !== "sonstiges");
      selectableCategories.forEach(c => {
        const opt = document.createElement("option");
        opt.textContent = formatCategoryOptionLabel(c);
        opt.value = c;
        appCategory.appendChild(opt);

        if (appCategoryMenu){
          const item = document.createElement("button");
          item.type = "button";
          item.className = "category-select-item";
          item.dataset.value = c;
          item.textContent = formatCategoryOptionLabel(c);
          const selected = String(appCategory.value || "") === c;
          item.classList.toggle("selected", selected);
          item.setAttribute("aria-selected", selected ? "true" : "false");
          item.addEventListener("click", () => {
            appCategory.value = c;
            syncAppCategoryUi();
            closeAppCategoryMenu();
            if (appCategoryMenu){
              appCategoryMenu.querySelectorAll(".category-select-item").forEach((el) => {
                const active = el.dataset.value === c;
                el.classList.toggle("selected", active);
                el.setAttribute("aria-selected", active ? "true" : "false");
              });
            }
          });
          appCategoryMenu.appendChild(item);
        }
      });
      if (appCategoryMenu){
        appCategoryMenu.querySelectorAll(".category-select-item").forEach((el) => {
          const active = el.dataset.value === String(appCategory.value || "");
          el.classList.toggle("selected", active);
          el.setAttribute("aria-selected", active ? "true" : "false");
        });
      }
      syncAppCategoryUi();
    }

    if (overTabs){
      overTabs.querySelectorAll(".tab-super").forEach((el) => el.remove());
      if (normalizeSuperName(activeSuper) === normalizeSuperName(SUPER_GENERAL)){
        activeSuper = SUPER_ALL;
      }
      const supers = buildSuperMeta();
      supers.forEach((group) => {
        const tab = document.createElement("div");
        tab.className = "tab tab-super";
        tab.setAttribute("role", "tab");
        tab.dataset.super = group.name;
        tab.dataset.tab = `super:${group.name}`;
        const iconWrap = document.createElement("span");
        iconWrap.className = "over-icon";
        iconWrap.setAttribute("aria-hidden", "true");
        const selectedIcon = getSuperIcon(group.name);
        if (selectedIcon?.type === "image"){
          iconWrap.classList.add("over-icon-image");
          const img = document.createElement("img");
          img.src = selectedIcon.value;
          img.alt = "";
          iconWrap.appendChild(img);
        } else if (selectedIcon?.type === "emoji"){
          iconWrap.textContent = selectedIcon.value;
        } else {
          const initial = (group.name || "?").trim().charAt(0).toUpperCase() || "?";
          iconWrap.textContent = initial;
        }
        const label = document.createElement("span");
        label.className = "over-label";
        label.textContent = group.name;
        tab.appendChild(iconWrap);
        tab.appendChild(label);
        overTabs.appendChild(tab);
      });
      overTabs.querySelectorAll(".tab[data-super]").forEach((tab) => {
        const superName = tab.dataset.super || SUPER_ALL;
        const label = superName === SUPER_ALL ? t("tab_all") : superName;
        tab.dataset.label = label;
        tab.dataset.tip = label;
        tab.setAttribute("aria-label", label);
        tab.removeAttribute("title");
      });
    }

    if (catTabs){
      catTabs.innerHTML = "";
      const ordered = getVisibleCategoriesForSuper(activeSuper);
      const visible = ordered.filter((cat) => {
        if (!categorySearchTerm) return true;
        const path = splitCategoryPath(cat);
        const hay = `${cat} ${path.super} ${path.label}`.toLowerCase();
        return hay.includes(categorySearchTerm);
      });

      visible.forEach(c => {
          const tab = document.createElement("div");
          tab.className = "tab tab-cat";
          tab.setAttribute("role", "tab");
          tab.dataset.tab = `cat:${c}`;
          tab.dataset.cat = c;
          const path = splitCategoryPath(c);
          const catIcon = getCategoryIcon(c);
          let iconHtml = "";
          if (catIcon?.type === "image"){
            iconHtml = `<span class="cat-tab-icon cat-tab-icon-image" aria-hidden="true"><img src="${escapeHtml(catIcon.value)}" alt=""></span>`;
          } else if (catIcon?.type === "emoji"){
            iconHtml = `<span class="cat-tab-icon" aria-hidden="true">${escapeHtml(catIcon.value)}</span>`;
          } else {
            const initial = (path.label || c || "?").trim().charAt(0).toUpperCase() || "?";
            iconHtml = `<span class="cat-tab-icon cat-tab-icon-fallback" aria-hidden="true">${escapeHtml(initial)}</span>`;
          }
          tab.innerHTML = `
            ${iconHtml}
            <span class="cat-label">${escapeHtml(path.label)}</span>
            <span class="badge" data-cat-badge="${escapeHtml(c)}">0</span>
          `;
          updateCategoryTabTooltip(tab, 0);
          catTabs.appendChild(tab);
        });
    }
    const allBaseTab = document.querySelector(".tabs > .tab[data-tab='all']");
    const favBaseTab = document.querySelector(".tabs > .tab[data-tab='fav']");
    const hotkeysBaseTab = document.querySelector(".tabs > .tab[data-tab='hotkeys']");
    const showBaseTabs =
      normalizeSuperName(activeSuper) === normalizeSuperName(SUPER_ALL) &&
      !categorySearchTerm;
    if (allBaseTab) allBaseTab.style.display = showBaseTabs ? "" : "none";
    if (favBaseTab) favBaseTab.style.display = showBaseTabs ? "" : "none";
    if (hotkeysBaseTab) hotkeysBaseTab.style.display = showBaseTabs ? "" : "none";
    applyCategoryRailState();
    refreshActiveTabClasses();
  }

  function renderCategoryManager(){
    if (!catManageList) return;
    catManageList.innerHTML = "";
    if (catManageMode === "super"){
      const sortedSupers = [...superCategories].sort((a, b) => a.localeCompare(b, "de"));
      sortedSupers.forEach((superName) => {
        const rowIcon = getSuperIcon(superName);
        const rowIconText = rowIcon?.type === "emoji" ? rowIcon.value : (rowIcon?.type === "image" ? "🖼️" : "•");
        const row = document.createElement("div");
        row.className = "cat-item";
        row.innerHTML = `
          <div class="cat-name">${escapeHtml(superName)}</div>
          <div class="cat-actions">
            <button class="cat-icon-pick" type="button">
              <span class="cat-icon-mark">${escapeHtml(rowIconText)}</span>
              <span class="cat-icon-text">${escapeHtml(t("category_icon_btn"))}</span>
            </button>
            <button class="cat-del" type="button">${escapeHtml(t("category_delete_btn"))}</button>
          </div>
        `;
        const iconBtn = row.querySelector(".cat-icon-pick");
        iconBtn?.addEventListener("click", () => openSuperIconPicker(superName));
        const delBtn = row.querySelector(".cat-del");
        delBtn?.addEventListener("click", () => {
          openConfirm(t("confirm_delete_category", { name: superName }), () => {
            deleteSuperCategoryByName(superName);
          });
        });
        catManageList.appendChild(row);
      });
      return;
    }

    const sorted = [...categories]
      .filter(c => c.toLowerCase() !== "sonstiges")
      .sort((a, b) => a.localeCompare(b, "de"));
    sorted.forEach((c) => {
      const rowIcon = getCategoryIcon(c);
      const rowIconText = rowIcon?.type === "emoji" ? rowIcon.value : (rowIcon?.type === "image" ? "🖼️" : "•");
      const row = document.createElement("div");
      row.className = "cat-item";
      row.innerHTML = `
        <div class="cat-name">${escapeHtml(c)}</div>
        <div class="cat-actions">
          <button class="cat-icon-pick" type="button">
            <span class="cat-icon-mark">${escapeHtml(rowIconText)}</span>
            <span class="cat-icon-text">${escapeHtml(t("category_icon_btn"))}</span>
          </button>
          <button class="cat-del" type="button" ${c === "Sonstiges" ? "disabled" : ""}>${escapeHtml(t("category_delete_btn"))}</button>
        </div>
      `;
      const iconBtn = row.querySelector(".cat-icon-pick");
      iconBtn?.addEventListener("click", () => openSuperIconPicker(c, "edit", "category"));
      const delBtn = row.querySelector(".cat-del");
      if (delBtn && c !== "Sonstiges") {
        delBtn.addEventListener("click", () => {
          openConfirm(t("confirm_delete_category", { name: c }), () => {
            deleteCategoryByName(c);
          });
        });
      }
      catManageList.appendChild(row);
    });
  }

  function addCategoryFromInput(){
    const val = normalizeCategory(catManageInput?.value);
    if (!val) return;
    if (catManageMode === "super"){
      const superName = val.replace(/\s*(?:\/|>)\s*/g, " ").trim();
      if (!superName) return;
      if (wouldExceedSuperLimit(superName)){
        showSuperCategoryLimitPopup();
        return;
      }
      const superKey = normalizeSuperName(superName);
      if (!superCategories.some((name) => normalizeSuperName(name) === superKey)){
        superCategories.push(superName);
        saveSuperCategories(superCategories);
      }
      if (!superTabOrder.includes(superKey)){
        superTabOrder.push(superKey);
        saveSuperTabOrder(superTabOrder);
      }
      if (draftSuperIcon){
        superIconMap[superKey] = { ...draftSuperIcon };
        saveSuperIconMap(superIconMap);
      }
      draftSuperIcon = null;
      updateCatSuperIconButton();
      renderCategories();
      setActiveSuper(superName);
      if (catManageInput) catManageInput.value = "";
      renderCategoryManager();
      return;
    }

    const selectedSuper = normalizeCategory(activeSuper);
    const useSuper = selectedSuper && selectedSuper !== SUPER_ALL && normalizeSuperName(selectedSuper) !== normalizeSuperName(SUPER_GENERAL);
    if (useSuper && wouldExceedSuperLimit(selectedSuper)){
      showSuperCategoryLimitPopup();
      return;
    }
    const fullCategory = useSuper ? `${selectedSuper} / ${val}` : val;
    if (categories.some(c => c.toLowerCase() === fullCategory.toLowerCase())){
      if (catManageInput) catManageInput.value = "";
      return;
    }
    categories.push(fullCategory);
    saveCategories(categories);
    categoryTabOrder.push(fullCategory);
    saveCategoryTabOrder(categoryTabOrder);
    if (draftCategoryIcon){
      categoryIconMap[normalizeSuperName(fullCategory)] = { ...draftCategoryIcon };
      saveCategoryIconMap(categoryIconMap);
    }
    draftCategoryIcon = null;
    updateCatSuperIconButton();
    if (useSuper && !superCategories.some((name) => normalizeSuperName(name) === normalizeSuperName(selectedSuper))){
      superCategories.push(selectedSuper);
      saveSuperCategories(superCategories);
    }
    renderCategories();
    setActiveTab(`cat:${fullCategory}`);
    if (catManageInput) catManageInput.value = "";
    renderCategoryManager();
  }

  catManageAdd?.addEventListener("click", addCategoryFromInput);
  catManageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCategoryFromInput();
  });
  catManageInput?.addEventListener("input", () => {
    if (catManageMode === "super" && !draftSuperIcon) updateCatSuperIconButton();
    if (catManageMode === "sub" && !draftCategoryIcon) updateCatSuperIconButton();
  });
  catSuperIconPick?.addEventListener("click", () => {
    const typed = normalizeCategory(catManageInput?.value);
    openSuperIconPicker(typed || "", "create", catManageMode === "super" ? "super" : "category");
  });
  catKindSwitch?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-kind]");
    if (!btn) return;
    setCatManageMode(btn.dataset.kind);
    catManageInput?.focus();
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

  document.addEventListener("keydown", (e) => {
    if (capturingHotkey || capturingAppHotkey) return;
    if (e.defaultPrevented || e.repeat) return;
    if (isTypingTarget(e.target)) return;
    if (overlay?.classList.contains("show")) return;
    if (settingsOverlay?.classList.contains("show")) return;
    if (voiceSettingsOverlay?.classList.contains("show")) return;
    if (catManageOverlay?.classList.contains("show")) return;
    if (superIconOverlay?.classList.contains("show")) return;
    if (confirmOverlay?.classList.contains("show")) return;

    const combo = normalizeKey(e);
    if (!combo) return;
    const hit = apps.find((app) => normalizeShortcutText(app?.hotkey) === normalizeShortcutText(combo));
    if (!hit) return;
    e.preventDefault();
    e.stopPropagation();
    openLaunch(hit);
  });

  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const DEFAULT_WAKE_PHRASES = ["kontrollzentrum", "kontroll zentrum", "control center", "controlcenter"];
  const COMMAND_VERBS = new Set(["starte", "start", "oeffne", "offne", "open", "launch", "run"]);
  const COMMAND_FILLERS = new Set([
    "bitte", "please", "mal", "doch", "den", "die", "das", "dem", "der", "ein", "eine",
    "the", "a", "an", "to", "app", "programm", "program", "kannst", "du", "can", "you"
  ]);
  const APP_NAME_STOPWORDS = new Set([
    "app", "desktop", "launcher", "client", "web", "tool", "tools", "programm", "program"
  ]);
  const MIN_APP_MATCH_SCORE = 56;
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
  let voiceMicAccessGranted = false;
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

  function compactSpeechText(input){
    return normalizeSpeechText(input).replace(/\s+/g, "");
  }

  function phoneticSpeechText(input){
    return compactSpeechText(input)
      .replace(/ph/g, "f")
      .replace(/ck/g, "k")
      .replace(/tz/g, "z")
      .replace(/th/g, "t")
      .replace(/ie/g, "i")
      .replace(/y/g, "i")
      .replace(/qu/g, "kw")
      .replace(/q/g, "k")
      .replace(/x/g, "ks")
      .replace(/v/g, "f")
      .replace(/w/g, "v")
      .replace(/c(?=[eiy])/g, "s")
      .replace(/c/g, "k");
  }

  function tokenizeSpeech(input){
    return normalizeSpeechText(input)
      .split(" ")
      .map((tkn) => tkn.trim())
      .filter((tkn) => {
        if (!tkn) return false;
        if (APP_NAME_STOPWORDS.has(tkn)) return false;
        if (tkn.length <= 1 && !/\d/.test(tkn)) return false;
        return true;
      });
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
    const pushAlias = (alias, canonical) => {
      const normalized = normalizeSpeechText(alias);
      if (!normalized) return;
      aliasMap.set(normalized, canonical);
      const compact = normalized.replace(/\s+/g, "");
      if (compact) aliasMap.set(compact, canonical);
      const phonetic = phoneticSpeechText(alias);
      if (phonetic) aliasMap.set(phonetic, canonical);
    };
    Object.entries(STATIC_APP_ALIASES).forEach(([canonical, aliases]) => {
      aliases.forEach((alias) => pushAlias(alias, canonical));
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
      const nameCompact = compactSpeechText(app?.name);
      const launchCompact = compactSpeechText(app?.launch);
      const namePhonetic = phoneticSpeechText(app?.name);
      const launchPhonetic = phoneticSpeechText(app?.launch);
      const hay = `${name} ${launch}`;
      const hayCompact = `${nameCompact} ${launchCompact}`;
      const hayPhonetic = `${namePhonetic} ${launchPhonetic}`;
      let score = 0;
      hints.forEach((hint) => {
        const needle = normalizeSpeechText(hint);
        const needleCompact = compactSpeechText(hint);
        const needlePhonetic = phoneticSpeechText(hint);
        if (!needle) return;
        if (name === needle) score = Math.max(score, 100);
        else if (name.includes(needle)) score = Math.max(score, 85);
        else if (hay.includes(needle)) score = Math.max(score, 70);
        if (needleCompact){
          if (nameCompact === needleCompact) score = Math.max(score, 100);
          else if (nameCompact.includes(needleCompact)) score = Math.max(score, 85);
          else if (hayCompact.includes(needleCompact)) score = Math.max(score, 70);
        }
        if (needlePhonetic){
          if (namePhonetic === needlePhonetic) score = Math.max(score, 98);
          else if (namePhonetic.includes(needlePhonetic)) score = Math.max(score, 82);
          else if (hayPhonetic.includes(needlePhonetic)) score = Math.max(score, 68);
        }
      });
      if (score > bestScore){
        bestScore = score;
        best = app;
      }
    });
    return best;
  }

  function scoreStringSimilarity(needle, haystack){
    const n = String(needle || "");
    const h = String(haystack || "");
    if (!n || !h) return 0;
    if (n === h) return 1;
    if (h.includes(n) || n.includes(h)) return 0.94;
    const maxLen = Math.max(n.length, h.length);
    const dist = levenshteinDistance(n, h);
    const similarity = 1 - dist / maxLen;
    return Math.max(0, similarity);
  }

  function resolveAppByPhraseDetailed(targetPhrase){
    const normalizedTarget = normalizeSpeechText(targetPhrase);
    if (!normalizedTarget) return null;
    const normalizedTargetCompact = normalizedTarget.replace(/\s+/g, "");
    const normalizedTargetPhonetic = phoneticSpeechText(targetPhrase);
    const targetTokens = tokenizeSpeech(targetPhrase);
    const targetTokenSet = new Set(targetTokens);

    const aliasMap = buildAliasMap();
    const canonical = aliasMap.get(normalizedTarget) || aliasMap.get(normalizedTargetCompact) || aliasMap.get(normalizedTargetPhonetic) || null;
    if (canonical){
      const app = pickCanonicalApp(canonical);
      if (app) return { app, score: 155 };
    }

    let best = null;
    let bestScore = 0;
    apps.forEach((app) => {
      const name = normalizeSpeechText(app?.name);
      const launch = normalizeSpeechText(app?.launch);
      const nameCompact = compactSpeechText(app?.name);
      const launchCompact = compactSpeechText(app?.launch);
      const namePhonetic = phoneticSpeechText(app?.name);
      const launchPhonetic = phoneticSpeechText(app?.launch);
      if (!name && !launch) return;
      let score = 0;

      // Strong exact and containment matches.
      if (name === normalizedTarget) score = 120;
      else if (name.includes(normalizedTarget)) score = 95;
      else if (normalizedTarget.includes(name) && name.length > 2) score = 90;
      else if (launch.includes(normalizedTarget)) score = 70;
      else if (nameCompact && normalizedTargetCompact){
        if (nameCompact === normalizedTargetCompact) score = 118;
        else if (nameCompact.includes(normalizedTargetCompact)) score = 93;
        else if (normalizedTargetCompact.includes(nameCompact) && nameCompact.length > 2) score = 88;
        else if (launchCompact.includes(normalizedTargetCompact)) score = 68;
      }

      if (namePhonetic && normalizedTargetPhonetic){
        if (namePhonetic === normalizedTargetPhonetic) score = Math.max(score, 114);
        else if (namePhonetic.includes(normalizedTargetPhonetic)) score = Math.max(score, 89);
        else if (launchPhonetic.includes(normalizedTargetPhonetic)) score = Math.max(score, 66);
      }

      // Weighted fuzzy similarity on multiple channels.
      const simNameCompact = scoreStringSimilarity(normalizedTargetCompact, nameCompact);
      const simNamePhonetic = scoreStringSimilarity(normalizedTargetPhonetic, namePhonetic);
      const simLaunchCompact = scoreStringSimilarity(normalizedTargetCompact, launchCompact);
      const simLaunchPhonetic = scoreStringSimilarity(normalizedTargetPhonetic, launchPhonetic);
      if (simNameCompact >= 0.72) score = Math.max(score, Math.round(54 + simNameCompact * 48));
      if (simNamePhonetic >= 0.7) score = Math.max(score, Math.round(50 + simNamePhonetic * 47));
      if (simLaunchCompact >= 0.76) score = Math.max(score, Math.round(40 + simLaunchCompact * 34));
      if (simLaunchPhonetic >= 0.74) score = Math.max(score, Math.round(38 + simLaunchPhonetic * 33));

      // Token overlap to catch cases like "tik tok", "counter strike", etc.
      const appTokenSet = new Set([
        ...tokenizeSpeech(app?.name),
        ...tokenizeSpeech(app?.launch)
      ]);
      if (targetTokenSet.size && appTokenSet.size){
        let overlap = 0;
        targetTokenSet.forEach((token) => {
          if (appTokenSet.has(token)) overlap++;
        });
        if (overlap > 0){
          const ratio = overlap / targetTokenSet.size;
          const bonus = Math.round(42 + ratio * 48);
          score = Math.max(score, bonus);
        }
      }

      if (score > 0 && normalizedTargetCompact && nameCompact){
        const startsSame = normalizedTargetCompact[0] === nameCompact[0];
        if (startsSame) score += 2;
      }

      if (score > bestScore){
        bestScore = score;
        best = app;
      }
    });
    if (!best) return null;
    return { app: best, score: bestScore };
  }

  function resolveAppByPhrase(targetPhrase){
    const detailed = resolveAppByPhraseDetailed(targetPhrase);
    if (!detailed) return null;
    return detailed.score >= MIN_APP_MATCH_SCORE ? detailed.app : null;
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

  async function ensureVoiceMicAccess(prompt = false){
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try{
      if (navigator.permissions?.query){
        const status = await navigator.permissions.query({ name: "microphone" });
        if (status.state === "granted"){
          voiceMicAccessGranted = true;
          return true;
        }
        if (status.state === "denied"){
          voiceMicAccessGranted = false;
          return false;
        }
      }
    }catch{
      // Permissions API optional; continue with fallback flow.
    }
    if (!prompt) return voiceMicAccessGranted;
    let stream = null;
    try{
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceMicAccessGranted = true;
      return true;
    }catch{
      voiceMicAccessGranted = false;
      return false;
    } finally {
      stream?.getTracks?.().forEach((t) => t.stop());
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
    if (!raw) return "__none__";
    if (lowered === "none" || lowered.includes("keine stimme") || lowered.includes("sound only")) return "__none__";
    if (lowered.includes("stefan")) return "__male__";
    if (lowered.includes("katja")) return "__female__";
    if (lowered.includes("hedda")) return "__none__";
    if (lowered.includes("male") || lowered.includes("mann") || lowered === "man") return "__male__";
    if (lowered.includes("female") || lowered.includes("frau") || lowered === "woman") return "__female__";
    return "__none__";
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
    if (!SpeechRecognitionCtor || !voiceEnabled || !voiceMicAccessGranted) return;
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
    if (!SpeechRecognitionCtor || !voiceEnabled || !voiceMicAccessGranted) return;
    commandModeActive = true;
    stopWakeListening();
    playListeningBeep();

    if (!commandRecognition){
      commandRecognition = new SpeechRecognitionCtor();
      commandRecognition.continuous = false;
      commandRecognition.interimResults = false;
      commandRecognition.maxAlternatives = 5;
      commandRecognition.lang = getRecognitionLocale();
    }

    let commandHandled = false;
    commandRecognition.onresult = async (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++){
        const result = event.results[i];
        if (!result.isFinal) continue;
        const transcripts = [];
        const altCount = Math.min(result.length || 0, 5);
        for (let alt = 0; alt < altCount; alt++){
          const transcript = String(result[alt]?.transcript || "").trim();
          if (!transcript) continue;
          transcripts.push(transcript);
        }
        if (!transcripts.length){
          const fallback = String(result[0]?.transcript || "").trim();
          if (fallback) transcripts.push(fallback);
        }
        commandHandled = true;
        await executeVoiceCommand(transcripts);
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

    setTimeout(() => {
      if (!voiceEnabled || !voiceMicAccessGranted){
        commandModeActive = false;
        startWakeListening();
        return;
      }
      try{ commandRecognition.start(); }catch{
        commandModeActive = false;
        startWakeListening();
      }
    }, 260);
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

  function toTranscriptList(input){
    if (Array.isArray(input)){
      return input
        .map((entry) => String(entry || "").trim())
        .filter(Boolean);
    }
    const single = String(input || "").trim();
    return single ? [single] : [];
  }

  function pickBestVoiceCommandMatch(input){
    const transcripts = toTranscriptList(input);
    let best = null;
    transcripts.forEach((transcript) => {
      const parsed = parseVoiceCommand(transcript);
      if (!parsed) return;
      const detailed = resolveAppByPhraseDetailed(parsed.target);
      if (!detailed) return;
      const candidate = {
        transcript,
        target: parsed.target,
        app: detailed.app,
        score: detailed.score
      };
      if (!best || candidate.score > best.score) best = candidate;
    });
    return best;
  }

  async function executeVoiceCommand(input){
    const transcripts = toTranscriptList(input);
    if (!transcripts.length){
      if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
      speakFeedback(t("voice_not_understood"));
      return;
    }

    const best = pickBestVoiceCommandMatch(transcripts);
    if (!best){
      if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
      const firstParsed = parseVoiceCommand(transcripts[0]);
      const fallbackName = firstParsed?.target || transcripts[0];
      speakFeedback(t("voice_app_not_found", { name: fallbackName }));
      return;
    }

    if (best.score < MIN_APP_MATCH_SCORE || !best.app){
      if (selectedVoiceName === "__none__") playCommandOutcomeTone("error");
      speakFeedback(t("voice_app_not_found", { name: best.target }));
      return;
    }

    await openLaunch(best.app);
    if (selectedVoiceName === "__none__") playCommandOutcomeTone("success");
    speakFeedback(t("voice_opening", { name: best.app.name || best.target }));
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
    if (voiceEnabled){
      ensureVoiceMicAccess(false).then((allowed) => {
        if (!allowed) return;
        startWakeListening();
      });
    }
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
    ensureVoiceMicAccess(false).then((allowed) => {
      if (!allowed){
        stopWakeListening();
        stopCommandListening();
        return;
      }
      startWakeListening();
    });
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
    if (activeTab === "hotkeys" && !String(app.hotkey || "").trim()) return false;
    if (activeTab === "misc" && app.category !== "Sonstiges") return false;
    if (activeTab.startsWith("cat:")){
      const cat = activeTab.slice(4);
      if (app.category !== cat) return false;
    }

    if (searchTerm){
      const hay = (app.name + " " + app.launch + " " + app.category + " " + (app.hotkey || "") + " " + (app.description || "")).toLowerCase();
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

  function renderCardHotkeyHtml(value){
    const raw = String(value || "").trim();
    if (!raw) return "";
    const parts = raw.split("+").map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return "";
    const keysHtml = parts.map((part, idx) => {
      const sep = idx < parts.length - 1 ? `<span class="card-hotkey-sep" aria-hidden="true">+</span>` : "";
      return `<span class="card-hotkey-key">${escapeHtml(part)}</span>${sep}`;
    }).join("");
    return `
      <div class="card-hotkey">
        <span class="card-hotkey-icon" aria-hidden="true">⛓️‍💥</span>
        <span class="card-hotkey-keys">${keysHtml}</span>
      </div>
    `;
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

  function inferSuperFromActiveTab(tabValue){
    if (tabValue === "all") return SUPER_ALL;
    if (tabValue === "fav") return SUPER_ALL;
    if (tabValue === "misc") return SUPER_ALL;
    if (String(tabValue || "").startsWith("cat:")){
      const cat = String(tabValue || "").slice(4);
      return splitCategoryPath(cat).super;
    }
    return SUPER_ALL;
  }

  function setActiveSuper(superValue){
    const nextSuper = String(superValue || SUPER_ALL);
    activeSuper = nextSuper;

    if (nextSuper === SUPER_ALL) return setActiveTab("all");

    const visible = getVisibleCategoriesForSuper(nextSuper);
    const currentCat = activeTab.startsWith("cat:") ? activeTab.slice(4) : "";
    if (visible.includes(currentCat)){
      setActiveTab(`cat:${currentCat}`, { preserveSuper: true });
      return;
    }
    if (visible.length){
      setActiveTab(`cat:${visible[0]}`, { preserveSuper: true });
      return;
    }
    setActiveTab("all", { preserveSuper: true });
  }

  function refreshActiveTabClasses(){
    document.querySelectorAll(".tab").forEach(t => {
      const isActive = t.dataset.tab === activeTab;
      const isSuperActive = Boolean(t.dataset.super) && t.dataset.super === activeSuper;
      const active = isActive || isSuperActive;
      if (isActive) {
        t.setAttribute("aria-selected", "true");
      } else if (t.dataset.super){
        t.setAttribute("aria-selected", isSuperActive ? "true" : "false");
      } else {
        t.setAttribute("aria-selected", "false");
      }
      t.classList.toggle("active", active);
    });
  }

  function setActiveTab(tabValue, options = {}){
    activeTab = tabValue || "all";
    if (!options.preserveSuper){
      const keepAllSuper =
        normalizeSuperName(activeSuper) === normalizeSuperName(SUPER_ALL) &&
        String(activeTab || "").startsWith("cat:");
      activeSuper = keepAllSuper ? SUPER_ALL : inferSuperFromActiveTab(activeTab);
    }
    renderCategories();
    refreshActiveTabClasses();
    render();
  }

  let suppressClickId = null;

  function render(){
    const shown = apps.filter(matches);

    // badges
    const badgeAll = document.getElementById("badgeAll");
    const badgeFav = document.getElementById("badgeFav");
    const badgeHotkeys = document.getElementById("badgeHotkeys");
    const badgeMisc = document.getElementById("badgeMisc");
    const allCount = apps.length;
    const favCount = apps.filter(a => a.fav).length;
    const hotkeyCount = apps.filter(a => String(a.hotkey || "").trim()).length;
    if (badgeAll) badgeAll.textContent = String(allCount);
    if (badgeFav) badgeFav.textContent = String(favCount);
    if (badgeHotkeys) badgeHotkeys.textContent = String(hotkeyCount);
    if (badgeMisc) badgeMisc.textContent = String(apps.filter(a => a.category === "Sonstiges").length);
    const allBaseTab = document.querySelector(".tabs > .tab[data-tab='all']");
    const favBaseTab = document.querySelector(".tabs > .tab[data-tab='fav']");
    const hotkeyBaseTab = document.querySelector(".tabs > .tab[data-tab='hotkeys']");
    if (allBaseTab){
      const tip = `${t("tab_all")} (${allCount})`;
      allBaseTab.dataset.tip = tip;
      allBaseTab.removeAttribute("title");
      allBaseTab.setAttribute("aria-label", tip);
    }
    if (favBaseTab){
      const tip = `${t("tab_favorites")} (${favCount})`;
      favBaseTab.dataset.tip = tip;
      favBaseTab.removeAttribute("title");
      favBaseTab.setAttribute("aria-label", tip);
    }
    if (hotkeyBaseTab){
      const tip = `${t("tab_hotkeys")} (${hotkeyCount})`;
      hotkeyBaseTab.dataset.tip = tip;
      hotkeyBaseTab.removeAttribute("title");
      hotkeyBaseTab.setAttribute("aria-label", tip);
    }
    const catBadges = document.querySelectorAll("[data-cat-badge]");
    catBadges.forEach(el => {
      const cat = el.getAttribute("data-cat-badge") || "";
      const count = apps.filter(a => a.category === cat).length;
      el.textContent = String(count);
    });
    catTabs?.querySelectorAll(".tab-cat").forEach((tab) => {
      const cat = tab.dataset.cat || "";
      const count = apps.filter((a) => a.category === cat).length;
      updateCategoryTabTooltip(tab, count);
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
      const hotkeyValue = String(app.hotkey || "").trim();
      const hotkeyHtml = renderCardHotkeyHtml(hotkeyValue);

      card.innerHTML = `
        <div class="card-top">
          <div class="card-icon">
          </div>

          <div class="card-actions">
            <button class="star ${app.fav ? "active" : ""}" type="button" aria-label="${escapeHtml(t("aria_favorite"))}" data-tip="${escapeHtml(t("aria_favorite"))}"><span class="action-emoji" aria-hidden="true">⭐</span></button>
          </div>
        </div>

        <div class="card-name">${escapeHtml(app.name)}</div>

        <div class="card-bottom">
          <div class="card-meta">
            <span class="pill card-type-pill">
              <span class="card-type-dot" aria-hidden="true"></span>
              ${escapeHtml(typeBadge)}
            </span>
          </div>
          ${hotkeyHtml}
        </div>
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
  let overTabDrag = null;
  let overTabGhost = null;
  let overTabSlot = null;
  let overTabLastReorderTs = 0;
  const OVER_TAB_REORDER_INTERVAL = 70;

  function createOverTabGhost(tab, x, y){
    overTabGhost = tab.cloneNode(true);
    overTabGhost.classList.add("over-tab-ghost");
    const rect = tab.getBoundingClientRect();
    overTabGhost.style.width = rect.width + "px";
    overTabGhost.style.height = rect.height + "px";
    overTabGhost.style.left = (x - rect.width / 2) + "px";
    overTabGhost.style.top = (y - rect.height / 2) + "px";
    document.body.appendChild(overTabGhost);
    tab.style.display = "none";
  }

  function createOverTabSlot(tab){
    overTabSlot = document.createElement("div");
    overTabSlot.className = "over-tab-slot";
    overTabSlot.style.width = tab.offsetWidth + "px";
    overTabSlot.style.height = tab.offsetHeight + "px";
    overTabs?.insertBefore(overTabSlot, tab.nextSibling);
  }

  function cleanupOverTabDrag(){
    if (overTabGhost && overTabGhost.parentElement) overTabGhost.parentElement.removeChild(overTabGhost);
    if (overTabSlot && overTabSlot.parentElement) overTabSlot.parentElement.removeChild(overTabSlot);
    if (overTabDrag?.tab) overTabDrag.tab.style.display = "";
    overTabGhost = null;
    overTabSlot = null;
    overTabDrag = null;
  }

  overTabs?.addEventListener("pointerdown", (e) => {
    const tab = e.target.closest(".tab-super");
    if (!tab) return;
    if (e.button !== 0) return;
    overTabDrag = {
      tab,
      startX: e.clientX,
      startY: e.clientY,
      moved: false
    };
    tab.setPointerCapture?.(e.pointerId);
  });

  overTabs?.addEventListener("pointermove", (e) => {
    if (!overTabDrag) return;
    const dx = e.clientX - overTabDrag.startX;
    const dy = e.clientY - overTabDrag.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (!overTabDrag.moved){
      if (dist < 6) return;
      overTabDrag.moved = true;
      createOverTabGhost(overTabDrag.tab, e.clientX, e.clientY);
      createOverTabSlot(overTabDrag.tab);
    }

    if (overTabGhost){
      overTabGhost.style.left = (e.clientX - overTabGhost.offsetWidth / 2) + "px";
      overTabGhost.style.top = (e.clientY - overTabGhost.offsetHeight / 2) + "px";
    }

    const now = performance.now();
    if (now - overTabLastReorderTs < OVER_TAB_REORDER_INTERVAL) return;
    overTabLastReorderTs = now;

    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tab-super");
    if (!target || target === overTabDrag.tab) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    if (overTabSlot){
      overTabs?.insertBefore(overTabSlot, before ? target : target.nextSibling);
    }
  });

  overTabs?.addEventListener("pointerup", () => {
    if (!overTabDrag) return;
    if (overTabDrag.moved && overTabSlot){
      overTabs?.insertBefore(overTabDrag.tab, overTabSlot);
      const nextOrder = Array.from(overTabs.querySelectorAll(".tab-super"))
        .map((el) => normalizeSuperName(el.dataset.super || ""))
        .filter(Boolean);
      superTabOrder = nextOrder;
      saveSuperTabOrder(superTabOrder);
      overTabSuppressClickUntil = Date.now() + 220;
    }
    cleanupOverTabDrag();
  });

  overTabs?.addEventListener("pointercancel", cleanupOverTabDrag);

  let tabDrag = null;
  let tabGhost = null;
  let tabSlot = null;
  let tabSuperDropTarget = null;
  let catContextMenu = null;
  let catContextTarget = "";
  let catContextType = "";
  let appContextMenu = null;
  let appContextTarget = "";
  let tabReflowRaf = 0;
  let tabReflowRects = null;
  let tabLastReorderTs = 0;
  const TAB_REORDER_INTERVAL = 70;

  function ensureCategoryContextMenu(){
    if (catContextMenu) return catContextMenu;
    const menu = document.createElement("div");
    menu.className = "cat-context-menu";
    menu.id = "catContextMenu";
    menu.hidden = true;
    menu.addEventListener("contextmenu", (e) => e.preventDefault());
    document.body.appendChild(menu);
    catContextMenu = menu;
    return menu;
  }

  function closeCategoryContextMenu(){
    if (!catContextMenu) return;
    catContextMenu.hidden = true;
    catContextMenu.innerHTML = "";
    catContextTarget = "";
    catContextType = "";
  }

  function ensureAppContextMenu(){
    if (appContextMenu) return appContextMenu;
    const menu = document.createElement("div");
    menu.className = "cat-context-menu app-context-menu";
    menu.id = "appContextMenu";
    menu.hidden = true;
    menu.addEventListener("contextmenu", (e) => e.preventDefault());
    document.body.appendChild(menu);
    appContextMenu = menu;
    return menu;
  }

  function closeAppContextMenu(){
    if (!appContextMenu) return;
    appContextMenu.hidden = true;
    appContextMenu.innerHTML = "";
    appContextTarget = "";
  }

  function findAppById(appId){
    const id = String(appId || "");
    if (!id) return null;
    return apps.find((a) => a.id === id) || null;
  }

  function openAppContextMenu(appId, clientX, clientY){
    const app = findAppById(appId);
    if (!app) return;
    closeCategoryContextMenu();
    const menu = ensureAppContextMenu();
    const favLabel = app.fav ? t("app_ctx_remove_favorite") : t("app_ctx_add_favorite");
    menu.innerHTML = `
      <button class="app-context-item" type="button" data-action="toggle-favorite">
        ${escapeHtml(favLabel)}
      </button>
      <button class="app-context-item" type="button" data-action="edit-app">
        ${escapeHtml(t("app_ctx_edit"))}
      </button>
      <button class="app-context-item danger" type="button" data-action="delete-app">
        ${escapeHtml(t("app_ctx_delete"))}
      </button>
    `;
    menu.hidden = false;
    appContextTarget = app.id;

    const pad = 10;
    const maxX = window.innerWidth - menu.offsetWidth - pad;
    const maxY = window.innerHeight - menu.offsetHeight - pad;
    const left = Math.max(pad, Math.min(clientX, maxX));
    const top = Math.max(pad, Math.min(clientY, maxY));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function refreshAfterCategoryMove(nextSuper = activeSuper){
    activeSuper = nextSuper || SUPER_ALL;
    renderCategories();
    refreshActiveTabClasses();
    render();
  }

  function deleteCategoryByName(categoryName){
    const target = normalizeCategory(categoryName);
    if (!target || normalizeSuperName(target) === normalizeSuperName("Sonstiges")) return false;
    const exists = categories.some((c) => c.toLowerCase() === target.toLowerCase());
    if (!exists) return false;
    categories = categories.filter((x) => x.toLowerCase() !== target.toLowerCase());
    apps = apps.map((a) => (a.category === target ? { ...a, category: "Sonstiges" } : a));
    saveApps(apps);
    saveCategories(categories);
    categoryTabOrder = categoryTabOrder.filter((x) => x.toLowerCase() !== target.toLowerCase());
    saveCategoryTabOrder(categoryTabOrder);
    if (categoryOrders[target]){
      delete categoryOrders[target];
      saveCategoryOrders(categoryOrders);
    }
    const targetKey = normalizeSuperName(target);
    if (categoryIconMap[targetKey]){
      delete categoryIconMap[targetKey];
      saveCategoryIconMap(categoryIconMap);
    }
    if (activeTab === `cat:${target}`) setActiveTab("all");
    else {
      renderCategories();
      refreshActiveTabClasses();
      render();
    }
    renderCategoryManager();
    return true;
  }

  function deleteSuperCategoryByName(superName){
    const wanted = normalizeSuperName(superName);
    if (!wanted || wanted === normalizeSuperName(SUPER_ALL) || wanted === normalizeSuperName(SUPER_GENERAL)) return false;

    const matches = categories.filter((cat) => normalizeSuperName(splitCategoryPath(cat).super) === wanted);
    const renameMap = new Map();
    matches.forEach((cat) => {
      const p = splitCategoryPath(cat);
      const nextName = normalizeCategory(p.label || p.leaf || cat);
      if (nextName) renameMap.set(cat, nextName);
    });

    apps = apps.map((app) => {
      const next = renameMap.get(app.category);
      return next ? { ...app, category: next } : app;
    });
    saveApps(apps);

    let nextCategories = categories.filter((cat) => !renameMap.has(cat));
    renameMap.forEach((nextName) => {
      if (!nextCategories.some((existing) => existing.toLowerCase() === nextName.toLowerCase())){
        nextCategories.push(nextName);
      }
    });
    categories = nextCategories;
    saveCategories(categories);

    const orderSeen = new Set();
    categoryTabOrder = categoryTabOrder
      .map((name) => renameMap.get(name) || name)
      .filter((name) => categories.some((c) => c.toLowerCase() === String(name).toLowerCase()))
      .filter((name) => {
        const key = String(name).toLowerCase();
        if (orderSeen.has(key)) return false;
        orderSeen.add(key);
        return true;
      });
    categories
      .filter((c) => c.toLowerCase() !== "sonstiges")
      .forEach((c) => {
        if (!categoryTabOrder.some((x) => x.toLowerCase() === c.toLowerCase())){
          categoryTabOrder.push(c);
        }
      });
    saveCategoryTabOrder(categoryTabOrder);

    const nextOrders = {};
    Object.entries(categoryOrders || {}).forEach(([cat, order]) => {
      const mapped = renameMap.get(cat) || cat;
      if (!categories.some((c) => c.toLowerCase() === String(mapped).toLowerCase())) return;
      if (!nextOrders[mapped]) nextOrders[mapped] = Array.isArray(order) ? [...order] : [];
      else if (Array.isArray(order)){
        const seen = new Set(nextOrders[mapped]);
        order.forEach((id) => {
          if (seen.has(id)) return;
          nextOrders[mapped].push(id);
          seen.add(id);
        });
      }
    });
    categoryOrders = nextOrders;
    saveCategoryOrders(categoryOrders);

    const nextCategoryIcons = {};
    Object.entries(categoryIconMap || {}).forEach(([catKey, icon]) => {
      for (const [oldName, newName] of renameMap.entries()){
        if (normalizeSuperName(oldName) === catKey){
          const mappedKey = normalizeSuperName(newName);
          if (!nextCategoryIcons[mappedKey]) nextCategoryIcons[mappedKey] = { ...icon };
          return;
        }
      }
      const stillExisting = categories.find((cat) => normalizeSuperName(cat) === catKey);
      if (stillExisting){
        if (!nextCategoryIcons[catKey]) nextCategoryIcons[catKey] = { ...icon };
      }
    });
    categoryIconMap = nextCategoryIcons;
    saveCategoryIconMap(categoryIconMap);

    superCategories = superCategories.filter((name) => normalizeSuperName(name) !== wanted);
    saveSuperCategories(superCategories);
    superTabOrder = superTabOrder.filter((name) => name !== wanted);
    saveSuperTabOrder(superTabOrder);
    if (superIconMap[wanted]){
      delete superIconMap[wanted];
      saveSuperIconMap(superIconMap);
    }

    if (normalizeSuperName(activeSuper) === wanted) setActiveSuper(SUPER_ALL);
    else {
      renderCategories();
      refreshActiveTabClasses();
      render();
    }
    renderCategoryManager();
    return true;
  }

  function openCategoryContextMenu(catName, clientX, clientY){
    const cat = normalizeCategory(catName);
    if (!cat) return;
    closeAppContextMenu();
    const menu = ensureCategoryContextMenu();
    const catPath = splitCategoryPath(cat);
    const currentSuperKey = normalizeSuperName(catPath.super);
    const isInSuper = currentSuperKey !== normalizeSuperName(SUPER_GENERAL);

    const superList = [...superCategories]
      .filter((name) => {
        const lower = normalizeSuperName(name);
        return lower && lower !== normalizeSuperName(SUPER_ALL) && lower !== normalizeSuperName(SUPER_GENERAL);
      })
      .sort((a, b) => a.localeCompare(b, currentLang === "de" ? "de" : "en"));

    const removeBtn = `
      <button class="cat-context-item" type="button" data-action="remove-super" ${isInSuper ? "" : "disabled"}>
        ${escapeHtml(t("cat_ctx_remove_super"))}
      </button>
    `;
    const deleteBtn = `
      <button class="cat-context-item danger" type="button" data-action="delete-category">
        ${escapeHtml(t("cat_ctx_delete_category"))}
      </button>
    `;
    const moveLabel = `<div class="cat-context-label">${escapeHtml(t("cat_ctx_move_to_super"))}</div>`;
    const moveItems = superList.length
      ? superList.map((superName) => {
          const selected = normalizeSuperName(superName) === currentSuperKey;
          return `
            <button class="cat-context-item" type="button" data-action="move-super" data-super="${escapeHtml(superName)}" ${selected ? "disabled" : ""}>
              ${escapeHtml(superName)}
            </button>
          `;
        }).join("")
      : `<div class="cat-context-empty">${escapeHtml(t("cat_ctx_no_super"))}</div>`;

    menu.innerHTML = `${removeBtn}${deleteBtn}<div class="cat-context-sep"></div>${moveLabel}${moveItems}`;
    menu.hidden = false;
    catContextTarget = cat;
    catContextType = "category";

    const pad = 10;
    const maxX = window.innerWidth - menu.offsetWidth - pad;
    const maxY = window.innerHeight - menu.offsetHeight - pad;
    const left = Math.max(pad, Math.min(clientX, maxX));
    const top = Math.max(pad, Math.min(clientY, maxY));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function openSuperContextMenu(superName, clientX, clientY){
    const superLabel = normalizeCategory(superName);
    if (!superLabel) return;
    closeAppContextMenu();
    const menu = ensureCategoryContextMenu();
    menu.innerHTML = `
      <button class="cat-context-item danger" type="button" data-action="delete-super">
        ${escapeHtml(t("cat_ctx_delete_super"))}
      </button>
    `;
    menu.hidden = false;
    catContextTarget = superLabel;
    catContextType = "super";

    const pad = 10;
    const maxX = window.innerWidth - menu.offsetWidth - pad;
    const maxY = window.innerHeight - menu.offsetHeight - pad;
    const left = Math.max(pad, Math.min(clientX, maxX));
    const top = Math.max(pad, Math.min(clientY, maxY));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function clearTabSuperDropTarget(){
    if (!tabSuperDropTarget) return;
    tabSuperDropTarget.classList.remove("drop-target");
    tabSuperDropTarget = null;
  }

  function setTabSuperDropTarget(target){
    if (tabSuperDropTarget === target) return;
    clearTabSuperDropTarget();
    if (!target) return;
    target.classList.add("drop-target");
    tabSuperDropTarget = target;
  }

  function getTabSuperDropTargetAt(x, y){
    const target = document.elementFromPoint(x, y)?.closest(".tab-super");
    if (!target) return null;
    const superName = String(target.dataset.super || "");
    if (!superName) return null;
    return target;
  }

  function moveCategoryToSuper(catName, targetSuperName){
    const oldCategory = normalizeCategory(catName);
    if (!oldCategory) return false;

    const path = splitCategoryPath(oldCategory);
    const targetSuper = String(targetSuperName || SUPER_ALL);
    const leafName = normalizeCategory(path.label || path.leaf || oldCategory);
    if (!leafName) return false;

    let nextCategory = "";
    if (normalizeSuperName(targetSuper) === normalizeSuperName(SUPER_ALL)){
      nextCategory = leafName;
    } else {
      const cleanSuper = normalizeCategory(targetSuper);
      if (!cleanSuper) return false;
      nextCategory = normalizeCategory(`${cleanSuper} / ${leafName}`);
      const cleanSuperKey = normalizeSuperName(cleanSuper);
      if (!superCategories.some((name) => normalizeSuperName(name) === cleanSuperKey)){
        superCategories.push(cleanSuper);
        saveSuperCategories(superCategories);
      }
      if (!superTabOrder.includes(cleanSuperKey)){
        superTabOrder.push(cleanSuperKey);
        saveSuperTabOrder(superTabOrder);
      }
    }

    if (!nextCategory || nextCategory.toLowerCase() === oldCategory.toLowerCase()) return false;

    const existing = categories.find((c) => c.toLowerCase() === nextCategory.toLowerCase());
    const oldOrder = categoryOrders[oldCategory] || [];
    const oldIconKey = normalizeSuperName(oldCategory);
    const nextIconKey = normalizeSuperName(nextCategory);
    const existingIconKey = normalizeSuperName(existing || "");
    const oldIcon = categoryIconMap[oldIconKey] ? { ...categoryIconMap[oldIconKey] } : null;
    let iconMapChanged = false;

    if (existing && existing.toLowerCase() !== oldCategory.toLowerCase()){
      apps = apps.map((app) => (app.category === oldCategory ? { ...app, category: existing } : app));
      categories = categories.filter((c) => c.toLowerCase() !== oldCategory.toLowerCase());
      categoryTabOrder = categoryTabOrder.filter((c) => c.toLowerCase() !== oldCategory.toLowerCase());
      const mergedOrder = categoryOrders[existing] || [];
      const seen = new Set(mergedOrder);
      oldOrder.forEach((id) => {
        if (seen.has(id)) return;
        mergedOrder.push(id);
        seen.add(id);
      });
      categoryOrders[existing] = mergedOrder;
      delete categoryOrders[oldCategory];
      if (oldIcon && existingIconKey && !categoryIconMap[existingIconKey]){
        categoryIconMap[existingIconKey] = oldIcon;
        iconMapChanged = true;
      }
      if (categoryIconMap[oldIconKey]){
        delete categoryIconMap[oldIconKey];
        iconMapChanged = true;
      }
      if (activeTab === `cat:${oldCategory}`) activeTab = `cat:${existing}`;
    } else {
      apps = apps.map((app) => (app.category === oldCategory ? { ...app, category: nextCategory } : app));
      categories = categories.map((c) => (c.toLowerCase() === oldCategory.toLowerCase() ? nextCategory : c));
      categoryTabOrder = categoryTabOrder.map((c) => (c.toLowerCase() === oldCategory.toLowerCase() ? nextCategory : c));
      if (categoryOrders[oldCategory]){
        categoryOrders[nextCategory] = oldOrder;
        delete categoryOrders[oldCategory];
      }
      if (oldIcon){
        categoryIconMap[nextIconKey] = oldIcon;
        iconMapChanged = true;
      }
      if (categoryIconMap[oldIconKey]){
        delete categoryIconMap[oldIconKey];
        iconMapChanged = true;
      }
      if (activeTab === `cat:${oldCategory}`) activeTab = `cat:${nextCategory}`;
    }

    saveApps(apps);
    saveCategories(categories);
    saveCategoryTabOrder(categoryTabOrder);
    saveCategoryOrders(categoryOrders);
    if (iconMapChanged) saveCategoryIconMap(categoryIconMap);
    return true;
  }

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
      setTabSuperDropTarget(getTabSuperDropTargetAt(e.clientX, e.clientY));
      return;
    }
    tabLastReorderTs = now;

    const superTarget = getTabSuperDropTargetAt(e.clientX, e.clientY);
    setTabSuperDropTarget(superTarget);
    if (superTarget){
      if (tabGhost){
        tabGhost.style.left = (e.clientX - tabGhost.offsetWidth / 2) + "px";
        tabGhost.style.top = (e.clientY - tabGhost.offsetHeight / 2) + "px";
      }
      return;
    }

    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tab-cat");
    if (!target || target === tabDrag.tab) return;
    const rect = target.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
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
    let droppedToSuper = false;
    if (tabDrag.moved && tabSuperDropTarget){
      const draggedCategory = tabDrag.tab?.dataset?.cat || "";
      const targetSuper = tabSuperDropTarget.dataset.super || SUPER_ALL;
      droppedToSuper = moveCategoryToSuper(draggedCategory, targetSuper);
    }
    if (tabDrag.moved && tabSlot){
      if (droppedToSuper){
        tabDrag.tab.style.display = "";
      } else {
        const rects = recordTabRects();
        catTabs.insertBefore(tabDrag.tab, tabSlot);
        scheduleTabReflow(rects);
        tabDrag.tab.style.display = "";
      }
      tabSlot.remove();
    }
    if (tabDrag.moved){
      if (droppedToSuper){
        refreshAfterCategoryMove(activeSuper);
      } else {
        const visibleOrder = Array.from(catTabs.querySelectorAll(".tab-cat")).map(el => el.dataset.cat).filter(Boolean);
        const visibleSet = new Set(visibleOrder);
        const rest = getOrderedUserCategories().filter((cat) => !visibleSet.has(cat));
        categoryTabOrder = [...visibleOrder, ...rest];
        saveCategoryTabOrder(categoryTabOrder);
      }
      if (tabGhost && tabGhost.parentElement) tabGhost.parentElement.removeChild(tabGhost);
      tabGhost = null;
      tabSlot = null;
      clearTabSuperDropTarget();
    }
    tabDrag = null;
  });

  catTabs?.addEventListener("pointercancel", () => {
    if (tabGhost && tabGhost.parentElement) tabGhost.parentElement.removeChild(tabGhost);
    tabGhost = null;
    if (tabSlot && tabSlot.parentElement) tabSlot.parentElement.removeChild(tabSlot);
    tabSlot = null;
    if (tabDrag?.tab) tabDrag.tab.style.display = "";
    clearTabSuperDropTarget();
    tabDrag = null;
  });

  catTabs?.addEventListener("contextmenu", (e) => {
    const tab = e.target.closest(".tab-cat");
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation();
    openCategoryContextMenu(tab.dataset.cat || "", e.clientX, e.clientY);
  });

  overTabs?.addEventListener("contextmenu", (e) => {
    const tab = e.target.closest(".tab-super");
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation();
    openSuperContextMenu(tab.dataset.super || "", e.clientX, e.clientY);
  });

  // Disable native browser context menu everywhere in the app.
  // Keep custom context menus for tabs and app cards.
  document.addEventListener("contextmenu", (e) => {
    const isCatTab = Boolean(e.target.closest(".tab-cat"));
    const isSuperTab = Boolean(e.target.closest(".tab-super"));
    const isCard = Boolean(e.target.closest(".card"));
    const isInCatMenu = Boolean(e.target.closest(".cat-context-menu"));
    const isInAppMenu = Boolean(e.target.closest(".app-context-menu"));
    if (isCatTab || isSuperTab || isCard || isInCatMenu || isInAppMenu) return;
    e.preventDefault();
    closeCategoryContextMenu();
    closeAppContextMenu();
  }, true);

  document.addEventListener("pointerdown", (e) => {
    if (!catContextMenu || catContextMenu.hidden) return;
    if (catContextMenu.contains(e.target)) return;
    closeCategoryContextMenu();
  });
  document.addEventListener("pointerdown", (e) => {
    if (!appContextMenu || appContextMenu.hidden) return;
    if (appContextMenu.contains(e.target)) return;
    closeAppContextMenu();
  });

  document.addEventListener("scroll", () => {
    if (!catContextMenu || catContextMenu.hidden) return;
    closeCategoryContextMenu();
  }, true);
  document.addEventListener("scroll", () => {
    if (!appContextMenu || appContextMenu.hidden) return;
    closeAppContextMenu();
  }, true);
  document.addEventListener("scroll", hideSuperTooltip, true);
  document.addEventListener("scroll", hideRailTooltip, true);

  window.addEventListener("resize", closeCategoryContextMenu);
  window.addEventListener("resize", closeAppContextMenu);
  window.addEventListener("resize", hideSuperTooltip);
  window.addEventListener("resize", hideRailTooltip);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeCategoryContextMenu();
    closeAppContextMenu();
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-context-item");
    if (!btn || !catContextMenu || catContextMenu.hidden) return;
    const action = btn.dataset.action;
    const cat = catContextTarget;
    if (!cat) return closeCategoryContextMenu();

    if (action === "remove-super"){
      const moved = moveCategoryToSuper(cat, SUPER_ALL);
      if (moved) refreshAfterCategoryMove(activeSuper);
      closeCategoryContextMenu();
      return;
    }

    if (action === "delete-category" && catContextType === "category"){
      openConfirm(t("confirm_delete_category", { name: cat }), () => {
        deleteCategoryByName(cat);
      });
      closeCategoryContextMenu();
      return;
    }

    if (action === "move-super"){
      const targetSuper = normalizeCategory(btn.dataset.super || "");
      if (!targetSuper) return closeCategoryContextMenu();
      const moved = moveCategoryToSuper(cat, targetSuper);
      if (moved) refreshAfterCategoryMove(activeSuper);
      closeCategoryContextMenu();
      return;
    }

    if (action === "delete-super" && catContextType === "super"){
      openConfirm(t("confirm_delete_category", { name: cat }), () => {
        deleteSuperCategoryByName(cat);
      });
      closeCategoryContextMenu();
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".app-context-item");
    if (!btn || !appContextMenu || appContextMenu.hidden) return;
    const app = findAppById(appContextTarget);
    if (!app) return closeAppContextMenu();
    const action = btn.dataset.action || "";

    if (action === "toggle-favorite"){
      app.fav = !app.fav;
      saveApps(apps);
      closeAppContextMenu();
      render();
      return;
    }
    if (action === "edit-app"){
      closeAppContextMenu();
      openEditModal(app);
      return;
    }
    if (action === "delete-app"){
      closeAppContextMenu();
      openConfirm(t("confirm_delete_app", { name: app.name }), () => {
        apps = apps.filter((a) => a.id !== app.id);
        saveApps(apps);
        render();
      });
    }
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
  grid?.addEventListener("contextmenu", (e) => {
    const card = e.target.closest(".card");
    if (!card || !grid.contains(card)) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClickId = card.dataset.id || null;
    openAppContextMenu(card.dataset.id || "", e.clientX, e.clientY);
  });
  pinnedRow?.addEventListener("contextmenu", (e) => {
    const card = e.target.closest(".card");
    if (!card || !pinnedRow.contains(card)) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClickId = card.dataset.id || null;
    openAppContextMenu(card.dataset.id || "", e.clientX, e.clientY);
  });
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // Submit -> add app
  submitBtn?.addEventListener("click", () => {
    let name = document.getElementById("appName")?.value?.trim();
    let launch = document.getElementById("appUrl")?.value?.trim();
    let cat  = document.getElementById("appCategory")?.value || "";
    const appHotkey = String(appHotkeyInput?.value || "").trim();
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
      const app = scanApps.find(a => (a.launch || a.path || "") === selected);
      if (iconState?.type !== "custom" && app?.icon){
        iconState = { type:"custom", value: app.icon };
      }
    }

    if(!name || !launch){
      alert(t("alert_fill_required"));
      return;
    }
    if (appHotkey){
      apps.forEach((item) => {
        if (!item || item.id === editingId) return;
        if (normalizeShortcutText(item.hotkey) === normalizeShortcutText(appHotkey)){
          item.hotkey = "";
        }
      });
    }
    if (!categories.some(c => c.toLowerCase() === String(cat).toLowerCase()) || String(cat).toLowerCase() === "sonstiges"){
      cat = categories.find((c) => String(c).toLowerCase() !== "sonstiges") || categories[0] || "";
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
          hotkey: appHotkey,
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
        hotkey: appHotkey,
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
    if (appHotkeyInput) appHotkeyInput.value = "";
    if (appCategory){
      appCategory.value = "";
    }
    document.getElementById("appType").value = "scan";
    iconState = { type:"favicon", value:"" };
    setIconNone();
    syncTypeUI();

    closeModal();
    render();
  });

  // initial
  applyCategoryRailState();
  renderCategories();
  setIconNone();
  syncTypeUI();
  render();
  setTimeout(bootstrapVoiceControl, 900);
  document.addEventListener("pointerdown", bootstrapVoiceControl, { once: true });
});




