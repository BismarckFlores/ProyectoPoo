# Plan — API (portal_examen/api)

Stack: Express + TypeScript + PostgreSQL (node-postgres)

## Paso 1 — Schema de base de datos (`src/db/schema.ts`)

Reemplazar el schema actual con las 9 tablas reales del sistema.

```
evaluado
├── id_evaluado       SERIAL PK
├── primer_apellido   VARCHAR(50)
├── segundo_apellido  VARCHAR(50)
├── nombre            VARCHAR(50)
├── fecha_nacimiento  DATE
├── sexo              CHAR(1)
└── estudios          VARCHAR(100)

forma_vocabulario
├── id_forma          SERIAL PK
├── tipo              CHAR(1)          -- 'A' o 'B'
├── titulo            VARCHAR(100)
├── tiempo_limite_seg INT
├── item_inicial      INT
├── item_final        INT
└── instrucciones     TEXT

item
├── id_item           SERIAL PK
├── id_forma          FK → forma_vocabulario
├── numero            INT
├── palabra_estimulo  VARCHAR(100)
└── respuesta_correcta CHAR(1)

aplicacion_test
├── id_aplicacion     SERIAL PK
├── id_evaluado       FK → evaluado
├── id_forma          FK → forma_vocabulario
├── fecha_examen      DATE
├── finalidad         VARCHAR(200)
└── estado            VARCHAR(20)      -- ASIGNADO | EN_PROGRESO | FINALIZADO | CALIFICADO

respuesta
├── id_respuesta      SERIAL PK
├── id_aplicacion     FK → aplicacion_test
├── id_item           FK → item
├── letra_marcada     CHAR(1)
└── es_correcta       BOOLEAN

resultado_vocabulario
├── id_resultado      SERIAL PK
├── id_aplicacion     FK → aplicacion_test  UNIQUE
└── texto_interpretativo TEXT

puntuacion
├── id_puntuacion     SERIAL PK
├── id_resultado      FK → resultado_vocabulario
├── factor            VARCHAR(10)      -- VOC1 | VOC2 | VOCT
├── puntuacion_directa  INT
└── puntuacion_tipica   INT

tabla_normas
├── id_normas         SERIAL PK
└── version           VARCHAR(50)

entrada_baremo
├── id_entrada        SERIAL PK
├── id_normas         FK → tabla_normas
├── factor            VARCHAR(10)
├── pd_min            INT
├── pd_max            INT
└── percentil         INT
```

## Paso 2 — Tipos TypeScript (`src/types/`)

Un archivo por entidad de dominio:
- `evaluado.ts` — interfaces Evaluado, CrearEvaluadoDTO
- `aplicacion.ts` — interfaces AplicacionTest, CrearAplicacionDTO, CalificarAplicacionDTO
- `forma.ts` — interfaces FormaVocabulario, Item
- `respuesta.ts` — interfaces Respuesta, RegistrarRespuestaDTO
- `resultado.ts` — interfaces ResultadoVocabulario, Puntuacion, ResultadoDTO

## Paso 3 — Repositorios (`src/repositories/`)

Cada repositorio encapsula las queries SQL de su entidad. Solo SQL, sin lógica de negocio.

- `EvaluadoRepository` — findById, create
- `AplicacionTestRepository` — findById, create, updateEstado
- `FormaRepository` — findById, findByTipo (A o B)
- `ItemRepository` — findByForma (devuelve todos los ítems de una forma)
- `RespuestaRepository` — create, findByAplicacion
- `ResultadoRepository` — create, findByAplicacion
- `BaremoRepository` — findByNormasYFactor, convertirPDaPercentil

## Paso 4 — Motor de corrección (`src/services/MotorCorreccion.ts`)

Lógica pura sin acceso a DB. Recibe datos ya cargados y devuelve resultados.

```
calcularPD(respuestas, itemInicial, itemFinal) → int
  Cuenta respuestas correctas dentro del rango de la forma.

calcularVOCT(pdVoc1, pdVoc2) → int
  Suma PD de Forma A y Forma B.

obtenerPT(factor, pd, entradasBaremo) → int
  Busca en el baremo el percentil correspondiente al PD.

calificar(respuestas, formaA, formaB, entradasBaremo) → ResultadoDTO
  Orquesta los tres métodos anteriores y genera texto interpretativo.
```

## Paso 5 — Servicios (`src/services/`)

Orquestan repositorios y el motor de corrección.

- `EvaluadoService` — validar y crear evaluado
- `AplicacionTestService` — crear aplicación, iniciar (cambiar estado), obtener forma con ítems
- `ResultadoService` — llamar a MotorCorreccion, persistir resultado, devolver ResultadoDTO

## Paso 6 — Controllers y Routes

### Controllers (`src/controllers/`)
- `EvaluadoController` — POST /api/evaluados
- `AplicacionTestController` — POST /api/aplicaciones, GET /api/aplicaciones/:id/forma, POST /api/aplicaciones/:id/respuestas, POST /api/aplicaciones/:id/calificar
- `ResultadoController` — GET /api/aplicaciones/:id/resultado

### Routes (`src/routes/index.ts`)
Registrar todos los controllers en el router principal.

## Paso 7 — Middleware (`src/middleware/`)

- `ValidationMiddleware` — valida body de cada request según el DTO esperado
- `ErrorHandlerMiddleware` — captura errores y devuelve JSON consistente `{ error, message }`
- `NotFoundMiddleware` — 404 para rutas no definidas

## Paso 8 — Configuración (`src/config/`)

- `EnvironmentConfig` — reemplazar `env.ts` actual, exponer variables tipadas (DB_HOST, DB_PORT, etc.)
- `DatabaseConnection` — reemplazar `pool.ts` actual, singleton del pool de conexiones

## Orden de implementación recomendado

```
schema.ts → tipos → repositorios → MotorCorreccion → servicios → controllers → routes → middleware
```

Cada capa depende de la anterior. Los repositorios son testeables de forma independiente.
Los servicios dependen de repositorios. Los controllers solo llaman servicios.
