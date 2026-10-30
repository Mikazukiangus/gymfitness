import { WorkoutSession, MealLog, DailyMacroTarget, PersonalRecord, Exercise } from '../types/telemetry';

export const INITIAL_WORKOUT_SESSION: WorkoutSession = {
  id: 'session-2026-10-push-a',
  title: 'HEAVY PUSH SESSION A',
  subtitle: 'CHEST & ANTERIOR DELT HYPERTROPHY // MESOCYCLE 3 // WEEK 2',
  startedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  durationSeconds: 32 * 60,
  isFinished: false,
  exercises: [
    {
      id: 'ex-incline-bench',
      name: '01 // BARBELL INCLINE BENCH PRESS',
      targetMuscle: 'Upper Chest / Front Delts',
      equipment: 'barbell',
      restTimeSeconds: 120,
      notes: 'Touch sternum 2 inches below collarbone. 2-second controlled eccentric.',
      cues: ['Retract scapulae', 'Elbows 45° tucked', 'Leg drive anchored'],
      historical1RM: 130,
      historicalMaxWeight: 110,
      sets: [
        { id: 'set-ib-1', setNumber: 1, type: 'warmup', previousWeight: 60, previousReps: 10, weight: 60, reps: 10, rpe: 6.0, completed: true },
        { id: 'set-ib-2', setNumber: 2, type: 'warmup', previousWeight: 80, previousReps: 5, weight: 80, reps: 5, rpe: 7.0, completed: true },
        { id: 'set-ib-3', setNumber: 1, type: 'normal', previousWeight: 100, previousReps: 8, weight: 102.5, reps: 8, rpe: 8.5, completed: true, isPR: true },
        { id: 'set-ib-4', setNumber: 2, type: 'normal', previousWeight: 100, previousReps: 7, weight: 102.5, reps: 7, rpe: 9.0, completed: false },
        { id: 'set-ib-5', setNumber: 3, type: 'normal', previousWeight: 100, previousReps: 6, weight: 100, reps: 8, rpe: 9.5, completed: false }
      ]
    },
    {
      id: 'ex-weighted-dips',
      name: '02 // WEIGHTED PARALLEL DIPS',
      targetMuscle: 'Lower Chest / Triceps',
      equipment: 'bodyweight',
      restTimeSeconds: 90,
      notes: 'Slight forward torso lean (15°) for sternal pectoralis recruitment.',
      cues: ['Lock shoulder blades down', 'Break 90° elbow depth', 'No chest bouncing'],
      historical1RM: 145, // Bodyweight 85kg + 60kg load
      sets: [
        { id: 'set-dip-1', setNumber: 1, type: 'normal', previousWeight: 30, previousReps: 8, weight: 32.5, reps: 8, rpe: 8.0, completed: false },
        { id: 'set-dip-2', setNumber: 2, type: 'normal', previousWeight: 30, previousReps: 8, weight: 32.5, reps: 8, rpe: 8.5, completed: false },
        { id: 'set-dip-3', setNumber: 3, type: 'normal', previousWeight: 30, previousReps: 7, weight: 30, reps: 9, rpe: 9.5, completed: false }
      ]
    },
    {
      id: 'ex-standing-ohp',
      name: '03 // STANDING BARBELL OVERHEAD PRESS',
      targetMuscle: 'Anterior & Medial Delts',
      equipment: 'barbell',
      restTimeSeconds: 120,
      notes: 'Squeeze glutes and abs to avoid lumbar hyperextension on lockouts.',
      cues: ['Grip just outside shoulders', 'Head moves back then through', 'Full lock at top'],
      historical1RM: 85,
      sets: [
        { id: 'set-ohp-1', setNumber: 1, type: 'normal', previousWeight: 65, previousReps: 6, weight: 67.5, reps: 6, rpe: 8.0, completed: false },
        { id: 'set-ohp-2', setNumber: 2, type: 'normal', previousWeight: 65, previousReps: 6, weight: 67.5, reps: 6, rpe: 8.5, completed: false },
        { id: 'set-ohp-3', setNumber: 3, type: 'normal', previousWeight: 65, previousReps: 5, weight: 65, reps: 7, rpe: 9.0, completed: false }
      ]
    },
    {
      id: 'ex-cable-lateral-raise',
      name: '04 // STANDING CABLE LATERAL RAISES',
      targetMuscle: 'Lateral Deltoids',
      equipment: 'cable',
      restTimeSeconds: 60,
      notes: 'Pulley set at wrist height when arm is down. Continuous tension curve.',
      cues: ['Lead with elbows', 'Slight pinky tilt', 'Pause 0.5s at horizon'],
      historical1RM: 20,
      sets: [
        { id: 'set-lat-1', setNumber: 1, type: 'normal', previousWeight: 12.5, previousReps: 15, weight: 12.5, reps: 15, rpe: 8.0, completed: false },
        { id: 'set-lat-2', setNumber: 2, type: 'normal', previousWeight: 12.5, previousReps: 14, weight: 12.5, reps: 14, rpe: 8.5, completed: false },
        { id: 'set-lat-3', setNumber: 3, type: 'drop', previousWeight: 15, previousReps: 12, weight: 15, reps: 12, rpe: 9.5, completed: false }
      ]
    },
    {
      id: 'ex-overhead-cable-tricep',
      name: '05 // CROSS-CABLE OVERHEAD TRICEP EXTENSION',
      targetMuscle: 'Triceps Long Head',
      equipment: 'cable',
      restTimeSeconds: 60,
      notes: 'Dual rope attachment. Emphasize full stretch under stretch-mediated tension.',
      cues: ['Keep upper arms fixed', 'Flared finish at lockout', 'Controlled 3s negative'],
      historical1RM: 35,
      sets: [
        { id: 'set-tri-1', setNumber: 1, type: 'normal', previousWeight: 22.5, previousReps: 12, weight: 25, reps: 12, rpe: 8.5, completed: false },
        { id: 'set-tri-2', setNumber: 2, type: 'normal', previousWeight: 22.5, previousReps: 12, weight: 25, reps: 11, rpe: 9.0, completed: false }
      ]
    }
  ]
};

