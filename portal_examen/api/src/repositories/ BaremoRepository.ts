import { Pool } from 'pg';

export type EntradaBaremo = {
    id_entrada: number;
    id_normas: number;
    factor: string;
    pd_min: number;
    pd_max: number;
    percentil: number;
};

export class BaremoRepository {
    constructor(private readonly pool: Pool) {}

    async findByNormasYFactor(idNormas: number, factor: string): Promise<EntradaBaremo[]> {
        const { rows } = await this.pool.query<EntradaBaremo>(
            'SELECT * FROM entrada_baremo WHERE id_normas = $1 AND factor = $2 ORDER BY pd_min ASC',
            [idNormas, factor]
        );
        return rows;
    }
}