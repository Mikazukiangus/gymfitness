import { Exercise, WorkoutSet, WeightUnit } from '../types/telemetry';

/**
 * Calculates estimated One-Rep Max using the Epley equation:
 * 1RM = Weight * (1 + Reps / 30)
 */
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calculates estimated 1RM using the Brzycki equation:
 * 1RM = Weight * (36 / (37 - Reps)) for Reps < 37
 */
export function calculateBrzycki1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  if (reps >= 37) return calculate1RM(weight, reps);
  return Math.round(weight * (36 / (37 - reps)));
}

/**
 * Plate breakdown for standard Olympic barbell loading
 */
export function calculateBarbellPlates(
  targetWeight: number,
  barWeight = 20,
  unit: WeightUnit = 'kg'
): {
  platesPerSide: { weight: number; count: number }[];
  totalAchieved: number;
  remainder: number;
  barWeight: number;
} {
  const availablePlates = unit === 'kg' 
    ? [25, 20, 15, 10, 5, 2.5, 1.25]
    : [45, 35, 25, 10, 5, 2.5];

  if (targetWeight <= barWeight) {
    return {
      platesPerSide: [],
      totalAchieved: barWeight,
      remainder: 0,
      barWeight
    };
  }

  const weightNeededTotal = targetWeight - barWeight;
  let weightNeededPerSide = weightNeededTotal / 2;
  const platesPerSide: { weight: number; count: number }[] = [];

  for (const plate of availablePlates) {
    if (weightNeededPerSide >= plate) {
      const count = Math.floor(weightNeededPerSide / plate);
      platesPerSide.push({ weight: plate, count });
      weightNeededPerSide = Math.round((weightNeededPerSide - count * plate) * 100) / 100;
    }
  }

  const platesWeightSide = platesPerSide.reduce((sum, p) => sum + p.weight * p.count, 0);
  const totalAchieved = barWeight + platesWeightSide * 2;
  const remainder = Math.round((targetWeight - totalAchieved) * 100) / 100;

  return {
    platesPerSide,
    totalAchieved,
    remainder,
    barWeight
  };
}

/**
 * Evaluates whether a set is a Personal Record compared to previous best
 */
export function checkPersonalRecord(
  current: { weight: number; reps: number },
  previousBest?: { weight: number; reps: number; estimated1RM?: number }
): { isPR: boolean; current1RM: number; delta1RM: number } {
  const current1RM = calculate1RM(current.weight, current.reps);
  
  if (!previousBest || (!previousBest.weight && !previousBest.estimated1RM)) {
    return {
      isPR: current.weight > 0 && current.reps > 0,
      current1RM,
      delta1RM: current1RM
    };
  }

  const prev1RM = previousBest.estimated1RM || calculate1RM(previousBest.weight, previousBest.reps);
  const isPR = current1RM > prev1RM && current.weight > 0 && current.reps > 0;
  const delta1RM = isPR ? current1RM - prev1RM : 0;

  return {
    isPR,
    current1RM,
    delta1RM
  };
}

/**
 * Calculates session aggregates (total tonnage, completed sets, average RPE, PR count)
 */
export function calculateWorkoutMetrics(exercises: Exercise[]) {
  let totalVolume = 0;
  let completedSets = 0;
  let totalSets = 0;
  let rpeSum = 0;
  let rpeCount = 0;
  let prCount = 0;

  for (const ex of exercises) {
    for (const set of ex.sets) {
      totalSets++;
      if (set.completed) {
        completedSets++;
        totalVolume += (set.weight || 0) * (set.reps || 0);
        if (set.rpe) {
          rpeSum += set.rpe;
          rpeCount++;
        }
        if (set.isPR) {
          prCount++;
        }
      }
    }
  }

  const avgRpe = rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : 0;
  const completionPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return {
    totalVolume,
    completedSets,
    totalSets,
    avgRpe,
    prCount,
    completionPercentage
  };
}

/**
 * Computes macronutrient calories and ratio splits
 */
export function calculateMacroCalories(protein: number, carbs: number, fat: number) {
  const proteinCal = Math.max(0, protein) * 4;
  const carbsCal = Math.max(0, carbs) * 4;
  const fatCal = Math.max(0, fat) * 9;
  const totalCalories = proteinCal + carbsCal + fatCal;

  const proteinPct = totalCalories > 0 ? Math.round((proteinCal / totalCalories) * 100) : 0;
  const carbsPct = totalCalories > 0 ? Math.round((carbsCal / totalCalories) * 100) : 0;
  const fatPct = totalCalories > 0 ? Math.max(0, 100 - proteinPct - carbsPct) : 0;

  return {
    totalCalories,
    proteinCal,
    carbsCal,
    fatCal,
    proteinPct,
    carbsPct,
    fatPct
  };
}

/**
 * Formats seconds into MM:SS format for tactical telemetry chronometer
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