export const WORKOUT_TEMPLATES = [
  {
    id: 'tpl-push-a',
    title: 'PUSH DAY A - HEAVY COMPOUND',
    focus: 'Chest, Front Delts, Triceps',
    exerciseCount: 5,
    estimatedMinutes: 65,
    exercises: INITIAL_WORKOUT_SESSION.exercises
  },
  {
    id: 'tpl-pull-a',
    title: 'PULL DAY A - LAT & POSTERIOR CHAIN',
    focus: 'Lats, Upper Traps, Rear Delts, Biceps',
    exerciseCount: 5,
    estimatedMinutes: 70,
    exercises: [
      {
        id: 'ex-deadlift',
        name: '01 // CONVENTIONAL BARBELL DEADLIFT',
        targetMuscle: 'Posterior Chain / Lats',
        equipment: 'barbell' as const,
        restTimeSeconds: 180,
        historical1RM: 225,
        sets: [
          { id: 't1', setNumber: 1, type: 'warmup' as const, weight: 100, reps: 5, completed: false },
          { id: 't2', setNumber: 2, type: 'normal' as const, weight: 170, reps: 5, completed: false },
          { id: 't3', setNumber: 3, type: 'normal' as const, weight: 185, reps: 5, completed: false },
          { id: 't4', setNumber: 4, type: 'normal' as const, weight: 190, reps: 3, completed: false }
        ]
      },
      {
        id: 'ex-weighted-pullups',
        name: '02 // WEIGHTED NEUTRAL-GRIP CHIN-UPS',
        targetMuscle: 'Lats / Biceps',
        equipment: 'bodyweight' as const,
        restTimeSeconds: 120,
        historical1RM: 135,
        sets: [
          { id: 't5', setNumber: 1, type: 'normal' as const, weight: 20, reps: 6, completed: false },
          { id: 't6', setNumber: 2, type: 'normal' as const, weight: 20, reps: 6, completed: false },
          { id: 't7', setNumber: 3, type: 'normal' as const, weight: 15, reps: 8, completed: false }
        ]
      },
      {
        id: 'ex-chest-supported-row',
        name: '03 // CHEST-SUPPORTED T-BAR ROW',
        targetMuscle: 'Mid-Back / Rhomboids',
        equipment: 'machine' as const,
        restTimeSeconds: 90,
        historical1RM: 95,
        sets: [
          { id: 't8', setNumber: 1, type: 'normal' as const, weight: 65, reps: 10, completed: false },
          { id: 't9', setNumber: 2, type: 'normal' as const, weight: 65, reps: 10, completed: false }
        ]
      }
    ]
  },
  {
    id: 'tpl-leg-a',
    title: 'LEG DAY A - QUAD DOMINANCE & SQUAT',
    focus: 'Quads, Adductors, Calves, Core',
    exerciseCount: 5,
    estimatedMinutes: 75,
    exercises: [
      {
        id: 'ex-barbell-squat',
        name: '01 // HIGH-BAR BARBELL BACK SQUAT',
        targetMuscle: 'Quads / Glutes',
        equipment: 'barbell' as const,
        restTimeSeconds: 180,
        historical1RM: 185,
        sets: [
          { id: 's-q1', setNumber: 1, type: 'warmup' as const, weight: 80, reps: 5, completed: false },
          { id: 's-q2', setNumber: 2, type: 'normal' as const, weight: 140, reps: 6, completed: false },
          { id: 's-q3', setNumber: 3, type: 'normal' as const, weight: 140, reps: 6, completed: false },
          { id: 's-q4', setNumber: 4, type: 'normal' as const, weight: 145, reps: 5, completed: false }
        ]
      },
      {
        id: 'ex-romanian-deadlift',
        name: '02 // BARBELL ROMANIAN DEADLIFT',
        targetMuscle: 'Hamstrings / Glutes',
        equipment: 'barbell' as const,
        restTimeSeconds: 120,
        historical1RM: 160,
        sets: [
          { id: 's-rdl1', setNumber: 1, type: 'normal' as const, weight: 120, reps: 8, completed: false },
          { id: 's-rdl2', setNumber: 2, type: 'normal' as const, weight: 120, reps: 8, completed: false }
        ]
      }
    ]
  }
];

