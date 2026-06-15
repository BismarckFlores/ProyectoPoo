import { AplicacionTestRepository } from '../repositories/AplicacionTestRepository';
import { FormaRepository } from '../repositories/FormaRepository';
import { ItemRepository } from '../repositories/ItemRepository';
import { RespuestaRepository, RespuestaCalculada } from '../repositories/RespuestaRepository';
import { ResultadoRepository } from '../repositories/ResultadoRepository';
import { BaremoRepository } from '../repositories/BaremoRepository';
import { MotorCorreccion } from './MotorCorreccion';
import { CalificarAplicacionDTO } from '../types/aplicacion';
import { ResultadoDTO } from '../types/resultado';
import { FormaVocabulario, Item } from '../types/forma';

export class ResultadoService {
    private readonly motor = new MotorCorreccion();

    constructor(
        private readonly aplicacionRepo : AplicacionTestRepository,
        private readonly formaRepo : FormaRepository,
        private readonly itemRepo : ItemRepository,
        private readonly respuestaRepo : RespuestaRepository,
        private readonly resultadoRepo : ResultadoRepository,
        private readonly baremoRepo : BaremoRepository
    ) {}

    // Recibe TODAS las respuestas de las dos formas, las corrige, las guarda y califica.
    async calificar(idAplicacion : number, dto : CalificarAplicacionDTO) : Promise<ResultadoDTO> {
        const aplicacion = await this.aplicacionRepo.findById(idAplicacion);
        if (!aplicacion) throw new Error(`Aplicación con id ${idAplicacion} no encontrada`);
        if (aplicacion.estado === 'CALIFICADO') throw new Error('La aplicación ya fue calificada');

        const formaA = await this.formaRepo.findById(aplicacion.id_forma_a);
        const formaB = await this.formaRepo.findById(aplicacion.id_forma_b);
        if (!formaA || !formaB) throw new Error('Las formas de esta aplicación no existen');

        const itemsA = await this.itemRepo.findByForma(formaA.id_forma);
        const itemsB = await this.itemRepo.findByForma(formaB.id_forma);

        const itemMap = new Map<number, Item>();
        [...itemsA, ...itemsB].forEach(i => itemMap.set(i.id_item, i));

        // Corregir cada respuesta contra su ítem.
        const calculadas: RespuestaCalculada[] = dto.respuestas.map(r => {
            const item = itemMap.get(r.id_item);
            if (!item) throw new Error(`El ítem ${r.id_item} no pertenece a esta aplicación`);
            return {
                id_item: r.id_item,
                letra_marcada: r.letra_marcada,
                es_correcta: this.motor.esCorrecta(item, r.letra_marcada),
            };
        });

        await this.respuestaRepo.createMany(idAplicacion, calculadas);
        const respuestas = await this.respuestaRepo.findByAplicacion(idAplicacion);

        const [entradasVoc1, entradasVoc2, entradasVoct] = await Promise.all([
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOC1'),
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOC2'),
            this.baremoRepo.findByNormasYFactor(dto.id_normas, 'VOCT'),
        ]);

        const rangoA = this.rango(formaA, itemsA);
        const rangoB = this.rango(formaB, itemsB);

        const parcial = this.motor.calificar(
            respuestas,
            itemsA, rangoA.inicial, rangoA.final,
            itemsB, rangoB.inicial, rangoB.final,
            entradasVoc1, entradasVoc2, entradasVoct
        );

        const resultado = await this.resultadoRepo.create(idAplicacion, parcial.texto_interpretativo ?? '');

        await Promise.all(
            parcial.puntuaciones.map(p =>
                this.resultadoRepo.createPuntuacion(resultado.id_resultado, p.factor, p.puntuacion_directa, p.puntuacion_tipica)
            )
        );

        await this.aplicacionRepo.updateEstado(idAplicacion, 'CALIFICADO');

        return {
            id_resultado: resultado.id_resultado,
            texto_interpretativo: resultado.texto_interpretativo,
            puntuaciones: parcial.puntuaciones,
        };
    }

    async obtenerPorAplicacion(idAplicacion : number) : Promise<ResultadoDTO> {
        const resultado = await this.resultadoRepo.findByAplicacion(idAplicacion);
        if (!resultado) throw new Error(`No hay resultado para la aplicación ${idAplicacion}`);

        const puntuaciones = await this.resultadoRepo.findPuntuacionesByResultado(resultado.id_resultado);

        return {
            id_resultado: resultado.id_resultado,
            texto_interpretativo: resultado.texto_interpretativo,
            puntuaciones,
        };
    }

    // Rango de ítems de una forma; si no está configurado, usa todos los ítems.
    private rango(forma : FormaVocabulario, items : Item[]) : { inicial: number; final: number } {
        const inicial = forma.item_inicial ?? 1;
        const final = forma.item_final ?? Math.max(0, ...items.map(i => i.numero));
        return { inicial, final };
    }
}
