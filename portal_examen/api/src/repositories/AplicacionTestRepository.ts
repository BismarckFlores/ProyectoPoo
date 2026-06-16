import { Pool } from "pg";
import { AplicacionTest } from "../types/aplicacion";

export class AplicacionTestRepository {
    constructor(private readonly pool : Pool) {}

    async create(
        idEvaluado: number,
        idFormaA: number,
        idFormaB: number,
        idNormas: number,
        finalidad: string | null,
        fechaExamen: string | null
    ): Promise<AplicacionTest> {
        const { rows } = await this.pool.query<AplicacionTest>(
            `INSERT INTO aplicacion_test (id_evaluado, id_forma_a, id_forma_b, id_normas, fecha_examen, finalidad, estado)
             VALUES ($1, $2, $3, $4, $5, $6, 'ASIGNADO') RETURNING *`,
            [idEvaluado, idFormaA, idFormaB, idNormas, fechaExamen, finalidad]
        );
        return rows[0];
    }

    async findById(id: number): Promise<AplicacionTest | null> {
        const { rows } = await this.pool.query<AplicacionTest>(
            'SELECT * FROM aplicacion_test WHERE id_aplicacion = $1',
            [id]
        );
        return rows[0] ?? null;
    }

    async updateEstado(id: number, estado: AplicacionTest['estado']): Promise<void> {
        await this.pool.query(
            'UPDATE aplicacion_test SET estado = $1 WHERE id_aplicacion = $2',
            [estado, id]
        );
    }
}
