const {
  assertServerConfig,
  isOpenTask,
  json,
  renderDigestHtml,
  renderDigestText,
  sendEmail,
  supabaseInsert,
  supabaseSelect,
  taskRisk,
} = require('../server/alerts-lib');

function allowed(req) {
  const secret = process.env.CRON_SECRET || '';
  if (!secret) return true;
  const auth = req.headers.authorization || '';
  const querySecret = new URL(req.url, 'https://sm-os.local').searchParams.get('secret') || '';
  return auth === `Bearer ${secret}` || querySecret === secret;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function alreadySentToday(userId) {
  const query = new URLSearchParams({
    select: 'id',
    user_id: `eq.${userId}`,
    type: 'eq.daily_digest',
    status: 'eq.sent',
    sent_on: `eq.${todayIso()}`,
    limit: '1',
  });
  try {
    const rows = await supabaseSelect('notification_logs', query.toString());
    return rows.length > 0;
  } catch (error) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return json(res, 405, { ok: false, error: 'Metodo no permitido' });
  if (!allowed(req)) return json(res, 401, { ok: false, error: 'CRON_SECRET invalido' });

  const missing = assertServerConfig();
  if (missing.length) return json(res, 503, { ok: false, error: 'Faltan variables de entorno', missing });

  try {
    const [users, prefs, projects, tasks] = await Promise.all([
      supabaseSelect('usuarios', 'select=id,nombre,rol,activo&activo=eq.true'),
      supabaseSelect('notification_preferences', 'select=*'),
      supabaseSelect('proyectos', 'select=id,nombre'),
      supabaseSelect('tareas', 'select=id,titulo,proyecto_id,owner_id,estado,prioridad,fecha_vencimiento,fecha_proximo_seguimiento,siguiente_accion'),
    ]);
    const projectById = new Map(projects.map((p) => [p.id, p]));
    const prefByUser = new Map(prefs.map((p) => [p.user_id, p]));
    const results = [];

    for (const user of users) {
      const pref = prefByUser.get(user.id) || {};
      if (!pref.email || pref.email_enabled === false || pref.daily_digest === false) {
        results.push({ user_id: user.id, status: 'skipped', reason: 'sin correo o resumen desactivado' });
        continue;
      }
      if (await alreadySentToday(user.id)) {
        results.push({ user_id: user.id, status: 'skipped', reason: 'ya enviado hoy' });
        continue;
      }
      const items = tasks
        .filter((task) => task.owner_id === user.id && isOpenTask(task))
        .map((task) => ({ task, risk: taskRisk(task), projectName: (projectById.get(task.proyecto_id) || {}).nombre || 'Sin proyecto' }))
        .filter((item) => item.risk)
        .sort((a, b) => {
          const order = { critical: 0, high: 1, medium: 2, low: 3 };
          return order[a.risk.level] - order[b.risk.level];
        })
        .slice(0, 25);

      if (!items.length) {
        results.push({ user_id: user.id, status: 'skipped', reason: 'sin alertas' });
        continue;
      }

      const subject = `SM OS: ${items.length} alerta${items.length === 1 ? '' : 's'} de seguimiento`;
      try {
        const sent = await sendEmail({
          to: pref.email,
          subject,
          html: renderDigestHtml({ user, items }),
          text: renderDigestText({ user, items }),
          tags: [{ name: 'type', value: 'daily_digest' }],
        });
        await supabaseInsert('notification_logs', {
          type: 'daily_digest',
          user_id: user.id,
          recipient_email: pref.email,
          subject,
          provider: 'resend',
          provider_message_id: sent && sent.id ? sent.id : null,
          status: 'sent',
          sent_on: todayIso(),
          metadata: { item_count: items.length },
        }).catch(() => null);
        results.push({ user_id: user.id, status: 'sent', count: items.length });
      } catch (error) {
        await supabaseInsert('notification_logs', {
          type: 'daily_digest',
          user_id: user.id,
          recipient_email: pref.email,
          subject,
          provider: 'resend',
          status: 'failed',
          sent_on: todayIso(),
          error: error.message,
          metadata: { item_count: items.length },
        }).catch(() => null);
        results.push({ user_id: user.id, status: 'failed', error: error.message });
      }
    }
    return json(res, 200, { ok: true, results });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message });
  }
};
