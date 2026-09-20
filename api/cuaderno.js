/* ------------------------------------------------------------------
   /api/cuaderno  ·  guarda y devuelve las respuestas de un participante
   GET  /api/cuaderno?codigo=VALLE-7K2M
   POST /api/cuaderno   { codigo, respuestas, resumen }
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

/* Solo letras, números y guiones. Así un código no puede tocar otras llaves. */
function limpiarCodigo(c) {
  return String(c || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const db = conectar();
  if (!db) {
    return res.status(503).json({
      ok: false,
      error: 'La base de datos no está conectada. Instale Upstash for Redis desde el Marketplace de Vercel.'
    });
  }

  try {
    if (req.method === 'GET') {
      const codigo = limpiarCodigo(req.query.codigo);
      if (codigo.length < 4) {
        return res.status(400).json({ ok: false, error: 'El código debe tener al menos 4 caracteres.' });
      }
      const dato = await db.get('p:' + codigo);
      return res.status(200).json({
        ok: true,
        codigo: codigo,
        existe: !!dato,
        respuestas: (dato && dato.respuestas) || {},
        actualizado: (dato && dato.actualizado) || null
      });
    }

    if (req.method === 'POST') {
      const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const codigo = limpiarCodigo(cuerpo.codigo);
      if (codigo.length < 4) {
        return res.status(400).json({ ok: false, error: 'El código debe tener al menos 4 caracteres.' });
      }

      const respuestas = cuerpo.respuestas || {};
      if (JSON.stringify(respuestas).length > 400000) {
        return res.status(413).json({ ok: false, error: 'Las respuestas son demasiado largas.' });
      }

      const registro = {
        codigo: codigo,
        respuestas: respuestas,
        resumen: cuerpo.resumen || {},
        actualizado: new Date().toISOString()
      };

      await db.set('p:' + codigo, registro);
      await db.sadd('codigos', codigo);

      return res.status(200).json({ ok: true, actualizado: registro.actualizado });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });

  } catch (e) {
    console.error('cuaderno:', e && e.message);
    return res.status(500).json({ ok: false, error: 'No se pudo guardar en este momento.' });
  }
};
