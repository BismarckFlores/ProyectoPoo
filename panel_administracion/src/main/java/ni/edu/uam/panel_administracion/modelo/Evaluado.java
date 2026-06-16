package ni.edu.uam.panel_administracion.modelo;

import java.time.*;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Persona que rinde el test. La crea la API desde el frontend; aqui solo se consulta.
 */

@Entity
@Table(name = "evaluado")
@Getter @Setter
public class Evaluado {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluado")
    int idEvaluado;

    @Column(name = "primer_apellido", length = 50) @Required
    String primerApellido;

    @Column(name = "segundo_apellido", length = 50)
    String segundoApellido;

    @Column(name = "nombre", length = 50) @Required
    String nombre;

    @Column(name = "fecha_nacimiento")
    LocalDate fechaNacimiento;

    @Column(name = "sexo", length = 1)
    String sexo;

    @Column(name = "estudios", length = 100)
    String estudios;
}
