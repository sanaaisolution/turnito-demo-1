// ============================================
// TURNITO - State Management & App Core
// ============================================

const AppState = {
  // Auth
  currentUser: null,
  isAuthenticated: false,

  // UI State
  currentView: 'dashboard',
  sidebarOpen: false,
  chatOpen: false,
  notifications: 3,

  // Data
  empleados: [...DEMO_DATA.empleados],
  pendientes: [...DEMO_DATA.pendientes],
  tareas: [...DEMO_DATA.tareas],
  mensajes_chat: [...DEMO_DATA.mensajes_chat],

  // Fichaje
  fichado: false,
  ultimo_fichaje: '08:55 - Hoy',
};

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success', duration = 4000) {
  const container = document.getElementById('toast-container');
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.success}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ============================================
// Modal Management
// ============================================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
  // Close dropdowns
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  }
});

// ============================================
// SVG Icons (Lucide-style)
// ============================================
const Icons = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  filetext: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  checkSquare: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  messageCircle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
  building: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>`,
  trendingUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  alertTriangle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  bell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  logOut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  dollarSign: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  activity: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  upload: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  chevronDown: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
  sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  shieldCheck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  barChart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  refreshCw: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,
};

// ============================================
// Auth functions
// ============================================
function demoLogin(email, password) {
  const user = DEMO_DATA.users.find(u => u.email === email && u.password === password);
  if (!user) return { error: 'Email o contraseña incorrectos' };
  AppState.currentUser = user;
  AppState.isAuthenticated = true;
  localStorage.setItem('turnito_user', JSON.stringify(user));
  return { data: user, error: null };
}

function demoLogout() {
  AppState.currentUser = null;
  AppState.isAuthenticated = false;
  localStorage.removeItem('turnito_user');
}

function restoreSession() {
  const stored = localStorage.getItem('turnito_user');
  if (stored) {
    const user = JSON.parse(stored);
    AppState.currentUser = user;
    AppState.isAuthenticated = true;
    return user;
  }
  return null;
}

// ============================================
// Navigation
// ============================================
function navigateTo(viewId, label = '') {
  AppState.currentView = viewId;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const view = document.getElementById(`view-${viewId}`);
  if (view) { view.classList.add('active'); }
  const navItem = document.querySelector(`[data-view="${viewId}"]`);
  if (navItem) { navItem.classList.add('active'); }
  const title = document.getElementById('page-title');
  if (title && label) title.textContent = label;
}

// ============================================
// Dropdown toggle
// ============================================
function toggleDropdown(id) {
  const menu = document.getElementById(id);
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
}

// ============================================
// Chat
// ============================================
function toggleChat() {
  AppState.chatOpen = !AppState.chatOpen;
  const panel = document.getElementById('chat-panel');
  if (panel) panel.classList.toggle('open', AppState.chatOpen);
  if (AppState.chatOpen) {
    setTimeout(() => scrollChatToBottom(), 100);
    AppState.notifications = Math.max(0, AppState.notifications - 1);
    updateNotifBadge();
  }
}

function scrollChatToBottom() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function updateNotifBadge() {
  document.querySelectorAll('.notif-badge').forEach(b => {
    b.textContent = AppState.notifications;
    b.style.display = AppState.notifications > 0 ? 'flex' : 'none';
  });
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMessage('user', text);
  showTypingIndicator();

  // Try n8n, fallback to demo
  const timeout = new Promise(r => setTimeout(() => r({ data: null, error: 'timeout' }), 3000));
  const apiCall = n8nAPI.chatMessage(AppState.currentUser?.id || 'demo', text);
  const { data, error } = await Promise.race([apiCall, timeout]);

  removeTypingIndicator();

  if (data?.respuesta) {
    appendMessage('bot', data.respuesta);
  } else {
    appendMessage('bot', getDemoResponse(text));
  }
  scrollChatToBottom();
}

function getDemoResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('vacacion') || t.includes('días libres')) return 'Tienes **22 días laborables de vacaciones** disponibles. ¿Quieres que gestione una solicitud ahora?';
  if (t.includes('turno') || t.includes('horario')) return 'Tu turno de mañana es **09:00 - 17:00** (Turno Mañana) en Sede Central. Descanso de 30 min.';
  if (t.includes('ausencia') || t.includes('médico') || t.includes('medico')) return 'Para registrar una ausencia, puedes usar el botón "Reportar ausencia" en tu panel o dime los detalles y lo proceso.';
  if (t.includes('nómina') || t.includes('sueldo') || t.includes('salario')) return 'Tu nómina de Marzo 2026 está **pendiente de aprobación** por RRHH (generada el día 25). Te notificaremos cuando esté disponible.';
  if (t.includes('hola') || t.includes('buenos') || t.includes('buenas')) return '¡Hola! ¿En qué puedo ayudarte hoy? Puedo consultar tu turno, gestionar vacaciones, ausencias, o responder tus dudas de RRHH.';
  if (t.includes('ficha') || t.includes('entrada') || t.includes('salida')) return 'Puedes fichar desde los botones en tu panel principal. ¿Quieres que lo haga por ti ahora?';
  return 'Entendido. Puedo ayudarte con turnos, vacaciones, ausencias, fichajes y consultas de RRHH. ¿Puedes concretar un poco más?';
}

function appendMessage(sender, text, time = null) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const now = time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const html = `
    <div class="message ${sender}">
      ${sender === 'bot' ? `<div class="chat-bot-avatar" style="width:28px;height:28px;font-size:11px;flex-shrink:0;">T</div>` : ''}
      <div>
        <div class="message-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
        <div class="message-time">${now}</div>
      </div>
    </div>
  `;
  msgs.insertAdjacentHTML('beforeend', html);
}

function showTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.className = 'message bot';
  typing.innerHTML = `<div class="chat-bot-avatar" style="width:28px;height:28px;font-size:11px;flex-shrink:0;">T</div><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ============================================
