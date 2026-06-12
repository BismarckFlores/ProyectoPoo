import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { createPool } from './db/pool';
import { ensureSchema } from './db/schema';
import { SubmissionService } from './services/submissionService';
import { SubmissionController } from './controllers/submissionController';
import { buildApiRouter } from './routes';

const app = express();
const pool = createPool();
const submissionService = new SubmissionService(pool);
const submissionController = new SubmissionController(submissionService);

app.use(express.json());
app.use(cors({ origin: env.webOrigin }));
app.use('/api', buildApiRouter(submissionController));

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

