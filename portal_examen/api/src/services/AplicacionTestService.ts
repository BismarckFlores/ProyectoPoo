import { AplicacionTestRepository } from "../repositories/AplicacionTestRepository";
import { FormaRepository } from "../repositories/FormaRepository";
import { ItemRepository } from "../repositories/ItemRepository";
import { EvaluadoRepository } from "../repositories/EvaluadoRepository";
import { AplicacionTest, CrearAplicacionDTO } from "../types/aplicacion";
import { FormaVocabulario, Item, ItemPublico } from "../types/forma";

export type FormaConItems = {
    forma: FormaVocabulario;
    items: ItemPublico[];
};

export class AplicacionTestService {
    constructor(
        private readonly aplicacionRepo : AplicacionTestRepository,
        private readonly evaluadoRepo : EvaluadoRepository,
        private readonly formaRepo : FormaRepository,
        private readonly itemRepo : ItemRepository
    ) {}

    async crear(dto : CrearAplicacionDTO) : Promise<AplicacionTest> {
        const evaluado = await this.evaluadoRepo.findById(dto.id_evaluado);
        if (!evaluado) throw new Error(`Evaluado con id ${dto.id_evaluado} no encontrado`);

        const formaA = await this.formaRepo.findByTipo('A');
        if (!formaA) throw new Error('No hay una Forma A configurada en la base de datos');

        const formaB = await this.formaRepo.findByTipo('B');
        if (!formaB) throw new Error('No hay una Forma B configurada en la base de datos');

        const fechaExamen = new Date().toISOString().slice(0, 10);

        return this.aplicacionRepo.create(
            dto.id_evaluado,
            formaA.id_forma,
            formaB.id_forma,
            dto.finalidad ?? null,
            fechaExamen
        );
    }

    // Devuelve ambas formas (A y B) con sus ítems y tiempos, listas para presentar.
    async obtenerFormas(idAplicacion : number) : Promise<{ forma_a: FormaConItems; forma_b: FormaConItems }> {
        const aplicacion = await this.aplicacionRepo.findById(idAplicacion);
        if (!aplicacion) throw new Error(`Aplicación con id ${idAplicacion} no encontrada`);

        const formaA = await this.formaRepo.findById(aplicacion.id_forma_a);
        const formaB = await this.formaRepo.findById(aplicacion.id_forma_b);
        if (!formaA || !formaB) throw new Error('Las formas de esta aplicación no existen');

        const itemsA = await this.itemRepo.findByForma(formaA.id_forma);
        const itemsB = await this.itemRepo.findByForma(formaB.id_forma);

        await this.aplicacionRepo.updateEstado(idAplicacion, 'EN_PROGRESO');

        return {
            forma_a: { forma: formaA, items: itemsA.map(this.aPublico) },
            forma_b: { forma: formaB, items: itemsB.map(this.aPublico) },
        };
    }

    private aPublico(item : Item) : ItemPublico {
        return {
            id_item: item.id_item,
            numero: item.numero,
            palabra_estimulo: item.palabra_estimulo,
        };
    }
}
