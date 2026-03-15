// ============================================
// TURNITO - App Initialization & Router
// ============================================

// Nav config per role
const NAV_CONFIG = {
  empleado: [
    { id: 'dashboard', label: 'Mi Dashboard', icon: 'dashboard' },
    { id: 'dummy-turno', label: 'Mi turno semanal', icon: 'calendar', action: () => scrollTo(0,400) },
    { id: 'dummy-vac', label: 'Vacaciones', icon: 'filetext', action: () => openModal('modal-vacaciones') },
    { id: 'dummy-ausencia', label: 'Ausencias', icon: 'clock', action: () => openModal('modal-ausencia') },
    { id: 'dummy-docs', label: 'Mis documentos', icon: 'upload' },
    { id: 'dummy-chat', label: 'Chat Turnito', icon: 'messageCircle', action: () => toggleChat() },
  ],
  supervisora: [
    { id: 'supervisora', label: 'Mi equipo', icon: 'users' },
    { id: 'dummy-pend', label: 'Pendientes aprobación', icon: 'clock', badge: 4 },
    { id: 'dummy-cobertura', label: 'Asignar cobertura', icon: 'shieldCheck' },
    { id: 'dummy-alertas', label: 'Alertas legales', icon: 'alertTriangle', badge: 3 },
    { id: 'dashboard', label: 'Mi dashboard', icon: 'dashboard' },
  ],
  rrhh: [
    { id: 'rrhh', label: 'Panel RRHH', icon: 'dashboard', action: () => loadRRHHSubview('empleados') },
    { id: 'dummy-rep', label: 'Reportes', icon: 'barChart' },
    { id: 'supervisora', label: 'Vista supervisora', icon: 'users' },
    { id: 'ceo', label: 'Vista CEO', icon: 'trendingUp' },
  ],
  ceo: [
    { id: 'ceo', label: 'Dashboard ejecutivo', icon: 'trendingUp' },
    { id: 'dummy-kpi', label: 'KPIs en tiempo real', icon: 'activity' },
    { id: 'dummy-rep', label: 'Reportes', icon: 'barChart' },
    { id: 'supervisora', label: 'Vista equipo', icon: 'users' },
    { id: 'rrhh', label: 'Panel RRHH', icon: 'settings' },
  ],
};

const ROL_COLORS = {
  empleado: 'var(--accent-green)',
  supervisora: 'var(--accent-purple)',
  rrhh: 'var(--accent-blue)',
  ceo: 'var(--accent-amber)',
};

const ROL_HOME = {
  empleado: 'dashboard',
  supervisora: 'supervisora',
  rrhh: 'rrhh',
  ceo: 'ceo',
};

// ============================================
// Login handlers
// ============================================
function autoLogin(email, password) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = password;
  handleLogin(null);
}

function handleLogin(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  errEl.style.display = 'none';
  btn.classList.add('loading');
  btn.textContent = '';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.textContent = 'Iniciar sesión';

    const { data, error } = demoLogin(email, password);
    if (error) {
      errEl.textContent = error;
      errEl.style.display = 'block';
      return;
    }
    bootApp(data);
  }, 800);
}

function handleLogout() {
  demoLogout();
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  showToast('Sesión cerrada correctamente', 'success');
}

