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
        "Datos Generales{" +
                "sujeto;" +
                "fechaExamen;" +
                "finalidad;" +
                "evaluador;" +
        "}" +
        "Respuestas{" +
                "respuestasVoc1," +
                "respuestasVoc2;" +
        "}"
)
@View(name = "preview",
        members =
                "fechaExamen;" +
                "finalidad;" +
                "evaluador;"
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
    @ListProperties("numeroItem, alternativa")
    private java.util.List<RespuestaItem> respuestasVoc1 = new java.util.ArrayList<>();

    @ElementCollection
    @ListProperties("numeroItem, alternativa")
    private java.util.List<RespuestaItem> respuestasVoc2 = new java.util.ArrayList<>();
}