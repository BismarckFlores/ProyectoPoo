import { Pool } from 'pg';
import { Item } from '../types/forma';

export class ItemRepository {
    constructor(private readonly pool: Pool) {}

    async findByForma(idForma: number): Promise<Item[]> {
        const { rows } = await this.pool.query<Item>(
            'SELECT * FROM item WHERE id_forma = $1 ORDER BY numero ASC',
            [idForma]
        );
        return rows;
    }
}