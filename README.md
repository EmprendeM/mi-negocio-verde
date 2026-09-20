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

## 4. Códigos de participante y panel de seguimiento (opcional)

Sin esta parte el cuaderno funciona igual, pero las respuestas viven solo en el
dispositivo. Con ella, cada participante entra con un código, su avance se
guarda en la nube y el equipo lo ve en `/admin`.

### 4.1 Conectar la base de datos

**Vercel KV ya no existe**: Vercel lo retiró y ahora el mismo servicio se llama
*Upstash for Redis*. Tiene plan gratuito suficiente para este uso.

1. En Vercel, entre a su proyecto y abra la pestaña **Storage**.
2. Presione **Create Database**, busque **Upstash for Redis** en el Marketplace
   e instálelo. Elija el plan **Free**.
3. Cuando pregunte a qué proyecto conectarlo, elija `mi-negocio-verde`.
4. Vercel crea solas las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
   No hay que copiarlas a mano.

### 4.2 Poner la clave del panel

1. En el proyecto: **Settings → Environment Variables**.
2. Name: `CLAVE_ADMIN`. Value: una contraseña larga que solo conozca el equipo.
3. Marque los tres ambientes (Production, Preview, Development) y guarde.
4. Vaya a **Deployments**, botón **⋯** del último despliegue, **Redeploy**.
   Las variables nuevas solo entran con un despliegue nuevo.

### 4.3 Repartir los códigos

Los códigos **no se registran en ninguna parte**: el primero que lo escriba lo
crea. Prepare una lista antes de la jornada, por ejemplo `VALLE-7K2M`,
`VALLE-3P9D`, y entréguele uno a cada participante en papel.

- Use letras y números, mínimo 4 caracteres, máximo 24. Solo se aceptan
  mayúsculas, números y guiones.
- **No use datos personales** (cédula, teléfono, nombre) como código.
- Mézclelos con caracteres al azar: quien conozca un código puede ver y editar
  ese cuaderno. Códigos predecibles como `VALLE-01`, `VALLE-02` permiten que
  alguien adivine el de otro participante.

### 4.4 Entrar al panel

Abra `https://su-sitio.vercel.app/admin` y escriba la `CLAVE_ADMIN`. Verá la
lista de participantes con avance por módulo, aciertos, evidencias y última
actividad; puede buscar, ver el detalle de cada uno y descargar un CSV para
Excel.

### 4.5 Datos personales

Cuando las respuestas salen del dispositivo, el programa pasa a ser responsable
del tratamiento de datos personales (Ley 1581 de 2012 en Colombia). Antes de
usar los códigos en campo, revise con el área jurídica la autorización
informada, la finalidad declarada y el procedimiento para consultar o eliminar
datos. No soy abogado: ese punto verifíquelo con quien corresponda.

---

## 5. Cómo cambiar el contenido

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

## 6. Privacidad

**Sin código**, las respuestas no salen del dispositivo: no hay servidor, ni
analítica, ni cuentas. El participante puede descargar sus respuestas en un
archivo `.json` y volver a cargarlas en otro dispositivo.

**Con código**, las respuestas se guardan en la base de datos del proyecto y el
equipo las ve en `/admin`. El código es la única llave: quien lo tenga entra a
ese cuaderno. Por eso los códigos deben ser difíciles de adivinar y no deben
contener datos personales. Si necesita un nivel de protección mayor (por
ejemplo, que cada persona tenga contraseña propia), lo indicado es migrar a
Supabase con enlace mágico al correo.

---

## Estructura

```
index.html                 cuaderno del participante
admin.html                 panel del equipo de acompañamiento (/admin)
assets/css/estilos.css     diseño, responsive e impresión
assets/js/datos.js         TODO el contenido de la cartilla
assets/js/app.js           render, autoguardado, cuentas y resultados
assets/js/nube.js          código de participante y guardado en la nube
assets/img/                fotografías, logo y franja de aliados
api/cuaderno.js            guarda y devuelve las respuestas de un código
api/admin.js               lista de participantes, protegida por CLAVE_ADMIN
package.json               dependencia @upstash/redis
vercel.json                cabeceras y caché
```

### Si algo falla

| Síntoma | Causa más probable |
|---|---|
| Al escribir el código dice "No hay conexión" | Falta instalar Upstash for Redis, o no se hizo Redeploy después |
| `/admin` dice "Falta configurar CLAVE_ADMIN" | La variable no existe o no se ha desplegado de nuevo |
| `/admin` dice "Clave incorrecta" | La clave tiene espacios al inicio o al final |
| El sitio no toma los cambios de `datos.js` | Espere el despliegue y recargue con Ctrl+F5 |

---

Material educativo de apoyo del programa **Reverdecer · Sembrando Futuro**.
No reemplaza una certificación ni una verificación de negocio verde.
