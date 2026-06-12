import { Router } from 'express';
import { getPing } from '../controllers/pingController';
import { SubmissionController } from '../controllers/submissionController';

export function buildApiRouter(submissionController: SubmissionController): Router {
  const router = Router();

  router.get('/ping', getPing);
  router.get('/submissions', submissionController.listSubmissions);
  router.post('/submit', submissionController.createSubmission);

  return router;
}

