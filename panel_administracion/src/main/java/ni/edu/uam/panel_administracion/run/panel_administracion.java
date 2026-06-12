package ni.edu.uam.panel_administracion.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class panel_administracion {

	public static void main(String[] args) throws Exception {
		DBServer.start("panel_administracion-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("panel_administracion"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
