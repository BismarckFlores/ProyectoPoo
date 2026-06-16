# Documentación de la API — Portal Examen (Vocabulario BFA)

Documentación técnica de cómo está construida la API: su arquitectura, el rol de cada archivo,
el flujo de una petición, el modelo de datos, los endpoints y la lógica de corrección.

> Para instalar y correr la API, ver `README.md`. Este documento explica **cómo funciona por dentro**.

---

## 1. Qué es y qué hace

API REST en **Express + TypeScript** que ejecuta el test de vocabulario BFA. Sus responsabilidades:

- Registrar al **evaluado** (la persona que rinde el test).
- Crear una **aplicación** (sesión de examen) tomando las formas y el baremo de la **configuración activa**.
- Servir al frontend las **dos formas** (A y B) con sus ítems y opciones, **sin** revelar la respuesta correcta.
- Recibir todas las respuestas al final, **corregirlas**, calcular las puntuaciones (VOC1, VOC2, VOCT)
  contra el baremo y **guardar** el resultado.

Comparte la base PostgreSQL `proyecto_poo` con el panel de **OpenXava**, que es quien configura
formas, ítems, opciones, baremo y la configuración del examen.

---

## 2. Arquitectura en capas

La API sigue una arquitectura por capas. Cada petición baja por estas capas y cada una tiene una
única responsabilidad:

```
HTTP  →  Routes  →  Controller  →  Service  →  Repository  →  PostgreSQL
                       │              │            │
              (req/res, errores)  (lógica)    (SQL puro)
                                      │
                                MotorCorreccion (cálculo puro, sin DB)
```

- **Routes** — mapean URL + método HTTP a un método de un controller.
- **Controllers** — leen `req`, llaman al service, devuelven JSON y traducen errores a códigos HTTP.
- **Services** — la lógica de negocio: validan, orquestan repositorios y el motor de corrección.
- **Repositories** — el único lugar con SQL. Reciben el `Pool` y devuelven/escriben filas.
- **MotorCorreccion** — lógica de cálculo pura (sin tocar la base), reutilizable y testeable.

Regla de dependencia: una capa solo conoce a la de abajo. Los controllers no hacen SQL; los
repositorios no tienen lógica de negocio.

---

## 3. Estructura de archivos

```
src/
├── server.ts                 # Punto de arranque (composition root)
├── config/
│   └── env.ts                # Variables de entorno tipadas
├── db/
│   ├── pool.ts               # Crea el pool de conexiones a PostgreSQL
│   └── schema.ts             # ensureSchema: crea todas las tablas
├── types/                    # Tipos del dominio y DTOs (sin lógica)
│   ├── evaluado.ts
│   ├── forma.ts
│   ├── aplicacion.ts
│   ├── respuesta.ts
│   ├── resultado.ts
│   └── configuracion.ts
├── repositories/             # Acceso a datos (SQL puro)
│   ├── EvaluadoRepository.ts
│   ├── FormaRepository.ts
│   ├── ItemRepository.ts
│   ├── AplicacionTestRepository.ts
│   ├── RespuestaRepository.ts
│   ├── ResultadoRepository.ts
│   ├── BaremoRepository.ts
│   └── ConfiguracionRepository.ts
├── services/                 # Lógica de negocio
│   ├── EvaluadoService.ts
│   ├── AplicacionTestService.ts
│   ├── ResultadoService.ts
│   └── MotorCorreccion.ts
├── controllers/              # Entrada/salida HTTP
│   ├── EvaluadoController.ts
│   └── AplicacionTestController.ts
└── routes/
    └── index.ts              # Registro de rutas
```

---

## 4. Explicación archivo por archivo

### Arranque y configuración

**`server.ts`** — *Composition root*. Es donde se "arma" toda la aplicación:
1. Crea el `pool` de PostgreSQL.
2. Instancia los **repositorios** (les pasa el pool).
3. Instancia los **servicios** (les pasa los repositorios que necesitan).
4. Instancia los **controllers** (les pasa los servicios).
5. Configura Express: `express.json()` (parsea el body JSON) y `cors` (permite el origen del frontend).
6. Monta el router en `/api`.
7. Llama a `ensureSchema(pool)` para crear las tablas y luego `app.listen(port)`.

