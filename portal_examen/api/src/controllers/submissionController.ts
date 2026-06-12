import { Request, Response } from 'express';
import { SubmissionService } from '../services/submissionService';
import { SubmitBody } from '../types/submission';

export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  listSubmissions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await this.submissionService.listAll();
      res.json(rows);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  };

  createSubmission = async (req: Request<unknown, unknown, SubmitBody>, res: Response): Promise<void> => {
    const { name, score } = req.body || {};

    if (typeof score !== 'number') {
      res.status(400).json({ error: 'score must be a number' });
      return;
    }

    try {
      const row = await this.submissionService.create(typeof name === 'string' ? name : 'Anonimo', score);
      res.status(201).json(row);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  };
}

