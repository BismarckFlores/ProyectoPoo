import { Request, Response } from "express";
import { AplicacionTestService } from "../services/AplicacionTestService";
import { CrearAplicacionDTO, CalificarAplicacionDTO } from "../types/aplicacion";
import { ResultadoService } from "../services/ResultadoService";

export class AplicacionTestController {
    constructor(
        private readonly aplicacionService : AplicacionTestService,
        private readonly resultadoService : ResultadoService
    ) {}

    crear = async (req : Request<unknown, unknown, CrearAplicacionDTO>, res : Response) : Promise<void> => {
        try {
            const aplicacion = await this.aplicacionService.crear(req.body);
            res.status(201).json(aplicacion);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido'
            res.status(400).json({ error: message });
        }
    };

    obtenerFormas = async (req : Request, res : Response) : Promise<void> => {
        try {
            const id = Number(req.params.id);
            const formas = await this.aplicacionService.obtenerFormas(id);
            res.json(formas);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido'
            res.status(404).json({ error: message });
        }
    };

    calificar = async (req: Request<{ id: string }, unknown, CalificarAplicacionDTO>, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const resultado = await this.resultadoService.calificar(id, req.body);
            res.json(resultado);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido';
            res.status(400).json({ error: message });
        }
    };

    obtenerResultado = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const resultado = await this.resultadoService.obtenerPorAplicacion(id);
            res.json(resultado);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido';
            res.status(404).json({ error: message });
        }
    };
}
