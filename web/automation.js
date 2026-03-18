(function (){
  function createAutomationSurface(options){
    const root = options?.root || null;
    const getLang = typeof options?.getLang === "function" ? options.getLang : (() => "de");
    const escapeHtml = typeof options?.escapeHtml === "function"
      ? options.escapeHtml
      : ((str) => String(str)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;"));

    if (!root){
      return { render(){} };
    }

    let selectedAutomationId = "";

    const AUTOMATION_CATALOG = [
      {
        id: "apps-files",
        icon: "📂",
        name: "Apps & Dateien",
        type: "apps_files",
        descDe: "Aktionen zum Starten oder Öffnen von Programmen, Webseiten, Ordnern oder Dateien.",
        descEn: "Actions for launching or opening applications, websites, folders, or files."
      },
      {
        id: "keyboard-input",
        icon: "⌨️",
        name: "Keyboard Input",
        type: "keyboard",
        descDe: "Simuliert Tastatureingaben: einzelne Tasten, Kombinationen oder Sequenzen mit Delay.",
        descEn: "Simulates keyboard input: single keys, key combinations, or delayed sequences."
      },
      {
        id: "mouse-input",
        icon: "🖱️",
        name: "Mouse Input",
        type: "mouse",
        descDe: "Führt Mausbewegungen und Interaktionen aus: Klicks, Scrollen, Bewegung, Drag & Drop.",
        descEn: "Performs mouse movement and interactions: clicks, scrolling, movement, drag & drop."
      },
      {
        id: "automations",
        icon: "🧩",
        name: "Automationen",
        type: "automations",
        descDe: "Kombiniert mehrere Aktionen in einem Ablauf, z. B. Keyboard + Maus + Apps + Delays.",
        descEn: "Combines multiple actions in one flow, e.g. keyboard + mouse + apps + delays."
      },
      {
        id: "system",
        icon: "⚙️",
        name: "System",
        type: "system",
        descDe: "Steuert Systemfunktionen wie Lautstärke, Mikrofon, Mediensteuerung oder Screenshots.",
        descEn: "Controls system functions like volume, microphone, media control, or screenshots."
      }
    ];

    function render(){
      const isDe = getLang() === "de";
      const cardsHtml = AUTOMATION_CATALOG.map((item) => {
        const active = item.id === selectedAutomationId;
        return `
          <article class="automation-card${active ? " active" : ""}" data-automation-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-pressed="${active ? "true" : "false"}">
            <div class="automation-card-icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
            <h3 class="automation-card-title">${escapeHtml(item.name)}</h3>
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

    return { render };
  }

  window.AutomationSurface = {
    create: createAutomationSurface
  };
})();

