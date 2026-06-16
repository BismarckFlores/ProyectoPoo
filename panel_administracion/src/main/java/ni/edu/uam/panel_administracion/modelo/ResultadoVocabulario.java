package ni.edu.uam.panel_administracion.modelo;

import java.util.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Resultado de una aplicacion con sus puntuaciones. Lo genera la API al calificar.
 */

@Entity
@Table(name = "resultado_vocabulario")
@Getter @Setter
public class ResultadoVocabulario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    int idResultado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aplicacion")
    @ReadOnly
    AplicacionTest aplicacion;

    @Column(name = "texto_interpretativo", columnDefinition = "text") @Stereotype("MEMO")
    @ReadOnly
    String textoInterpretativo;

    @OneToMany(mappedBy = "resultado")
    @ListProperties("factor, puntuacionDirecta, puntuacionTipica")
    @ReadOnly
    Collection<Puntuacion> puntuaciones;
}