Esta inyección de dependencias manual es lo que mantiene las capas desacopladas.

**`config/env.ts`** — Carga el archivo `.env` con `dotenv` y exporta un objeto `env` **tipado**
(`AppEnv`) con `port`, `webOrigin` y los datos de conexión a PostgreSQL. Centraliza el acceso a
`process.env` para que el resto del código no lo toque directo.

**`db/pool.ts`** — Exporta `createPool()`, que construye el `Pool` de `pg`:
- Si hay `DATABASE_URL` (o `PG_CONNECTION`), usa esa cadena de conexión.
- Si no, arma la config con `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE`.
- Si no hay nada configurado, lanza un error.

**`db/schema.ts`** — Exporta `ensureSchema(pool)`, que ejecuta un bloque de `CREATE TABLE IF NOT
EXISTS` para las 11 tablas, en orden de dependencias (para respetar las foreign keys). Se llama
una vez al arrancar. Como usa `IF NOT EXISTS`, **no altera** tablas que ya existan.

### Tipos (`types/`)

Solo definiciones de TypeScript, sin lógica. Hay dos clases de tipos:
- **Tipos de fila** (reflejan una tabla): `Evaluado`, `FormaVocabulario`, `Item`, `Opcion`,
  `AplicacionTest`, `Respuesta`, `ResultadoVocabulario`, `Puntuacion`, `ConfiguracionExamen`.
- **DTOs** (lo que entra/sale por HTTP): `CrearEvaluadoDTO`, `CrearAplicacionDTO`,
  `CalificarAplicacionDTO`, `RegistrarRespuestaDTO`, `ResultadoDTO`.
- **Tipos "públicos"**: `ItemPublico` y `OpcionPublica` — versiones de `Item`/`Opcion` **sin la
  respuesta correcta**, que son las que se le mandan al frontend para que no se pueda hacer trampa.

### Repositorios (`repositories/`) — solo SQL

Cada uno recibe el `Pool` en el constructor y expone métodos que hacen una query.

| Repositorio | Métodos | Qué hace |
|---|---|---|
| `EvaluadoRepository` | `create`, `findById` | Inserta/lee evaluados. |
| `FormaRepository` | `findById`, `findByTipo` | Lee una forma por id o por tipo ('A'/'B'). |
| `ItemRepository` | `findByForma` | Lee los ítems de una forma **y carga sus opciones** (una query extra que agrupa las opciones por ítem). |
| `AplicacionTestRepository` | `create`, `findById`, `updateEstado` | Crea la aplicación (con forma A, forma B y baremo), la lee y cambia su estado. |
| `RespuestaRepository` | `createMany`, `findByAplicacion` | `createMany` inserta **todas** las respuestas en un solo `INSERT` multi-fila. Exporta el tipo `RespuestaCalculada` (con `es_correcta` ya resuelto). |
| `ResultadoRepository` | `create`, `createPuntuacion`, `findByAplicacion`, `findPuntuacionesByResultado` | Guarda el resultado y sus puntuaciones; los lee. |
| `BaremoRepository` | `findByNormasYFactor` | Lee las entradas del baremo de un factor (VOC1/VOC2/VOCT) ordenadas por `pd_min`. Exporta el tipo `EntradaBaremo`. |
| `ConfiguracionRepository` | `findActiva` | Devuelve la configuración marcada como `activa` (la más reciente si hubiera varias). |

### Servicios (`services/`) — lógica de negocio

**`EvaluadoService`**
- `crear(dto)` — valida que `nombre` y `primer_apellido` no vengan vacíos, luego inserta.
- `obtenerPorId(id)` — lee y lanza error si no existe.

**`AplicacionTestService`**
- `crear(dto)` — verifica que el evaluado exista, lee la **configuración activa**
  (`ConfiguracionRepository.findActiva`) y crea la aplicación guardando como *snapshot* su
  `id_forma_a`, `id_forma_b` e `id_normas`. Si no hay config activa, lanza error.
- `obtenerFormas(idAplicacion)` — lee las dos formas de la aplicación con sus ítems, cambia el
  estado a `EN_PROGRESO` y devuelve ambas formas con sus ítems **convertidos a públicos**.
