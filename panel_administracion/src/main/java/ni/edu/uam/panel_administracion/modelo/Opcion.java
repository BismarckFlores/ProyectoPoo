package ni.edu.uam.panel_administracion.modelo;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Opcion de respuesta de un item (letra A-E con su palabra).
 * Ej: para el item "GRAMA" -> A. pastizal, B. cesped, C. hierba...
 */

@Entity
@Table(name = "opcion")
@Getter @Setter
public class Opcion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opcion")
    int idOpcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_item")
    @Required
    Item item;

    @Column(name = "letra", length = 1) @Required
    String letra; // A, B, C, D, E

    @Column(name = "texto", length = 150) @Required
    String texto;
}