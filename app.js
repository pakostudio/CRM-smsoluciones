const gerencias = [
  { area: "Produccion", label: "Producción", manager: "Luis Ortega", email: "produccion@menlun.com", pin: "2401", role: "Gerente de Producción", frequency: "Semanal", status: "Activo", lastReport: "2026-06-03", budget: 680000 },
  { area: "Calidad", label: "Calidad", manager: "Mariana Ruiz", email: "calidad@menlun.com", pin: "2402", role: "Gerente de Calidad", frequency: "Semanal", status: "Activo", lastReport: "2026-06-03", budget: 310000 },
  { area: "Compras", label: "Compras", manager: "Rafael Torres", email: "compras@menlun.com", pin: "2403", role: "Gerente de Compras", frequency: "Quincenal", status: "Activo", lastReport: "2026-05-31", budget: 520000 },
  { area: "Almacen", label: "Almacén", manager: "Sofia Campos", email: "almacen@menlun.com", pin: "2404", role: "Gerente de Almacén", frequency: "Semanal", status: "Activo", lastReport: "2026-06-02", budget: 420000 },
  { area: "Logistica", label: "Logística", manager: "Jorge Vidal", email: "logistica@menlun.com", pin: "2405", role: "Gerente de Logística", frequency: "Semanal", status: "Activo", lastReport: "2026-06-02", budget: 640000 },
  { area: "Mantenimiento", label: "Mantenimiento", manager: "Elena Ponce", email: "mantenimiento@menlun.com", pin: "2406", role: "Gerente de Mantenimiento", frequency: "Quincenal", status: "Activo", lastReport: "2026-06-01", budget: 380000 },
  { area: "Ventas", label: "Ventas", manager: "Pablo Ibarra", email: "ventas@menlun.com", pin: "2407", role: "Gerente Comercial", frequency: "Mensual", status: "Activo", lastReport: "2026-05-30", budget: 290000 },
  { area: "Recursos Humanos", label: "Recursos Humanos", manager: "Claudia Rios", email: "rh@menlun.com", pin: "2408", role: "Gerente de Recursos Humanos", frequency: "Mensual", status: "Activo", lastReport: "2026-05-29", budget: 260000 },
  { area: "Contabilidad", label: "Contabilidad", manager: "Hector Silva", email: "contabilidad@menlun.com", pin: "2409", role: "Gerente de Contabilidad", frequency: "Quincenal", status: "Activo", lastReport: "2026-05-31", budget: 210000 },
  { area: "Sistemas", label: "Sistemas", manager: "Nadia Luna", email: "sistemas@menlun.com", pin: "2410", role: "Gerente de Sistemas", frequency: "Mensual", status: "Inactivo", lastReport: "2026-05-24", budget: 450000 },
];

const demoUsers = [
  { name: "Pako", role: "Administrador General", email: "pako@menlun.com", password: "1234", pin: "1234", access: "all" },
  { name: "Carmen", role: "Acceso Total Operativo", email: "carmen@menlun.com", password: "1234", pin: "1234", access: "all" },
  { name: "Direccion General", role: "Vista Ejecutiva", email: "direccion@menlun.com", password: "1234", pin: "1234", access: "executive" },
  ...gerencias.map((item) => ({
    name: item.manager,
    role: item.role,
    email: item.email,
    password: item.pin,
    pin: item.pin,
    access: "area",
    area: item.area,
  })),
];

