// ============================================
// VISTA: EMPLEADO - Self-Service Panel
// ============================================

function renderEmpleadoDashboard() {
  const user = AppState.currentUser;
  const today = new Date();
  const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dayStr = `${dayNames[today.getDay()]}, ${today.getDate()} de ${monthNames[today.getMonth()]}`;

  return `
  <!-- Fichar Hero -->
  <div class="fichar-hero animate-in">
    <div class="fichar-buttons">
      <button class="btn-fichar entrada" onclick="accionFichar('entrada')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
        FICHAR ENTRADA
      </button>
      <button class="btn-fichar salida" onclick="accionFichar('salida')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        FICHAR SALIDA
      </button>
      <button class="btn-fichar chat" onclick="toggleChat()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        ABRIR CHAT
      </button>
    </div>
    <div class="ultimo-fichaje" id="ultimo-fichaje-msg">
      ${Icons.clock} Último fichaje: <span>Entrada hoy 08:55</span>
    </div>
  </div>

  <!-- Grid principal -->
  <div class="grid-3 mb-5">

    <!-- Mi turno hoy -->
    <div class="card animate-in" style="animation-delay:0.05s">
      <div class="card-header">
        <div class="card-title">${Icons.sun} Mi turno hoy</div>
        <span class="pill pill-green">Mañana</span>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;">${dayStr}</div>
      <div style="font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--accent-green);margin-bottom:12px;">09:00 – 17:00</div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 text-sm"><span style="color:var(--text-secondary);">Centro:</span> <strong>Sede Central</strong></div>
        <div class="flex items-center gap-2 text-sm"><span style="color:var(--text-secondary);">Descanso:</span> <strong>30 min (13:30)</strong></div>
        <div class="flex items-center gap-2 text-sm"><span style="color:var(--text-secondary);">Tipo:</span> <span class="pill pill-green">Turno mañana</span></div>
      </div>
    </div>

    <!-- Vacaciones -->
    <div class="card animate-in" style="animation-delay:0.1s">
      <div class="card-header">
        <div class="card-title">${Icons.calendar} Mis vacaciones</div>
        <button class="btn btn-sm btn-primary" onclick="openModal('modal-vacaciones')">+ Solicitar</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-muted">Disponibles</span>
            <span style="color:var(--accent-green);font-weight:700;">22 días</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:73%;background:var(--accent-green);"></div></div>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">Consumidos</span><span style="font-weight:600;">3 días</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">Pendiente aprobación</span>
          <span class="pill pill-amber">8 días</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">Total año</span><span style="font-weight:600;">30 días</span>
        </div>
      </div>
    </div>

    <!-- Ausencias/Permisos -->
    <div class="card animate-in" style="animation-delay:0.15s">
      <div class="card-header">
        <div class="card-title">${Icons.filetext} Ausencias</div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-secondary" onclick="openModal('modal-ausencia')">Reportar</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;">
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold">14/02/2026</span>
            <span class="pill pill-green">Aprobado</span>
          </div>
          <div class="text-sm text-muted mt-1">Permiso personal (1 día)</div>
        </div>
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;">
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold">20/01/2026</span>
            <span class="pill pill-green">Aprobado</span>
          </div>
          <div class="text-sm text-muted mt-1">Cita médica (1 día)</div>
        </div>
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;">
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold">08/01/2026</span>
            <span class="pill pill-amber">Pendiente</span>
          </div>
          <div class="text-sm text-muted mt-1">Ausencia (1 día)</div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <!-- Justificantes -->
    <div class="card animate-in" style="animation-delay:0.2s">
      <div class="card-header">
        <div class="card-title">${Icons.upload} Justificantes</div>
      </div>
      <div class="dropzone mb-4" id="dropzone-justificante" onclick="document.getElementById('file-input').click()">
        <input type="file" id="file-input" accept=".pdf,.jpg,.png" style="display:none" onchange="handleFileUpload(this)">
        <div class="dropzone-icon">📎</div>
        <div class="dropzone-text"><strong>Arrastra aquí</strong> o haz clic para subir</div>
        <div class="text-xs text-muted mt-1">PDF, JPG, PNG · Máx. 10MB</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;" id="justificantes-list">
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="text-sm font-bold">Baja médica - 10/03/2026</div>
            <div class="text-xs text-muted">justificante_medico.pdf</div>
          </div>
          <span class="pill pill-amber">Pendiente</span>
        </div>
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="text-sm font-bold">Cita esp. - 20/01/2026</div>
            <div class="text-xs text-muted">informe_medico.pdf</div>
          </div>
          <span class="pill pill-green">Aprobado</span>
        </div>
      </div>
    </div>

    <!-- Tareas del día -->
    <div class="card animate-in" style="animation-delay:0.25s">
      <div class="card-header">
        <div class="card-title">${Icons.checkSquare} Tareas del día</div>
        <span id="task-progress-label" class="text-sm text-muted">1/4 completadas</span>
      </div>
      <div class="progress-bar mb-4">
        <div class="progress-fill" id="task-progress-bar" style="width:25%;background:var(--accent-blue);"></div>
      </div>
      <div id="tareas-list" style="display:flex;flex-direction:column;gap:8px;">
        ${AppState.tareas.map(t => `
          <label style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg-input);border-radius:var(--radius-sm);cursor:pointer;transition:var(--transition);" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='var(--bg-input)'">
            <input type="checkbox" ${t.completada ? 'checked' : ''} onchange="toggleTarea('${t.id}')" style="width:16px;height:16px;accent-color:var(--accent-green);cursor:pointer;">
            <span class="text-sm" style="${t.completada ? 'text-decoration:line-through;color:var(--text-secondary);' : ''}">${t.descripcion}</span>
          </label>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Historial Fichajes -->
  <div class="card mt-4 animate-in" style="animation-delay:0.3s">
    <div class="card-header">
      <div class="card-title">${Icons.clock} Historial de fichajes</div>
      <button class="btn btn-sm btn-ghost">${Icons.download} Exportar</button>
    </div>
    <div class="table-container">
      <table class="table">
        <thead><tr><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Horas</th><th>Estado</th></tr></thead>
        <tbody>
          ${DEMO_DATA.historial_fichajes.map(f => `
            <tr>
              <td>${f.fecha}</td>
              <td style="color:var(--accent-green);font-weight:600;">${f.entrada}</td>
              <td style="color:var(--error);font-weight:600;">${f.salida}</td>
              <td>${f.horas}</td>
              <td><span class="pill pill-green">Completo</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { showToast('El archivo supera el límite de 10MB', 'error'); return; }
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowed.includes(file.type)) { showToast('Formato no permitido. Usa PDF, JPG o PNG', 'error'); return; }
  showToast(`📎 "${file.name}" subido correctamente. Pendiente de revisión.`, 'success');
  // Add to list
  const list = document.getElementById('justificantes-list');
  if (list) {
    const item = document.createElement('div');
    item.style.cssText = 'background:var(--bg-input);border-radius:var(--radius-sm);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;';
    item.innerHTML = `<div><div class="text-sm font-bold">Nuevo - ${new Date().toLocaleDateString('es-ES')}</div><div class="text-xs text-muted">${file.name}</div></div><span class="pill pill-amber">Pendiente</span>`;
    list.prepend(item);
  }
}
