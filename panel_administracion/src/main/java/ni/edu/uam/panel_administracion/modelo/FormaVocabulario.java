package ni.edu.uam.panel_administracion.modelo;

import java.util.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Forma del test de vocabulario (tipo 'A' o 'B') con sus items.
 * Se configura desde este panel; la API la lee para presentar el examen.
 */

@Entity
@Table(name = "forma_vocabulario")
@Getter @Setter
public class FormaVocabulario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_forma")
    int idForma;

    @Column(name = "tipo", length = 1) @Required
    String tipo; // 'A' o 'B'

    @Column(name = "titulo", length = 100) @Required
    String titulo;

    @Column(name = "tiempo_limite_seg")
    Integer tiempoLimiteSeg;

    @Column(name = "item_inicial")
    Integer itemInicial;

    @Column(name = "item_final")
    Integer itemFinal;

    @Column(name = "instrucciones", columnDefinition = "text") @Stereotype("MEMO")
    String instrucciones;

    @OneToMany(mappedBy = "forma", cascade = CascadeType.ALL)
    @AsEmbedded
    @ListProperties("numero, palabraEstimulo, respuestaCorrecta")
    @OrderBy("numero")
    Collection<Item> items;
}