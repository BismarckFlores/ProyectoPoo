import { EvaluadoRepository } from "../repositories/EvaluadoRepository";
import { Evaluado, CrearEvaluadoDTO } from "../types/evaluado";

export class EvaluadoService {
    constructor(private readonly evaluadoRepository: EvaluadoRepository) {}

    async crear(dto: CrearEvaluadoDTO): Promise<Evaluado> {
        if (!dto.primer_apellido?.trim()) throw new Error('El primer apellido es requerido');
        if (!dto.nombre?.trim()) throw new Error('El nombre es requerido');

        return this.evaluadoRepository.create(dto);
    }

    async obtenerPorId(id : number) : Promise<Evaluado> {
        const evaluado = await this.evaluadoRepository.findById(id);
        if (!evaluado) throw new Error('Evaluado no encontrado');
        return evaluado;
    }
}