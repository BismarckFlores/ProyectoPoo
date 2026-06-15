import { Router } from 'express';
import { EvaluadoController } from "../controllers/EvaluadoController";
import { AplicacionTestController } from "../controllers/AplicacionTestController";

export function buildApiRouter(
    evaluadoController: EvaluadoController,
    aplicacionController: AplicacionTestController,
): Router {
  const router = Router();

  router.post("/evaluados", evaluadoController.crear);

  router.post('/aplicaciones', aplicacionController.crear);
  router.get('/aplicaciones/:id/formas', aplicacionController.obtenerFormas);
  router.post('/aplicaciones/:id/calificar', aplicacionController.calificar);
  router.get('/aplicaciones/:id/resultado', aplicacionController.obtenerResultado);

  return router;
}
