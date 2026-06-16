package ni.edu.uam.panel_administracion.modelo;

import java.util.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Version del baremo con sus entradas (rangos de PD a percentil por factor).
 * Se configura desde este panel; la API la usa para calcular las puntuaciones tipicas.
 */

@Entity
@Table(name = "tabla_normas")
@Getter @Setter
public class TablaNormas {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_normas")
    int idNormas;

    @Column(name = "version", length = 50) @Required
    String version;

    @OneToMany(mappedBy = "tablaNormas", cascade = CascadeType.ALL)
    @AsEmbedded
    @ListProperties("factor, pdMin, pdMax, percentil")
    Collection<EntradaBaremo> entradas;
}
