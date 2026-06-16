package ni.edu.uam.panel_administracion.modelo;

import javax.persistence.*;

import org.openxava.annotations.*;

import lombok.*;

/**
 * Configuracion del examen: define que dos formas y que baremo usa la API.
 * Marca una como 'activa' para que sea la vigente.
 */

@Entity
@Table(name = "configuracion_examen")
@Getter @Setter
@Tab(properties = "nombre, formaA.titulo, formaB.titulo, tablaNormas.version, activa")
public class ConfiguracionExamen {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    int idConfig;

    @Column(name = "nombre", length = 100) @Required
    String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forma_a") @Required
    FormaVocabulario formaA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forma_b") @Required
    FormaVocabulario formaB;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_normas") @Required
    TablaNormas tablaNormas;

    @Column(name = "activa")
    boolean activa;
}
