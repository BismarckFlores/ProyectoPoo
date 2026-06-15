import { Pool } from 'pg';
import { Respuesta, RegistrarRespuestaDTO } from '../types/respuesta';

export class RespuestaRepository {
    constructor(private readonly pool: Pool) {
    }

    async create(idAplicacion: number, dto: RegistrarRespuestaDTO, esCorrecta: boolean): Promise<Respuesta> {
        const {rows} = await this.pool.query<Respuesta>(
            `INSERT INTO respuesta (id_aplicacion, id_item, letra_marcada, es_correcta)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [idAplicacion, dto.id_item, dto.letra_marcada, esCorrecta]
        );
        return rows[0];
    }

    async findByAplicacion(idAplicacion: number): Promise<Respuesta[]> {
        const {rows} = await this.pool.query<Respuesta>(
            'SELECT * FROM respuesta WHERE id_aplicacion = $1',
            [idAplicacion]
        );
        return rows;
    }
}