- `aPublico(item)` — (privado) transforma un `Item` en `ItemPublico`: copia número, palabra y las
  opciones (solo `letra` y `texto`), **descartando** `respuesta_correcta`.

**`ResultadoService`**
- `calificar(idAplicacion, dto)` — el corazón del cierre del examen:
  1. Lee la aplicación (valida que no esté ya `CALIFICADO`).
  2. Carga las dos formas y sus ítems; arma un mapa `id_item → Item`.
  3. Para cada respuesta recibida, calcula `es_correcta` con `MotorCorreccion.esCorrecta`.
  4. Inserta todas las respuestas en lote (`RespuestaRepository.createMany`).
  5. Lee el baremo (de `aplicacion.id_normas`) para VOC1, VOC2 y VOCT.
  6. Llama a `MotorCorreccion.calificar` con las respuestas, los ítems y el baremo.
  7. Guarda el `resultado_vocabulario` y una `puntuacion` por factor.
  8. Cambia el estado a `CALIFICADO` y devuelve el `ResultadoDTO`.
- `obtenerPorAplicacion(id)` — lee un resultado ya calculado con sus puntuaciones.
- `rango(forma, items)` — (privado) calcula el rango de ítems a puntuar (usa `item_inicial`/
  `item_final` de la forma, o todos los ítems si no están definidos).

**`MotorCorreccion`** — lógica de cálculo **pura** (no toca la base). Es lo que define cómo se puntúa:
- `esCorrecta(item, letra)` — compara la letra marcada con `respuesta_correcta` (sin distinguir mayúsculas).
- `calcularPD(respuestas, items, itemInicial, itemFinal)` — **Puntuación Directa**: cuenta las
  respuestas correctas cuyos ítems caen dentro del rango de la forma.
- `calcularVOCT(pdVoc1, pdVoc2)` — suma las PD de las dos formas.
- `obtenerPT(pd, entradas)` — **Puntuación Típica** (percentil): busca en el baremo la entrada cuyo
  rango `[pd_min, pd_max]` contiene la PD y devuelve su percentil.
- `generarInterpretacion(puntuaciones)` — (privado) genera el texto interpretativo según el
  percentil de VOCT.
- `calificar(...)` — orquesta lo anterior: PD de Forma A → **VOC1**, PD de Forma B → **VOC2**,
  suma → **VOCT**; convierte cada PD a percentil y arma las tres puntuaciones + el texto.

### Controllers (`controllers/`) — entrada/salida HTTP

Reciben el service en el constructor. Cada método: lee `req.body`/`req.params`, llama al service,
responde con JSON y, si algo falla, captura el error y responde `{ error: mensaje }` con el código
adecuado (`400` en operaciones de escritura, `404` en lecturas que no encuentran).

- **`EvaluadoController`** — `crear` → `POST /api/evaluados`.
- **`AplicacionTestController`** — `crear`, `obtenerFormas`, `calificar`, `obtenerResultado`.
  (Usa tanto `AplicacionTestService` como `ResultadoService`.)

### Rutas (`routes/index.ts`)

`buildApiRouter(evaluadoController, aplicacionController)` crea el `Router` de Express y asocia
cada ruta a un método de controller. Se monta bajo `/api` en `server.ts`.

---

## 5. Modelo de datos (resumen)

11 tablas en `proyecto_poo`:

| Tabla | Rol | La escribe |
|---|---|---|
| `evaluado` | Persona evaluada | API |
| `forma_vocabulario` | Forma del test (A, B, ...) | OpenXava |
| `item` | Pregunta (palabra estímulo + letra correcta) | OpenXava |
| `opcion` | Opción A–E de un ítem (letra + texto) | OpenXava |
| `tabla_normas` | Versión del baremo | OpenXava |
| `entrada_baremo` | Rango PD → percentil por factor | OpenXava |
| `configuracion_examen` | Qué 2 formas + baremo usar (flag `activa`) | OpenXava |
| `aplicacion_test` | Sesión de examen (snapshot de formas + baremo) | API |
| `respuesta` | Respuesta marcada por ítem | API |
| `resultado_vocabulario` | Resultado de una aplicación | API |
| `puntuacion` | PD y PT por factor (VOC1/VOC2/VOCT) | API |

---

## 6. Endpoints

