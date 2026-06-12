import { Pool } from 'pg';
import { Submission } from '../types/submission';

export class SubmissionService {
  constructor(private readonly pool: Pool) {}

  async listAll(): Promise<Submission[]> {
    const { rows } = await this.pool.query<Submission>('SELECT * FROM submissions ORDER BY created_at DESC');
    return rows;
  }

  async create(name: string, score: number): Promise<Submission> {
    const safeName = name.trim().length > 0 ? name : 'Anonimo';
    const { rows } = await this.pool.query<Submission>(
      'INSERT INTO submissions (name, score) VALUES ($1, $2) RETURNING *',
      [safeName, score]
    );
    return rows[0];
  }
}

