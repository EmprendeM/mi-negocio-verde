/* ------------------------------------------------------------------
   Reverdecer · Mi negocio verde
   Contenido de la cartilla. Edite aquí los textos, preguntas y campos:
   el sitio se arma solo a partir de este archivo.
------------------------------------------------------------------- */

window.CARTILLA = {

  marca: {
    nombre: 'Mi negocio verde',
    programa: 'Reverdecer · Sembrando Futuro',
    lema: 'Cuaderno práctico para hacer, probar y mejorar',
    entrada: 'Bitácora quincenal para fortalecer su negocio. Cinco retos, uno cada 15 días.'
  },

  /* ---------------------------------------------------------- perfil */
  perfil: [
    { t: 'texto', id: 'nombre', label: 'Mi nombre' },
    { t: 'texto', id: 'negocio', label: 'Mi negocio' },
    { t: 'texto', id: 'lugar', label: 'Municipio o vereda' }
  ],

  /* ------------------------------------------------- autoevaluación */
  autoevaluacion: {
    titulo: 'Mi punto de partida',
    guia: 'Marque un número del 1 al 5 en cada aspecto. Puede llenarla al empezar y volver a llenarla al terminar.',
    ayuda: 'No es una nota. Sirve para ver con más claridad en qué ha avanzado y qué necesita seguir practicando. Si hoy anota la plata con ayuda de otra persona, podría marcar 3. Si al terminar ya lo hace sola o solo, podría marcar 5.',
    escala: [
      'Todavía no puedo', 'Con mucha ayuda', 'Con algo de ayuda', 'Con poca ayuda', 'Sin ayuda'
    ],
    aspectos: [
      'Sé quién me compra y qué necesita.',
      'Explico con claridad qué vendo y por qué puede servir.',
      'Sé cuánto me cuesta producir o prestar mi servicio.',
      'Reviso si mi precio sí me sirve.',
      'Llevo registro de la plata que entra y sale.',
      'Anticipo si me alcanza para los pagos de los próximos 15 días.',
      'Elijo una mejora ambiental que puedo hacer sin poner a nadie en riesgo.',
      'Muestro con un registro qué cambió al aplicar esa mejora.',
      'Comparo una oportunidad con mi negocio actual antes de cambiar.',
      'Defino una prueba pequeña con límite y fecha para revisarla.'
    ]
  },

  /* ------------------------------------------------------- módulos  */
  modulos: [

    /* ============================================== MÓDULO 1 ====== */
    {
      id: 'm1', n: 1, corto: 'Clientes', dias: 'Días 1 al 15', color: 'verde',
      titulo: '¿Qué me compran y por qué?',
      lema: 'Escuchar a dos compradores y mejorar la forma de ofrecer lo que vendo.',
      meta: 'Al terminar esta quincena usted tendrá dos conversaciones escritas y una oferta probada con dos personas.',
      pasos: [
        ['Pregunte sin adivinar.', 'Averigüe para qué lo necesita la persona, qué le importa y qué le dificulta comprar.'],
        ['Elija una sola oferta para poner a prueba.', 'Diga qué vende, cuánto incluye, cuánto vale y cuándo entregaría.'],
        ['Cumpla lo que promete.', 'No ofrezca algo que todavía no puede demostrar o garantizar.']
      ],
      caso: 'La FAO ha mostrado que, en la agricultura familiar y en los circuitos cortos, escuchar al comprador hace parte del negocio. No se trata solo de producir, sino de entender cómo compra la gente y qué valora.',
      casoRef: 1,
      bitacora: {
        frase: 'Escuché a mis clientes y probé una oferta clara.',
        ejemplo: 'Puede guardar una frase que le dijo un cliente, una foto del producto, una nota de audio, un recibo o esta misma hoja llena.'
      },
      actividades: [
        {
          id: 'a1', titulo: 'Dos conversaciones que me sirven',
          guia: 'Escriba palabras cortas. No necesita poner nombres ni teléfonos.',
          ayuda: 'Si vende artesanías, puede preguntar: “¿Qué tamaño le sirve más?”. Si tiene un vivero, puede preguntar: “¿La planta la busca para sombra, para regalo o para venderla?”.',
          campos: [
            {
              t: 'tabla', id: 'persona1', label: 'Persona 1',
              filas: ['¿Para qué lo necesita?', '¿Qué le importa al comprar?', '¿Qué se le dificulta?', 'Otra cosa que me dijo'],
              columnas: [{ id: 'r', label: 'Respuesta corta', t: 'texto' }]
            },
            {
              t: 'tabla', id: 'persona2', label: 'Persona 2',
              filas: ['¿Para qué lo necesita?', '¿Qué le importa al comprar?', '¿Qué se le dificulta?', 'Otra cosa que me dijo'],
              columnas: [{ id: 'r', label: 'Respuesta corta', t: 'texto' }]
            },
            { t: 'area', id: 'repetido', label: 'Algo que se repitió en las dos conversaciones' }
          ]
        },
        {
          id: 'a2', titulo: 'Pruebo una oferta clara',
          guia: 'Diga su oferta con palabras sencillas y revísela con dos personas.',
          ayuda: 'Una oferta clara dice: producto o servicio + cantidad + precio + fecha de entrega + una razón verdadera para elegirle. Ejemplo: “Ofrezco 10 bolsas de abono orgánico a $8.000 cada una. Entrego el martes. Me eligen porque está listo para usar”.',
          formula: ['Producto o servicio', 'Cantidad', 'Precio', 'Fecha de entrega', 'Una razón verdadera'],
          campos: [
            { t: 'texto', id: 'producto', label: 'Ofrezco este producto o servicio' },
            { t: 'texto', id: 'cantidad', label: 'Cantidad o presentación' },
            { t: 'moneda', id: 'precio', label: 'Precio' },
            { t: 'texto', id: 'entrega', label: 'Lugar y fecha de entrega' },
            { t: 'area', id: 'razon', label: 'Una razón verdadera para elegirlo es' },
            {
              t: 'tabla', id: 'reacciones', label: 'Cómo reaccionaron',
              filas: ['Persona 1', 'Persona 2'],
              columnas: [{ id: 'r', label: '¿Qué entendió? ¿Qué preguntó?', t: 'texto' }]
            },
            { t: 'area', id: 'cambio', label: 'La frase que voy a cambiar o mejorar' }
          ]
        }
      ],
      quiz: [
        {
          p: 'Una persona dice: “Me gusta”. ¿Qué conviene hacer?',
          ops: ['Anotarlo como venta.', 'Preguntar qué necesita y qué le falta para comprar.', 'Producir el doble de una vez.'],
          ok: 1, porque: 'Esa pregunta ayuda a entender la decisión de compra.'
        },
        {
          p: 'Dos personas no entienden qué incluye mi oferta. ¿Qué conviene hacer?',
          ops: ['Cambiar una frase y volver a probar.', 'Hablar más rápido.', 'Dejar la oferta igual.'],
          ok: 0, porque: 'Una corrección pequeña permite comprobar si la oferta quedó más clara.'
        }
      ]
    },

    /* ============================================== MÓDULO 2 ====== */
    {
      id: 'm2', n: 2, corto: 'Precio y costo', dias: 'Días 16 al 30', color: 'naranja',
      titulo: '¿A qué precio sí me sirve vender?',
      lema: 'Revisar el costo de una unidad y compararlo con el precio.',
      meta: 'Al terminar esta quincena usted tendrá una cuenta por unidad y un precio revisado.',
      pasos: [
        ['Cuente todo lo que sí usa.', 'Materiales o insumos, el trabajo propio y ajeno, el empaque, el transporte y otros costos.'],
        ['Use siempre la misma unidad.', 'Kilo, planta, bolsa, pieza, tour, servicio o menú: compare con la misma medida.'],
        ['Revise el precio con un cambio pequeño.', 'No tiene que cambiar todo de una vez.']
      ],
      caso: 'Si producir un lote vale $100.000 y de ese lote salen 20 plantas vendibles, cada planta cuesta $5.000. Si la vende a $6.500, la diferencia sobre esos costos es de $1.500.',
      casoRef: 2,
      bitacora: {
        frase: 'Revisé un costo y un precio.',
        ejemplo: 'La cuenta del lote, una foto de la tabla de costos, una cotización, un precio consultado o una anotación sobre el cambio que hizo.'
      },
      actividades: [
        {
          id: 'a1', titulo: 'Hago la cuenta de mi producto o servicio',
          guia: 'Escriba “por confirmar” cuando todavía le falte un dato. La cuenta se hace sola.',
          ayuda: 'Si prepara alimentos, su unidad puede ser “porción”. Si hace artesanías, puede ser “pieza”. Si ofrece turismo, puede ser “cupo pagado” o “salida”.',
          campos: [
            { t: 'texto', id: 'producto', label: 'Producto o servicio' },
            { t: 'texto', id: 'unidad', label: 'Unidad con la que mido' },
            { t: 'numero', id: 'unidades', label: 'Unidades vendibles del lote' },
            {
              t: 'tabla', id: 'costos', label: '¿Qué me cuesta este lote o servicio?', suma: 'valor',
              filas: ['Materiales o insumos', 'Trabajo propio, familiar y contratado', 'Empaques',
                'Transporte', 'Parte de arriendo, servicios y desgaste', 'Comisiones y otros costos', 'Otro'],
              columnas: [{ id: 'valor', label: 'Valor', t: 'moneda' }]
            },
            { t: 'resultado', id: 'costoUnidad', label: 'Costo por unidad', calculo: 'costoUnidad' }
          ]
        },
        {
          id: 'a2', titulo: 'Reviso mi precio antes de cambiarlo',
          guia: 'Compare un precio real con el costo por unidad de la misma unidad.',
          ayuda: 'Si su costo por unidad es $5.000 y hoy vende a $5.200, la diferencia es muy pequeña. Antes de decir que “gana”, revise si faltó contar comisiones, transporte o tiempo de trabajo.',
          campos: [
            { t: 'moneda', id: 'precioProbar', label: 'Precio que cobro o pienso probar' },
            { t: 'resultado', id: 'diferencia', label: 'Diferencia sobre los costos incluidos', calculo: 'diferencia' },
            { t: 'texto', id: 'faltaConfirmar', label: 'Este costo aún me falta confirmar' },
            { t: 'texto', id: 'consultado', label: 'Precio que consulté (unidad, calidad y fecha)' },
            { t: 'area', id: 'cambioPequeno', label: 'Haré este cambio pequeño en precio, costo o presentación' },
            { t: 'area', id: 'resultadoVenta', label: 'Después de una venta o cotización, pasó esto' }
          ]
        }
      ],
      quiz: [
        {
          p: 'El lote cuesta $100.000 y quedan 20 plantas vendibles. ¿Cuánto cuesta cada una?',
          ops: ['$500', '$5.000', '$20.000'], ok: 1,
          porque: '$100.000 dividido entre 20 es $5.000.'
        },
        {
          p: 'Usted trabaja en el producto, pero ese día no se paga. ¿Incluye ese trabajo en el costo?',
          ops: ['No, porque no salió plata.', 'Solo si sobra dinero.', 'Sí: anota el tiempo y un valor razonable.'],
          ok: 2, porque: 'Esto ayuda a no regalar el trabajo propio o familiar.'
        }
      ]
    },

    /* ============================================== MÓDULO 3 ====== */
    {
      id: 'm3', n: 3, corto: 'Mi plata', dias: 'Días 31 al 45', color: 'azul',
      titulo: 'Mi registro de plata',
      lema: 'Registrar la plata que entra y sale durante 15 días para tener el negocio en la mira.',
      meta: 'Al terminar esta quincena tendrá un registro de 15 días y una previsión de pagos y cobros.',
      pasos: [
        ['Flujo de caja quiere decir cuándo entra y cuándo sale la plata.', 'No es lo mismo que ganancia.'],
        ['Anote todo lo que mueve la caja.', 'Ventas cobradas, compras, pagos, transportes y también lo que saca para la casa.'],
        ['Distinga lo que todavía no entra.', 'Si una venta queda fiada, aún no entra a la caja. Si recibe un préstamo, entra a la caja, pero no es una venta.']
      ],
      caso: 'Si empieza con $100.000, luego cobra $180.000 y recupera una deuda de $40.000, pero paga $230.000 y saca $20.000 para la casa, al cierre le quedan $70.000.',
      casoRef: 3,
      bitacora: {
        frase: 'Miré mi caja y registré mi plata.',
        ejemplo: 'Esta hoja de caja, una foto del cuaderno, un pantallazo, un audio donde explica sus cuentas o la lista de pagos por venir.'
      },
      actividades: [
        {
          id: 'a1', titulo: 'Mi registro de plata',
          guia: 'Anote el dinero que entra y sale. El saldo se calcula solo, línea por línea.',
          ayuda: 'Si compró insumos, eso sale. Si vendió un producto o recibió un pago, eso entra. Anote también lo que saca para la casa.',
          campos: [
            { t: 'moneda', id: 'saldoInicial', label: 'Plata con la que empiezo' },
            {
              t: 'caja', id: 'movimientos', label: 'Movimientos de estos 15 días', lineas: 12,
              columnas: [
                { id: 'fecha', label: 'Fecha', t: 'texto' },
                { id: 'detalle', label: '¿Qué pasó?', t: 'texto' },
                { id: 'entra', label: 'Entra $', t: 'moneda' },
                { id: 'sale', label: 'Sale $', t: 'moneda' }
              ]
            },
            { t: 'resultado', id: 'resumenCaja', label: 'Resumen de estos 15 días', calculo: 'caja' }
          ]
        },
        {
          id: 'a2', titulo: 'Veo los pagos antes de que lleguen',
          guia: 'Primero anote cobros pendientes y pagos comprometidos. Después haga la previsión de los próximos 15 días.',
          ayuda: 'Si hoy tiene $150.000, espera cobrar $80.000 en cuatro días y sabe que debe pagar $120.000 en una semana, esta hoja le ayuda a ver si le alcanza o si necesita mover fechas.',
          campos: [
            {
              t: 'lista', id: 'compromisos', label: 'Por cobrar y por pagar', lineas: 5,
              columnas: [
                { id: 'que', label: 'Por cobrar / por pagar', t: 'texto' },
                { id: 'monto', label: 'Monto $', t: 'moneda' },
                { id: 'fecha', label: 'Fecha acordada', t: 'texto' }
              ]
            },
            {
              t: 'caja', id: 'prevision', label: 'Previsión de los próximos 15 días', lineas: 15, dias: true,
              columnas: [
                { id: 'fecha', label: 'Día', t: 'texto' },
                { id: 'entra', label: 'Entraría $', t: 'moneda' },
                { id: 'sale', label: 'Saldría $', t: 'moneda' }
              ]
            },
            { t: 'area', id: 'planB', label: 'Si el cobro se retrasa o si un pago me aprieta, haré esto' }
          ]
        }
      ],
      quiz: [
        {
          p: 'Vendió $60.000 fiados y le pagan la próxima quincena. ¿Qué entra hoy a la caja por esa venta?',
          ops: ['$60.000', '$30.000', '$0: queda por cobrar.'], ok: 2,
          porque: 'La venta sigue por cobrar: todavía no es plata disponible.'
        },
        {
          p: 'En el ejemplo: $100.000 + $180.000 + $40.000 − $230.000 − $20.000. ¿Cuánto queda?',
          ops: ['$70.000', '$130.000', '$320.000'], ok: 0,
          porque: 'Ese saldo debe compararse con el dinero realmente disponible.'
        }
      ]
    },

    /* ============================================== MÓDULO 4 ====== */
    {
      id: 'm4', n: 4, corto: 'Cuidar recursos', dias: 'Días 46 al 60', color: 'verde',
      titulo: '¿Cómo cuido lo que uso y lo que sobra?',
      lema: 'Probar una mejora ambiental segura y mostrar lo que cambió sin exagerar el resultado.',
      meta: 'Al terminar esta quincena tendrá una mejora ambiental probada y una forma de mostrar qué cambió.',
      pasos: [
        ['Elija una sola mejora.', 'Menos desperdicio, mejor orden, mejor uso del agua, separación de residuos o mejor aprovechamiento del material limpio.'],
        ['Compare lo comparable.', 'Use la misma unidad, una cantidad de trabajo parecida y la misma forma de medir.'],
        ['No arriesgue la salud ni la calidad.', 'Si la mejora toca temas técnicos, pídale apoyo al asesor.']
      ],
      caso: 'La CVC ha documentado emprendimientos de turismo de naturaleza y otras experiencias que cuidan el entorno y organizan mejor sus residuos. Esos casos inspiran, pero no equivalen a una certificación automática.',
      casoRef: 5,
      bitacora: {
        frase: 'Probé una mejora ambiental.',
        ejemplo: 'Un conteo, un peso, una foto del antes y del después, una nota de cuánto material ahorró o una fecha para volver a medir.'
      },
      actividades: [
        {
          id: 'a1', titulo: 'Mido antes y después',
          guia: 'Anote el “antes” y el “después” con la misma unidad. La diferencia se calcula sola.',
          ayuda: 'Antes de la mejora, en 20 piezas salieron 4 kilos de recortes. Después, en 20 piezas parecidas, salieron 3 kilos. En esa prueba hubo 1 kilo menos de recortes.',
          campos: [
            { t: 'texto', id: 'recurso', label: 'Recurso o sobrante que voy a medir' },
            { t: 'texto', id: 'unidadMedida', label: 'Unidad con la que mido' },
            {
              t: 'comparar', id: 'medicion', label: 'Mi medición',
              filas: [
                { id: 'fecha', label: 'Fecha', t: 'texto' },
                { id: 'producido', label: 'Cantidad producida o servicios atendidos', t: 'numero' },
                { id: 'sobrante', label: 'Cantidad usada o sobrante', t: 'numero', diferencia: true },
                { id: 'como', label: '¿Cómo la medí?', t: 'texto' },
                { id: 'costo', label: 'Tiempo o dinero que costó la mejora', t: 'texto' }
              ]
            },
            { t: 'area', id: 'cambio', label: 'Lo que cambió, o la fecha en que podré comprobarlo' }
          ]
        },
        {
          id: 'a2', titulo: 'Cuento mi mejora sin exagerar',
          guia: 'Marque solo lo que revisó y escriba con honestidad lo que sí puede mostrar.',
          ayuda: 'Una forma honesta de contarlo es: “En esta prueba reduje los recortes y lo mostré con mi registro”. No diga “ya no contamina” o “ya tengo certificación” si todavía no puede demostrarlo.',
          campos: [
            {
              t: 'checks', id: 'revisiones', label: 'Antes de contarlo, revisé que',
              opciones: [
                'Usé la misma unidad y una cantidad de trabajo comparable.',
                'Conservé la calidad, la limpieza y la seguridad.',
                'Anoté lo que costó la mejora y guardé un registro.'
              ]
            },
            { t: 'area', id: 'logro', label: 'Puedo decir: “En esta prueba logré…”' },
            { t: 'area', id: 'prueba', label: 'Puedo mostrarlo con este registro, conteo o foto' },
            { t: 'area', id: 'dificultad', label: 'La mejora tuvo esta dificultad, o necesito esta ayuda' }
          ]
        }
      ],
      quiz: [
        {
          p: 'Antes hizo 20 piezas y sobraron 4 kg. Después hizo 10 y sobraron 3 kg. ¿Ya demostró una mejora?',
          ops: ['Sí, porque 3 es menor que 4.', 'No: debe comparar por pieza o repetir con una cantidad similar.', 'Sí, porque trabajó menos.'],
          ok: 1, porque: 'Debe revisar cantidades comparables antes de concluir.'
        },
        {
          p: 'Su registro muestra menos recortes en una prueba. ¿Qué puede decir?',
          ops: ['Mi producto no contamina nada.', 'Ya tengo una certificación ambiental.', 'En esta prueba reduje los recortes y tengo el registro.'],
          ok: 2, porque: 'La afirmación corresponde a la evidencia que usted sí tiene.'
        }
      ]
    },

    /* ============================================== MÓDULO 5 ====== */
    {
      id: 'm5', n: 5, corto: 'Decidir', dias: 'Días 61 al 75', color: 'naranja',
      titulo: '¿Sigo, pruebo o cambio?',
      lema: 'Evaluar una oportunidad sin abandonar a ciegas lo que hoy sostiene el negocio.',
      meta: 'Al terminar esta quincena tendrá una comparación clara y una decisión con límite.',
      pasos: [
        ['Busque un comprador real.', 'Pregunte cantidad, calidad, precio, transporte y fecha de pago. Una noticia no es un pedido.'],
        ['Revise el ciclo completo.', 'Cuánto cuesta, cuánto dura y cuánto tarda en entrar la plata.'],
        ['Pruebe sin arriesgar lo esencial.', 'Defina un límite de dinero, de tiempo o de área.']
      ],
      caso: 'Los precios mayoristas o una oportunidad puntual no garantizan que el negocio funcione igual en su predio o en su mercado. Para cambiar de cultivo o de actividad, revise suelo, agua, clima, tiempos, requisitos y flujo de caja.',
      casoRef: 7,
      bitacora: {
        frase: 'Comparé una oportunidad y tomé una decisión.',
        ejemplo: 'Una cuenta comparativa, un dato confirmado, una llamada realizada, una foto del lote de prueba o esta misma hoja llena.'
      },
      actividades: [
        {
          id: 'a1', titulo: 'Comparo antes de comprometerme',
          guia: 'Use el mismo periodo para comparar y escriba “por confirmar” donde falte información.',
          ayuda: 'Un cultivo nuevo puede verse atractivo por precio, pero quizá exige más plata antes de cobrar o más tiempo de espera. La oportunidad solo sirve si usted puede sostenerla.',
          campos: [
            {
              t: 'comparar', id: 'comparacion', label: 'Qué necesito saber',
              encabezados: ['Actividad actual', 'Oportunidad'],
              filas: [
                { id: 'unidad', label: '¿Qué vendo y en qué unidad?', t: 'texto' },
                { id: 'comprador', label: 'Comprador, cantidad y calidad', t: 'texto' },
                { id: 'precio', label: 'Precio, transporte y comisiones', t: 'texto' },
                { id: 'ciclo', label: 'Costo del ciclo y duración', t: 'texto' },
                { id: 'recibiria', label: 'Plata que recibiría', t: 'moneda' },
                { id: 'cobro', label: 'Fecha del primer cobro', t: 'texto' },
                { id: 'necesito', label: 'Plata que necesito antes de cobrar', t: 'moneda' },
                { id: 'requisitos', label: 'Suelo, agua, permisos o apoyo por revisar', t: 'texto' }
              ]
            },
            { t: 'area', id: 'riesgo', label: 'Si el precio baja o el pago se atrasa, esto pasaría con mi caja' }
          ]
        },
        {
          id: 'a2', titulo: 'Mi prueba tiene un límite',
          guia: 'Decida un siguiente paso pequeño y seguro.',
          ayuda: 'Si todavía le falta un dato clave, su mejor decisión puede ser “conseguir el dato” antes de invertir. Avanzar también es frenar a tiempo.',
          campos: [
            {
              t: 'opcion', id: 'decision', label: 'Hoy decido',
              opciones: ['Seguir igual', 'Conseguir un dato', 'Probar algo pequeño']
            },
            { t: 'area', id: 'queProbar', label: 'Lo que voy a probar o el dato que voy a conseguir es' },
            { t: 'texto', id: 'tamano', label: 'Tamaño de la prueba: cantidad, pedido o área' },
            { t: 'texto', id: 'limite', label: 'Máximo de dinero y tiempo que puedo comprometer' },
            { t: 'fecha', id: 'revision', label: 'Fecha de revisión' },
            { t: 'area', id: 'continuar', label: 'Continuaré solo si' },
            { t: 'area', id: 'parar', label: 'Pararé o cambiaré la prueba si' }
          ]
        }
      ],
      quiz: [
        {
          p: 'Subió el precio de otro cultivo. ¿Qué hace primero?',
          ops: ['Arranco todo lo que tengo.', 'Confirmo comprador, costos, tiempo de cobro y condiciones del predio.', 'Pido un préstamo de inmediato.'],
          ok: 1, porque: 'Primero necesita información comercial, financiera y técnica.'
        },
        {
          p: 'No sabe si su caja aguanta hasta la primera cosecha. ¿Qué decisión sirve?',
          ops: ['Cambiar de todos modos.', 'Suponer que venderá al precio más alto.', 'Completar esa cuenta antes de comprometer recursos.'],
          ok: 2, porque: 'Aplazar la inversión para conseguir un dato clave también es avanzar.'
        }
      ]
    }
  ],

  /* -------------------------------------------------------- bitácora */
  bitacoraCampos: [
    'La acción pequeña que hice fue',
    'Este dato o evidencia guardé',
    'Al probarla pasó esto',
    'Aprendí que / la próxima vez cambiaré',
    'Mi siguiente paso, la fecha y la ayuda que necesito'
  ],

  /* ---------------------------------------------------------- cierre */
  cierre: {
    mentor: {
      titulo: 'Lo converso con mi mentor o asesora',
      guia: 'Muestre una cuenta, una prueba o una duda concreta. No necesita tener todo perfecto.',
      ayuda: 'Si no sabe por dónde empezar, muestre solo una hoja: por ejemplo, la de costos, la de caja o la comparación de oportunidades.',
      campos: ['La evidencia que revisamos o lo que falta confirmar es',
        'La recomendación concreta fue', 'Acordamos esta acción y esta fecha']
    },
    evidencias: [
      'E1. Dos conversaciones y una oferta probada.',
      'E2. Un costo por unidad y un precio revisado.',
      'E3. Mi caja y la previsión de pagos y cobros.',
      'E4. Una medición antes y después, o una fecha para verificar.',
      'E5. Una comparación y una decisión con límite.'
    ],
    estados: ['Lo tengo', 'Me falta', 'Pido ayuda'],
    plan: {
      titulo: 'Mi plan para los próximos 30 días',
      guia: 'Elija solo dos acciones. Hacer pocas y revisarlas bien ayuda más que cambiar muchas cosas al tiempo.',
      campos: ['Voy a hacer esto', 'Sabré que avancé cuando', 'Para hacerlo necesito esta ayuda o este recurso']
    }
  },

  /* -------------------------------------------------------- glosario */
  glosario: [
    ['Cliente', 'Persona u organización que compra o podría comprar.'],
    ['Costo', 'Lo que usa y el trabajo que necesita para ofrecer algo.'],
    ['Unidad vendible', 'Kilo, planta, bolsa, pieza o servicio en condiciones de venderse.'],
    ['Caja', 'Plata disponible, no ventas que todavía no ha cobrado.'],
    ['Por cobrar', 'Dinero que le deben y todavía no ha recibido.'],
    ['Por pagar', 'Compromiso que todavía debe pagar.'],
    ['Evidencia', 'Dato, cuenta, registro o foto que muestra lo que hizo.'],
    ['Prueba pequeña', 'Cambio limitado para aprender antes de comprometer más.']
  ],

  /* --------------------------------------------------------- fuentes */
  fuentes: [
    'FAO (2021). Recomendaciones sobre agricultura familiar y circuitos cortos. Caso Red Agroecológica La Canasta.',
    'OIT (2016). Mejore su negocio: Costeo. Referente para identificar costos.',
    'Banca de las Oportunidades (2018). Construir, avanzar y prosperar. Educación financiera.',
    'MinAmbiente (s. f.). Criterios para identificar los Negocios Verdes.',
    'CVC (13 de abril de 2026). Emprendimientos verdes del Pacífico avanzan en su proceso de evaluación.',
    'CVC (26 de mayo de 2026). Mujeres impulsan un negocio verde en área protegida de Dagua.',
    'DANE (s. f.). SIPSA: precios mayoristas, insumos y abastecimiento.',
    'UPRA (s. f.). SIPRA: información orientadora para la planificación rural.'
  ],

  aviso: 'Material educativo de apoyo. Las recomendaciones productivas, sanitarias, ambientales o financieras específicas deben revisarse con el profesional correspondiente. Este material no reemplaza una certificación ni una verificación de negocio verde.'
};