let reports = [
  { id: 1, date: "2026-06-04", area: "Produccion", responsible: "Luis Ortega", frequency: "Semanal", type: "gasto", amount: 184500, priority: "alta", status: "pendiente", description: "Compra urgente para línea 2", evidence: "cotizacion-linea2.pdf", comments: "Fuera de presupuesto por demanda extraordinaria.", due: "2026-06-05" },
  { id: 2, date: "2026-06-03", area: "Calidad", responsible: "Mariana Ruiz", frequency: "Semanal", type: "incidencia", amount: 0, priority: "alta", status: "falta evidencia", description: "Validación incompleta de lote A-91", evidence: "", comments: "Falta evidencia fotográfica.", due: "2026-06-04" },
  { id: 3, date: "2026-06-03", area: "Compras", responsible: "Rafael Torres", frequency: "Quincenal", type: "solicitud", amount: 76500, priority: "media", status: "en revision", description: "Alta de proveedor alterno", evidence: "expediente-proveedor.pdf", comments: "Pendiente dictamen.", due: "2026-06-07" },
  { id: 4, date: "2026-06-02", area: "Almacen", responsible: "Sofia Campos", frequency: "Semanal", type: "reporte operativo", amount: 32800, priority: "media", status: "aprobado", description: "Ajuste de inventario por diferencia física", evidence: "conteo-ciclico.xlsx", comments: "Autorizado por operaciones.", due: "2026-06-03" },
  { id: 5, date: "2026-06-02", area: "Logistica", responsible: "Jorge Vidal", frequency: "Semanal", type: "gasto", amount: 142300, priority: "alta", status: "pendiente", description: "Rutas extraordinarias zona norte", evidence: "rutas-junio.pdf", comments: "Fuera de presupuesto.", due: "2026-06-04" },
  { id: 6, date: "2026-06-01", area: "Mantenimiento", responsible: "Elena Ponce", frequency: "Quincenal", type: "incidencia", amount: 58900, priority: "alta", status: "en ejecucion", description: "Falla crítica en compresor", evidence: "orden-servicio.pdf", comments: "Atención en proceso.", due: "2026-06-02" },
  { id: 7, date: "2026-06-01", area: "Ventas", responsible: "Pablo Ibarra", frequency: "Mensual", type: "solicitud", amount: 94000, priority: "media", status: "pendiente", description: "Descuento especial cliente clave", evidence: "caso-comercial.pdf", comments: "Requiere autorización.", due: "2026-06-08" },
  { id: 8, date: "2026-05-31", area: "Recursos Humanos", responsible: "Claudia Rios", frequency: "Mensual", type: "mejora", amount: 0, priority: "baja", status: "cerrado", description: "Actualización de matriz de capacitación", evidence: "matriz-rh.xlsx", comments: "Completado.", due: "2026-06-01" },
  { id: 9, date: "2026-05-31", area: "Contabilidad", responsible: "Hector Silva", frequency: "Quincenal", type: "reporte operativo", amount: 0, priority: "alta", status: "pendiente", description: "Reporte de cierre parcial", evidence: "", comments: "Reporte vencido.", due: "2026-06-01" },
  { id: 10, date: "2026-05-30", area: "Sistemas", responsible: "Nadia Luna", frequency: "Mensual", type: "gasto", amount: 116200, priority: "media", status: "rechazado", description: "Licenciamiento no presupuestado", evidence: "cotizacion-saas.pdf", comments: "Replantear alcance.", due: "2026-06-06" },
  { id: 11, date: "2026-06-04", area: "Produccion", responsible: "Luis Ortega", frequency: "Semanal", type: "ahorro", amount: 42000, priority: "media", status: "aprobado", description: "Ahorro por cambio de turno", evidence: "ahorro-turno.xlsx", comments: "Impacto validado.", due: "2026-06-05" },
  { id: 12, date: "2026-06-04", area: "Calidad", responsible: "Mariana Ruiz", frequency: "Semanal", type: "ahorro", amount: 18000, priority: "baja", status: "cerrado", description: "Reducción de retrabajo", evidence: "retrabajo.pdf", comments: "Cerrado.", due: "2026-06-05" },
];

