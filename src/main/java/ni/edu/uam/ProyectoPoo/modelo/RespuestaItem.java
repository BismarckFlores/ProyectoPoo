package ni.edu.uam.ProyectoPoo.modelo;

import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.ReadOnly;

@Embeddable
@Getter @Setter
public class RespuestaItem {
    @ReadOnly
    private int numeroItem;

    @Enumerated(EnumType.STRING)
    private Alternativa alternativa;
}
