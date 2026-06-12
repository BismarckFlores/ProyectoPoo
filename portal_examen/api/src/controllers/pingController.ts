import { Request, Response } from 'express';

export function getPing(_req: Request, res: Response): void {
  res.json({ ok: true, time: Date.now() });
}