const calendarEvents = [
  { day: 3, title: "Corte semanal", type: "Semanal" },
  { day: 7, title: "Vencimientos de tareas", type: "Tareas" },
  { day: 14, title: "Corte quincenal", type: "Quincenal" },
  { day: 18, title: "Junta de operaciones", type: "Junta" },
  { day: 21, title: "Corte semanal", type: "Semanal" },
  { day: 28, title: "Corte quincenal", type: "Quincenal" },
  { day: 30, title: "Cierre mensual", type: "Mensual" },
];

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#login-error");
const logoImages = document.querySelectorAll("[data-logo]");
const navButtons = document.querySelectorAll(".module-nav button");
const adminOnlyItems = document.querySelectorAll("[data-admin-only]");
const moduleArea = document.querySelector("#module-area");
const moduleTitle = document.querySelector("#module-title");
const userChip = document.querySelector("#user-chip");
const appContent = document.querySelector("#app-content");

let activeUser = null;

logoImages.forEach((logo) => {
  const showFallback = () => logo.closest(".logo-frame").classList.add("logo-missing");
  const showLogo = () => logo.closest(".logo-frame").classList.remove("logo-missing");

  logo.addEventListener("load", showLogo);
  logo.addEventListener("error", showFallback);
  if (logo.complete && logo.naturalWidth > 0) showLogo();
  if (logo.complete && logo.naturalWidth === 0) showFallback();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const secret = passwordInput.value.trim();
  const user = demoUsers.find((item) => item.email === email && (item.password === secret || item.pin === secret));

  if (!user) {
    loginError.textContent = "Usuario, contraseña o PIN incorrecto.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  activeUser = user;
  loginError.textContent = "";
  userChip.textContent = `${user.name} - ${user.role}`;
  document.body.classList.remove("is-login");
  document.body.classList.add("is-app");
  applyVisibilityRules();
  navigateInitialView();
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.hidden) return;
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    navigate(button.dataset.view, button.dataset.module, button.dataset.area, button.dataset.areaKey);
  });
});

appContent.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const target = button.dataset.target || "registro";

  if (action === "new-management") notify("Nueva gerencia demo lista para capturarse cuando exista backend.");
  if (action === "edit-management") notify(`Edición demo abierta para ${target}.`);
  if (action === "disable-management") notify(`${target} marcado para desactivación demo.`);
  if (action === "review-report") notify(`Revisión demo abierta para reporte ${target}.`);
});

function applyVisibilityRules() {
  adminOnlyItems.forEach((item) => {
    item.hidden = !hasFullAccess();
  });

  navButtons.forEach((button) => {
    if (button.dataset.view === "carmen") button.hidden = !hasFullAccess();
    if (button.dataset.view === "capture") button.hidden = activeUser.access === "executive";
    if (button.dataset.view === "kanban") button.hidden = activeUser.access === "executive";
    if (button.dataset.view === "executive" && activeUser.access === "area") button.hidden = true;
    if (button.dataset.view === "area" && activeUser.access === "area") {
      button.hidden = button.dataset.areaKey !== activeUser.area;
    }
  });
}

function navigateInitialView() {
  let target = document.querySelector('[data-view="executive"]');

  if (activeUser.access === "area") {
    target = document.querySelector(`[data-view="area"][data-area-key="${activeUser.area}"]`);
  }

  navButtons.forEach((item) => item.classList.remove("active"));
  target.classList.add("active");
  navigate(target.dataset.view, target.dataset.module, target.dataset.area, target.dataset.areaKey);
}

function navigate(view, title, area, areaKey) {
  moduleTitle.textContent = title;
  moduleArea.textContent = area;

  if (view === "executive") renderExecutiveDashboard();
  if (view === "carmen") renderCarmenPanel();
  if (view === "capture") renderCaptureForm(areaKey);
  if (view === "kanban") renderKanban();
  if (view === "calendar") renderCalendar();
  if (view === "management") renderManagementPanel();
  if (view === "area") renderAreaModule(areaKey);
}

function hasFullAccess() {
  return activeUser && activeUser.access === "all";
}

function visibleReports() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return reports;
  return reports.filter((report) => report.area === activeUser.area);
}

function areaReports(area) {
  return visibleReports().filter((report) => report.area === area);
}

