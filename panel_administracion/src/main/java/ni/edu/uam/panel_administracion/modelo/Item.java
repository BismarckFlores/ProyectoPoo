package ni.edu.uam.panel_administracion.modelo;

import java.util.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Pregunta de una forma: palabra estimulo, sus opciones (A-E) y la letra correcta.
 */

@Entity
@Table(name = "item")
@Getter @Setter
public class Item {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    int idItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forma")
    @Required
    FormaVocabulario forma;

    @Column(name = "numero") @Required
    int numero;

    @Column(name = "palabra_estimulo", length = 100)
    String palabraEstimulo;

    @Column(name = "respuesta_correcta", length = 1) @Required
    String respuestaCorrecta; // letra de la opcion correcta: A, B, C, D o E

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    @AsEmbedded
    @ListProperties("letra, texto")
    @OrderBy("letra")
    Collection<Opcion> opciones;
}
