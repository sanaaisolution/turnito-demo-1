// ============================================
// VISTA: RRHH / ADMIN
// ============================================

function renderRRHHDashboard(subview = 'empleados') {
  const views = {
    empleados: renderRRHHEmpleados,
    turnos: renderRRHHTurnos,
    nominas: renderRRHHNominas,
    centros: renderRRHHCentros,
    configuracion: renderRRHHConfig,
  };
  return (views[subview] || views.empleados)();
}

// ---- Sub-nav helper ----
function renderRRHHSubnav(active) {
  const items = [
    { id:'empleados', label:'Empleados', icon:Icons.users },
    { id:'turnos', label:'Turnos y Horarios', icon:Icons.clock },
    { id:'nominas', label:'Nóminas', icon:Icons.dollarSign },
    { id:'centros', label:'Centros/Sedes', icon:Icons.building },
    { id:'configuracion', label:'Configuración', icon:Icons.settings },
  ];
  return `
    <div class="tabs mb-5">
      ${items.map(i => `
        <button class="tab-btn ${active===i.id?'active':''}" onclick="loadRRHHSubview('${i.id}')">
          ${i.icon} ${i.label}
        </button>
      `).join('')}
    </div>
  `;
}

function loadRRHHSubview(subview) {
  const view = document.getElementById('view-rrhh');
  if (!view) return;
  const content = document.getElementById('rrhh-content');
  if (content) content.innerHTML = renderRRHHSubnav(subview) + renderRRHHDashboard(subview);
}