function renderExecutiveDashboard() {
  const items = visibleReports();
  const budgetUsed = sum(items.filter((item) => item.type === "gasto"), "amount");
  const budgetTotal = gerencias.reduce((total, item) => total + item.budget, 0);
  const savings = sum(items.filter((item) => item.type === "ahorro"), "amount");
  const openIncidents = items.filter((item) => item.type === "incidencia" && !["cerrado", "rechazado"].includes(item.status)).length;
  const overdueReports = items.filter((item) => item.status === "pendiente" && item.due < "2026-06-04").length;
  const pendingRequests = items.filter((item) => item.type === "solicitud" && ["pendiente", "en revision"].includes(item.status)).length;

  appContent.innerHTML = `
    ${sectionHeading("Dashboard ejecutivo", "KPIs de operación y cumplimiento", scopeText())}
    <section class="executive-grid">
      ${metricCard("Presupuesto usado", `${Math.round((budgetUsed / budgetTotal) * 100)}%`)}
      ${metricCard("Gastos por gerencia", formatCurrency(budgetUsed))}
      ${metricCard("Ahorro generado", formatCurrency(savings))}
      ${metricCard("Incidencias abiertas", openIncidents)}
      ${metricCard("Reportes vencidos", overdueReports)}
      ${metricCard("Solicitudes pendientes", pendingRequests)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Cumplimiento</p><h3>Cumplimiento por gerencia</h3></div></div>
      ${renderTable(["Gerencia", "Presupuesto usado", "Reportes", "Cumplimiento", "Estatus"], gerencias.map((item) => {
        const rows = reports.filter((report) => report.area === item.area);
        const spent = sum(rows.filter((report) => report.type === "gasto"), "amount");
        const closed = rows.filter((report) => ["aprobado", "cerrado"].includes(report.status)).length;
        const compliance = rows.length ? Math.round((closed / rows.length) * 100) : 0;
        return [item.label, formatCurrency(spent), rows.length, `${compliance}%`, badge(compliance >= 70 ? "Activo" : "Pendiente", compliance >= 70 ? "status-activo" : "status-pendiente")];
      }))}
    </section>
  `;
}

function renderCarmenPanel() {
  const items = visibleReports();
  appContent.innerHTML = `
    ${sectionHeading("Panel Carmen", "Control ejecutivo de autorizaciones", scopeText())}
    <section class="executive-grid">
      ${metricCard("Reportes pendientes", items.filter((item) => item.status === "pendiente").length)}
      ${metricCard("Solicitudes por aprobar", items.filter((item) => item.type === "solicitud" && ["pendiente", "en revision"].includes(item.status)).length)}
      ${metricCard("Gastos fuera de presupuesto", items.filter((item) => item.type === "gasto" && item.amount > 90000).length)}
      ${metricCard("Incidencias críticas", items.filter((item) => item.type === "incidencia" && item.priority === "alta").length)}
      ${metricCard("Evidencias faltantes", items.filter((item) => !item.evidence || item.status === "falta evidencia").length)}
      ${metricCard("Tareas vencidas", items.filter((item) => item.due < "2026-06-04" && !["cerrado", "aprobado"].includes(item.status)).length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Autorizaciones</p><h3>Bandeja de autorización</h3></div></div>
      ${renderTable(["Fecha", "Gerencia", "Responsable", "Tipo", "Monto", "Prioridad", "Estatus", "Acción"], items.map((item) => [
        item.date, item.area, item.responsible, item.type, formatCurrency(item.amount), priorityBadge(item.priority), statusBadge(item.status), `<button class="action-button" type="button" data-action="review-report" data-target="${item.id}">Revisar</button>`
      ]))}
    </section>
  `;
}

