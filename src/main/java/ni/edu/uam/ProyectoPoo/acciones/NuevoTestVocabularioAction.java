package ni.edu.uam.ProyectoPoo.acciones;

import org.openxava.actions.NewAction;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NuevoTestVocabularioAction extends NewAction {
    @Override
    public void execute() throws Exception {
        super.execute();

        List<Map<String, Object>> valoresVoc1 = new ArrayList<>();
        for (int i = 1; i <= 37; i++) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("numeroItem", i);
            valoresVoc1.add(fila);
        }
        getView().setValue("respuestasVoc1", valoresVoc1);

        List<Map<String, Object>> valoresVoc2 = new ArrayList<>();
        for (int i = 41; i <= 77; i++) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("numeroItem", i);
            valoresVoc2.add(fila);
        }
        getView().setValue("respuestasVoc2", valoresVoc2);
    }
}
