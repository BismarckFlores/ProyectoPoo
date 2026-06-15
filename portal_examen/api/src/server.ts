import express from 'express';
import cors from 'cors';
import { env } from "./config/env";
import { createPool } from "./db/pool";
import { ensureSchema } from "./db/schema";
import { buildApiRouter } from "./routes";

import { EvaluadoRepository } from "./repositories/EvaluadoRepository";
import { AplicacionTestRepository } from "./repositories/AplicacionTestRepository";
import { FormaRepository } from "./repositories/FormaRepository";
import { ItemRepository } from "./repositories/ItemRepository";
import { RespuestaRepository } from "./repositories/RespuestaRepository";
import { ResultadoRepository } from "./repositories/ResultadoRepository";
import { BaremoRepository } from "./repositories/BaremoRepository";

import { EvaluadoService } from "./services/EvaluadoService";
import { AplicacionTestService } from "./services/AplicacionTestService";
import { ResultadoService } from "./services/ResultadoService";

import { EvaluadoController } from "./controllers/EvaluadoController";
import { AplicacionTestController } from "./controllers/AplicacionTestController";

const app = express();
const pool = createPool();

const evaluadoRepo       = new EvaluadoRepository(pool);
const aplicacionRepo     = new AplicacionTestRepository(pool);
const formaRepo          = new FormaRepository(pool);
const itemRepo           = new ItemRepository(pool);
const respuestaRepo      = new RespuestaRepository(pool);
const resultadoRepo      = new ResultadoRepository(pool);
const baremoRepo         = new BaremoRepository(pool);

const evaluadoService    = new EvaluadoService(evaluadoRepo);
const aplicacionService  = new AplicacionTestService(aplicacionRepo, evaluadoRepo, formaRepo, itemRepo);
const resultadoService   = new ResultadoService(aplicacionRepo, formaRepo, itemRepo, respuestaRepo, resultadoRepo, baremoRepo);

const evaluadoController    = new EvaluadoController(evaluadoService);
const aplicacionController  = new AplicacionTestController(aplicacionService, resultadoService);

app.use(express.json());
app.use(cors({ origin: env.webOrigin }));
app.use('/api', buildApiRouter(evaluadoController, aplicacionController));

(async () => {
  try {
    await ensureSchema(pool);
    app.listen(env.port, () => {
      console.log(`Server listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();