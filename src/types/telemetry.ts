export type WeightUnit = 'kg' | 'lbs';

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  previousWeight?: number;
  previousReps?: number;
  weight: number;
  reps: number;
  rpe?: number; // e.g. 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10
  rir?: number; // Reps In Reserve
  completed: boolean;
  completedAt?: string;
  isPR?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string; // e.g. 'Chest', 'Triceps', 'Shoulders', 'Back', 'Quads'
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';
  restTimeSeconds: number; // default rest timer e.g. 90 or 120
  notes?: string;
  cues?: string[];
  sets: WorkoutSet[];
  historical1RM?: number;
  historicalMaxWeight?: number;
}

export interface WorkoutSession {
  id: string;
  title: string;
  subtitle: string;
  startedAt: string;
  durationSeconds: number;
  exercises: Exercise[];
  isFinished: boolean;
  finishedAt?: string;
}

export interface MealLog {
  id: string;
  time: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface DailyMacroTarget {
  targetCalories: number;
  targetProtein: number; // in grams
  targetCarbs: number;   // in grams
  targetFat: number;     // in grams
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  date: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  delta1RM: number;
}