export const EXERCISE_CATALOG: Omit<Exercise, 'sets'>[] = [
  { id: 'cat-1', name: 'Barbell Flat Bench Press', targetMuscle: 'Chest', equipment: 'barbell', restTimeSeconds: 120, historical1RM: 140 },
  { id: 'cat-2', name: 'Barbell Incline Bench Press', targetMuscle: 'Upper Chest', equipment: 'barbell', restTimeSeconds: 120, historical1RM: 130 },
  { id: 'cat-3', name: 'Weighted Parallel Dips', targetMuscle: 'Chest / Triceps', equipment: 'bodyweight', restTimeSeconds: 90, historical1RM: 145 },
  { id: 'cat-4', name: 'Standing Overhead Press (OHP)', targetMuscle: 'Shoulders', equipment: 'barbell', restTimeSeconds: 120, historical1RM: 85 },
  { id: 'cat-5', name: 'Dumbbell Lateral Raises', targetMuscle: 'Lateral Delts', equipment: 'dumbbell', restTimeSeconds: 60, historical1RM: 22 },
  { id: 'cat-6', name: 'Cable Overhead Tricep Extension', targetMuscle: 'Triceps', equipment: 'cable', restTimeSeconds: 60, historical1RM: 35 },
  { id: 'cat-7', name: 'Conventional Deadlift', targetMuscle: 'Posterior Chain', equipment: 'barbell', restTimeSeconds: 180, historical1RM: 225 },
  { id: 'cat-8', name: 'Weighted Pull-Ups', targetMuscle: 'Lats', equipment: 'bodyweight', restTimeSeconds: 120, historical1RM: 135 },
  { id: 'cat-9', name: 'Barbell Bent Over Row', targetMuscle: 'Upper Back', equipment: 'barbell', restTimeSeconds: 90, historical1RM: 115 },
  { id: 'cat-10', name: 'High-Bar Back Squat', targetMuscle: 'Quads', equipment: 'barbell', restTimeSeconds: 180, historical1RM: 185 },
  { id: 'cat-11', name: 'Barbell Romanian Deadlift (RDL)', targetMuscle: 'Hamstrings', equipment: 'barbell', restTimeSeconds: 120, historical1RM: 160 },
  { id: 'cat-12', name: 'Seated Leg Extension', targetMuscle: 'Quads', equipment: 'machine', restTimeSeconds: 60, historical1RM: 95 },
  { id: 'cat-13', name: 'Lying Leg Curl', targetMuscle: 'Hamstrings', equipment: 'machine', restTimeSeconds: 60, historical1RM: 75 },
  { id: 'cat-14', name: 'Standing Barbell Bicep Curl', targetMuscle: 'Biceps', equipment: 'barbell', restTimeSeconds: 60, historical1RM: 55 },
  { id: 'cat-15', name: 'Incline Dumbbell Bicep Curl', targetMuscle: 'Biceps', equipment: 'dumbbell', restTimeSeconds: 60, historical1RM: 22 }
];

