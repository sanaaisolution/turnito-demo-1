// ============================================
// VISTA: CEO / DIRECCIÓN
// ============================================

function renderCEODashboard() {
  const kpi = DEMO_DATA.kpi_ceo;
  return `
  <!-- KPIs ejecutivos -->
  <div class="grid-4 mb-5 animate-in">
    <div class="kpi-card amber">
      <div class="kpi-icon">${Icons.dollarSign}</div>
      <div class="kpi-label">Coste personal (mes)</div>
      <div class="kpi-value" style="font-size:24px;">${kpi.coste_personal.valor}</div>
      <div class="kpi-change up">↑ ${kpi.coste_personal.cambio} vs mes anterior</div>
    </div>
    <div class="kpi-card blue">
      <div class="kpi-icon">${Icons.clock}</div>
      <div class="kpi-label">Horas extra acumuladas</div>
      <div class="kpi-value">${kpi.horas_extra.valor}</div>
      <div class="kpi-change down">↓ ${kpi.horas_extra.cambio} vs mes anterior</div>
    </div>
    <div class="kpi-card green">
      <div class="kpi-icon">${Icons.shieldCheck}</div>
      <div class="kpi-label">Cobertura ausencias</div>
      <div class="kpi-value">${kpi.cobertura_ausencias.valor}</div>
      <div class="kpi-change up">↑ ${kpi.cobertura_ausencias.cambio}</div>
    </div>
    <div class="kpi-card purple">
      <div class="kpi-icon">${Icons.activity}</div>
      <div class="kpi-label">Satisfacción empleado</div>
      <div class="kpi-value">${kpi.satisfaccion.valor}</div>
      <div class="kpi-change up">↑ ${kpi.satisfaccion.cambio} pts</div>
    </div>
  </div>
  <div class="grid-5 mb-5 animate-in" style="animation-delay:0.05s">
    <div class="kpi-card amber" style="grid-column:span 1;">
      <div class="kpi-icon">${Icons.trendingUp}</div>
      <div class="kpi-label">Rotación personal</div>
      <div class="kpi-value" style="font-size:26px;">${kpi.rotacion.valor}</div>
      <div class="kpi-change down">↓ ${kpi.rotacion.cambio} últimos 6m</div>
    </div>
    <!-- Charts -->
    <div class="card" style="grid-column:span 2;">
      <div class="card-header">
        <div class="card-title">${Icons.barChart} Coste por centro (€k)</div>
      </div>
      ${renderBarChart()}
    </div>
    <div class="card" style="grid-column:span 2;">
      <div class="card-header">
        <div class="card-title">${Icons.activity} Evolución costes (12m)</div>
      </div>
      ${renderLineChart()}
    </div>
  </div>

  <div class="grid-2 animate-in" style="animation-delay:0.1s">
    <!-- Alertas críticas -->
    <div class="card">
      <div class="card-header">
        <div class="card-title text-red">🚨 Alertas críticas</div>
        <span class="pill pill-red">4 activas</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${[
          { label:'Contratos próximos a vencer', desc:'2 contratos vencen en menos de 30 días', color:'var(--warning)' },
          { label:'Horas extra excesivas', desc:'Carlos M. superó el límite semanal (+2h)', color:'var(--warning)' },
          { label:'Cobertura baja — Sede Sur', desc:'Solo 2/5 turnos de esta semana cubiertos', color:'var(--error)' },
          { label:'Descanso legal incumplido', desc:'Oussama F. con 10h entre jornadas (mín. 12h)', color:'var(--error)' },
        ].map(a => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);border-left:3px solid ${a.color};">
            <div>
              <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${a.label}</div>
              <div class="text-xs text-muted">${a.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Reportes y contratos -->
    <div>
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">${Icons.filetext} Reportes automáticos</div>
        </div>
        ${[
          { label:'Resumen semanal', sub:'Sem. 11 · 10-16 Mar 2026', icon:'📊' },
          { label:'Reporte mensual', sub:'Febrero 2026', icon:'📈' },
          { label:'Reporte anual', sub:'2025 – Análisis y tendencias', icon:'📋' },
        ].map(r => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:20px;">${r.icon}</span>
            <div style="flex:1;">
              <div class="text-sm font-bold">${r.label}</div>
              <div class="text-xs text-muted">${r.sub}</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="showToast('Generando PDF…','warning')">${Icons.download} PDF</button>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.filetext} Contratos próximos a vencer</div>
        </div>
        ${[
          { nombre:'Ana Torres', vence:'22/03/2026', dias:7 },
          { nombre:'Oussama Filali', vence:'30/03/2026', dias:15 },
        ].map(c => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="flex:1;">
              <div class="text-sm font-bold">${c.nombre}</div>
              <div class="text-xs text-muted">Vence ${c.vence}</div>
            </div>
            <span class="pill ${c.dias<=7?'pill-red':'pill-amber'}">${c.dias} días</span>
            <button class="btn btn-sm btn-blue" onclick="showToast('Abriendo contrato…','warning')">Renovar</button>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Distribución contratos + Mapa calor -->
  <div class="grid-2 mt-4 animate-in" style="animation-delay:0.15s">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Distribución tipo de contrato</div>
      </div>
      ${renderDonutChart()}
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Mapa de calor — Ausencias por día (Feb 2026)</div>
      </div>
      ${renderHeatmap()}
    </div>
  </div>
  `;
}

