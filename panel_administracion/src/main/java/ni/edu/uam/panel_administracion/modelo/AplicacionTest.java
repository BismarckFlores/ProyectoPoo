package ni.edu.uam.panel_administracion.modelo;

import java.time.*;
import java.util.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Sesion de test de un evaluado sobre las dos formas (A y B).
 * La gestiona la API; aqui se consulta su estado, el historial de respuestas y el resultado.
 */

@Entity
@Table(name = "aplicacion_test")
@Getter @Setter
@Tab(properties = "idAplicacion, evaluado.nombre, evaluado.primerApellido, fechaExamen, estado")
public class AplicacionTest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aplicacion")
    int idAplicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluado")
    @ReadOnly
    Evaluado evaluado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forma_a")
    @ReadOnly
    FormaVocabulario formaA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forma_b")
    @ReadOnly
    FormaVocabulario formaB;

    @Column(name = "fecha_examen")
    @ReadOnly
    LocalDate fechaExamen;

    @Column(name = "finalidad", length = 200)
    @ReadOnly
    String finalidad;

    @Column(name = "estado", length = 20)
    @ReadOnly
    String estado; // ASIGNADO | EN_PROGRESO | FINALIZADO | CALIFICADO

    @OneToMany(mappedBy = "aplicacion")
    @ListProperties("item.numero, item.palabraEstimulo, letraMarcada, esCorrecta")
    @ReadOnly
    Collection<Respuesta> respuestas;

    @OneToOne(mappedBy = "aplicacion", fetch = FetchType.LAZY)
    @ReadOnly
    ResultadoVocabulario resultado;
}