function renderManagementPanel() {
  if (!hasFullAccess()) {
    renderExecutiveDashboard();
    return;
  }

  appContent.innerHTML = `
    <section class="content-card">
      <div class="section-heading">
        <div><p class="eyebrow">Administración</p><h3>Gerencias</h3></div>
        <button class="primary-button" type="button" data-action="new-management">Nueva gerencia</button>
      </div>
      ${renderTable(["Gerencia", "Gerente", "Email", "PIN", "Rol", "Frecuencia", "Estatus", "Último reporte", "Acción"], gerencias.map((item) => [
        item.label, item.manager, item.email, item.pin, item.role, item.frequency, statusBadge(item.status.toLowerCase()), item.lastReport,
        `<div class="row-actions"><button class="secondary-button" type="button" data-action="edit-management" data-target="${item.label}">Editar</button><button class="secondary-button" type="button" data-action="disable-management" data-target="${item.label}">Desactivar</button></div>`
      ]), "management-table")}
    </section>
  `;
}

function renderAreaModule(area) {
  if (activeUser.access === "area" && activeUser.area !== area) {
    renderExecutiveDashboard();
    return;
  }

  const meta = gerencias.find((item) => item.area === area);
  const items = areaReports(area);
  const gastos = sum(items.filter((item) => item.type === "gasto"), "amount");
  const ahorros = sum(items.filter((item) => item.type === "ahorro"), "amount");

  appContent.innerHTML = `
    ${sectionHeading(meta.label, `Responsable: ${meta.manager}`, meta.status)}
    <section class="executive-grid">
      ${metricCard("Reportes capturados", items.length)}
      ${metricCard("Gastos", formatCurrency(gastos))}
      ${metricCard("Incidencias", items.filter((item) => item.type === "incidencia").length)}
      ${metricCard("Solicitudes", items.filter((item) => item.type === "solicitud").length)}
      ${metricCard("Ahorros", formatCurrency(ahorros))}
      ${metricCard("Evidencias", items.filter((item) => item.evidence).length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Resumen del área</p><h3>Estatus operativo</h3></div>${statusBadge(meta.status.toLowerCase())}</div>
      <p class="muted-copy">Frecuencia de reporte: ${meta.frequency}. Último reporte: ${meta.lastReport}. Presupuesto asignado: ${formatCurrency(meta.budget)}.</p>
      ${renderReportTable(items)}
    </section>
  `;
}

function renderCaptureForm() {
  if (activeUser.access === "executive") {
    renderExecutiveDashboard();
    return;
  }

  const availableAreas = activeUser.access === "area" ? gerencias.filter((item) => item.area === activeUser.area) : gerencias;
  appContent.innerHTML = `
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Captura</p><h3>Formulario general de reportes</h3></div></div>
      <form class="report-form" id="report-form">
        ${inputField("Fecha", "date", "report-date", "2026-06-04")}
        <label>Gerencia<select id="report-area">${availableAreas.map((item) => `<option value="${item.area}">${item.label}</option>`).join("")}</select></label>
        <label>Responsable<input id="report-responsible" type="text" value="${activeUser.name}"></label>
        <label>Frecuencia<select id="report-frequency"><option>semanal</option><option>quincenal</option><option>mensual</option></select></label>
        <label>Tipo<select id="report-type"><option>gasto</option><option>incidencia</option><option>solicitud</option><option>ahorro</option><option>mejora</option><option>reporte operativo</option></select></label>
        <label>Monto<input id="report-amount" type="number" min="0" value="0"></label>
        <label>Prioridad<select id="report-priority"><option>alta</option><option>media</option><option>baja</option></select></label>
        <label>Estatus<select id="report-status"><option>pendiente</option><option>en revision</option><option>falta evidencia</option><option>aprobado</option><option>rechazado</option><option>en ejecucion</option><option>cerrado</option></select></label>
        <label class="field-wide">Descripción<textarea id="report-description">Reporte demo capturado desde MVP v1.0</textarea></label>
        <label>Evidencia simulada<input id="report-evidence" type="text" placeholder="archivo-demo.pdf"></label>
        <label class="field-wide">Comentarios<textarea id="report-comments">Sin comentarios adicionales.</textarea></label>
        <div class="form-actions"><button class="primary-button" type="submit">Guardar reporte demo</button></div>
      </form>
    </section>
  `;

  document.querySelector("#report-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedArea = document.querySelector("#report-area").value;

    reports.unshift({
      id: reports.length + 1,
      date: document.querySelector("#report-date").value,
      area: selectedArea,
      responsible: document.querySelector("#report-responsible").value,
      frequency: document.querySelector("#report-frequency").value,
      type: document.querySelector("#report-type").value,
      amount: Number(document.querySelector("#report-amount").value || 0),
      priority: document.querySelector("#report-priority").value,
      status: document.querySelector("#report-status").value,
      description: document.querySelector("#report-description").value,
      evidence: document.querySelector("#report-evidence").value,
      comments: document.querySelector("#report-comments").value,
      due: "2026-06-10",
    });

    const areaButton = document.querySelector(`[data-view="area"][data-area-key="${selectedArea}"]`);
    if (areaButton) {
      navButtons.forEach((item) => item.classList.remove("active"));
      areaButton.classList.add("active");
      moduleTitle.textContent = areaButton.dataset.module;
      moduleArea.textContent = areaButton.dataset.area;
    }

    notify("Reporte demo guardado correctamente.");
    renderAreaModule(selectedArea);
  });
}

