# Plan — Panel de Administración (panel_administracion)

Stack: OpenXava + JPA + Lombok + PostgreSQL

Seguir siempre las convenciones de `AGENTS.md`:
- `@Getter @Setter` de Lombok, campos sin `private`
- `@ElementCollection` + `@Embeddable` para colecciones maestro-detalle
- No `@OneToMany` ni getters/setters manuales

## Paso 1 — Conectar a PostgreSQL compartida

Editar `src/main/webapp/META-INF/context.xml` para apuntar a la misma DB que usa la API:

```xml
<Resource name="jdbc/panel_administracionDB"
    url="jdbc:postgresql://localhost:5432/proyecto_poo"
    driverClassName="org.postgresql.Driver"
    username="..." password="..."
    ... />
```

Y en `panel_administracion.java` comentar la línea `DBServer.start(...)` para no levantar la DB embebida.

## Paso 2 — Entidades de configuración (OpenXava escribe)

### `Item` (`@Embeddable`)
Detalle de `FormaVocabulario`. No tiene `@Id` propio.

```java
@Embeddable @Getter @Setter
public class Item {
    int numero;
    @Column(length=100) String palabraEstimulo;
    @Column(length=1)   String respuestaCorrecta;
}
```

### `FormaVocabulario`
Entidad principal de configuración. Contiene los ítems como colección embebida.

```java
@Entity @Getter @Setter
public class FormaVocabulario extends Identifiable {
    @Column(length=1) @Required
    String tipo;           // "A" o "B"

    @Column(length=100) @Required
    String titulo;

    int tiempoLimiteSeg;
    int itemInicial;
    int itemFinal;

    @Lob
    String instrucciones;

    @ElementCollection
    @ListProperties("numero, palabraEstimulo, respuestaCorrecta")
    List<Item> items;
}
```

### `EntradaBaremo` (`@Embeddable`)
Detalle de `TablaNormas`.

```java
@Embeddable @Getter @Setter
public class EntradaBaremo {
    @Column(length=10) String factor;   // VOC1 | VOC2 | VOCT
    int pdMin;
    int pdMax;
    int percentil;
}
```

### `TablaNormas`
```java
@Entity @Getter @Setter
public class TablaNormas extends Identifiable {
    @Column(length=50) @Required
    String version;

    @ElementCollection
    @ListProperties("factor, pdMin, pdMax, percentil")
    List<EntradaBaremo> entradas;
}
```

## Paso 3 — Entidades de solo lectura (API escribe, OpenXava visualiza)

Estas entidades se mapean a tablas que la API crea y llena. OpenXava solo las lee.

### `Evaluado`
```java
@Entity @Getter @Setter
public class Evaluado extends Identifiable {
    @Column(length=50) String primerApellido;
    @Column(length=50) String segundoApellido;
    @Column(length=50) String nombre;
    LocalDate fechaNacimiento;
    @Column(length=1)  String sexo;
    @Column(length=100) String estudios;
}
```

### `Puntuacion` (`@Embeddable`)
```java
@Embeddable @Getter @Setter
public class Puntuacion {
    @Column(length=10) String factor;
    int puntuacionDirecta;
    int puntuacionTipica;
}
```

### `Respuesta` (`@Embeddable`)
Para visualizar el historial de respuestas dentro de una aplicación.
```java
@Embeddable @Getter @Setter
public class Respuesta {
    int numeroItem;
    @Column(length=1) String letraMarcada;
    boolean esCorrecta;
}
```

### `ResultadoVocabulario`
```java
@Entity @Getter @Setter
public class ResultadoVocabulario extends Identifiable {
    @Lob String textoInterpretativo;

    @ElementCollection
    @ListProperties("factor, puntuacionDirecta, puntuacionTipica")
    List<Puntuacion> puntuaciones;
}
```

### `AplicacionTest`
Vista completa: quién hizo qué test, en qué estado, con qué respuestas y resultado.
```java
@Entity @Getter @Setter
public class AplicacionTest extends Identifiable {
    LocalDate fechaExamen;
    @Column(length=200) String finalidad;
    @Column(length=20)  String estado;

    @ManyToOne @Required
    Evaluado evaluado;

    @ManyToOne @Required
    FormaVocabulario forma;

    @ElementCollection
    @ListProperties("numeroItem, letraMarcada, esCorrecta")
    List<Respuesta> respuestas;

    @OneToOne
    ResultadoVocabulario resultado;
}
```

## Paso 4 — Módulos y vistas en OpenXava

OpenXava genera la UI automáticamente a partir de las entidades. No requiere código extra, pero se puede refinar con anotaciones:

- `@Tab` — columnas visibles en la lista
- `@View` — agrupar campos en la vista detalle
- `@ReadOnly` — marcar campos que la API escribe (no editables en el panel)

Entidades que van como módulos navegables:
| Módulo | Acción permitida |
|---|---|
| FormaVocabulario | CRUD completo |
| TablaNormas | CRUD completo |
| AplicacionTest | Crear (asignar), ver detalle con respuestas y resultado |
| Evaluado | Solo lectura |
| ResultadoVocabulario | Solo lectura |

## Orden de implementación

```
Conectar PostgreSQL → Item + FormaVocabulario → EntradaBaremo + TablaNormas
→ Evaluado (read-only) → Respuesta + Puntuacion (embeddables read-only)
→ ResultadoVocabulario → AplicacionTest (vista completa)
```
