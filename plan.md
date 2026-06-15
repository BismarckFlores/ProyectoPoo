# Plan de Acción — BFA Módulo de Vocabulario

## Visión general del sistema

Cuatro componentes que comparten una única base de datos PostgreSQL:

```
Frontend HTML          API Express/TS         OpenXava (Java)       PostgreSQL
(portal_examen/web)    (portal_examen/api)    (panel_administracion) (fuente de verdad)

Evaluado se            Computa el test,        Configura formas,      Tablas compartidas
registra aquí.  ────►  registra respuestas, ─► items y baremo.    ◄──────────────────
Test se                genera resultados       Lee resultados e
ejecuta aquí.          y feedback.             historial.
```

## Roles por componente

| Componente | Escribe | Solo lee |
|---|---|---|
| Frontend | `evaluado`, `respuesta`, estado de `aplicacion_test` | `forma_vocabulario`, `item` |
| API | `evaluado`, `aplicacion_test`, `respuesta`, `resultado_vocabulario`, `puntuacion` | `forma_vocabulario`, `item`, `tabla_normas`, `entrada_baremo` |
| OpenXava | `forma_vocabulario`, `item`, `tabla_normas`, `entrada_baremo`, `aplicacion_test` (asignación) | `evaluado`, `respuesta`, `resultado_vocabulario`, `puntuacion` |

## Base de datos — 9 tablas

| Tabla | Dueño de escritura | Descripción |
|---|---|---|
| `evaluado` | API / Frontend | Persona que rinde el test |
| `aplicacion_test` | API + OpenXava | Sesión de test (OpenXava asigna, API actualiza estado) |
| `forma_vocabulario` | OpenXava | Forma A o B con su configuración |
| `item` | OpenXava | Pregunta con palabra estímulo y respuesta correcta |
| `respuesta` | API | Letra marcada por el evaluado en cada ítem |
| `resultado_vocabulario` | API | Resultado final de la aplicación |
| `puntuacion` | API | PD y PT por factor (VOC1, VOC2, VOCT) |
| `tabla_normas` | OpenXava | Versión del baremo |
| `entrada_baremo` | OpenXava | Rango PD → percentil por factor |

`EstadoTest` es un enum — columna `estado` dentro de `aplicacion_test`.  
`MotorCorreccion` es lógica pura — sin tabla.

## Flujo de una sesión

```
1. Evaluado se registra en el frontend
        → API POST /api/evaluados → INSERT evaluado

2. Evaluado inicia el test
        → API POST /api/aplicaciones → INSERT aplicacion_test (estado: EN_PROGRESO)
        → API GET /api/aplicaciones/:id/forma → devuelve items al frontend

3. Evaluado responde ítem por ítem
        → API POST /api/aplicaciones/:id/respuestas → INSERT respuesta

4. Evaluado finaliza
        → API POST /api/aplicaciones/:id/calificar
        → MotorCorreccion calcula PD, VOCT, PT
        → INSERT resultado_vocabulario + puntuacion
        → Devuelve feedback al frontend

5. Admin ve en OpenXava
        → Historial de respuestas por aplicacion
        → Resultados y puntuaciones
```

## Orden de desarrollo

### Fase 1 — API (trabajo actual)
Ver `portal_examen/PLAN.md`

### Fase 2 — OpenXava
Ver `panel_administracion/PLAN.md`

### Fase 3 — Frontend
- Registro de Evaluado (form → POST /api/evaluados)
- Inicio de test (GET forma + items, render dinámico)
- Envío de respuestas ítem a ítem
- Pantalla de resultados con feedback
