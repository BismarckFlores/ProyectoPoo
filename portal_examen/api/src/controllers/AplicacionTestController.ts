import { Request, Response } from "express";
import { AplicacionTestService } from "../services/AplicacionTestService";
import { CrearAplicacionDTO, CalificarAplicacionDTO } from "../types/aplicacion";
import { RegistrarRespuestaDTO } from "../types/respuesta";
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

    obtenerForma = async (req : Request, res : Response) : Promise<void> => {
        try {
            const id = Number(req.params.id);
            const resultado = await this.aplicacionService.obtenerFormaConItems(id);
            res.json(resultado);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido'
            res.status(404).json({ error: message });
        }
    }

    registrarRespuesta = async (req: Request<{ id: string }, unknown, RegistrarRespuestaDTO>, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const respuesta = await this.aplicacionService.registrarRespuesta(id, req.body);
            res.status(201).json(respuesta);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            res.status(400).json({ error: message });
        }
    };

    calificar = async (req: Request<{ id: string }, unknown, CalificarAplicacionDTO>, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const resultado = await this.resultadoService.calificar(id, req.body);
            res.json(resultado);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            res.status(400).json({ error: message });
        }
    };

    obtenerResultado = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const resultado = await this.resultadoService.obtenerPorAplicacion(id);
            res.json(resultado);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            res.status(404).json({ error: message });
        }
    };
}