package ni.edu.uam.panel_administracion.modelo;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Puntuacion de un factor (VOC1, VOC2 o VOCT): directa y tipica. La genera la API.
 */

@Entity
@Table(name = "puntuacion")
@Getter @Setter
public class Puntuacion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puntuacion")
    int idPuntuacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_resultado")
    @ReadOnly
    ResultadoVocabulario resultado;

    @Column(name = "factor", length = 10)
    @ReadOnly
    String factor;

    @Column(name = "puntuacion_directa")
    @ReadOnly
    Integer puntuacionDirecta;

    @Column(name = "puntuacion_tipica")
    @ReadOnly
    Integer puntuacionTipica;
}