Todos cuelgan de `/api`. Body y respuesta en JSON. Errores: `{ "error": "mensaje" }`.

### `POST /api/evaluados`
Registra al evaluado.
```jsonc
// body (CrearEvaluadoDTO)
{ "nombre": "Ana", "primer_apellido": "Lopez", "sexo": "F" }
// 201 → Evaluado
{ "id_evaluado": 1, "nombre": "Ana", "primer_apellido": "Lopez", ... }
```

### `POST /api/aplicaciones`
Crea la sesión. Toma formas y baremo de la **configuración activa**.
```jsonc
// body (CrearAplicacionDTO)
{ "id_evaluado": 1, "finalidad": "Evaluacion academica" }
// 201 → AplicacionTest
{ "id_aplicacion": 1, "id_forma_a": 1, "id_forma_b": 2, "id_normas": 1, "estado": "ASIGNADO", ... }
```

### `GET /api/aplicaciones/:id/formas`
Devuelve las dos formas con sus ítems y opciones (sin respuestas correctas). Cambia el estado a `EN_PROGRESO`.
```jsonc
{
  "forma_a": {
    "forma": { "id_forma": 1, "titulo": "VOCABULARIO - Forma A", "tiempo_limite_seg": 300, ... },
    "items": [
      { "id_item": 1, "numero": 1, "palabra_estimulo": "GRAMA",
        "opciones": [ { "letra": "A", "texto": "pastizal" }, { "letra": "B", "texto": "cesped" }, ... ] }
    ]
  },
  "forma_b": { "forma": { ... }, "items": [ ... ] }
}
```

### `POST /api/aplicaciones/:id/calificar`
Recibe **todas** las respuestas (de ambas formas), corrige y calcula.
```jsonc
// body (CalificarAplicacionDTO)
{ "respuestas": [ { "id_item": 1, "letra_marcada": "B" }, { "id_item": 2, "letra_marcada": "C" } ] }
// 200 → ResultadoDTO
{
  "id_resultado": 1,
  "texto_interpretativo": "Vocabulario muy alto. ...",
  "puntuaciones": [
    { "factor": "VOC1", "puntuacion_directa": 4, "puntuacion_tipica": 95 },
    { "factor": "VOC2", "puntuacion_directa": 4, "puntuacion_tipica": 95 },
    { "factor": "VOCT", "puntuacion_directa": 8, "puntuacion_tipica": 95 }
  ]
}
```

### `GET /api/aplicaciones/:id/resultado`
Consulta un resultado ya calculado (mismo `ResultadoDTO`).

---

## 7. Flujo completo de un examen

```
1. POST /evaluados            → INSERT evaluado                          (estado mental: registrado)
2. POST /aplicaciones         → lee config activa, INSERT aplicacion_test (estado: ASIGNADO)
3. GET  /:id/formas           → devuelve forma A y B + ítems              (estado: EN_PROGRESO)
4. (el usuario responde las dos formas en el frontend)
5. POST /:id/calificar        → corrige, INSERT respuestas (lote),
                                 calcula VOC1/VOC2/VOCT, INSERT resultado
                                 + puntuaciones                           (estado: CALIFICADO)
6. GET  /:id/resultado        → consulta el resultado guardado
```

---

## 8. Cómo se calcula el puntaje (detalle)

```
PD (Puntuación Directa) de una forma = nº de respuestas correctas dentro del rango de ítems
VOC1 = PD de la Forma A
VOC2 = PD de la Forma B
VOCT = VOC1 + VOC2
PT (Puntuación Típica) = percentil del baremo cuyo rango [pd_min, pd_max] contiene la PD
```

La interpretación textual se decide por el percentil de VOCT (muy alto ≥75, alto ≥50, medio ≥25, bajo <25).

> El modelo asume **exactamente dos formas** por examen. Cuáles dos (y qué baremo) lo decide la
> `configuracion_examen` activa, configurada desde OpenXava.

---

## 9. Manejo de errores

- Los **servicios** lanzan `Error` con mensajes en español ante datos inválidos o entidades inexistentes.
- Los **controllers** los capturan y responden `{ "error": mensaje }` con `400` (escrituras) o `404` (lecturas).
- La validación es a nivel de servicio (no hay middleware de validación todavía).
