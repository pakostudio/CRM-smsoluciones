const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bljqlibgwvpflrtwgsef.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ALERT_FROM_EMAIL = process.env.ALERT_FROM_EMAIL || 'SM OS <alerts@resend.dev>';
const ALERT_REPLY_TO = process.env.ALERT_REPLY_TO || '';

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function assertServerConfig() {
  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!ALERT_FROM_EMAIL) missing.push('ALERT_FROM_EMAIL');
  return missing;
}

function supabaseHeaders(extra) {
  return Object.assign({
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  }, extra || {});
}

async function supabaseSelect(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;
  const response = await fetch(url, { headers: supabaseHeaders() });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data && data.message ? data.message : response.statusText);
  return data || [];
}

async function supabaseInsert(table, row) {
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: supabaseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data && data.message ? data.message : response.statusText);
  return Array.isArray(data) ? data[0] : data;
}

async function sendEmail({ to, subject, html, text, tags }) {
  const payload = {
    from: ALERT_FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  };
  if (ALERT_REPLY_TO) payload.reply_to = ALERT_REPLY_TO;
  if (tags && tags.length) payload.tags = tags;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  const data = body ? JSON.parse(body) : null;
  if (!response.ok) {
    const msg = data && (data.message || data.name) ? `${data.name || 'Resend'}: ${data.message || ''}` : response.statusText;
    throw new Error(msg);
  }
  return data;
}

function cleanDate(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}

function daysFromToday(value) {
  const d = cleanDate(value);
  if (!d) return null;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(`${d}T00:00:00`);
  return Math.ceil((target - start) / 86400000);
}

function isOpenTask(task) {
  return !['terminada', 'completada', 'cerrada', 'done'].includes(String(task.estado || '').toLowerCase());
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function taskRisk(task) {
  const due = daysFromToday(task.fecha_vencimiento);
  const follow = daysFromToday(task.fecha_proximo_seguimiento);
  if (due !== null && due < 0) return { level: 'critical', label: 'Vencida' };
  if (due !== null && due <= 1) return { level: 'high', label: 'Vence hoy o manana' };
  if (follow !== null && follow < 0) return { level: 'high', label: 'Seguimiento atrasado' };
  if (follow !== null && follow <= 1) return { level: 'medium', label: 'Seguimiento hoy o manana' };
  if (!String(task.siguiente_accion || '').trim()) return { level: 'medium', label: 'Sin siguiente accion' };
  if (due !== null && due <= 7) return { level: 'low', label: 'Vence esta semana' };
  return null;
}

function renderDigestHtml({ user, items }) {
  const rows = items.map((item) => {
    const task = item.task;
    return `<tr>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb"><strong>${escapeHtml(task.titulo)}</strong><br><span style="color:#64748b">${escapeHtml(item.projectName)}</span></td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.risk.label)}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(cleanDate(task.fecha_vencimiento) || 'Sin fecha')}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(task.siguiente_accion || 'Definir siguiente accion')}</td>
    </tr>`;
  }).join('');
  return `<div style="font-family:Arial,sans-serif;color:#0f2747">
    <h2 style="margin:0 0 8px">Resumen diario SM OS</h2>
    <p style="margin:0 0 18px;color:#64748b">Hola ${escapeHtml(user.nombre)}, estos son tus pendientes que requieren seguimiento.</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      <thead>
        <tr style="text-align:left;background:#f1f5f9">
          <th style="padding:10px">Tarea</th>
          <th style="padding:10px">Alerta</th>
          <th style="padding:10px">Entrega</th>
          <th style="padding:10px">Siguiente accion</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:18px;color:#64748b;font-size:12px">Correo automatico generado por SM OS. No incluye canales de mensajeria externa.</p>
  </div>`;
}

function renderDigestText({ user, items }) {
  const lines = [`Resumen diario SM OS para ${user.nombre}`, ''];
  items.forEach((item) => {
    lines.push(`- ${item.task.titulo}`);
    lines.push(`  Proyecto: ${item.projectName}`);
    lines.push(`  Alerta: ${item.risk.label}`);
    lines.push(`  Entrega: ${cleanDate(item.task.fecha_vencimiento) || 'Sin fecha'}`);
    lines.push(`  Siguiente accion: ${item.task.siguiente_accion || 'Definir siguiente accion'}`);
  });
  return lines.join('\n');
}

module.exports = {
  assertServerConfig,
  cleanDate,
  daysFromToday,
  escapeHtml,
  isOpenTask,
  json,
  renderDigestHtml,
  renderDigestText,
  sendEmail,
  supabaseInsert,
  supabaseSelect,
  taskRisk,
};