// Fichar action
// ============================================
async function accionFichar(tipo) {
  const btn = document.querySelector(`.btn-fichar.${tipo}`);
  if (btn) {
    btn.classList.add('loading');
    btn.disabled = true;
  }

  // Simulate API call
  await new Promise(r => setTimeout(r, 1200));

  const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (btn) {
    btn.classList.remove('loading');
    btn.disabled = false;
  }

  const tipoLabel = tipo === 'entrada' ? 'Entrada' : 'Salida';
  const msg = document.getElementById('ultimo-fichaje-msg');
  if (msg) msg.innerHTML = `Último fichaje: <span>${tipoLabel} hoy ${hora}</span>`;

  showToast(`✅ ${tipoLabel} fichada correctamente a las ${hora}`, 'success');

  // Update state
  AppState.fichado = tipo === 'entrada';
}

// ============================================
// Manage Tasks
// ============================================
function toggleTarea(id) {
  const tarea = AppState.tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    updateTaskProgress();
  }
}

function updateTaskProgress() {
  const completadas = AppState.tareas.filter(t => t.completada).length;
  const total = AppState.tareas.length;
  const pct = total ? Math.round((completadas / total) * 100) : 0;
  const bar = document.getElementById('task-progress-bar');
  const label = document.getElementById('task-progress-label');
  if (bar) { bar.style.width = `${pct}%`; bar.style.background = pct === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'; }
  if (label) label.textContent = `${completadas}/${total} completadas`;
}

// ============================================
// Approvals
// ============================================
function aprobarSolicitud(id, accion) {
  const idx = AppState.pendientes.findIndex(p => p.id === id);
  if (idx === -1) return;

  const solicitud = AppState.pendientes[idx];
  AppState.pendientes.splice(idx, 1);

  const accionLabel = accion === 'aprobar' ? 'aprobada' : 'rechazada';
  const emoji = accion === 'aprobar' ? '✅' : '❌';
  showToast(`${emoji} Solicitud de ${solicitud.empleado} ${accionLabel}`, accion === 'aprobar' ? 'success' : 'error');

  // Re-render pending section
  renderPendientes();
}

function renderPendientes() {
  const container = document.getElementById('pendientes-list');
  if (!container) return;

  if (AppState.pendientes.length === 0) {
    container.innerHTML = '<p class="text-muted text-sm" style="padding:20px;text-align:center;">No hay solicitudes pendientes</p>';
    return;
  }

  const tipoPills = {
    vacaciones: 'pill-blue',
    ausencia: 'pill-amber',
    justificante: 'pill-purple',
    permiso: 'pill-green',
  };

  container.innerHTML = AppState.pendientes.map(p => `
    <tr>
      <td><span class="pill ${tipoPills[p.tipo] || 'pill-gray'}">${p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)}</span></td>
      <td><strong>${p.empleado}</strong></td>
      <td>${p.fecha_inicio}${p.fecha_fin && p.fecha_fin !== '-' ? ` → ${p.fecha_fin}` : ''}</td>
      <td>${p.solicitud}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-primary" onclick="aprobarSolicitud('${p.id}', 'aprobar')" title="Aprobar">${Icons.check}</button>
          <button class="btn btn-sm btn-danger" onclick="aprobarSolicitud('${p.id}', 'rechazar')" title="Rechazar">${Icons.x}</button>
          <button class="btn btn-sm btn-secondary" title="Ver detalle">${Icons.eye}</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ============================================
// Format helpers
// ============================================
function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function getRolColor(rol) {
  const map = { empleado: 'var(--accent-green)', supervisora: 'var(--accent-purple)', rrhh: 'var(--accent-blue)', ceo: 'var(--accent-amber)' };
  return map[rol] || 'var(--text-secondary)';
}

function getRolLabel(rol) {
  const map = { empleado: 'Empleado/a', supervisora: 'Supervisora', rrhh: 'RRHH / Admin', ceo: 'CEO / Dirección' };
  return map[rol] || rol;
}
