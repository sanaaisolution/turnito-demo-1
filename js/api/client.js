// ============================================
// TURNITO - API Integration Layer
// ============================================

const TURNITO_CONFIG = {
  // n8n Webhook Base URL - Configure with your VPS
  n8nBaseUrl: 'https://YOUR-VPS-HOSTINGER/webhook',
  n8nApiKey: 'YOUR-N8N-API-KEY',

  // Supabase Config
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-SUPABASE-ANON-KEY',
};

// ============================================
// Supabase Client (Lightweight)
// ============================================
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.accessToken = null;
    this.user = null;
    this.listeners = [];
  }

  setSession(session) {
    this.accessToken = session?.access_token || null;
    this.user = session?.user || null;
    if (session) localStorage.setItem('turnito_session', JSON.stringify(session));
    else localStorage.removeItem('turnito_session');
  }

  getSession() {
    const raw = localStorage.getItem('turnito_session');
    return raw ? JSON.parse(raw) : null;
  }

  async headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'apikey': this.key,
      'Authorization': this.accessToken ? `Bearer ${this.accessToken}` : `Bearer ${this.key}`,
      ...extra,
    };
  }

  async signIn(email, password) {
    try {
      const res = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: await this.headers(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || 'Error de autenticación');
      this.setSession(data);
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }

  async signOut() {
    try {
      await fetch(`${this.url}/auth/v1/logout`, {
        method: 'POST',
        headers: await this.headers(),
      });
    } catch (e) { /* ignore */ }
    this.setSession(null);
    return { error: null };
  }

  async from(table) {
    return new SupabaseQuery(this, table);
  }

  // RPC call
  async rpc(fn, params = {}) {
    try {
      const res = await fetch(`${this.url}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: await this.headers({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en RPC');
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }
}

class SupabaseQuery {
  constructor(client, table) {
    this.client = client;
    this.table = table;
    this._select = '*';
    this._filters = [];
    this._order = null;
    this._limit = null;
    this._single = false;
  }

  select(cols = '*') { this._select = cols; return this; }
  eq(col, val) { this._filters.push(`${col}=eq.${val}`); return this; }
  neq(col, val) { this._filters.push(`${col}=neq.${val}`); return this; }
  gte(col, val) { this._filters.push(`${col}=gte.${val}`); return this; }
  lte(col, val) { this._filters.push(`${col}=lte.${val}`); return this; }
  ilike(col, val) { this._filters.push(`${col}=ilike.${val}`); return this; }
  order(col, { ascending = true } = {}) { this._order = `${col}.${ascending ? 'asc' : 'desc'}`; return this; }
  limit(n) { this._limit = n; return this; }
  single() { this._single = true; return this; }

  async _buildUrl(method = 'GET') {
    let url = `${this.client.url}/rest/v1/${this.table}?select=${encodeURIComponent(this._select)}`;
    this._filters.forEach(f => url += '&' + f);
    if (this._order) url += `&order=${this._order}`;
    if (this._limit) url += `&limit=${this._limit}`;
    return url;
  }

  async get() {
    const url = await this._buildUrl();
    const headers = await this.client.headers({ 'Prefer': 'return=representation' });
    if (this._single) headers['Accept'] = 'application/vnd.pgrst.object+json';
    try {
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en consulta');
      return { data, error: null };
    } catch (e) { return { data: null, error: e.message }; }
  }

  async insert(body) {
    const url = `${this.client.url}/rest/v1/${this.table}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: await this.client.headers({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al insertar');
      return { data, error: null };
    } catch (e) { return { data: null, error: e.message }; }
  }

  async update(body) {
    const url = await this._buildUrl();
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: await this.client.headers({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      return { data, error: null };
    } catch (e) { return { data: null, error: e.message }; }
  }

  async delete() {
    const url = await this._buildUrl();
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: await this.client.headers({ 'Prefer': 'return=representation' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al eliminar');
      }
      return { data: null, error: null };
    } catch (e) { return { data: null, error: e.message }; }
  }
}

// ============================================
// n8n Webhook API
// ============================================
class N8nAPI {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async call(endpoint, method = 'POST', body = null, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
    };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    try {
      const res = await fetch(url.toString(), opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }

  verificarEmpleado(codigo, nombre) {
    return this.call('verificar-empleado', 'POST', { codigo, nombre });
  }

  fichar(codigo, nombre, tipo) {
    return this.call('fichar', 'POST', { codigo, nombre, tipo });
  }

  consultarTurno(codigo) {
    return this.call('consultar-turno', 'GET', null, { codigo });
  }

  solicitarVacaciones(data) {
    return this.call('solicitar-vacaciones', 'POST', data);
  }

  registrarAusencia(data) {
    return this.call('registrar-ausencia', 'POST', data);
  }

  gestionarJustificante(data) {
    return this.call('gestionar-justificante', 'POST', data);
  }

  aprobarSolicitud(data) {
    return this.call('aprobar-solicitud', 'POST', data);
  }

  getDashboardData(rol, centro, fecha_desde, fecha_hasta) {
    return this.call('dashboard-data', 'GET', null, { rol, centro, fecha_desde, fecha_hasta });
  }

  chatMessage(codigo, mensaje, historial = []) {
    return this.call('chat-turnito', 'POST', { codigo, mensaje, historial });
  }
}

// ============================================
// Demo Data (Mock for offline)
// ============================================
const DEMO_DATA = {
  users: [
    { id: '1', email: 'empleado@turnito.es', password: 'demo123', rol: 'empleado', nombre: 'María García', centro: 'Sede Central', avatar: 'MG', color: '#00e5a0' },
    { id: '2', email: 'supervisora@turnito.es', password: 'demo123', rol: 'supervisora', nombre: 'Elena Morales', centro: 'Sede Central', avatar: 'EM', color: '#a78bfa' },
    { id: '3', email: 'rrhh@turnito.es', password: 'demo123', rol: 'rrhh', nombre: 'Cristina López', centro: 'Sede Central', avatar: 'CL', color: '#60a5fa' },
    { id: '4', email: 'ceo@turnito.es', password: 'demo123', rol: 'ceo', nombre: 'Alejandro Ruiz', centro: 'Global', avatar: 'AR', color: '#fbbf24' },
  ],

  empleados: [
    { id: 'e1', codigo: 'EMP001', nombre: 'Sanae Gutiérrez', centro: 'Sede Central', puesto: 'Agente Atención', tipo_contrato: 'indefinido', estado: 'activo', turno: '09:00-17:00', fichado: true, color: '#00e5a0', avatar: 'SG', horas_semana: 38, vacaciones_disponibles: 20 },
    { id: 'e2', codigo: 'EMP002', nombre: 'Carlos Martínez', centro: 'Sede Norte', puesto: 'Técnico IT', tipo_contrato: 'indefinido', estado: 'activo', turno: '14:00-22:00', fichado: false, color: '#60a5fa', avatar: 'CM', horas_semana: 42, vacaciones_disponibles: 15 },
    { id: 'e3', codigo: 'EMP003', nombre: 'Laura Pérez', centro: 'Sede Central', puesto: 'RRHH', tipo_contrato: 'indefinido', estado: 'baja', turno: '09:00-17:00', fichado: false, color: '#f87171', avatar: 'LP', horas_semana: 0, vacaciones_disponibles: 22 },
    { id: 'e4', codigo: 'EMP004', nombre: 'Oussama Filali', centro: 'Sede Sur', puesto: 'Logística', tipo_contrato: 'temporal', estado: 'activo', turno: '22:00-06:00', fichado: true, color: '#a78bfa', avatar: 'OF', horas_semana: 36, vacaciones_disponibles: 12 },
    { id: 'e5', codigo: 'EMP005', nombre: 'Ana Torres', centro: 'Sede Central', puesto: 'Comercial', tipo_contrato: 'practicas', estado: 'activo', turno: '09:00-14:00', fichado: true, color: '#fbbf24', avatar: 'AT', horas_semana: 25, vacaciones_disponibles: 8 },
    { id: 'e6', codigo: 'EMP006', nombre: 'Miguel Sánchez', centro: 'Sede Norte', puesto: 'Operaciones', tipo_contrato: 'indefinido', estado: 'vacaciones', turno: '-', fichado: false, color: '#34d399', avatar: 'MS', horas_semana: 0, vacaciones_disponibles: 5 },
  ],

  pendientes: [
    { id: 'p1', tipo: 'vacaciones', empleado: 'Sanae Gutiérrez', fecha_inicio: '2026-04-01', fecha_fin: '2026-04-10', dias: 8, solicitud: '2026-03-14', estado: 'pendiente' },
    { id: 'p2', tipo: 'ausencia', empleado: 'Carlos Martínez', fecha_inicio: '2026-03-18', fecha_fin: '2026-03-18', dias: 1, solicitud: '2026-03-15', estado: 'pendiente', motivo: 'Cita médica' },
    { id: 'p3', tipo: 'justificante', empleado: 'Laura Pérez', fecha_inicio: '2026-03-10', fecha_fin: '-', solicitud: '2026-03-10', estado: 'pendiente', doc: 'Baja médica' },
    { id: 'p4', tipo: 'permiso', empleado: 'Ana Torres', fecha_inicio: '2026-03-20', fecha_fin: '2026-03-20', dias: 1, solicitud: '2026-03-15', estado: 'pendiente', motivo: 'Gestión personal' },
  ],

  alertas_legales: [
    { empleado: 'Carlos Martínez', avatar: 'CM', desc: 'Lleva 42h esta semana (límite: 40h)', tipo: 'horas_max' },
    { empleado: 'Oussama Filali', avatar: 'OF', desc: 'Solo tiene 10h de descanso entre turnos (mínimo: 12h)', tipo: 'descanso_min' },
    { empleado: 'Ana Torres', avatar: 'AT', desc: 'Jornada nocturna sin complemento configurado', tipo: 'nocturnidad' },
  ],

  tareas: [
    { id: 't1', descripcion: 'Revisar informe semanal de ventas', completada: true },
    { id: 't2', descripcion: 'Actualizar CRM con leads del lunes', completada: false },
    { id: 't3', descripcion: 'Asistir al briefing de las 12:00h', completada: false },
    { id: 't4', descripcion: 'Enviar resumen de actividad diaria', completada: false },
  ],

  kpi_ceo: {
    coste_personal: { valor: '€ 124,500', cambio: '+2.3%', tendencia: 'up' },
    horas_extra: { valor: '87h', cambio: '-12%', tendencia: 'down' },
    cobertura_ausencias: { valor: '94%', cambio: '+1.5%', tendencia: 'up' },
    rotacion: { valor: '4.2%', cambio: '-0.8%', tendencia: 'down' },
    satisfaccion: { valor: '8.7/10', cambio: '+0.3', tendencia: 'up' },
  },

  costes_centro: [
    { centro: 'Sede Central', coste: 62000, color: '#00e5a0' },
    { centro: 'Sede Norte', coste: 38500, color: '#60a5fa' },
    { centro: 'Sede Sur', coste: 24000, color: '#a78bfa' },
  ],

  centros: [
    { id: 'c1', nombre: 'Sede Central', direccion: 'Calle Mayor 14, Madrid', ciudad: 'Madrid', empleados: 32, telefono: '91 234 5678', email_centro: 'central@empresa.es' },
    { id: 'c2', nombre: 'Sede Norte', direccion: 'Paseo de la Castellana 200, Madrid', ciudad: 'Madrid', empleados: 18, telefono: '91 876 5432', email_centro: 'norte@empresa.es' },
    { id: 'c3', nombre: 'Sede Sur', direccion: 'Av. Andalucía 55, Sevilla', ciudad: 'Sevilla', empleados: 14, telefono: '95 333 2222', email_centro: 'sur@empresa.es' },
  ],

  nominas: [
    { id: 'n1', empleado: 'Sanae Gutiérrez', periodo: 'Marzo 2026', bruto: '1.950,00 €', neto: '1.540,00 €', estado: 'pendiente' },
    { id: 'n2', empleado: 'Carlos Martínez', periodo: 'Marzo 2026', bruto: '2.100,00 €', neto: '1.650,00 €', estado: 'pendiente' },
    { id: 'n3', empleado: 'Oussama Filali', periodo: 'Marzo 2026', bruto: '1.800,00 €', neto: '1.420,00 €', estado: 'pendiente' },
    { id: 'n4', empleado: 'Ana Torres', periodo: 'Marzo 2026', bruto: '900,00 €', neto: '780,00 €', estado: 'aprobada' },
    { id: 'n5', empleado: 'Miguel Sánchez', periodo: 'Marzo 2026', bruto: '2.050,00 €', neto: '1.610,00 €', estado: 'enviada' },
  ],

  mensajes_chat: [
    { sender: 'bot', text: '¡Hola María! 👋 Soy Turnito, tu asistente de RRHH. ¿En qué puedo ayudarte hoy?', time: '08:50' },
    { sender: 'user', text: '¿Cuántos días de vacaciones me quedan?', time: '08:52' },
    { sender: 'bot', text: 'Tienes **22 días de vacaciones** disponibles para 2026. Ya has consumido 3 días y tienes 8 días pendientes de aprobación (solicitud del 14/03). ¿Quieres solicitar más días o consultar otra cosa?', time: '08:52' },
  ],

  historial_fichajes: [
    { fecha: '15/03/2026', entrada: '08:55', salida: '17:10', horas: '8h 15m', estado: 'completo' },
    { fecha: '14/03/2026', entrada: '09:02', salida: '17:05', horas: '8h 03m', estado: 'completo' },
    { fecha: '13/03/2026', entrada: '09:00', salida: '17:00', horas: '8h 00m', estado: 'completo' },
  ],
};

// ============================================
// Initialize singletons
// ============================================
const supabase = new SupabaseClient(TURNITO_CONFIG.supabaseUrl, TURNITO_CONFIG.supabaseAnonKey);
const n8nAPI = new N8nAPI(TURNITO_CONFIG.n8nBaseUrl, TURNITO_CONFIG.n8nApiKey);
