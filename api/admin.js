/* ------------------------------------------------------------------
   /api/admin  ·  panel del equipo de acompañamiento
   GET /api/admin?clave=...              → lista de participantes
   GET /api/admin?clave=...&codigo=XXX   → respuestas completas de uno
   La clave se configura en Vercel como variable de entorno CLAVE_ADMIN.
------------------------------------------------------------------- */
const { Redis } = require('@upstash/redis');

let redis = null;
function conectar() {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

/* comparación que no revela la clave por el tiempo de respuesta */
function clavesIguales(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const esperada = process.env.CLAVE_ADMIN;
  if (!esperada) {
    return res.status(503).json({ ok: false, error: 'Falta configurar CLAVE_ADMIN en Vercel.' });
  }
  if (!clavesIguales(req.query.clave, esperada)) {
    return res.status(401).json({ ok: false, error: 'Clave incorrecta.' });
  }

  const db = conectar();
  if (!db) return res.status(503).json({ ok: false, error: 'La base de datos no está conectada.' });

  try {
    /* detalle de un participante */
    if (req.query.codigo) {
      const codigo = String(req.query.codigo).toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
      const dato = await db.get('p:' + codigo);
      if (!dato) return res.status(404).json({ ok: false, error: 'Ese código no tiene respuestas.' });
      return res.status(200).json({ ok: true, participante: dato });
    }

    /* lista completa */
    const codigos = (await db.smembers('codigos')) || [];
    const participantes = [];

    for (let i = 0; i < codigos.length; i += 50) {
      const lote = codigos.slice(i, i + 50).map(function (c) { return 'p:' + c; });
      const datos = await db.mget(...lote);
      datos.forEach(function (d, k) {
        if (!d) return;
        participantes.push({
          codigo: d.codigo || codigos[i + k],
          actualizado: d.actualizado || null,
          resumen: d.resumen || {}
        });
      });
    }

    participantes.sort(function (a, b) {
      return String(b.actualizado || '').localeCompare(String(a.actualizado || ''));
    });

    return res.status(200).json({ ok: true, total: participantes.length, participantes: participantes });

  } catch (e) {
    console.error('admin:', e && e.message);
    return res.status(500).json({ ok: false, error: 'No se pudo leer la información.' });
  }
};
