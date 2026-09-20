# Mi negocio verde · Cuaderno interactivo

Sitio web del cuaderno práctico **Reverdecer · Mi negocio verde**: cinco retos
quincenales que el participante completa en línea desde el computador, la tablet
o el celular. El sitio hace las cuentas solo (costo por unidad, saldo de caja,
previsión de pagos, comparación antes/después), califica las preguntas de cada
módulo y arma una página de resultados imprimible.

No usa frameworks ni base de datos: son archivos estáticos. Todo lo que escribe
el participante se guarda en su propio navegador (`localStorage`), así que
funciona sin cuenta de usuario y sin conexión después de la primera carga.

---

## 1. Ver el sitio en su computador

Abra `index.html` con doble clic. Para que funcione igual que en internet,
es mejor levantar un servidor local:

```bash
# con Python (ya viene en Mac y Linux)
python3 -m http.server 8080
# luego abra http://localhost:8080
```

---

## 2. Subirlo a GitHub

Necesita una cuenta en <https://github.com> y Git instalado.

```bash
cd cartilla-web                 # la carpeta de este proyecto
git init
git add .
git commit -m "Cuaderno interactivo Mi negocio verde"
git branch -M main
git remote add origin https://github.com/USUARIO/mi-negocio-verde.git
git push -u origin main
```

Reemplace `USUARIO` por su usuario de GitHub. Si prefiere no usar la terminal:
en GitHub cree un repositorio nuevo, elija **uploading an existing file** y
arrastre toda la carpeta.

> Cree el repositorio **público** si quiere que cualquiera vea el código, o
> **privado** si solo lo usará el equipo. Vercel funciona con los dos.

---

## 3. Publicarlo en Vercel

1. Entre a <https://vercel.com> y cree la cuenta con **Continue with GitHub**.
2. Botón **Add New… → Project**.
3. Busque el repositorio `mi-negocio-verde` y presione **Import**.
4. En *Framework Preset* deje **Other**. No cambie nada más:
   - Build Command: vacío
   - Output Directory: vacío (la raíz)
   - Install Command: vacío
5. Presione **Deploy**. En menos de un minuto tendrá una dirección como
   `https://mi-negocio-verde.vercel.app`.

Desde ese momento, **cada vez que haga `git push` el sitio se actualiza solo**.

### Dominio propio (opcional)

En el proyecto de Vercel: **Settings → Domains → Add**. Escriba su dominio
(por ejemplo `cuaderno.fundacionunivalle.org`) y Vercel le indica los registros
DNS que debe pedirle a quien administra el dominio.

---

## 4. Cómo cambiar el contenido

Casi todo vive en un solo archivo: **`assets/js/datos.js`**.

| Quiero cambiar… | Dónde |
|---|---|
| Títulos, metas, pasos y casos de cada módulo | `modulos[]` en `datos.js` |
| Las preguntas de comprobación y su respuesta correcta | `quiz` dentro de cada módulo (`ok` es el índice: 0 = primera opción) |
| Los campos que el participante llena | `actividades[].campos[]` |
| Los aspectos de la autoevaluación | `autoevaluacion.aspectos` |
| El glosario y las fuentes | `glosario` y `fuentes` |
| Colores, tamaños y tipografías | `:root` al inicio de `assets/css/estilos.css` |
| Fotografías | reemplace los archivos de `assets/img/` conservando el nombre |

Tipos de campo disponibles: `texto`, `area`, `numero`, `moneda`, `fecha`,
`opcion`, `checks`, `tabla`, `lista`, `caja` (con saldo corrido automático),
`comparar` (antes/después) y `resultado` (cuenta calculada).

### Las fotografías

Las imágenes actuales se recortaron de la cartilla impresa para que el sitio
saliera con el mismo lenguaje visual. **Reemplácelas por fotos reales de los
participantes** en cuanto las tenga: se ven mejor y le dan identidad al
territorio. Conserve los nombres (`hero.jpg`, `modulo-1.jpg` … `modulo-5.jpg`),
use formato JPG, ancho de 900 a 1600 px y menos de 300 KB por archivo.

---

## 5. Privacidad

Las respuestas **no salen del dispositivo**: no hay servidor, ni base de datos,
ni analítica. El participante puede descargar sus respuestas en un archivo
`.json` y volver a cargarlas en otro dispositivo desde la página *Mis
resultados*.

Si más adelante necesita recoger las respuestas de forma centralizada (por
ejemplo para hacer seguimiento del programa), eso sí requiere un backend:
las opciones más sencillas son Vercel KV, Supabase o un formulario de Google
conectado al botón de envío.

---

## Estructura

```
index.html                 estructura de la página e íconos
assets/css/estilos.css     diseño, responsive e impresión
assets/js/datos.js         TODO el contenido de la cartilla
assets/js/app.js           render, autoguardado, cuentas y resultados
assets/img/                fotografías, logo y franja de aliados
vercel.json                cabeceras y caché
```

---

Material educativo de apoyo del programa **Reverdecer · Sembrando Futuro**.
No reemplaza una certificación ni una verificación de negocio verde.
