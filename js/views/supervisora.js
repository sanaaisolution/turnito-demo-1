// ============================================
// VISTA: SUPERVISORA
// ============================================

function renderSupervisoraDashboard() {
  const activos = AppState.empleados.filter(e => e.fichado).length;
  const ausentes = AppState.empleados.filter(e => e.estado === 'baja').length;

  return `
  <!-- KPIs rápidos -->
  <div class="grid-4 mb-5 animate-in">
    <div class="kpi-card purple">
      <div class="kpi-icon">${Icons.users}</div>
      <div class="kpi-label">Equipo total</div>
      <div class="kpi-value">${AppState.empleados.length}</div>
      <div class="kpi-change">6 centros activos</div>
    </div>
    <div class="kpi-card green">
      <div class="kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <div class="kpi-label">Trabajando ahora</div>
      <div class="kpi-value">${activos}</div>
      <div class="kpi-change up">↑ En turno activo</div>
    </div>
    <div class="kpi-card amber">
      <div class="kpi-icon">${Icons.alertTriangle}</div>
      <div class="kpi-label">Pendientes aprobación</div>
      <div class="kpi-value">${AppState.pendientes.length}</div>
      <div class="kpi-change">Requieren tu revisión</div>
    </div>
    <div class="kpi-card blue">
      <div class="kpi-icon">${Icons.shieldCheck}</div>
      <div class="kpi-label">Alertas legales</div>
      <div class="kpi-value">${DEMO_DATA.alertas_legales.length}</div>
      <div class="kpi-change">Solo informativas</div>
    </div>
  </div>

  <!-- Filtros equipo -->
  <div class="card mb-5 animate-in" style="animation-delay:0.05s">
    <div class="card-header">
      <div class="card-title">${Icons.users} Mi equipo en tiempo real</div>
      <div class="flex gap-2">
        <button class="btn btn-sm btn-secondary team-filter active" data-filter="all" onclick="filterTeam('all',this)">Todos</button>
        <button class="btn btn-sm btn-secondary team-filter" data-filter="working" onclick="filterTeam('working',this)">🟢 Activos</button>
        <button class="btn btn-sm btn-secondary team-filter" data-filter="absent" onclick="filterTeam('absent',this)">🔴 Ausentes</button>
      </div>
    </div>
    <div class="grid-3" id="team-grid">
      ${AppState.empleados.map(e => renderEmployeeCard(e)).join('')}
    </div>
  </div>

  <div class="grid-2 animate-in" style="animation-delay:0.1s">
    <!-- Pendientes de aprobación -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.clock} Pendientes de aprobación</div>
        <span class="pill pill-amber">${AppState.pendientes.length}</span>
      </div>
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Tipo</th><th>Empleado/a</th><th>Fechas</th><th>Acciones</th></tr></thead>
          <tbody id="pendientes-list">
            ${AppState.pendientes.map(p => renderPendienteRow(p)).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alertas legales -->
    <div>
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title" style="color:var(--warning);">${Icons.alertTriangle} Motor legal</div>
          <span class="pill pill-warning">Informativo</span>
        </div>
        <div style="display:flex;flex-direction:column;">
          ${DEMO_DATA.alertas_legales.map(a => `
            <div class="legal-alert-item">
              ${Icons.alertTriangle}
              <div>
                <div class="alert-desc"><strong>${a.empleado}</strong> — ${a.desc}</div>
                <div class="alert-detail">No bloqueante · Solo informativo</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Cobertura ausencia -->
      <div class="card" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.03);">
        <div class="card-header">
          <div class="card-title text-red">⚠️ Cobertura requerida</div>
          <span class="pill pill-red">Urgente</span>
        </div>
        <div class="alert-banner warning mb-4">
          ${Icons.alertTriangle}
          <div class="alert-text">
            <strong>Laura Pérez está ausente</strong>
            <span>Turno mañana 09:00–17:00 sin cubrir · Sede Central</span>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">Candidatos disponibles:</div>
        ${[
          {name:'Ana Torres', status:'ok', label:'Disponible y recomendada'},
          {name:'Sanae Gutiérrez', status:'warn', label:'Pocas horas de descanso (11h)'},
          {name:'Carlos Martínez', status:'no', label:'No disponible · Horas máx.'},
        ].map(c => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:16px;">${c.status==='ok'?'✅':c.status==='warn'?'⚠️':'❌'}</span>
            <div style="flex:1;">
              <div class="text-sm font-bold">${c.name}</div>
              <div class="text-xs text-muted">${c.label}</div>
            </div>
            ${c.status!=='no' ? `<button class="btn btn-sm btn-purple" onclick="confirmarCobertura('${c.name}')">Asignar</button>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `;
}

function renderEmployeeCard(e) {
  const statusInfo = e.fichado
    ? { dot: 'working', label: 'Trabajando', color: 'var(--accent-green)' }
    : e.estado === 'baja'
      ? { dot: 'absent', label: 'Baja médica', color: 'var(--error)' }
      : e.estado === 'vacaciones'
        ? { dot: 'pending', label: 'Vacaciones', color: 'var(--accent-amber)' }
        : { dot: 'pending', label: 'Sin fichar', color: 'var(--text-secondary)' };

  const actionBtn = e.fichado
    ? `<button class="btn btn-sm btn-secondary" style="flex:1;" onclick="openModal('modal-perfil-empleado')">Ver perfil</button>`
    : e.estado === 'baja'
      ? `<button class="btn btn-sm btn-purple" style="flex:1;" onclick="confirmarCobertura('${e.nombre}')">Cobertura</button>`
      : `<button class="btn btn-sm btn-warning" style="flex:1;">Recordar</button>`;

  return `
    <div class="employee-card" data-status="${e.estado}" data-fichado="${e.fichado}" onclick="">
      <div class="employee-card-header">
        <div class="emp-avatar" style="background:${e.color === '#f87171' ? 'var(--error)' : e.color};">${e.avatar}</div>
        <div>
          <div class="emp-name">${e.nombre}</div>
          <div class="emp-role">${e.puesto}</div>
        </div>
      </div>
      <div class="emp-status">
        <span class="status-dot ${statusInfo.dot}"></span>
        <span style="color:${statusInfo.color};font-size:13px;font-weight:500;">${statusInfo.label}</span>
      </div>
      <div class="emp-schedule text-xs text-muted">${e.turno !== '-' ? `⏰ ${e.turno}` : ''}  ${Icons.mapPin} ${e.centro}</div>
      <div class="emp-actions">
        ${actionBtn}
        <button class="btn btn-sm btn-ghost" onclick="openModal('modal-perfil-empleado')">${Icons.eye}</button>
      </div>
    </div>
  `;
}

function renderPendienteRow(p) {
  const tipoPills = { vacaciones:'pill-blue', ausencia:'pill-amber', justificante:'pill-purple', permiso:'pill-green' };
  return `
    <tr>
      <td><span class="pill ${tipoPills[p.tipo]||'pill-gray'}">${p.tipo.charAt(0).toUpperCase()+p.tipo.slice(1)}</span></td>
      <td><strong>${p.empleado}</strong></td>
      <td style="font-size:12px;">${p.fecha_inicio}${p.fecha_fin&&p.fecha_fin!=='-'?` → ${p.fecha_fin}`:''}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-primary" onclick="aprobarSolicitud('${p.id}','aprobar')" title="Aprobar">${Icons.check}</button>
          <button class="btn btn-sm btn-danger" onclick="aprobarSolicitud('${p.id}','rechazar')" title="Rechazar">${Icons.x}</button>
          <button class="btn btn-sm btn-secondary" title="Ver">${Icons.eye}</button>
        </div>
      </td>
    </tr>
  `;
}

function filterTeam(filter, btn) {
  document.querySelectorAll('.team-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  let empleados = AppState.empleados;
  if (filter === 'working') empleados = empleados.filter(e => e.fichado);
  if (filter === 'absent') empleados = empleados.filter(e => e.estado === 'baja');
  grid.innerHTML = empleados.map(e => renderEmployeeCard(e)).join('');
}

function confirmarCobertura(nombre) {
  showToast(`✅ Cobertura asignada a ${nombre}. Se ha notificado al empleado/a.`, 'success');
}
