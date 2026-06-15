import { Request, Response } from "express";
import { EvaluadoService } from "../services/EvaluadoService";
import { CrearEvaluadoDTO } from "../types/evaluado";

export class EvaluadoController {
    constructor(private readonly evaluadoService : EvaluadoService) {}

    crear = async (req : Request<unknown, unknown, CrearEvaluadoDTO>, res : Response) : Promise<void> => {
        try {
            const evaluado = await this.evaluadoService.crear(req.body);
            res.status(201).json(evaluado);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Error Desconocido'
            res.status(400).json({ error: message });
        }
    };
}