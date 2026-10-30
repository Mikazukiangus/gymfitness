import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculate1RM,
  calculateBrzycki1RM,
  calculateBarbellPlates,
  checkPersonalRecord,
  calculateWorkoutMetrics,
  calculateMacroCalories,
  formatTime
} from './telemetryMath';
import { Exercise } from '../types/telemetry';

test('calculate1RM correctly estimates one-rep max with Epley formula', () => {
  assert.equal(calculate1RM(100, 1), 100);
  assert.equal(calculate1RM(100, 10), 133); // 100 * (1 + 10/30) = 133.33 -> 133
  assert.equal(calculate1RM(0, 5), 0);
  assert.equal(calculate1RM(140, 5), 163); // 140 * (1 + 5/30) = 163.33 -> 163
});

test('calculateBrzycki1RM estimates one-rep max', () => {
  assert.equal(calculateBrzycki1RM(100, 1), 100);
  assert.equal(calculateBrzycki1RM(100, 5), 113); // 100 * 36 / 32 = 112.5 -> 113
});

test('calculateBarbellPlates correctly distributes plates per side for 100kg target on 20kg bar', () => {
  // 100kg total with 20kg bar = 80kg plates total = 40kg per side
  // 40kg = 1x 25kg + 1x 15kg (or 20kg x 2)
  const result = calculateBarbellPlates(100, 20, 'kg');
  assert.equal(result.totalAchieved, 100);
  assert.equal(result.remainder, 0);
  
  const totalPerSide = result.platesPerSide.reduce((sum, p) => sum + p.weight * p.count, 0);
  assert.equal(totalPerSide, 40);
});

test('calculateBarbellPlates handles target weight equal or lower than bar', () => {
  const result = calculateBarbellPlates(20, 20, 'kg');
  assert.equal(result.totalAchieved, 20);
  assert.equal(result.platesPerSide.length, 0);
});

test('checkPersonalRecord identifies new 1RM record', () => {
  const prResult = checkPersonalRecord(
    { weight: 105, reps: 5 }, // 105 * (1 + 5/30) = 123kg 1RM
    { weight: 100, reps: 5, estimated1RM: 117 }
  );
  assert.equal(prResult.isPR, true);
  assert.equal(prResult.delta1RM > 0, true);

  const nonPR = checkPersonalRecord(
    { weight: 90, reps: 5 },
    { weight: 100, reps: 5, estimated1RM: 117 }
  );
  assert.equal(nonPR.isPR, false);
});

test('calculateWorkoutMetrics computes session volume, completion rate, and avg RPE', () => {
  const dummyExercises: Exercise[] = [
    {
      id: 'ex-1',
      name: 'Incline Bench Press',
      targetMuscle: 'Chest',
      equipment: 'barbell',
      restTimeSeconds: 90,
      sets: [
        { id: 's1', setNumber: 1, type: 'normal', weight: 100, reps: 8, rpe: 8.0, completed: true },
        { id: 's2', setNumber: 2, type: 'normal', weight: 100, reps: 6, rpe: 9.0, completed: true, isPR: true },
        { id: 's3', setNumber: 3, type: 'normal', weight: 100, reps: 6, completed: false }
      ]
    }
  ];

  const metrics = calculateWorkoutMetrics(dummyExercises);
  assert.equal(metrics.totalVolume, 100 * 8 + 100 * 6); // 1400
  assert.equal(metrics.completedSets, 2);
  assert.equal(metrics.totalSets, 3);
  assert.equal(metrics.avgRpe, 8.5);
  assert.equal(metrics.prCount, 1);
  assert.equal(metrics.completionPercentage, 67);
});

test('calculateMacroCalories computes accurate macro calories and split percentages', () => {
  // 180g P = 720 cal, 250g C = 1000 cal, 60g F = 540 cal. Total = 2260 cal
  const macros = calculateMacroCalories(180, 250, 60);
  assert.equal(macros.totalCalories, 2260);
  assert.equal(macros.proteinCal, 720);
  assert.equal(macros.carbsCal, 1000);
  assert.equal(macros.fatCal, 540);
  assert.equal(macros.proteinPct + macros.carbsPct + macros.fatPct, 100);
});

test('formatTime properly formats seconds to MM:SS', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(75), '01:15');
  assert.equal(formatTime(120), '02:00');
});
