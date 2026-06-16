package ni.edu.uam.panel_administracion.modelo;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Respuesta marcada por el evaluado para un item. La registra la API al calificar.
 */

@Entity
@Table(name = "respuesta")
@Getter @Setter
public class Respuesta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    int idRespuesta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aplicacion")
    @ReadOnly
    AplicacionTest aplicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_item")
    @ReadOnly
    Item item;

    @Column(name = "letra_marcada", length = 1)
    @ReadOnly
    String letraMarcada;

    @Column(name = "es_correcta")
    @ReadOnly
    Boolean esCorrecta;
}
