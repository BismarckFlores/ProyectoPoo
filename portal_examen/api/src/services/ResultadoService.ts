import { AplicacionTestRepository } from '../repositories/AplicacionTestRepository';
import { FormaRepository } from '../repositories/FormaRepository';
import { ItemRepository } from '../repositories/ItemRepository';
import { RespuestaRepository } from '../repositories/RespuestaRepository';
import { ResultadoRepository } from '../repositories/ResultadoRepository';
import { BaremoRepository } from '../repositories/BaremoRepository';
import { MotorCorreccion } from './MotorCorreccion';
import { CalificarAplicacionDTO } from '../types/aplicacion';
import { ResultadoDTO } from '../types/resultado';

export class ResultadoService {
    private readonly motor = new MotorCorreccion();

    constructor(
        private readonly aplicationRepo : AplicacionTestRepository,
        private readonly formaRepo : FormaRepository,
        private readonly itemRepo : ItemRepository,
        private readonly respuestaRepo : RespuestaRepository,
        private readonly resultadoRepo : ResultadoRepository,
        private readonly baremoRepo : BaremoRepository
    ) {}

    async calificar(idAplicacion : number, dto : CalificarAplicacionDTO) : Promise<ResultadoDTO> {
        const aplicacion = await this.aplicationRepo.findById(idAplicacion);
        if (!aplicacion) throw new Error(`Aplicación con id ${idAplicacion} no encontrada`);
        if (aplicacion.estado === 'CALIFICADO') throw new Error(`La aplicación ya fue calificada`);

        const forma = await this.formaRepo.findById(aplicacion.id_forma);
        if (!forma) throw new Error(`Forma con id ${aplicacion.id_forma} no encontrada`);

        const items = await this.itemRepo.findByForma(forma.id_forma);
        const respuestas = await this.respuestaRepo.findByAplicacion(idAplicacion);

        const [entradasVoc1, entradasVoc2, entradasVoct] = await Promise.all([
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOC1'),
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOC2'),
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOCT')
        ]);

        const parcial = this.motor.calificar(
            idAplicacion,
            respuestas,
            items,
            forma.item_inicial ?? 1,
            forma.item_final ?? items.length,
            entradasVoc1,
            entradasVoc2,
            entradasVoct
        );

        const resultado = await this.resultadoRepo.create(idAplicacion, parcial.texto_interpretativo ?? '');

        await Promise.all(
            parcial.puntuaciones.map(p =>
                this.resultadoRepo.createPuntuacion(resultado.id_resultado, p.factor, p.puntuacion_directa, p.puntuacion_tipica)
            )
        );

        await this.aplicationRepo.updateEstado(idAplicacion, 'CALIFICADO');

        return {
            id_resultado : resultado.id_resultado,
            texto_interpretativo : resultado.texto_interpretativo,
            puntuaciones : parcial.puntuaciones
        };
    }

    async obtenerPorAplicacion(idAplicacion: number): Promise<ResultadoDTO> {
        const resultado = await this.resultadoRepo.findByAplicacion(idAplicacion);
        if (!resultado) throw new Error(`No hay resultado para la aplicación ${idAplicacion}`);

        const puntuaciones = await this.resultadoRepo.findPuntuacionesByResultado(resultado.id_resultado);

        return {
            id_resultado: resultado.id_resultado,
            texto_interpretativo: resultado.texto_interpretativo,
            puntuaciones,
        };
    }
}