export const INITIAL_MACRO_TARGET: DailyMacroTarget = {
  targetCalories: 2750,
  targetProtein: 210, // grams
  targetCarbs: 310,   // grams
  targetFat: 70       // grams
};

export const INITIAL_MEAL_LOGS: MealLog[] = [
  {
    id: 'm-1',
    time: '07:30',
    name: '01 // POST-WAKE HYDRATION & OAT FUEL',
    protein: 48,
    carbs: 85,
    fat: 14,
    calories: 658
  },
  {
    id: 'm-2',
    time: '12:30',
    name: '02 // HIGH-NITROGEN LUNCH MATRIX',
    protein: 58,
    carbs: 90,
    fat: 18,
    calories: 754
  },
  {
    id: 'm-3',
    time: '16:00',
    name: '03 // PRE-WORKOUT ANABOLIC PRIMER',
    protein: 35,
    carbs: 65,
    fat: 6,
    calories: 454
  }
];

export const RECENT_PERSONAL_RECORDS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseName: 'Barbell Incline Bench Press',
    date: 'OCT 29, 2026',
    weight: 102.5,
    reps: 8,
    estimated1RM: 130,
    delta1RM: +3.5
  },
  {
    id: 'pr-2',
    exerciseName: 'Conventional Deadlift',
    date: 'OCT 26, 2026',
    weight: 190.0,
    reps: 4,
    estimated1RM: 215,
    delta1RM: +5.0
  },
  {
    id: 'pr-3',
    exerciseName: 'Weighted Neutral Chin-Ups',
    date: 'OCT 24, 2026',
    weight: 35.0,
    reps: 6,
    estimated1RM: 142,
    delta1RM: +4.0
  },
  {
    id: 'pr-4',
    exerciseName: 'High-Bar Back Squat',
    date: 'OCT 20, 2026',
    weight: 150.0,
    reps: 5,
    estimated1RM: 175,
    delta1RM: +7.5
  }
];

export const VOLUME_PROGRESSION_DATA = [
  { week: 'WK 39', volume: 42100, intensity: 8.1 },
  { week: 'WK 40', volume: 44800, intensity: 8.3 },
  { week: 'WK 41', volume: 46200, intensity: 8.4 },
  { week: 'WK 42', volume: 38500, intensity: 7.2 }, // Deload
  { week: 'WK 43', volume: 48900, intensity: 8.5 },
  { week: 'WK 44', volume: 51200, intensity: 8.6 }
];
