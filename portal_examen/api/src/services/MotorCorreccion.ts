import { Respuesta } from '../types/respuesta';
import { Item } from '../types/forma';
import { EntradaBaremo } from '../repositories/BaremoRepository';
import { ResultadoDTO } from '../types/resultado';

export class MotorCorreccion {

  calcularPD(respuestas: Respuesta[], items: Item[], itemInicial: number, itemFinal: number): number {
    const numerosEnRango = new Set(
      items
        .filter(i => i.numero >= itemInicial && i.numero <= itemFinal)
        .map(i => i.id_item)
    );

    return respuestas.filter(r => numerosEnRango.has(r.id_item) && r.es_correcta === true).length;
  }

  calcularVOCT(pdVoc1: number, pdVoc2: number): number {
    return pdVoc1 + pdVoc2;
  }

  obtenerPT(pd: number, entradas: EntradaBaremo[]): number {
    const entrada = entradas.find(e => pd >= e.pd_min && pd <= e.pd_max);
    return entrada?.percentil ?? 0;
  }

  private generarInterpretacion(puntuaciones: { factor: string; puntuacion_tipica: number }[]): string {
    const voct = puntuaciones.find(p => p.factor === 'VOCT');
    if (!voct) return 'No se pudo generar una interpretación.';

    const pt = voct.puntuacion_tipica;
    if (pt >= 75) return 'Vocabulario muy alto. Comprensión léxica superior al promedio.';
    if (pt >= 50) return 'Vocabulario alto. Comprensión léxica por encima del promedio.';
    if (pt >= 25) return 'Vocabulario medio. Comprensión léxica dentro del promedio.';
    return 'Vocabulario bajo. Comprensión léxica por debajo del promedio.';
  }

  calificar(
    idAplicacion: number,
    respuestas: Respuesta[],
    items: Item[],
    itemInicial: number,
    itemFinal: number,
    entradasVoc1: EntradaBaremo[],
    entradasVoc2: EntradaBaremo[],
    entradasVoct: EntradaBaremo[]
  ): Omit<ResultadoDTO, 'id_resultado'> {
    const pdVoc1 = this.calcularPD(respuestas, items, itemInicial, Math.floor((itemInicial + itemFinal) / 2));
    const pdVoc2 = this.calcularPD(respuestas, items, Math.floor((itemInicial + itemFinal) / 2) + 1, itemFinal);
    const pdVoct = this.calcularVOCT(pdVoc1, pdVoc2);

    const puntuaciones = [
      { factor: 'VOC1', puntuacion_directa: pdVoc1, puntuacion_tipica: this.obtenerPT(pdVoc1, entradasVoc1) },
      { factor: 'VOC2', puntuacion_directa: pdVoc2, puntuacion_tipica: this.obtenerPT(pdVoc2, entradasVoc2) },
      { factor: 'VOCT', puntuacion_directa: pdVoct, puntuacion_tipica: this.obtenerPT(pdVoct, entradasVoct) },
    ];

    return {
      texto_interpretativo: this.generarInterpretacion(puntuaciones),
      puntuaciones,
    };
  }
}
