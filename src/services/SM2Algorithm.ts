/**
 * Algoritmo SM-2 (SuperMemo 2) para repetição espaçada
 *
 * Este algoritmo calcula:
 * - O intervalo até a próxima revisão (em dias)
 * - O fator de facilidade do card (easeFactor)
 * - O número de repetições
 *
 * Referência: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

export enum ReviewQuality {
  AGAIN = 0,
  HARD = 1,
  GOOD = 2,
  EASY = 3,
}

export interface SM2Result {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

/**
 * Mapeia a escala interna (0-3) para a escala SM-2 original (0-5).
 * A fórmula do SM-2 foi projetada para a escala 0-5:
 *   - 0-2: resposta incorreta (reseta repetições)
 *   - 3: correta com dificuldade extrema
 *   - 4: correta com hesitação
 *   - 5: resposta perfeita
 */
const QUALITY_MAP: Record<ReviewQuality, number> = {
  [ReviewQuality.AGAIN]: 1, // incorreta → escala 1
  [ReviewQuality.HARD]: 3,  // correta com dificuldade → escala 3
  [ReviewQuality.GOOD]: 4,  // correta com hesitação → escala 4
  [ReviewQuality.EASY]: 5,  // resposta perfeita → escala 5
};

export class SM2Algorithm {
  /**
   * Calcula os próximos valores baseado na qualidade da resposta
   *
   * @param quality - Qualidade da resposta (0-3)
   * @param repetitions - Número atual de repetições
   * @param easeFactor - Fator de facilidade atual
   * @param interval - Intervalo atual em dias
   * @returns Novos valores calculados
   */
  static calculate(
    quality: ReviewQuality,
    repetitions: number = 0,
    easeFactor: number = 2.5,
    interval: number = 0
  ): SM2Result {
    // Converter para escala SM-2 original (0-5)
    const q = QUALITY_MAP[quality];

    let newRepetitions = repetitions;
    let newEaseFactor = easeFactor;
    let newInterval = interval;

    // Calcular novo fator de facilidade
    // Fórmula original: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // O fator de facilidade não pode ser menor que 1.3
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }

    // Se a qualidade for menor que 3 na escala original (AGAIN), resetar repetições
    if (q < 3) {
      newRepetitions = 0;
      newInterval = 1; // Revisar amanhã
    } else {
      newRepetitions = repetitions + 1;

      // Calcular novo intervalo baseado no número de repetições
      if (newRepetitions === 1) {
        newInterval = 1; // Primeira revisão: 1 dia
      } else if (newRepetitions === 2) {
        newInterval = 6; // Segunda revisão: 6 dias
      } else {
        // Revisões subsequentes: intervalo anterior * fator de facilidade
        newInterval = Math.round(interval * newEaseFactor);
      }
    }

    return {
      interval: newInterval,
      repetitions: newRepetitions,
      easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    };
  }

  /**
   * Calcula a data da próxima revisão
   *
   * @param interval - Intervalo em dias
   * @returns Data da próxima revisão
   */

static getNextReviewDate(interval: number): Date {
  const now = new Date();
  const nextDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + interval,
    0, 0, 0, 0
  ));
  return nextDate;
}

  /**
   * Verifica se um card deve ser revisado hoje
   *
   * @param nextReviewDate - Data da próxima revisão
   * @returns true se deve revisar hoje
   */
  static shouldReviewToday(nextReviewDate: Date | null): boolean {
    if (!nextReviewDate) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return nextReviewDate <= today;
  }
}