// ============================================
// Boot app for authenticated user
// ============================================
function bootApp(user) {
  // Hide login, show app
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('main-app').style.display = 'flex';

  const rolColor = ROL_COLORS[user.rol] || 'var(--accent-green)';

  // Update sidebar user info
  const avatar = user.avatar || getInitials(user.nombre);
  document.getElementById('sidebar-avatar').textContent = avatar;
  document.getElementById('sidebar-avatar').style.background = rolColor;
  document.getElementById('sidebar-name').textContent = user.nombre;
  document.getElementById('sidebar-role').textContent = getRolLabel(user.rol);
  document.getElementById('header-avatar').textContent = avatar;
  document.getElementById('header-avatar').style.background = rolColor;

  // Status badge
  const statusEl = document.getElementById('header-status-badge');
  statusEl.innerHTML = `<span class="status-badge active">Activo</span>`;

  // Subtitle
  document.getElementById('page-subtitle').textContent = `${user.nombre} · ${user.centro}`;

  // Build sidebar nav
  buildSidebarNav(user.rol, rolColor);

  // Render perfil modal
  document.getElementById('perfil-modal-content').innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="width:64px;height:64px;border-radius:50%;background:${rolColor};display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#0a0e14;font-family:'Syne',sans-serif;margin-bottom:10px;">${avatar}</div>
      <div style="font-weight:700;font-size:18px;">${user.nombre}</div>
      <div class="text-muted text-sm">${getRolLabel(user.rol)} · ${user.centro}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);" class="flex justify-between"><span class="text-muted text-sm">Email</span><span class="text-sm">${user.email}</span></div>
      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);" class="flex justify-between"><span class="text-muted text-sm">Rol</span><span class="pill" style="background:${rolColor}22;color:${rolColor};">${getRolLabel(user.rol)}</span></div>
      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);" class="flex justify-between"><span class="text-muted text-sm">Centro</span><span class="text-sm">${user.centro}</span></div>
    </div>
  `;

  // Init chat with stored messages
  initChat();

  // Navigate to role home
  navigateToRole(user.rol);
}

function buildSidebarNav(rol, rolColor) {
  const navItems = NAV_CONFIG[rol] || NAV_CONFIG.empleado;
  const nav = document.getElementById('sidebar-nav');

  nav.innerHTML = `<div class="nav-section-label">Menú principal</div>`;

  navItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'nav-item';
    el.dataset.view = item.id;
    if (i === 0) el.classList.add('active');

    el.innerHTML = `
      ${Icons[item.icon] || Icons.dashboard}
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    `;

    el.addEventListener('click', () => {
      if (item.action) {
        item.action();
        return;
      }
      document.querySelectorAll('#sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      navigateToRole(rol, item.id);
    });

    nav.appendChild(el);
  });

  // Apply accent color to active items based on role
  const style = document.getElementById('role-style') || document.createElement('style');
  style.id = 'role-style';
  style.textContent = `
    .nav-item.active {
      color: ${rolColor} !important;
      background: ${rolColor}15 !important;
      border-left-color: ${rolColor} !important;
    }
    .btn-primary {
      background: ${rolColor} !important;
    }
    .btn-primary:hover {
      filter: brightness(1.1);
    }
    .form-control:focus {
      border-color: ${rolColor} !important;
      box-shadow: 0 0 0 3px ${rolColor}22 !important;
    }
  `;
  document.head.appendChild(style);
}

function navigateToRole(rol, override = null) {
  const target = override || ROL_HOME[rol];
  navigateToView(target, rol);
}

function navigateToView(viewId, rol) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  const pageTitles = {
    dashboard: 'Mi Dashboard',
    supervisora: 'Gestión de Equipo',
    rrhh: 'Panel RRHH',
    ceo: 'Dashboard Ejecutivo',
  };

  document.getElementById('page-title').textContent = pageTitles[viewId] || 'Dashboard';

  const view = document.getElementById(`view-${viewId}`);
  if (!view) return;
  view.classList.add('active');

  // Render content
  if (viewId === 'dashboard') {
    document.getElementById('empleado-content').innerHTML = renderEmpleadoDashboard();
    updateTaskProgress();
  } else if (viewId === 'supervisora') {
    document.getElementById('supervisora-content').innerHTML = renderSupervisoraDashboard();
  } else if (viewId === 'rrhh') {
    loadRRHHSubview('empleados');
  } else if (viewId === 'ceo') {
    document.getElementById('ceo-content').innerHTML = renderCEODashboard();
  }
}

// ============================================
// RRHH sidenav helper
// ============================================
function setRRHHActive(el) {
  document.querySelectorAll('#rrhh-sidenav .nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

function loadRRHHSubview(subview) {
  const content = document.getElementById('rrhh-content');
  if (!content) return;
  content.innerHTML = renderRRHHDashboard(subview);
}

// ============================================
// Chat initialization
// ============================================
function initChat() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  AppState.mensajes_chat.forEach(m => appendMessage(m.sender, m.text, m.time));
}

function sendQuickAction(text) {
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendChatMessage();
}

// ============================================
// Form Submissions
// ============================================
function submitVacaciones() {
  const inicio = document.getElementById('vac-inicio').value;
  const fin = document.getElementById('vac-fin').value;
  if (!inicio || !fin) { showToast('Selecciona las fechas de inicio y fin', 'warning'); return; }
  if (fin < inicio) { showToast('La fecha de fin debe ser posterior al inicio', 'error'); return; }
  closeModal('modal-vacaciones');
  showToast('✅ Solicitud de vacaciones enviada. Pendiente de aprobación.', 'success');
}

function submitAusencia() {
  const motivo = document.getElementById('ausencia-motivo').value;
  if (!motivo.trim()) { showToast('El motivo es obligatorio', 'warning'); return; }
  closeModal('modal-ausencia');
  showToast('✅ Ausencia registrada correctamente. Tu supervisora ha sido notificada.', 'success');
}

// ============================================
// Ficha modal tabs
// ============================================
function switchFichaTab(tab, btn) {
  document.querySelectorAll('[id^="ficha-tab-"]').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#modal-ficha-empleado .tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`ficha-tab-${tab}`);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ============================================
// Vacaciones date calc
// ============================================
document.addEventListener('change', (e) => {
  if (e.target.id === 'vac-inicio' || e.target.id === 'vac-fin') {
    const inicio = document.getElementById('vac-inicio').value;
    const fin = document.getElementById('vac-fin').value;
    if (inicio && fin) {
      const diff = Math.ceil((new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24)) + 1;
      const calc = document.getElementById('vac-days-calc');
      if (calc) { calc.textContent = `Duración estimada: ${Math.max(0,diff)} días (laborables: ~${Math.max(0,Math.round(diff*5/7))})`; }
    }
  }
});

// ============================================
// Drag & Drop for dropzone
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone-justificante');
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload({ files: [file] });
    });
  }
});

// ============================================
// Auto-restore session
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const user = restoreSession();
  if (user) {
    bootApp(user);
  }
});

// ============================================
// Keyboard shortcuts
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// ============================================
// Realtime simulation (badge updates)
// ============================================
setInterval(() => {
  // Simulate occasional notification
  const shouldNotify = Math.random() < 0.03;
  if (AppState.isAuthenticated && shouldNotify && !AppState.chatOpen) {
    AppState.notifications = Math.min(AppState.notifications + 1, 9);
    updateNotifBadge();
  }
}, 15000);
