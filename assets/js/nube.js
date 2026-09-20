/* ==================================================================
   nube.js · código de participante y guardado en la nube
   Si no hay código, el cuaderno sigue funcionando solo en el
   dispositivo, igual que antes. El código es opcional.
================================================================== */
(function () {
  'use strict';

  var LLAVE_CODIGO = 'reverdecer-codigo';
  var LLAVE_SELLO = 'reverdecer-actualizado';

  var API = {
    codigo: localStorage.getItem(LLAVE_CODIGO) || '',
    estadoRed: 'local',     // local | guardando | guardado | error
    pendiente: null,
    reloj: null
  };

  function $(s) { return document.querySelector(s); }

  function limpiar(c) {
    return String(c || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
  }

  /* ------------------------------------------------ indicador visual */
  function pintarEstado() {
    var caja = $('#nube-estado');
    if (!caja) return;
    var textos = {
      local: 'Guardado en este dispositivo',
      guardando: 'Guardando…',
      guardado: 'Guardado en la nube',
      error: 'Sin conexión · guardado aquí'
    };
    caja.className = 'nube ' + API.estadoRed;
    caja.innerHTML = '<i></i><span>' + (API.codigo ? API.codigo + ' · ' : '') +
      textos[API.estadoRed] + '</span>';
  }

  /* ------------------------------------------------ pantalla inicial */
  function pedirCodigo(alEntrar) {
    var cap = document.createElement('div');
    cap.className = 'portada-codigo';
    cap.innerHTML =
      '<div class="caja">' +
      '<img src="assets/img/logo.png" alt="Reverdecer">' +
      '<h2>Mi negocio verde</h2>' +
      '<p>Escriba el código que le dio su asesora o asesor. Sirve para que su avance quede guardado ' +
      'y pueda seguir desde otro teléfono o computador.</p>' +
      '<div class="campo"><label for="cod">Mi código</label>' +
      '<input type="text" id="cod" placeholder="VALLE-7K2M" autocapitalize="characters" autocomplete="off"></div>' +
      '<p class="err" id="cod-err"></p>' +
      '<button class="btn" id="cod-ok">Entrar con mi código</button>' +
      '<button class="btn linea-verde" id="cod-no">Trabajar solo en este dispositivo</button>' +
      '<p class="fino">Si trabaja solo en este dispositivo, sus respuestas no salen de aquí. ' +
      'Puede escribir el código más adelante desde la página de resultados.</p>' +
      '</div>';
    document.body.appendChild(cap);

    function entrar() {
      var c = limpiar($('#cod').value);
      if (c.length < 4) { $('#cod-err').textContent = 'El código tiene al menos 4 caracteres.'; return; }
      $('#cod-ok').disabled = true;
      $('#cod-ok').textContent = 'Buscando su cuaderno…';
      API.codigo = c;
      localStorage.setItem(LLAVE_CODIGO, c);
      traer(function (ok, msg) {
        if (!ok) {
          $('#cod-err').textContent = msg || 'No se pudo conectar. Intente de nuevo.';
          $('#cod-ok').disabled = false;
          $('#cod-ok').textContent = 'Entrar con mi código';
          return;
        }
        cap.remove();
        alEntrar();
      });
    }

    $('#cod-ok').addEventListener('click', entrar);
    $('#cod').addEventListener('keydown', function (e) { if (e.key === 'Enter') entrar(); });
    $('#cod-no').addEventListener('click', function () { cap.remove(); alEntrar(); });
  }

  /* --------------------------------------------------- traer / subir */
  function traer(listo) {
    fetch('/api/cuaderno?codigo=' + encodeURIComponent(API.codigo))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) return listo(false, d.error);
        var selloLocal = localStorage.getItem(LLAVE_SELLO) || '';
        var hayLocal = Object.keys(window.CUADERNO.leer()).length > 0;

        if (d.existe && (!hayLocal || String(d.actualizado) > selloLocal)) {
          window.CUADERNO.reemplazar(d.respuestas);
          localStorage.setItem(LLAVE_SELLO, d.actualizado || '');
        } else if (hayLocal) {
          subir();
        }
        API.estadoRed = 'guardado';
        pintarEstado();
        listo(true);
      })
      .catch(function () { listo(false, 'No hay conexión en este momento.'); });
  }

  function subir() {
    if (!API.codigo) { API.estadoRed = 'local'; pintarEstado(); return; }
    API.estadoRed = 'guardando';
    pintarEstado();
    fetch('/api/cuaderno', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: API.codigo,
        respuestas: window.CUADERNO.leer(),
        resumen: window.CUADERNO.resumen()
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) throw new Error(d.error);
        localStorage.setItem(LLAVE_SELLO, d.actualizado || '');
        API.estadoRed = 'guardado';
        pintarEstado();
      })
      .catch(function () { API.estadoRed = 'error'; pintarEstado(); });
  }

  /* ------------------------------------------------------- público  */
  window.NUBE = {
    hayCodigo: function () { return !window.SIN_NUBE && !!API.codigo; },
    disponible: function () { return !window.SIN_NUBE; },
    codigo: function () { return API.codigo; },

    arrancar: function (alTerminar) {
      if (window.SIN_NUBE) { API.codigo = ''; pintarEstado(); alTerminar(); return; }
      if (API.codigo) {
        traer(function (ok) {
          if (!ok) { API.estadoRed = 'error'; pintarEstado(); }
          alTerminar();
        });
      } else {
        var visto = sessionStorage.getItem('reverdecer-visto');
        if (visto) { alTerminar(); return; }
        sessionStorage.setItem('reverdecer-visto', '1');
        pedirCodigo(alTerminar);
      }
      pintarEstado();
    },

    /* la llama app.js cada vez que el participante escribe algo */
    cambio: function () {
      if (!API.codigo) { pintarEstado(); return; }
      clearTimeout(API.reloj);
      API.reloj = setTimeout(subir, 2000);
    },

    cambiarCodigo: function () {
      localStorage.removeItem(LLAVE_CODIGO);
      localStorage.removeItem(LLAVE_SELLO);
      sessionStorage.removeItem('reverdecer-visto');
      location.reload();
    },

    pintarEstado: pintarEstado
  };
})();
