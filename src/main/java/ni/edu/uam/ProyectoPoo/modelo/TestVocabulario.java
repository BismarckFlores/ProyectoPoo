package ni.edu.uam.ProyectoPoo.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@View(members =
        "Datos Generales[" +
                "sujeto;" +
                "fechaExamen;" +
                "finalidad;" +
                "evaluador" +
                "];" +
                "Respuestas[" +
                "respuestas" +
                "];"

)
public class TestVocabulario extends Identificable {

    @ManyToOne(optional = false)
    @Required
    @DescriptionsList
    private Sujeto sujeto;

    @Required
    private LocalDate fechaExamen;

    @Required
    @Column(length = 200)
    private String finalidad;

    @Required
    @Column(length = 100)
    private String evaluador;

    @ElementCollection
    @ListProperties("numeroItem, respuestamarcada")
    private java.util.List<RespuestaItem> respuestas = new java.util.ArrayList<>();

    public TestVocabulario() {
        for (int i = 0; i < 77; i++) {

            RespuestaItem item = new RespuestaItem();
            item.setNumeroItem(i+1);

            respuestas.add(item);
        }
    }
}