// ---- Mini Charts ----
function renderBarChart() {
  const max = Math.max(...DEMO_DATA.costes_centro.map(c => c.coste));
  return `
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
      ${DEMO_DATA.costes_centro.map(c => `
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-muted">${c.centro}</span>
            <span style="color:${c.color};font-weight:600;">€${(c.coste/1000).toFixed(1)}k</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(c.coste/max*100)}%;background:${c.color};"></div></div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderLineChart() {
  const months = ['A','M','J','J','A','S','O','N','D','E','F','M'];
  const values = [98,102,108,115,110,118,125,119,130,122,135,124.5];
  const max = Math.max(...values), min = Math.min(...values);
  const W = 300, H = 100;
  const pts = values.map((v, i) => {
    const x = (i / (values.length-1)) * W;
    const y = H - ((v - min) / (max - min)) * H;
    return `${x},${y}`;
  }).join(' ');

  return `
    <div style="margin-top:8px;">
      <svg viewBox="0 0 300 110" width="100%" height="110" style="overflow:visible;">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="0,${H} ${pts} ${W},${H}" fill="url(#areaGrad)"/>
        <polyline points="${pts}" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        ${values.map((v, i) => {
          const x = (i / (values.length-1)) * W;
          const y = H - ((v - min) / (max - min)) * H;
          return `<circle cx="${x}" cy="${y}" r="3" fill="#fbbf24" stroke="#0a0e14" stroke-width="1.5"/>`;
        }).join('')}
        ${months.map((m, i) => `<text x="${(i/(months.length-1))*W}" y="115" text-anchor="middle" font-size="9" fill="#6b7280">${m}</text>`).join('')}
      </svg>
    </div>
  `;
}

function renderDonutChart() {
  const data = [
    { label:'Indefinido', val:50, color:'#00e5a0' },
    { label:'Temporal', val:27, color:'#60a5fa' },
    { label:'Prácticas', val:15, color:'#a78bfa' },
    { label:'Autónomo', val:8, color:'#fbbf24' },
  ];
  const total = data.reduce((s, d) => s + d.val, 0);
  let offset = 0;
  const r = 50, cx = 70, cy = 70, stroke = 28;
  const circumference = 2 * Math.PI * r;
  const segments = data.map(d => {
    const pct = d.val / total;
    const seg = { ...d, pct, offset, dash: pct * circumference, gap: circumference };
    offset += pct;
    return seg;
  });

  return `
    <div style="display:flex;align-items:center;gap:24px;margin-top:8px;flex-wrap:wrap;">
      <svg width="140" height="140" viewBox="0 0 140 140">
        ${segments.map(s => `
          <circle cx="${cx}" cy="${cy}" r="${r}"
            fill="none" stroke="${s.color}" stroke-width="${stroke}"
            stroke-dasharray="${s.dash} ${circumference - s.dash}"
            stroke-dashoffset="${-s.offset * circumference}"
            transform="rotate(-90 ${cx} ${cy})" style="transition:all 0.5s;"/>
        `).join('')}
        <circle cx="${cx}" cy="${cy}" r="${r - stroke/2 - 2}" fill="var(--bg-card)"/>
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="18" font-weight="800" fill="#f0f2f5" font-family="Syne">${total}</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="10" fill="#6b7280">empleados</text>
      </svg>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${data.map(d => `
          <div class="flex items-center gap-2">
            <div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>
            <span class="text-sm">${d.label}</span>
            <span style="margin-left:auto;font-weight:700;color:${d.color};">${d.val}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHeatmap() {
  const intensity = [0,1,2,1,3,4,2,1,0,2,3,5,2,1,1,2,4,3,2,1,0,1,2,3,4,5,4,2];
  const colors = ['var(--bg-input)','rgba(0,229,160,0.1)','rgba(0,229,160,0.25)','rgba(245,158,11,0.3)','rgba(245,158,11,0.5)','rgba(239,68,68,0.6)'];
  const days = ['L','M','X','J','V','S','D'];
  return `
    <div style="margin-top:8px;">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px;">
        ${days.map(d=>`<div style="text-align:center;font-size:10px;color:var(--text-secondary);">${d}</div>`).join('')}
      </div>
      <div class="heatmap-grid">
        ${intensity.map(v=>`<div class="heatmap-cell" style="background:${colors[v]||colors[0]};" title="${v} ausencias"></div>`).join('')}
      </div>
      <div class="flex gap-3 mt-3" style="align-items:center;flex-wrap:wrap;">
        <span class="text-xs text-muted">Menos</span>
        ${colors.map(c=>`<div style="width:14px;height:14px;border-radius:3px;background:${c};"></div>`).join('')}
        <span class="text-xs text-muted">Más ausencias</span>
      </div>
    </div>
  `;
}
