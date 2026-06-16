package ni.edu.uam.panel_administracion.modelo;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Entrada del baremo: un rango de puntuacion directa (PD) que corresponde a un percentil.
 */

@Entity
@Table(name = "entrada_baremo")
@Getter @Setter
public class EntradaBaremo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrada")
    int idEntrada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_normas")
    @Required
    TablaNormas tablaNormas;

    @Column(name = "factor", length = 10) @Required
    String factor; // VOC1 | VOC2 | VOCT

    @Column(name = "pd_min")
    Integer pdMin;

    @Column(name = "pd_max")
    Integer pdMax;

    @Column(name = "percentil")
    Integer percentil;
}