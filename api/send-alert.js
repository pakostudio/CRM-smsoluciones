const {
  assertServerConfig,
  escapeHtml,
  isOpenTask,
  json,
  sendEmail,
  supabaseInsert,
  supabaseSelect,
  taskRisk,
} = require('../server/alerts-lib');

function allowed(req) {
  const token = process.env.SM_INTERNAL_API_TOKEN || '';
  if (!token) return false;
  return (req.headers['x-sm-admin-token'] || '') === token;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (error) { reject(new Error('JSON invalido')); }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Metodo no permitido' });
  if (!allowed(req)) return json(res, 401, { ok: false, error: 'Token administrativo requerido' });

  const missing = assertServerConfig();
  if (missing.length) return json(res, 503, { ok: false, error: 'Faltan variables de entorno', missing });

  try {
    const body = await readBody(req);
    if (!body.task_id || !body.user_id) return json(res, 400, { ok: false, error: 'task_id y user_id son obligatorios' });

    const [users, tasks, prefs, projects] = await Promise.all([
      supabaseSelect('usuarios', `select=id,nombre,activo&id=eq.${encodeURIComponent(body.user_id)}&activo=eq.true`),
      supabaseSelect('tareas', `select=id,titulo,proyecto_id,owner_id,estado,prioridad,fecha_vencimiento,fecha_proximo_seguimiento,siguiente_accion&id=eq.${encodeURIComponent(body.task_id)}`),
      supabaseSelect('notification_preferences', `select=*&user_id=eq.${encodeURIComponent(body.user_id)}`),
      supabaseSelect('proyectos', 'select=id,nombre'),
    ]);
    const user = users[0];
    const task = tasks[0];
    const pref = prefs[0] || {};
    if (!user || !task) return json(res, 404, { ok: false, error: 'Usuario o tarea no encontrados' });
    if (!isOpenTask(task)) return json(res, 409, { ok: false, error: 'La tarea ya esta cerrada' });
    if (!pref.email || pref.email_enabled === false) return json(res, 409, { ok: false, error: 'El usuario no tiene correo de alertas activo' });

    const project = projects.find((p) => p.id === task.proyecto_id) || {};
    const risk = taskRisk(task) || { label: 'Recordatorio manual' };
    const subject = `SM OS: seguimiento requerido - ${task.titulo}`;
    const html = `<div style="font-family:Arial,sans-serif;color:#0f2747">
      <h2 style="margin:0 0 8px">Seguimiento requerido</h2>
      <p>Hola ${escapeHtml(user.nombre)}, hay una tarea que requiere atencion.</p>
      <p><strong>${escapeHtml(task.titulo)}</strong><br>${escapeHtml(project.nombre || 'Sin proyecto')}</p>
      <p><strong>Alerta:</strong> ${escapeHtml(risk.label)}</p>
      <p><strong>Siguiente accion:</strong> ${escapeHtml(task.siguiente_accion || 'Definir siguiente accion')}</p>
    </div>`;
    const text = [
      `Seguimiento requerido para ${user.nombre}`,
      `Tarea: ${task.titulo}`,
      `Proyecto: ${project.nombre || 'Sin proyecto'}`,
      `Alerta: ${risk.label}`,
      `Siguiente accion: ${task.siguiente_accion || 'Definir siguiente accion'}`,
    ].join('\n');
    const sent = await sendEmail({ to: pref.email, subject, html, text, tags: [{ name: 'type', value: 'manual_alert' }] });

    await supabaseInsert('notification_logs', {
      type: 'manual_alert',
      user_id: user.id,
      task_id: task.id,
      project_id: task.proyecto_id,
      recipient_email: pref.email,
      subject,
      provider: 'resend',
      provider_message_id: sent && sent.id ? sent.id : null,
      status: 'sent',
      sent_on: new Date().toISOString().slice(0, 10),
      metadata: { triggered_by: body.triggered_by || null },
    }).catch(() => null);

    return json(res, 200, { ok: true, id: sent && sent.id ? sent.id : null });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message });
  }
};
