import { Pool } from "pg";
import { Evaluado, CrearEvaluadoDTO } from "../types/evaluado";

export class EvaluadoRepository {
    constructor(private readonly pool : Pool) {}

    async create(dto : CrearEvaluadoDTO) : Promise<Evaluado> {
        const { rows } = await this.pool.query<Evaluado>(
            `INSERT INTO evaluado (primer_apellido, segundo_apellido, nombre, fecha_nacimiento, sexo, estudios)                                                                                                                         
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [dto.primer_apellido, dto.segundo_apellido ?? null, dto.nombre,
            dto.fecha_nacimiento ?? null, dto.sexo ?? null, dto.estudios ?? null]
        );
        return rows[0];
    }

    async findById(id: number): Promise<Evaluado | null> {
        const { rows } = await this.pool.query<Evaluado>(
            'SELECT * FROM evaluado WHERE id_evaluado = $1',
            [id]
        );
        return rows[0] ?? null;
    }
}