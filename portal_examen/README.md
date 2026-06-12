Portal Examen - estructura separada Web/API

## Estructura

- `web/` -> frontend estatico (HTML + Bootstrap), corre en puerto `4000`.
- `api/` -> backend TypeScript (Express + PostgreSQL), corre en puerto `3000`.
- `api/src/server.ts` -> bootstrap del backend en TypeScript.

Estructura por capas del backend (`api/src`):

- `config/` -> lectura de variables de entorno.
- `db/` -> conexion PostgreSQL y schema.
- `services/` -> logica de negocio.
- `controllers/` -> manejo HTTP (request/response).
- `routes/` -> definicion de endpoints.
- `types/` -> tipos compartidos.
- `package.json` (raiz) -> scripts globales para levantar ambos servicios.

## Puertos

- Web: `http://localhost:4000`
- API: `http://localhost:3000`

La web usa `fetch` hacia `http://localhost:3000/api`.

## Requisitos

- Node.js 18+
- PostgreSQL activo
- Cadena de conexion en `DATABASE_URL` o variables `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`.

## Configuracion

1) Copia `api/.env.example` a `api/.env`.

Linux/macOS:

```bash
cp api/.env.example api/.env
```

Windows PowerShell:

```powershell
Copy-Item api\.env.example api\.env
```

2) Edita `api/.env` con tus valores de PostgreSQL.

Ejemplo con una sola URL:

```dotenv
DATABASE_URL=postgres://usuario:password@localhost:5432/mi_basedatos
WEB_ORIGIN=http://localhost:4000
PORT=3000
```

Ejemplo con variables separadas:

```dotenv
PGHOST=localhost
PGPORT=5432
PGUSER=usuario
PGPASSWORD=password
PGDATABASE=mi_basedatos
WEB_ORIGIN=http://localhost:4000
PORT=3000
```

## Endpoints API

- `GET /api/ping`
- `GET /api/submissions`
- `POST /api/submit` body JSON: `{ "name": "Bismarck", "score": 2 }`

## Notas

- El backend crea la tabla `submissions` automaticamente si no existe.
- No se usa SQLite en esta nueva estructura.