// ---- Empleados ----
function renderRRHHEmpleados() {
  const tipoPill = { indefinido:'pill-green', temporal:'pill-amber', practicas:'pill-blue', autonomo:'pill-purple' };
  const estadoPill = { activo:'pill-green', baja:'pill-red', vacaciones:'pill-amber' };

  return `
  <div class="flex justify-between items-center mb-4">
    <div class="flex gap-3">
      <input class="form-control" style="width:220px;" placeholder="Buscar empleado..." oninput="filterEmpleados(this.value)">
      <select class="form-control" style="width:160px;" onchange="filterEmpleadosByField('centro',this.value)">
        <option value="">Todos los centros</option>
        ${DEMO_DATA.centros.map(c=>`<option>${c.nombre}</option>`).join('')}
      </select>
      <select class="form-control" style="width:160px;" onchange="filterEmpleadosByField('estado',this.value)">
        <option value="">Todos los estados</option>
        <option>activo</option><option>baja</option><option>vacaciones</option>
      </select>
    </div>
    <button class="btn btn-primary" onclick="openModal('modal-nuevo-empleado')">${Icons.plus} Nuevo empleado</button>
  </div>
  <div class="card">
    <div class="table-container">
      <table class="table" id="empleados-table">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Centro</th><th>Puesto</th><th>Contrato</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          ${AppState.empleados.map(e => `
            <tr>
              <td><code style="color:var(--accent-blue);font-size:12px;">${e.codigo}</code></td>
              <td>
                <div class="flex items-center gap-2">
                  <div style="width:30px;height:30px;border-radius:50%;background:${e.color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#0a0e14;flex-shrink:0;">${e.avatar}</div>
                  <strong>${e.nombre}</strong>
                </div>
              </td>
              <td class="text-muted">${e.centro}</td>
              <td>${e.puesto}</td>
              <td><span class="pill ${tipoPill[e.tipo_contrato]||'pill-gray'}">${e.tipo_contrato}</span></td>
              <td><span class="pill ${estadoPill[e.estado]||'pill-gray'}">${e.estado}</span></td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-secondary" onclick="openModal('modal-ficha-empleado')" title="Ver ficha">${Icons.eye}</button>
                  <button class="btn btn-sm btn-blue" title="Editar">${Icons.edit}</button>
                  <button class="btn btn-sm btn-ghost" title="Documentos">${Icons.filetext}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// ---- Turnos ----
function renderRRHHTurnos() {
  const days = ['L','M','X','J','V','S','D'];
  const turns = [
    { name:'Mañana', short:'M', class:'morning', time:'09:00-17:00' },
    { name:'Tarde', short:'T', class:'afternoon', time:'14:00-22:00' },
    { name:'Noche', short:'N', class:'night', time:'22:00-06:00' },
  ];

  const patterns = {
    'e1': ['morning','morning','morning','morning','morning','off','off'],
    'e2': ['off','off','afternoon','afternoon','afternoon','afternoon','afternoon'],
    'e3': ['off','off','off','off','off','off','off'],
    'e4': ['night','night','off','night','night','off','off'],
    'e5': ['morning','morning','morning','morning','morning','off','off'],
    'e6': ['off','off','off','off','off','off','off'],
  };

  return `
  <div class="grid-3 mb-5">
    ${turns.map(t => `
      <div class="card" style="border-color:${t.class==='morning'?'rgba(0,229,160,0.2)':t.class==='afternoon'?'rgba(167,139,250,0.2)':'rgba(96,165,250,0.2)'};">
        <div class="card-title mb-2">${t.name}</div>
        <div style="font-size:22px;font-weight:800;font-family:'Syne',sans-serif;margin-bottom:6px;color:${t.class==='morning'?'var(--accent-green)':t.class==='afternoon'?'var(--accent-purple)':'var(--accent-blue)'};">${t.time}</div>
        <div class="text-xs text-muted">${t.name==='Noche'?'⭐ Nocturnidad aplicada':''}</div>
      </div>
    `).join('')}
  </div>
  <div class="card">
    <div class="card-header">
      <div class="card-title">${Icons.calendar} Cuadrante semanal</div>
      <div class="flex gap-3 items-center">
        <span class="text-sm text-muted">Semana 11 · 10-16 Mar 2026</span>
        <button class="btn btn-sm btn-secondary">◀</button>
        <button class="btn btn-sm btn-secondary">▶</button>
      </div>
    </div>
    <div style="overflow-x:auto;">
      <div class="schedule-grid" style="min-width:700px;">
        <div class="schedule-header">Empleado</div>
        ${days.map(d => `<div class="schedule-header">${d}</div>`).join('')}
        ${AppState.empleados.map(e => `
          <div class="schedule-employee-name">
            <div style="width:24px;height:24px;border-radius:50%;background:${e.color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#0a0e14;flex-shrink:0;">${e.avatar}</div>
            <span style="font-size:12px;">${e.nombre.split(' ')[0]}</span>
          </div>
          ${(patterns[e.id]||['off','off','off','off','off','off','off']).map(t => `
            <div class="schedule-cell ${t}" title="${t==='morning'?'09:00-17:00':t==='afternoon'?'14:00-22:00':t==='night'?'22:00-06:00':'-'}" onclick="editTurnoCell(this)">
              ${t==='morning'?'M':t==='afternoon'?'T':t==='night'?'N':'–'}
            </div>
          `).join('')}
        `).join('')}
      </div>
    </div>
    <div class="flex gap-3 mt-4" style="flex-wrap:wrap;">
      <span class="schedule-cell morning" style="padding:4px 12px;cursor:default;">M Mañana 09-17</span>
      <span class="schedule-cell afternoon" style="padding:4px 12px;cursor:default;">T Tarde 14-22</span>
      <span class="schedule-cell night" style="padding:4px 12px;cursor:default;">N Noche 22-06</span>
      <span class="schedule-cell off" style="padding:4px 12px;cursor:default;">– Libre</span>
    </div>
  </div>
  `;
}

function editTurnoCell(cell) {
  const turns = ['morning','afternoon','night','off'];
  const curr = turns.find(t => cell.classList.contains(t)) || 'off';
  const next = turns[(turns.indexOf(curr)+1)%turns.length];
  turns.forEach(t => cell.classList.remove(t));
  cell.classList.add(next);
  cell.textContent = next==='morning'?'M':next==='afternoon'?'T':next==='night'?'N':'–';
  showToast('Turno actualizado. Recuerda guardar los cambios.', 'warning');
}

// ---- Nóminas ----
function renderRRHHNominas() {
  const estados = { pendiente:'pill-amber', aprobada:'pill-green', enviada:'pill-blue' };
  return `
  <div class="nomina-warning">
    ${Icons.alertTriangle}
    <span>⚠️ Las nóminas requieren aprobación explícita antes del envío. Generación automática el día 25 de cada mes.</span>
  </div>
  <div class="grid-3 mb-5">
    <div class="card" style="border-color:rgba(245,158,11,0.2);text-align:center;">
      <div class="text-xs text-muted mb-2">PENDIENTES</div>
      <div style="font-size:36px;font-weight:800;font-family:'Syne',sans-serif;color:var(--warning);">${DEMO_DATA.nominas.filter(n=>n.estado==='pendiente').length}</div>
    </div>
    <div class="card" style="border-color:rgba(0,229,160,0.2);text-align:center;">
      <div class="text-xs text-muted mb-2">APROBADAS</div>
      <div style="font-size:36px;font-weight:800;font-family:'Syne',sans-serif;color:var(--accent-green);">${DEMO_DATA.nominas.filter(n=>n.estado==='aprobada').length}</div>
    </div>
    <div class="card" style="border-color:rgba(96,165,250,0.2);text-align:center;">
      <div class="text-xs text-muted mb-2">ENVIADAS</div>
      <div style="font-size:36px;font-weight:800;font-family:'Syne',sans-serif;color:var(--accent-blue);">${DEMO_DATA.nominas.filter(n=>n.estado==='enviada').length}</div>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <div class="card-title">${Icons.filetext} Nóminas · Marzo 2026</div>
    </div>
    <div class="table-container">
      <table class="table">
        <thead><tr><th>Empleado/a</th><th>Período</th><th>Bruto</th><th>Neto</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          ${DEMO_DATA.nominas.map(n => `
            <tr>
              <td><strong>${n.empleado}</strong></td>
              <td class="text-muted">${n.periodo}</td>
              <td>${n.bruto}</td>
              <td style="color:var(--accent-green);font-weight:600;">${n.neto}</td>
              <td><span class="pill ${estados[n.estado]||'pill-gray'}">${n.estado}</span></td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-secondary" title="Ver detalle">${Icons.eye}</button>
                  ${n.estado==='pendiente'?`
                    <button class="btn btn-sm btn-primary" onclick="aprobarNomina('${n.id}','${n.empleado}')">Aprobar y enviar</button>
                    <button class="btn btn-sm btn-danger" onclick="rechazarNomina('${n.id}')">Rechazar</button>
                  `:''}
                  ${n.estado==='enviada'?`<button class="btn btn-sm btn-ghost">${Icons.download}</button>`:''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function aprobarNomina(id, nombre) {
  showToast(`✅ Nómina de ${nombre} aprobada y enviada correctamente.`, 'success');
}
function rechazarNomina(id) {
  showToast(`❌ Nómina enviada a revisión. Añade un comentario al empleado.`, 'error');
}

// ---- Centros ----
function renderRRHHCentros() {
  return `
  <div class="flex justify-between items-center mb-4">
    <div class="card-title">${Icons.building} Centros y Sedes</div>
    <button class="btn btn-primary" onclick="showToast('Formulario de nuevo centro próximamente','warning')">${Icons.plus} Nueva sede</button>
  </div>
  <div class="grid-3">
    ${DEMO_DATA.centros.map(c => `
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.building} ${c.nombre}</div>
          <button class="btn btn-sm btn-secondary">${Icons.edit}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
          <div class="flex gap-2"><span class="text-muted">Ciudad:</span> <strong>${c.ciudad}</strong></div>
          <div class="flex gap-2"><span class="text-muted">Dirección:</span> <span>${c.direccion}</span></div>
          <div class="flex gap-2"><span class="text-muted">Teléfono:</span> <span>${c.telefono}</span></div>
          <div class="flex gap-2"><span class="text-muted">Email:</span> <span>${c.email_centro}</span></div>
          <hr class="divider">
          <div class="flex justify-between">
            <span class="text-muted">Empleados activos</span>
            <span class="pill pill-green">${c.empleados}</span>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

// ---- Configuración ----
function renderRRHHConfig() {
  return `
  <div class="grid-2">
    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.settings} Convenio colectivo</div>
      </div>
      <div class="form-group">
        <label class="form-label">Nombre del convenio</label>
        <input class="form-control" value="Convenio Comercio 2024-2026">
      </div>
      <div class="form-group">
        <label class="form-label">Horas máximas diarias</label>
        <input class="form-control" type="number" value="9">
      </div>
      <div class="form-group">
        <label class="form-label">Horas máximas semanales</label>
        <input class="form-control" type="number" value="40">
      </div>
      <div class="form-group">
        <label class="form-label">Descanso mínimo entre jornadas (horas)</label>
        <input class="form-control" type="number" value="12">
      </div>
      <div class="form-group">
        <label class="form-label">Inicio nocturnidad</label>
        <input class="form-control" type="time" value="22:00">
      </div>
      <div class="form-group">
        <label class="form-label">Fin nocturnidad</label>
        <input class="form-control" type="time" value="06:00">
      </div>
      <div class="form-group">
        <label class="form-label">Días de vacaciones base (año)</label>
        <input class="form-control" type="number" value="30">
      </div>
      <button class="btn btn-primary btn-full" onclick="showToast('Configuración guardada correctamente','success')">Guardar cambios</button>
    </div>
    <div>
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">Tipos de contrato</div>
          <button class="btn btn-sm btn-primary">${Icons.plus}</button>
        </div>
        ${['Indefinido','Temporal','Prácticas','Autónomo'].map(t => `
          <div class="flex justify-between items-center" style="padding:10px 0;border-bottom:1px solid var(--border);">
            <span class="text-sm">${t}</span>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-ghost">${Icons.edit}</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Festivos 2026</div>
          <button class="btn btn-sm btn-primary">${Icons.plus} Añadir</button>
        </div>
        ${['01/01 – Año Nuevo','06/01 – Reyes','28/02 – Autonomía','23/04 – S. Jorge','01/05 – Trabajo','15/08 – Asunción','12/10 – Hispanidad','01/11 – Todos los Santos','06/12 – Constitución','08/12 – Inmaculada','25/12 – Navidad'].map(f => `
          <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border);">
            <span class="text-sm">${f}</span>
            <button class="btn btn-sm btn-ghost text-red">${Icons.x}</button>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `;
}

function filterEmpleados(q) {
  const rows = document.querySelectorAll('#empleados-table tbody tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function filterEmpleadosByField(field, val) {
  if (!val) { document.querySelectorAll('#empleados-table tbody tr').forEach(r => r.style.display = ''); return; }
  const rows = document.querySelectorAll('#empleados-table tbody tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}
