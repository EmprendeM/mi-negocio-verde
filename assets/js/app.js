/* ==================================================================
   Reverdecer · Mi negocio verde — lógica del cuaderno interactivo
   Sin dependencias. Todo se guarda en el navegador del participante.
================================================================== */
(function () {
  'use strict';

  var D = window.CARTILLA;
  var LLAVE = 'reverdecer-mi-negocio-verde-v1';
  var estado = {};
  var main, nav, avance;

  /* ---------------------------------------------------------- util */
  function $(s, c) { return (c || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(v) {
    if (v == null || v === '') return null;
    var s = String(v).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function pesos(n) {
    if (n == null || isNaN(n)) return '—';
    var neg = n < 0; n = Math.round(Math.abs(n));
    return (neg ? '−$' : '$') + n.toLocaleString('es-CO');
  }
  function ico(id, cls) {
    return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
  }

  /* --------------------------------------------------------- estado */
  function cargar() {
    try { estado = JSON.parse(localStorage.getItem(LLAVE) || '{}') || {}; }
    catch (e) { estado = {}; }
  }
  var guardarPronto = null;
  function guardar() {
    clearTimeout(guardarPronto);
    guardarPronto = setTimeout(function () {
      try { localStorage.setItem(LLAVE, JSON.stringify(estado)); } catch (e) { }
      var s = $('#guardado-txt');
      if (s) { s.textContent = 'Guardado ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }); }
      if (window.NUBE) window.NUBE.cambio();
    }, 300);
  }
  function val(id) { return estado[id] == null ? '' : estado[id]; }
  function lleno(id) { var v = estado[id]; return v != null && String(v).trim() !== ''; }

  /* ----------------------------------------------- campos genéricos */
  function campoHTML(pre, c) {
    var id = pre + '.' + c.id;
    var h = '<div class="campo" data-campo="' + id + '">';

    if (c.t === 'texto' || c.t === 'fecha' || c.t === 'numero' || c.t === 'moneda') {
      h += '<label for="' + id + '">' + esc(c.label) + '</label>';
      if (c.t === 'moneda') {
        h += '<div class="moneda"><span>$</span><input type="text" inputmode="numeric" id="' + id +
          '" name="' + id + '" value="' + esc(val(id)) + '" placeholder="0"></div>';
      } else if (c.t === 'numero') {
        h += '<input type="number" inputmode="decimal" id="' + id + '" name="' + id + '" value="' + esc(val(id)) + '">';
      } else if (c.t === 'fecha') {
        h += '<input type="date" id="' + id + '" name="' + id + '" value="' + esc(val(id)) + '">';
      } else {
        h += '<input type="text" id="' + id + '" name="' + id + '" value="' + esc(val(id)) + '">';
      }

    } else if (c.t === 'area') {
      h += '<label for="' + id + '">' + esc(c.label) + '</label>' +
        '<textarea id="' + id + '" name="' + id + '" rows="3">' + esc(val(id)) + '</textarea>';

    } else if (c.t === 'opcion') {
      h += '<span class="etq">' + esc(c.label) + '</span><div class="opciones">';
      c.opciones.forEach(function (o, i) {
        var m = val(id) === o ? ' marcada' : '';
        h += '<label class="opcion' + m + '"><input type="radio" name="' + id + '" value="' + esc(o) + '"' +
          (val(id) === o ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      });
      h += '</div>';

    } else if (c.t === 'checks') {
      h += '<span class="etq">' + esc(c.label) + '</span><div class="opciones">';
      c.opciones.forEach(function (o, i) {
        var cid = id + '.' + i, m = val(cid) === 'si' ? ' marcada' : '';
        h += '<label class="opcion' + m + '"><input type="checkbox" name="' + cid + '"' +
          (val(cid) === 'si' ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      });
      h += '</div>';

    } else if (c.t === 'tabla') {
      h += '<span class="etq">' + esc(c.label) + '</span><div class="tabla-caja"><table class="apilable"><thead><tr><th>' +
        esc(c.label) + '</th>' + c.columnas.map(function (k) { return '<th>' + esc(k.label) + '</th>'; }).join('') + '</tr></thead><tbody>';
      c.filas.forEach(function (f, i) {
        h += '<tr><td class="rotulo">' + esc(f) + '</td>';
        c.columnas.forEach(function (k) {
          var cid = id + '.' + i + '.' + k.id;
          h += '<td data-etq="' + esc(k.label) + '"><input type="text"' +
            (k.t === 'moneda' ? ' inputmode="numeric" class="num" data-moneda="1"' : '') +
            ' name="' + cid + '" value="' + esc(val(cid)) + '"></td>';
        });
        h += '</tr>';
      });
      if (c.suma) {
        h += '<tr class="total"><td class="rotulo">Total</td><td class="calc" data-suma="' + id + '|' + c.suma + '|' + c.filas.length + '">—</td></tr>';
      }
      h += '</tbody></table></div>';

    } else if (c.t === 'lista') {
      h += '<span class="etq">' + esc(c.label) + '</span><div class="tabla-caja"><table class="apilable"><thead><tr>' +
        c.columnas.map(function (k) { return '<th>' + esc(k.label) + '</th>'; }).join('') + '</tr></thead><tbody>';
      for (var i = 0; i < c.lineas; i++) {
        h += '<tr data-fila="' + id + '|' + i + '">';
        c.columnas.forEach(function (k) {
          var cid = id + '.' + i + '.' + k.id;
          h += '<td data-etq="' + esc(k.label) + '"><input type="text"' +
            (k.t === 'moneda' ? ' inputmode="numeric" class="num" data-moneda="1"' : '') +
            ' name="' + cid + '" value="' + esc(val(cid)) + '"></td>';
        });
        h += '</tr>';
      }
      h += '</tbody></table></div><div class="btns"><button type="button" class="btn gris chico" data-mas="' +
        id + '">+ Agregar línea</button></div>';

    } else if (c.t === 'caja') {
      h += '<span class="etq">' + esc(c.label) + '</span><div class="tabla-caja"><table class="apilable"><thead><tr>' +
        c.columnas.map(function (k) { return '<th>' + esc(k.label) + '</th>'; }).join('') +
        '<th class="num">Queda $</th></tr></thead><tbody>';
      for (var j = 0; j < c.lineas; j++) {
        h += '<tr data-fila="' + id + '|' + j + '">';
        c.columnas.forEach(function (k) {
          var cid = id + '.' + j + '.' + k.id;
          var ph = (c.dias && k.id === 'fecha') ? ' placeholder="Día ' + (j + 1) + '"' : '';
          h += '<td data-etq="' + esc(k.label) + '"><input type="text"' +
            (k.t === 'moneda' ? ' inputmode="numeric" class="num" data-moneda="1"' : '') + ph +
            ' name="' + cid + '" value="' + esc(val(cid)) + '"></td>';
        });
        h += '<td class="calc" data-etq="Queda $" data-saldo="' + id + '|' + j + '">—</td></tr>';
      }
      h += '</tbody></table></div><div class="btns"><button type="button" class="btn gris chico" data-mas="' +
        id + '">+ Agregar línea</button></div>';

    } else if (c.t === 'comparar') {
      var enc = c.encabezados || ['Antes', 'Después'];
      h += '<span class="etq">' + esc(c.label) + '</span><div class="tabla-caja"><table class="apilable"><thead><tr><th>' +
        esc(c.label) + '</th><th>' + esc(enc[0]) + '</th><th>' + esc(enc[1]) + '</th></tr></thead><tbody>';
      c.filas.forEach(function (f) {
        h += '<tr><td class="rotulo">' + esc(f.label) + '</td>';
        ['a', 'b'].forEach(function (lado, k) {
          var cid = id + '.' + f.id + '.' + lado;
          h += '<td data-etq="' + esc(enc[k]) + '"><input type="text"' +
            (f.t === 'moneda' || f.t === 'numero' ? ' inputmode="decimal" class="num"' : '') +
            (f.t === 'moneda' ? ' data-moneda="1"' : '') +
            ' name="' + cid + '" value="' + esc(val(cid)) + '"></td>';
        });
        h += '</tr>';
        if (f.diferencia) {
          h += '<tr class="total"><td class="rotulo">Diferencia</td><td class="calc" colspan="2" data-dif="' +
            id + '.' + f.id + '">—</td></tr>';
        }
      });
      h += '</tbody></table></div>';

    } else if (c.t === 'resultado') {
      h += '<div class="resultado" data-calculo="' + c.calculo + '"><span class="etq">' + esc(c.label) + '</span></div>';
    }

    return h + '</div>';
  }

  function camposHTML(pre, lista) { return lista.map(function (c) { return campoHTML(pre, c); }).join(''); }

  /* --------------------------------------------------------- quiz  */
  function quizHTML(m) {
    var h = '<div class="tarjeta"><h2>Compruebo lo que aprendí</h2>' +
      '<p class="guia">Marque una respuesta. El cuaderno le dice de inmediato si va bien y por qué.</p>';
    m.quiz.forEach(function (q, i) {
      var id = m.id + '.quiz.' + i, elegida = val(id), resp = elegida === '' ? null : parseInt(elegida, 10);
      h += '<div class="quiz-q" data-q="' + id + '"><div class="p"><span class="n">' + (i + 1) +
        '</span><p>' + esc(q.p) + '</p></div>';
      q.ops.forEach(function (o, j) {
        var cls = '';
        if (resp != null) {
          if (j === q.ok) cls = ' bien';
          else if (j === resp) cls = ' mal';
        }
        h += '<label class="quiz-op' + cls + '"><span class="letra">' + 'ABCDE'[j] + '</span>' +
          '<input type="radio" name="' + id + '" value="' + j + '"' + (resp === j ? ' checked' : '') + '>' +
          '<span>' + esc(o) + '</span></label>';
      });
      if (resp != null) {
        var bien = resp === q.ok;
        h += '<div class="quiz-fb ' + (bien ? 'bien' : 'mal') + '"><b>' +
          (bien ? '¡Correcto! ' : 'Todavía no. ') + '</b>' + esc(q.porque) + '</div>';
      }
      h += '</div>';
    });
    return h + '</div>';
  }

  /* ------------------------------------------------------ secciones */
  function inicioHTML() {
    var h = '<section class="seccion" id="s-inicio">';
    h += '<div class="hero"><img src="assets/img/hero.jpg" alt="Tres productores rurales con canastos de cosecha">' +
      '<div class="hero-tx"><div class="contenedor"><h1>Mi negocio <em>verde</em></h1>' +
      '<p class="lema">Negocios de hoy, territorios con futuro</p>' +
      '<p>' + esc(D.marca.entrada) + ' Complete cada actividad en línea: el cuaderno hace las cuentas y le muestra los resultados.</p>' +
      '<div class="btns"><button class="btn" data-ir="m1">Empezar por el módulo 1</button>' +
      '<button class="btn linea" data-ir="resultados">Ver mis resultados</button></div></div></div></div>';

    h += '<div class="contenedor"><div class="tarjeta" style="margin-top:18px"><h2>Este cuaderno es suyo</h2>' +
      '<p class="guia">Úselo para anotar, probar y mejorar su negocio. No es un examen.</p>' +
      '<div class="rejilla dos" style="margin-top:12px">' + camposHTML('perfil', D.perfil.slice(0, 2)) + '</div>' +
      camposHTML('perfil', D.perfil.slice(2)) +
      '<div class="aviso verde">' + ico('chat', 'ico') + '<div><h4>¿Tiene dudas?</h4>' +
      '<p>Un asesor del equipo de acompañamiento puede revisar cualquier actividad con usted.</p></div></div>' +
      '<div class="guardado"><i></i><span id="guardado-txt">Sus respuestas se guardan solas en este dispositivo</span></div></div>';

    h += '<h2 style="margin:26px 0 0">La ruta, paso a paso</h2>' +
      '<p style="margin-top:2px;color:var(--gris)">Una actividad principal cada 15 días. Avance a su ritmo.</p>' +
      '<div class="mod-lista">';
    D.modulos.forEach(function (m) {
      h += '<button class="mod-card" data-ir="' + m.id + '">' +
        '<figure><img src="assets/img/modulo-' + m.n + '.jpg" alt="" loading="lazy">' +
        '<span class="etiqueta">MÓDULO ' + m.n + ' · ' + esc(m.dias) + '</span></figure>' +
        '<div class="cuerpo"><h3>' + esc(m.titulo) + '</h3><p>' + esc(m.lema) + '</p>' +
        '<div class="pie"><span class="barrita ' + m.color + '"><i data-barra="' + m.id + '" style="width:0%"></i></span>' +
        '<span class="pct" data-pct="' + m.id + '">0%</span></div></div></button>';
    });
    h += '</div>';

    h += '<div class="tarjeta" style="margin-top:22px"><h2>' + esc(D.autoevaluacion.titulo) + '</h2>' +
      '<p class="guia">' + esc(D.autoevaluacion.guia) + '</p>' + autoevalHTML() + '</div>';

    h += '</div></section>';
    return h;
  }

  function autoevalHTML() {
    var a = D.autoevaluacion;
    var h = '<div class="aviso naranja">' + ico('bulb') + '<div><h4>Cómo se usa</h4><p>' + esc(a.ayuda) + '</p></div></div>';
    h += '<div class="tabla-caja" style="margin-top:12px"><table class="apilable"><thead><tr><th>Aspecto</th>' +
      '<th>Al empezar</th><th>Hoy</th><th>Al cerrar</th></tr></thead><tbody>';
    a.aspectos.forEach(function (asp, i) {
      h += '<tr><td class="rotulo">' + (i + 1) + '. ' + esc(asp) + '</td>';
      ['antes', 'hoy', 'cierre'].forEach(function (mom, k) {
        var cid = 'auto.' + i + '.' + mom, v = val(cid);
        var op = '<option value="">—</option>';
        for (var n = 1; n <= 5; n++) op += '<option value="' + n + '"' + (v == n ? ' selected' : '') + '>' + n + ' · ' + a.escala[n - 1] + '</option>';
        h += '<td data-etq="' + ['Al empezar', 'Hoy', 'Al cerrar'][k] + '"><select name="' + cid + '">' + op + '</select></td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }

  function moduloHTML(m) {
    var h = '<section class="seccion" id="s-' + m.id + '"><div class="contenedor">';
    h += '<div class="mod-hero"><img src="assets/img/modulo-' + m.n + '.jpg" alt="">' +
      '<div class="sobre"><span class="chip">MÓDULO ' + m.n + ' · ' + esc(m.dias) + '</span>' +
      '<h2>' + esc(m.titulo) + '</h2><p>' + esc(m.lema) + '</p></div></div>';

    h += '<div class="tarjeta"><div class="aviso verde">' + ico('target') +
      '<div><h4>Meta de esta quincena</h4><p>' + esc(m.meta) + '</p></div></div><div class="pasos">';
    m.pasos.forEach(function (p, i) {
      h += '<div class="paso"><span class="n">' + (i + 1) + '</span><p><b>' + esc(p[0]) + '</b> ' + esc(p[1]) + '</p></div>';
    });
    h += '</div><div class="aviso azul">' + ico('book') + '<div><h4>Caso que inspira</h4><p>' + esc(m.caso) +
      ' <a href="#recursos">Ver fuente ' + m.casoRef + '</a></p></div></div></div>';

    m.actividades.forEach(function (a) {
      h += '<div class="tarjeta"><h2>' + esc(a.titulo) + '</h2><p class="guia">' + esc(a.guia) + '</p>';
      if (a.formula) {
        h += '<div class="formula">' + a.formula.map(function (f, i) {
          return (i ? '<i>+</i>' : '') + '<span>' + esc(f) + '</span>';
        }).join('') + '</div>';
      }
      if (a.ayuda) h += '<div class="aviso naranja">' + ico('bulb') + '<div><h4>Ejemplo</h4><p>' + esc(a.ayuda) + '</p></div></div>';
      h += camposHTML(m.id + '.' + a.id, a.campos) + '</div>';
    });

    h += quizHTML(m);

    h += '<div class="tarjeta"><h2>Mi bitácora de la quincena ' + m.n + '</h2>' +
      '<p class="guia">' + esc(m.dias) + ' · ' + esc(m.bitacora.frase) + '</p>' +
      '<div class="aviso naranja">' + ico('bulb') + '<div><h4>Ejemplo de evidencia</h4><p>' + esc(m.bitacora.ejemplo) + '</p></div></div>';
    D.bitacoraCampos.forEach(function (lab, i) {
      h += campoHTML(m.id + '.bit', { t: 'area', id: String(i), label: (i + 1) + '. ' + lab });
    });
    h += '</div>';

    var idx = D.modulos.indexOf(m);
    h += '<div class="pasar">' +
      (idx > 0 ? '<button class="btn gris" data-ir="' + D.modulos[idx - 1].id + '">← Módulo ' + idx + '</button>' : '<span></span>') +
      (idx < D.modulos.length - 1
        ? '<button class="btn" data-ir="' + D.modulos[idx + 1].id + '">Módulo ' + (idx + 2) + ' →</button>'
        : '<button class="btn" data-ir="cierre">Ir al cierre →</button>') +
      '</div>';

    return h + '</div></section>';
  }

  function cierreHTML() {
    var c = D.cierre;
    var h = '<section class="seccion" id="s-cierre"><div class="contenedor">';
    h += '<div class="tarjeta"><h2>' + esc(c.mentor.titulo) + '</h2><p class="guia">' + esc(c.mentor.guia) + '</p>' +
      '<div class="aviso naranja">' + ico('bulb') + '<div><h4>Ejemplo</h4><p>' + esc(c.mentor.ayuda) + '</p></div></div>';
    [1, 2].forEach(function (n) {
      h += '<h3 style="margin-top:16px">Conversación ' + n + '</h3>' +
        campoHTML('cierre.mentor' + n, { t: 'fecha', id: 'fecha', label: 'Fecha' }) +
        c.mentor.campos.map(function (lab, i) {
          return campoHTML('cierre.mentor' + n, { t: 'area', id: 'c' + i, label: lab });
        }).join('');
    });
    h += '</div>';

    h += '<div class="tarjeta"><h2>Veo mi progreso con hechos</h2>' +
      '<p class="guia">Revise qué hizo, qué probó y qué guardó como evidencia.</p>' +
      '<div class="tabla-caja"><table class="apilable"><thead><tr><th>Lo que guardo</th><th>¿Cómo va?</th></tr></thead><tbody>';
    c.evidencias.forEach(function (e, i) {
      var cid = 'cierre.ev.' + i, v = val(cid);
      var op = '<option value="">—</option>' + c.estados.map(function (s) {
        return '<option value="' + s + '"' + (v === s ? ' selected' : '') + '>' + s + '</option>';
      }).join('');
      h += '<tr><td class="rotulo">' + esc(e) + '</td><td data-etq="¿Cómo va?"><select name="' + cid + '">' + op + '</select></td></tr>';
    });
    h += '</tbody></table></div>' +
      campoHTML('cierre', { t: 'area', id: 'claridad', label: 'Lo que ahora hago con más claridad es' }) +
      campoHTML('cierre', { t: 'area', id: 'practicar', label: 'Esto todavía necesito practicar o confirmar' }) + '</div>';

    h += '<div class="tarjeta"><h2>' + esc(c.plan.titulo) + '</h2><p class="guia">' + esc(c.plan.guia) + '</p>';
    [1, 2].forEach(function (n) {
      h += '<h3 style="margin-top:16px">Acción ' + n + '</h3>' +
        c.plan.campos.map(function (lab, i) {
          return campoHTML('cierre.plan' + n, { t: i === 0 ? 'area' : 'texto', id: 'p' + i, label: lab });
        }).join('') +
        campoHTML('cierre.plan' + n, { t: 'fecha', id: 'fecha', label: 'Fecha de revisión' });
    });
    h += campoHTML('cierre', { t: 'fecha', id: 'volver', label: 'Fecha para volver a abrir este cuaderno' }) + '</div>';

    h += '<div class="pasar"><button class="btn gris" data-ir="m5">← Módulo 5</button>' +
      '<button class="btn" data-ir="resultados">Ver mis resultados →</button></div>';
    return h + '</div></section>';
  }

  function recursosHTML() {
    var h = '<section class="seccion" id="s-recursos"><div class="contenedor">';
    h += '<div class="tarjeta"><h2>Palabras sencillas</h2><p class="guia">Vuelva aquí cuando quiera recordar qué quiere decir una palabra del cuaderno.</p>' +
      '<div class="glosario" style="margin-top:12px">' +
      D.glosario.map(function (g) { return '<div><b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></div>'; }).join('') +
      '</div></div>';
    h += '<div class="tarjeta"><h2>De dónde salen las ideas</h2>' +
      '<p class="guia">Los casos reales están identificados con un número. Las cuentas y ejercicios fueron creados para esta cartilla.</p>' +
      '<div class="fuentes">' + D.fuentes.map(function (f, i) {
        return '<div><i>' + (i + 1) + '</i><span>' + esc(f) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="aviso verde" style="margin-top:16px">' + ico('alert') + '<div><h4>Uso del recurso</h4><p>' + esc(D.aviso) + '</p></div></div></div>';
    return h + '</div></section>';
  }

  function resultadosHTML() {
    return '<section class="seccion" id="s-resultados"><div class="contenedor">' +
      '<h1>Mis resultados</h1><p style="color:var(--gris);margin-top:2px">Todo lo que ha completado, con las cuentas hechas. Puede imprimirlo o guardarlo como PDF.</p>' +
      '<div id="panel-resultados"></div>' +
      '<div class="tarjeta"><h2>Mis respuestas</h2>' +
      '<p class="guia">Se guardan solas en este navegador. Descárguelas para tener una copia o para abrirlas en otro dispositivo.</p>' +
      '<div class="btns"><button class="btn" id="b-imprimir">' + ico('note') + ' Imprimir o guardar PDF</button>' +
      '<button class="btn gris" id="b-bajar">Descargar mis respuestas</button>' +
      '<label class="btn gris" for="f-subir" style="cursor:pointer">Cargar respuestas</label>' +
      '<input type="file" id="f-subir" accept="application/json" class="oculto">' +
      '<button class="btn gris" id="b-borrar">Borrar todo</button></div>' +
      (!window.NUBE || !window.NUBE.disponible() ? '' :
       window.NUBE.hayCodigo()
        ? '<div class="aviso verde" style="margin-top:16px">' + ico('check') +
          '<div><h4>Su código es ' + esc(window.NUBE.codigo()) + '</h4>' +
          '<p>Con ese código puede seguir este mismo cuaderno desde otro teléfono o computador. ' +
          'Su asesor ve su avance, no necesita que le envíe nada.</p></div></div>' +
          '<div class="btns"><button class="btn gris chico" id="b-codigo">Usar otro código</button></div>'
        : '<div class="aviso naranja" style="margin-top:16px">' + ico('alert') +
          '<div><h4>Está trabajando solo en este dispositivo</h4>' +
          '<p>Si borra los datos del navegador o cambia de teléfono, perderá el avance. ' +
          'Pídale un código a su asesor para guardarlo en la nube.</p></div></div>' +
          '<div class="btns"><button class="btn chico" id="b-codigo">Escribir mi código</button></div>') +
      '</div>' +
      '</div></section>';
  }

  /* ----------------------------------------------------- cálculos  */
  function sumaColumna(id, col, filas) {
    var t = 0, hay = false;
    for (var i = 0; i < filas; i++) {
      var n = num(val(id + '.' + i + '.' + col));
      if (n != null) { t += n; hay = true; }
    }
    return hay ? t : null;
  }

  function cajaSaldos(id, lineas, inicial) {
    var saldo = inicial || 0, out = [], entro = 0, salio = 0, hay = false;
    for (var i = 0; i < lineas; i++) {
      var e = num(val(id + '.' + i + '.entra')) || 0;
      var s = num(val(id + '.' + i + '.sale')) || 0;
      var tocada = lleno(id + '.' + i + '.entra') || lleno(id + '.' + i + '.sale') ||
        lleno(id + '.' + i + '.fecha') || lleno(id + '.' + i + '.detalle');
      if (tocada) hay = true;
      entro += e; salio += s; saldo += e - s;
      out.push(tocada ? saldo : null);
    }
    return { saldos: out, entro: entro, salio: salio, final: saldo, hay: hay };
  }

  function costoUnidad() {
    var total = sumaColumna('m2.a1.costos', 'valor', 7);
    var u = num(val('m2.a1.unidades'));
    if (total == null || !u) return null;
    return total / u;
  }

  function recalcular() {
    /* totales de tablas con suma */
    document.querySelectorAll('[data-suma]').forEach(function (td) {
      var p = td.getAttribute('data-suma').split('|');
      var t = sumaColumna(p[0], p[1], parseInt(p[2], 10));
      td.textContent = t == null ? '—' : pesos(t);
    });

    /* saldos corridos */
    var movs = cajaSaldos('m3.a1.movimientos', 12, num(val('m3.a1.saldoInicial')) || 0);
    var prev = cajaSaldos('m3.a2.prevision', 15, movs.hay ? movs.final : 0);
    document.querySelectorAll('[data-saldo]').forEach(function (td) {
      var p = td.getAttribute('data-saldo').split('|'), i = parseInt(p[1], 10);
      var r = p[0].indexOf('prevision') > -1 ? prev : movs;
      td.textContent = r.saldos[i] == null ? '—' : pesos(r.saldos[i]);
    });

    /* diferencias antes/después */
    document.querySelectorAll('[data-dif]').forEach(function (td) {
      var base = td.getAttribute('data-dif');
      var a = num(val(base + '.a')), b = num(val(base + '.b'));
      if (a == null || b == null) { td.textContent = '—'; return; }
      var d = a - b;
      td.textContent = (d > 0 ? d + ' menos' : d < 0 ? Math.abs(d) + ' más' : 'sin cambio') +
        ' en esta prueba';
    });

    /* bloques de resultado */
    document.querySelectorAll('[data-calculo]').forEach(function (box) {
      var tipo = box.getAttribute('data-calculo'), etq = box.querySelector('.etq').outerHTML, h = etq;
      if (tipo === 'costoUnidad') {
        var cu = costoUnidad(), total = sumaColumna('m2.a1.costos', 'valor', 7), u = num(val('m2.a1.unidades'));
        h += cu == null
          ? '<span class="dato">—</span><p class="nota">Escriba los costos del lote y cuántas unidades vendibles salen.</p>'
          : '<span class="dato">' + pesos(cu) + '</span><p class="nota">' + pesos(total) + ' ÷ ' + u +
          ' unidades. Este es el piso: por debajo de este valor, la venta no cubre lo que usted puso.</p>';
        box.className = 'resultado' + (cu == null ? ' vacio' : '');
      } else if (tipo === 'diferencia') {
        var cu2 = costoUnidad(), pr = num(val('m2.a2.precioProbar'));
        if (cu2 == null || pr == null) {
          h += '<span class="dato">—</span><p class="nota">Necesita el costo por unidad (actividad anterior) y el precio que quiere probar.</p>';
          box.className = 'resultado vacio';
        } else {
          var d = pr - cu2, pct = cu2 ? Math.round(d / cu2 * 100) : 0;
          h += '<span class="dato' + (d < 0 ? ' rojo' : '') + '">' + pesos(d) + '</span>' +
            '<p class="nota">' + (d < 0
              ? 'Con ese precio la venta no alcanza a cubrir el costo por unidad. Revise costos, presentación o precio.'
              : 'Equivale a ' + pct + '% sobre el costo por unidad. Recuerde que faltan los costos que anotó como “por confirmar”.') + '</p>';
          box.className = 'resultado';
        }
      } else if (tipo === 'caja') {
        if (!movs.hay) {
          h += '<span class="dato">—</span><p class="nota">Anote sus movimientos y el saldo se calcula solo.</p>';
          box.className = 'resultado vacio';
        } else {
          h += '<span class="etq">Entró</span><span class="dato">' + pesos(movs.entro) + '</span>' +
            '<span class="etq">Salió</span><span class="dato">' + pesos(movs.salio) + '</span>' +
            '<span class="etq">Saldo final</span><span class="dato' + (movs.final < 0 ? ' rojo' : '') + '">' + pesos(movs.final) + '</span>' +
            '<p class="nota">' + (movs.final < 0
              ? 'La caja quedó en negativo: está sacando más de lo que entra.'
              : 'Compare este saldo con la plata que realmente tiene disponible hoy.') + '</p>';
          box.className = 'resultado';
        }
      }
      box.innerHTML = h;
    });

    ajustarFilas();
    pintarAvance();
  }

  /* muestra solo las líneas necesarias: menos scroll en celular */
  var visibles = {};
  function ajustarFilas() {
    var grupos = {};
    document.querySelectorAll('[data-fila]').forEach(function (tr) {
      var p = tr.getAttribute('data-fila').split('|');
      (grupos[p[0]] = grupos[p[0]] || []).push(tr);
    });
    Object.keys(grupos).forEach(function (id) {
      var filas = grupos[id], ultima = -1;
      filas.forEach(function (tr, i) {
        var usada = Array.prototype.some.call(tr.querySelectorAll('input'), function (inp) {
          return inp.value.trim() !== '';
        });
        if (usada) ultima = i;
      });
      var n = Math.max(4, ultima + 2, visibles[id] || 0);
      filas.forEach(function (tr, i) { tr.style.display = i < n ? '' : 'none'; });
      var b = document.querySelector('[data-mas="' + id + '"]');
      if (b) b.style.display = n >= filas.length ? 'none' : '';
    });
  }

  /* ------------------------------------------------------- avance  */
  function camposModulo(m) {
    var ids = [];
    m.actividades.forEach(function (a) {
      var pre = m.id + '.' + a.id;
      a.campos.forEach(function (c) {
        var id = pre + '.' + c.id;
        if (['texto', 'area', 'moneda', 'numero', 'fecha', 'opcion'].indexOf(c.t) > -1) ids.push([id]);
        else if (c.t === 'checks') c.opciones.forEach(function (_, i) { ids.push([id + '.' + i]); });
        else if (c.t === 'tabla') {
          c.filas.forEach(function (_, i) { c.columnas.forEach(function (k) { ids.push([id + '.' + i + '.' + k.id]); }); });
        } else if (c.t === 'comparar') {
          c.filas.forEach(function (f) { ids.push([id + '.' + f.id + '.a', id + '.' + f.id + '.b']); });
        } else if (c.t === 'caja' || c.t === 'lista') {
          var grupo = [];
          for (var i = 0; i < c.lineas; i++) c.columnas.forEach(function (k) { grupo.push(id + '.' + i + '.' + k.id); });
          ids.push(grupo);
        }
      });
    });
    m.quiz.forEach(function (_, i) { ids.push([m.id + '.quiz.' + i]); });
    D.bitacoraCampos.forEach(function (_, i) { ids.push([m.id + '.bit.' + i]); });
    return ids;
  }

  function progreso(m) {
    var g = camposModulo(m), hechos = 0;
    g.forEach(function (grupo) { if (grupo.some(lleno)) hechos++; });
    return { hechos: hechos, total: g.length, pct: Math.round(hechos / g.length * 100) };
  }

  function progresoGeneral() {
    var h = 0, t = 0;
    D.modulos.forEach(function (m) { var p = progreso(m); h += p.hechos; t += p.total; });
    return Math.round(h / t * 100);
  }

  function pintarAvance() {
    D.modulos.forEach(function (m) {
      var p = progreso(m);
      document.querySelectorAll('[data-barra="' + m.id + '"]').forEach(function (b) { b.style.width = p.pct + '%'; });
      document.querySelectorAll('[data-pct="' + m.id + '"]').forEach(function (b) { b.textContent = p.pct + '%'; });
    });
    var g = progresoGeneral();
    if (avance) { avance.style.setProperty('--p', g); avance.querySelector('span').textContent = g + '%'; }
  }

  /* ---------------------------------------------------- resultados */
  function pintarResultados() {
    var caja = document.getElementById('panel-resultados');
    if (!caja) return;
    var a = D.autoevaluacion;

    /* métricas */
    var aciertos = 0, respondidas = 0, totalP = 0;
    D.modulos.forEach(function (m) {
      m.quiz.forEach(function (q, i) {
        totalP++;
        var v = val(m.id + '.quiz.' + i);
        if (v !== '') { respondidas++; if (parseInt(v, 10) === q.ok) aciertos++; }
      });
    });
    function promedio(mom) {
      var s = 0, n = 0;
      a.aspectos.forEach(function (_, i) { var v = num(val('auto.' + i + '.' + mom)); if (v) { s += v; n++; } });
      return n ? s / n : null;
    }
    var pAntes = promedio('antes'), pHoy = promedio('hoy'), pCierre = promedio('cierre');
    var evListas = D.cierre.evidencias.filter(function (_, i) { return val('cierre.ev.' + i) === 'Lo tengo'; }).length;

    var h = '<div class="metricas">' +
      '<div class="metrica"><b>' + progresoGeneral() + '%</b><span>del cuaderno completado</span></div>' +
      '<div class="metrica"><b>' + aciertos + '/' + totalP + '</b><span>respuestas correctas (' + respondidas + ' contestadas)</span></div>' +
      '<div class="metrica"><b>' + (pHoy ? pHoy.toFixed(1) : '—') + '</b><span>promedio de autoevaluación hoy' +
      (pAntes && pHoy ? ' (empezó en ' + pAntes.toFixed(1) + ')' : '') + '</span></div>' +
      '<div class="metrica"><b>' + evListas + '/5</b><span>evidencias listas</span></div></div>';

    /* autoevaluación */
    h += '<div class="tarjeta"><h2>Cómo cambió mi autoevaluación</h2>' +
      '<p class="guia">Barra clara: como empezó. Barra verde: como está hoy o al cerrar.</p><div class="barras">';
    a.aspectos.forEach(function (asp, i) {
      var an = num(val('auto.' + i + '.antes')), ho = num(val('auto.' + i + '.cierre')) || num(val('auto.' + i + '.hoy'));
      h += '<div class="barra-item"><span class="txt">' + (i + 1) + '. ' + esc(asp) + '</span>' +
        '<div class="barra-doble"><span class="pista">' +
        '<i class="antes" style="width:' + ((an || 0) / 5 * 100) + '%"></i>' +
        '<i class="hoy" style="width:' + ((ho || 0) / 5 * 100) + '%"></i></span>' +
        '<span class="val">' + (an ? an : '—') + ' → ' + (ho ? ho : '—') + '</span></div></div>';
    });
    if (pAntes && (pCierre || pHoy)) {
      var dif = (pCierre || pHoy) - pAntes;
      h += '</div><div class="resultado"><span class="etq">Cambio promedio</span><span class="dato">' +
        (dif >= 0 ? '+' : '') + dif.toFixed(1) + ' puntos</span><p class="nota">' +
        (dif > 0 ? 'Avanzó en la mayoría de los aspectos. Revise los que siguen bajos y vuelva a esa página.'
          : dif === 0 ? 'Se mantiene igual: elija un aspecto y trabájelo con una prueba pequeña.'
            : 'Bajó en promedio. Eso también es aprender: descubrió que necesita más práctica.') + '</p></div></div>';
    } else { h += '</div><p style="color:var(--gris)">Llene la autoevaluación en la página de inicio para ver esta comparación.</p></div>'; }

    /* cuentas del negocio */
    var cu = costoUnidad(), pr = num(val('m2.a2.precioProbar'));
    var movs = cajaSaldos('m3.a1.movimientos', 12, num(val('m3.a1.saldoInicial')) || 0);
    var prev = cajaSaldos('m3.a2.prevision', 15, movs.hay ? movs.final : 0);
    var mA = num(val('m4.a1.medicion.sobrante.a')), mB = num(val('m4.a1.medicion.sobrante.b'));

    h += '<div class="tarjeta"><h2>Las cuentas de mi negocio</h2>' +
      '<p class="guia">Calculadas con lo que usted escribió en los módulos 2, 3 y 4.</p>';
    h += bloqueResultado('Costo por unidad', cu == null ? null : pesos(cu),
      'Módulo 2 · lo que le cuesta producir una unidad.');
    h += bloqueResultado('Diferencia entre precio y costo', (cu == null || pr == null) ? null : pesos(pr - cu),
      'Módulo 2 · precio que va a probar menos el costo por unidad.', (cu != null && pr != null && pr - cu < 0));
    h += bloqueResultado('Saldo de caja de la quincena', movs.hay ? pesos(movs.final) : null,
      'Módulo 3 · entró ' + pesos(movs.entro) + ' y salió ' + pesos(movs.salio) + '.', movs.hay && movs.final < 0);
    h += bloqueResultado('Saldo previsto en 15 días', prev.hay ? pesos(prev.final) : null,
      'Módulo 3 · si se cumplen los cobros y pagos que anotó.', prev.hay && prev.final < 0);
    h += bloqueResultado('Cambio en el sobrante medido',
      (mA == null || mB == null) ? null : (mA - mB > 0 ? (mA - mB) + ' menos' : mA - mB < 0 ? (mB - mA) + ' más' : 'sin cambio'),
      'Módulo 4 · comparado con la misma unidad. Solo vale si las cantidades de trabajo eran parecidas.');
    h += '</div>';

    /* quiz por módulo */
    h += '<div class="tarjeta"><h2>Comprobación por módulo</h2><div class="barras">';
    D.modulos.forEach(function (m) {
      var ok = 0, cont = 0;
      m.quiz.forEach(function (q, i) {
        var v = val(m.id + '.quiz.' + i);
        if (v !== '') { cont++; if (parseInt(v, 10) === q.ok) ok++; }
      });
      h += '<div class="barra-item"><span class="txt"><b>Módulo ' + m.n + '</b> · ' + esc(m.titulo) + '</span>' +
        '<div class="barra-doble"><span class="pista"><i class="hoy" style="width:' + (ok / m.quiz.length * 100) + '%"></i></span>' +
        '<span class="val">' + ok + '/' + m.quiz.length + '</span></div></div>';
    });
    h += '</div></div>';

    /* evidencias y plan */
    h += '<div class="tarjeta"><h2>Mis evidencias y mi plan</h2><div class="glosario">';
    D.cierre.evidencias.forEach(function (e, i) {
      var v = val('cierre.ev.' + i);
      h += '<div><b>' + esc(e) + '</b><span>' + (v ? esc(v) : 'Sin marcar') + '</span></div>';
    });
    h += '</div>';
    [1, 2].forEach(function (n) {
      var acc = val('cierre.plan' + n + '.p0'), fecha = val('cierre.plan' + n + '.fecha');
      if (acc) h += '<div class="aviso verde" style="margin-top:12px">' + ico('flag') +
        '<div><h4>Acción ' + n + (fecha ? ' · revisa el ' + esc(fecha) : '') + '</h4><p>' + esc(acc) + '</p></div></div>';
    });
    h += '</div>';

    caja.innerHTML = h;
  }

  function bloqueResultado(etq, dato, nota, rojo) {
    return '<div class="resultado' + (dato == null ? ' vacio' : '') + '"><span class="etq">' + esc(etq) + '</span>' +
      '<span class="dato' + (rojo ? ' rojo' : '') + '">' + (dato == null ? '—' : esc(dato)) + '</span>' +
      '<p class="nota">' + esc(nota) + '</p></div>';
  }

  function calificarPregunta(id) {
    var partes = id.split('.');
    var m = D.modulos.filter(function (x) { return x.id === partes[0]; })[0];
    if (!m) return;
    var q = m.quiz[parseInt(partes[2], 10)];
    var resp = parseInt(val(id), 10);
    var caja = document.querySelector('.quiz-q[data-q="' + id + '"]');
    if (!caja || isNaN(resp)) return;

    Array.prototype.forEach.call(caja.querySelectorAll('.quiz-op'), function (op, j) {
      op.classList.toggle('bien', j === q.ok);
      op.classList.toggle('mal', j === resp && resp !== q.ok);
    });
    var bien = resp === q.ok;
    var fb = caja.querySelector('.quiz-fb');
    if (!fb) { fb = document.createElement('div'); caja.appendChild(fb); }
    fb.className = 'quiz-fb ' + (bien ? 'bien' : 'mal');
    fb.innerHTML = '<b>' + (bien ? '¡Correcto! ' : 'Todavía no. ') + '</b>' + esc(q.porque);
  }

  /* ------------------------------------ puente con el guardado en nube */
  function resumenCorto() {
    var mods = {}, ac = 0, cont = 0;
    D.modulos.forEach(function (m) {
      mods[m.id] = progreso(m).pct;
      m.quiz.forEach(function (q, i) {
        var v = val(m.id + '.quiz.' + i);
        if (v !== '') { cont++; if (parseInt(v, 10) === q.ok) ac++; }
      });
    });
    return {
      nombre: val('perfil.nombre'), negocio: val('perfil.negocio'), lugar: val('perfil.lugar'),
      avance: progresoGeneral(), modulos: mods, aciertos: ac, contestadas: cont,
      evidencias: D.cierre.evidencias.filter(function (_, i) { return val('cierre.ev.' + i) === 'Lo tengo'; }).length
    };
  }

  window.CUADERNO = {
    leer: function () { return estado; },
    resumen: resumenCorto,
    reemplazar: function (nuevo) {
      estado = nuevo || {};
      try { localStorage.setItem(LLAVE, JSON.stringify(estado)); } catch (e) { }
    }
  };

  /* ------------------------------------------------------ eventos  */
  function irA(id, empujar) {
    document.querySelectorAll('.seccion').forEach(function (s) { s.classList.remove('activa'); });
    var s = document.getElementById('s-' + id) || document.getElementById('s-inicio');
    s.classList.add('activa');
    nav.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (empujar !== false && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    recalcular();
    if (id === 'resultados') pintarResultados();
  }

  function manejarEntrada(e) {
    var t = e.target;
    if (!t.name) return;
    if (t.type === 'checkbox') estado[t.name] = t.checked ? 'si' : '';
    else estado[t.name] = t.value;
    guardar();

    var op = t.closest('.opcion');
    if (op) {
      if (t.type === 'radio') {
        op.parentNode.querySelectorAll('.opcion').forEach(function (o) { o.classList.remove('marcada'); });
        op.classList.add('marcada');
      } else op.classList.toggle('marcada', t.checked);
    }
    if (t.closest('.quiz-op')) calificarPregunta(t.name);
    recalcular();
  }

  /* ---------------------------------------------------------- init */
  function iniciar() {
    cargar();
    main = $('#app'); nav = $('#nav'); avance = $('#avance');

    var h = inicioHTML();
    D.modulos.forEach(function (m) { h += moduloHTML(m); });
    h += cierreHTML() + recursosHTML() + resultadosHTML();
    main.innerHTML = h;

    var enlaces = '<a href="#inicio">Inicio</a>';
    D.modulos.forEach(function (m) { enlaces += '<a href="#' + m.id + '" title="' + esc(m.titulo) + '">' + m.n + '. ' + esc(m.corto || m.titulo) + '</a>'; });
    enlaces += '<a href="#cierre">Cierre y plan</a><a href="#resultados">Mis resultados</a><a href="#recursos">Palabras y fuentes</a>';
    nav.innerHTML = enlaces;

    main.addEventListener('input', manejarEntrada);
    main.addEventListener('change', manejarEntrada);
    document.addEventListener('click', function (e) {
      var mas = e.target.closest('[data-mas]');
      if (mas) {
        var k = mas.getAttribute('data-mas');
        var total = document.querySelectorAll('[data-fila^="' + k + '|"]').length;
        visibles[k] = Math.min(total, (visibles[k] || 4) + 3);
        ajustarFilas();
        return;
      }
      var b = e.target.closest('[data-ir]');
      if (b) { irA(b.getAttribute('data-ir')); return; }
      var a = e.target.closest('.nav a');
      if (a) { e.preventDefault(); irA(a.getAttribute('href').slice(1)); }
    });
    window.addEventListener('popstate', function () { irA((location.hash || '#inicio').slice(1), false); });

    if (window.NUBE) window.NUBE.arrancar(repintar);
    else { conectarBotones(); irA((location.hash || '#inicio').slice(1), false); }
  }

  function conectarBotones() {
    if (!$('#b-imprimir')) return;
    $('#b-imprimir').addEventListener('click', function () { window.print(); });
    $('#b-bajar').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mi-negocio-verde-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click(); URL.revokeObjectURL(a.href);
    });
    $('#f-subir').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          estado = JSON.parse(r.result); guardar();
          location.reload();
        } catch (err) { alert('Ese archivo no se pudo leer. Use el archivo que descargó de este cuaderno.'); }
      };
      r.readAsText(f);
    });
    $('#b-borrar').addEventListener('click', function () {
      if (confirm('Esto borra todas sus respuestas en este dispositivo. ¿Continuar?')) {
        estado = {}; localStorage.removeItem(LLAVE); location.reload();
      }
    });
    var bc = $('#b-codigo');
    if (bc) bc.addEventListener('click', function () { window.NUBE.cambiarCodigo(); });
  }

  /* vuelve a pintar todo con las respuestas que hayan llegado de la nube */
  function repintar() {
    var h = inicioHTML();
    D.modulos.forEach(function (m) { h += moduloHTML(m); });
    h += cierreHTML() + recursosHTML() + resultadosHTML();
    main.innerHTML = h;
    conectarBotones();
    irA((location.hash || '#inicio').slice(1), false);
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
