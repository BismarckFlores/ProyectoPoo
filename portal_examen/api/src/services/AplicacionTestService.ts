import { AplicacionTestRepository } from "../repositories/AplicacionTestRepository";
import { FormaRepository } from "../repositories/FormaRepository";
import { ItemRepository } from "../repositories/ItemRepository";
import { RespuestaRepository } from "../repositories/RespuestaRepository";
import { EvaluadoRepository } from "../repositories/EvaluadoRepository";
import { AplicacionTest, CrearAplicacionDTO } from "../types/aplicacion";
import { RegistrarRespuestaDTO, Respuesta } from "../types/respuesta";
import { FormaVocabulario, Item } from "../types/forma";

export class AplicacionTestService {
    constructor(
        private readonly aplicationRepo : AplicacionTestRepository,
        private readonly evaluadoRepo : EvaluadoRepository,
        private readonly formaRepo : FormaRepository,
        private readonly itemRepo : ItemRepository,
        private readonly respuestaRepo : RespuestaRepository
    ) {}

    async crear(dto : CrearAplicacionDTO) : Promise<AplicacionTest> {
        const evaluado = await this.evaluadoRepo.findById(dto.id_evaluado);
        if (!evaluado) throw new Error(`Evaluado con id ${dto.id_evaluado} no encontrado`);

        const forma = await this.formaRepo.findById(dto.id_forma);
        if (!forma) throw new Error(`Forma con id ${dto.id_forma} no encontrada`);

        return this.aplicationRepo.create(dto)
    }

    async obtenerFormaConItems(idAplicacion : number) : Promise<{ forma: FormaVocabulario; items: Item[] }> {
        const aplicacion = await this.aplicationRepo.findById(idAplicacion);
        if (!aplicacion) throw new Error(`Aplicación con id ${idAplicacion} no encontrada`);

        const forma = await this.formaRepo.findById(aplicacion.id_forma);
        if (!forma) throw new Error(`Forma con id ${aplicacion.id_forma} no encontrada`);

        const items = await this.itemRepo.findByForma(forma.id_forma);

        await this.aplicationRepo.updateEstado(idAplicacion, 'EN_PROGRESO');

        return { forma, items };
    }

    async registrarRespuesta(idAplicacion : number, dto : RegistrarRespuestaDTO) : Promise<Respuesta> {
        const aplicacion = await this.aplicationRepo.findById(idAplicacion);
        if (!aplicacion) throw new Error(`Aplicación con id ${idAplicacion} no encontrada`);
        if (aplicacion.estado === 'CALIFICADO') throw new Error(`No se pueden registrar respuestas en una aplicación que ya fue calificada`);

        const items = await this.itemRepo.findByForma(aplicacion.id_forma);
        const item = items.find(i => i.id_item === dto.id_item);
        if (!item) throw new Error(`Item con id ${dto.id_item} no encontrado en la forma de esta aplicación`);

        const esCorrecta = item.respuesta_correcta === dto.letra_marcada.toUpperCase();

        return this.respuestaRepo.create(idAplicacion, dto, esCorrecta)
    }
}