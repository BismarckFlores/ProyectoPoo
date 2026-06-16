# API — Portal Examen (Vocabulario BFA)

API REST en **Express + TypeScript** que ejecuta el test de vocabulario: registra al evaluado,
sirve las dos formas (A y B) al frontend, corrige las respuestas y calcula las puntuaciones
(VOC1, VOC2, VOCT) contra un baremo. Comparte la base PostgreSQL `proyecto_poo` con el panel
de OpenXava.

## Requisitos previos

| Herramienta | Versión | Para qué |
|---|---|---|
| **Node.js** | 18 o superior (recomendado LTS 20+) | correr la API |
| **npm** | viene con Node | instalar dependencias |
| **PostgreSQL** | 12 o superior | base de datos |

Verifica que los tengas:

```bash
node -v
npm -v
psql --version
```

## Paso 1 — Instalar dependencias

Desde la carpeta `portal_examen/api`:

```bash
cd portal_examen/api
npm install
```

Esto instala Express, pg (driver de PostgreSQL), cors, dotenv y las herramientas de
TypeScript (tsx, typescript y los @types).

## Paso 2 — Crear la base de datos

La API crea las **tablas** automáticamente al arrancar, pero la **base de datos** debe existir antes.
Créala una vez:

```bash
createdb proyecto_poo
```

O desde `psql`:

```sql
CREATE DATABASE proyecto_poo;
```

> Usa el mismo nombre, usuario y contraseña que pondrás en el `.env` y en el panel de OpenXava,
> ya que ambos comparten esta base.

## Paso 3 — Configurar las variables de entorno

Copia el ejemplo y edítalo con tus datos:

```bash
cp .env.example .env
```

Contenido de `.env`:

```ini
# API
PORT=3000
WEB_ORIGIN=http://localhost:4000

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=tu_usuario
PGPASSWORD=tu_contraseña
PGDATABASE=proyecto_poo
```

- `PORT` — puerto de la API (el frontend espera `3000`).
- `WEB_ORIGIN` — origen permitido por CORS (el frontend corre en `4000`).
- `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` — conexión a PostgreSQL.
- Alternativa: en vez de las 5 variables `PG*`, puedes usar una sola `DATABASE_URL=postgres://usuario:clave@localhost:5432/proyecto_poo`.

## Paso 4 — Correr la API

### Modo desarrollo (recomendado mientras trabajas)
Recarga automática al guardar cambios:

```bash
npm run dev
```

### Modo producción (compilar y ejecutar)

```bash
npm run build   # compila TypeScript a dist/
npm start       # ejecuta dist/server.js
```

Si todo está bien verás:

```
Server listening on http://localhost:3000
```

Al arrancar, la API ejecuta `ensureSchema` y crea las tablas si no existen.

## Verificar que funciona

Al arrancar debe imprimir `Server listening on http://localhost:3000`. Para una prueba rápida,
crea un evaluado (debe responder `201` con el registro creado):

```bash
curl -X POST http://localhost:3000/api/evaluados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Test","primer_apellido":"Prueba"}'
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/evaluados` | Registra al evaluado |
| POST | `/api/aplicaciones` | Crea la sesión de examen (toma formas y baremo de la configuración activa) |
| GET | `/api/aplicaciones/:id/formas` | Devuelve las dos formas con sus ítems y opciones |
| POST | `/api/aplicaciones/:id/calificar` | Recibe todas las respuestas, corrige y calcula el resultado |
| GET | `/api/aplicaciones/:id/resultado` | Consulta el resultado ya calculado |

## Notas importantes

- **Necesita una configuración activa.** La API saca las dos formas y el baremo de la tabla
  `configuracion_examen` (la marcada como `activa`). Esa configuración se crea desde el panel de
  OpenXava. Sin una config activa, crear una aplicación falla.
- **El esquema se crea con `CREATE TABLE IF NOT EXISTS`**: si cambian las tablas, no se alteran
  las existentes. Si modificas el esquema, borra las tablas afectadas para que se recreen.
- **OpenXava comparte esta misma base** (`proyecto_poo`): configura formas, ítems, opciones y
  baremo; la API los consume.

## Estructura del proyecto

```
src/
├── server.ts            # arranque: arma el grafo de dependencias y levanta Express
├── config/env.ts        # variables de entorno tipadas
├── db/
│   ├── pool.ts          # pool de conexiones a PostgreSQL
│   └── schema.ts        # ensureSchema: crea todas las tablas
├── types/               # tipos del dominio y DTOs
├── repositories/        # acceso a datos (SQL puro)
├── services/            # lógica de negocio + MotorCorreccion
├── controllers/         # manejan request/response
└── routes/index.ts      # registro de rutas
```
