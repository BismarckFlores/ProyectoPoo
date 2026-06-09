package ni.edu.uam.ProyectoPoo.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Entity
@Getter
@Setter
@View(members =
        "Datos Personales{" +
                "nombre;" +
                "primerApellido, segundoApellido;" +
                "fechaNacimiento, edad;" +
                "sexo;" +
                "estudiosRealizados;" +
                "profesion" +
        "}" +
        "Tests Tomados { testsVocabulario }"
)
public class Sujeto extends Identificable {

    @Required
    @Column(length = 100)
    private String nombre;

    @Required
    @Column(length = 100)
    private String primerApellido;

    @Column(length = 100)
    private String segundoApellido;

    @Required
    private LocalDate fechaNacimiento;

    @Required
    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Stereotype("MEMO")
    private String estudiosRealizados;

    @Column(length = 150)
    private String profesion;

    @ReadOnly @Hidden
    @Depends("fechaNacimiento")
    public Integer getEdad() {
        if (fechaNacimiento == null) return null;

        return Period.between(
                fechaNacimiento,
                LocalDate.now()
        ).getYears();
    }

    @ReadOnly @Hidden
    public String getNombreCompleto() {
        return String.format("%s %s %s",
                        nombre != null ? nombre : "",
                        primerApellido != null ? primerApellido : "",
                        segundoApellido != null ? segundoApellido : "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    @OneToMany(mappedBy = "sujeto")
    @ReadOnly
    @CollectionView("preview")
    private List<TestVocabulario> testsVocabulario;
}