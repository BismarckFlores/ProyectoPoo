import { Pool } from 'pg';
import { FormaVocabulario } from '../types/forma';

export class FormaRepository {
    constructor(private readonly pool: Pool) {}

    async findById(id: number): Promise<FormaVocabulario | null> {
        const { rows } = await this.pool.query<FormaVocabulario>(
            'SELECT * FROM forma_vocabulario WHERE id_forma = $1',
            [id]
        );
        return rows[0] ?? null;
    }

    async findByTipo(tipo: string): Promise<FormaVocabulario | null> {
        const { rows } = await this.pool.query<FormaVocabulario>(
            'SELECT * FROM forma_vocabulario WHERE tipo = $1 LIMIT 1',
            [tipo]
        );
        return rows[0] ?? null;
    }
}