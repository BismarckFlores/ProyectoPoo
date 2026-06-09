package ni.edu.uam.ProyectoPoo.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class ProyectoPoo {

	public static void main(String[] args) throws Exception {
		DBServer.start("ProyectoPoo-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("ProyectoPoo"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