function renderKanban() {
  const columns = ["pendiente", "en revision", "falta evidencia", "aprobado", "rechazado", "en ejecucion", "cerrado"];
  const items = visibleReports();
  appContent.innerHTML = `
    ${sectionHeading("Kanban", "Seguimiento por estatus", scopeText())}
    <section class="kanban-board">
      ${columns.map((status) => `
        <article class="kanban-column">
          <h3>${titleCase(status)}</h3>
          ${items.filter((item) => item.status === status).map((item) => `
            <div class="kanban-card">
              <strong>${item.area}</strong>
              <span>${item.type} - ${item.responsible}</span>
              <small>${priorityBadge(item.priority)} ${formatCurrency(item.amount)}</small>
            </div>
          `).join("") || `<p class="muted-copy">Sin registros</p>`}
        </article>
      `).join("")}
    </section>
  `;
}

function renderCalendar() {
  appContent.innerHTML = `
    ${sectionHeading("Calendario", "Junio 2026", scopeText())}
    <section class="calendar-grid">
      ${Array.from({ length: 30 }, (_, index) => {
        const day = index + 1;
        const events = calendarEvents.filter((event) => event.day === day);
        return `<article class="calendar-day"><strong>${day}</strong>${events.map((event) => `<span>${event.title}</span>`).join("")}</article>`;
      }).join("")}
    </section>
  `;
}

function renderReportTable(items) {
  return renderTable(["Fecha", "Tipo", "Monto", "Prioridad", "Estatus", "Evidencia", "Descripción"], items.map((item) => [
    item.date, item.type, formatCurrency(item.amount), priorityBadge(item.priority), statusBadge(item.status), item.evidence || "Faltante", item.description
  ]));
}

function renderTable(headers, rows, extraClass = "") {
  return `<div class="table-wrap"><table class="${extraClass}"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function sectionHeading(kicker, title, pill) {
  return `<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h3>${title}</h3></div><span class="scope-pill">${pill}</span></div>`;
}

function metricCard(label, value) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function inputField(label, type, id, value) {
  return `<label>${label}<input id="${id}" type="${type}" value="${value}"></label>`;
}

function priorityBadge(value) {
  return badge(titleCase(value), `priority-${normalizeClassName(value)}`);
}

function statusBadge(value) {
  return badge(titleCase(value), `status-${normalizeClassName(value)}`);
}

function badge(text, className) {
  return `<span class="badge ${className}">${text}</span>`;
}

function formatCurrency(amount) {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(amount);
}

function sum(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function scopeText() {
  if (!activeUser || activeUser.access === "all") return "Vista total";
  if (activeUser.access === "executive") return "Vista ejecutiva";
  return `Vista: ${activeUser.area}`;
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeClassName(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function notify(message) {
  let toast = document.querySelector("#app-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(notify.timeoutId);
  notify.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}
