import { Pool } from 'pg';
import { Item, Opcion } from '../types/forma';

export class ItemRepository {
    constructor(private readonly pool: Pool) {}

    async findByForma(idForma: number): Promise<Item[]> {
        const { rows: items } = await this.pool.query<Item>(
            'SELECT * FROM item WHERE id_forma = $1 ORDER BY numero ASC',
            [idForma]
        );
        if (items.length === 0) return [];

        // Cargar todas las opciones de los ítems de esta forma en una sola query.
        const { rows: opciones } = await this.pool.query<Opcion>(
            `SELECT o.* FROM opcion o
             JOIN item i ON i.id_item = o.id_item
             WHERE i.id_forma = $1
             ORDER BY o.letra ASC`,
            [idForma]
        );

        const opcionesPorItem = new Map<number, Opcion[]>();
        opciones.forEach(o => {
            const lista = opcionesPorItem.get(o.id_item) ?? [];
            lista.push(o);
            opcionesPorItem.set(o.id_item, lista);
        });

        items.forEach(it => { it.opciones = opcionesPorItem.get(it.id_item) ?? []; });
        return items;
    }
}
