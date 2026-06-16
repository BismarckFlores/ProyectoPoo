import { Pool } from 'pg';
import { ConfiguracionExamen } from '../types/configuracion';

export class ConfiguracionRepository {
    constructor(private readonly pool: Pool) {}

    // Devuelve la configuración marcada como activa (la más reciente si hubiera varias).
    async findActiva(): Promise<ConfiguracionExamen | null> {
        const { rows } = await this.pool.query<ConfiguracionExamen>(
            'SELECT * FROM configuracion_examen WHERE activa = true ORDER BY id_config DESC LIMIT 1'
        );
        return rows[0] ?? null;
    }
}
