import React, { useState } from 'react';
import { Check, Flame, Plus, Calculator, ChevronDown, ChevronUp, Info, Trash2 } from 'lucide-react';
import { Exercise, WorkoutSet, WeightUnit } from '../types/telemetry';
import { calculate1RM, checkPersonalRecord } from '../utils/telemetryMath';

interface ExerciseCardProps {
  exercise: Exercise;
  unit: WeightUnit;
  onUpdateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  onToggleCompleteSet: (exerciseId: string, set: WorkoutSet) => void;
  onAddSet: (exerciseId: string, type: 'normal' | 'warmup') => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onOpenPlateCalculator: (exerciseName: string, currentWeight: number, onApply: (weight: number) => void) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  unit,
  onUpdateSet,
  onToggleCompleteSet,
  onAddSet,
  onDeleteSet,
  onOpenPlateCalculator,
}) => {
  const [showCues, setShowCues] = useState(false);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);

  // Calculate highest estimated 1RM from completed sets
  const bestCurrent1RM = exercise.sets
    .filter((s) => s.completed)
    .reduce((max, s) => Math.max(max, calculate1RM(s.weight, s.reps)), 0);

  return (
    <div className="rounded-lg bg-theme-card border border-theme overflow-hidden mb-5 transition-shadow hover:shadow-md">
      {/* Exercise Header */}
      <div className="p-4 border-b border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base sm:text-lg font-['Space_Grotesk'] font-bold text-theme-high tracking-tight">
              {exercise.name}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#0284C7]/15 dark:bg-[#00F0FF]/15 text-[#0284C7] dark:text-[#00F0FF] border border-[#0284C7]/30 dark:border-[#00F0FF]/30 tracking-wider uppercase">
              {exercise.targetMuscle}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-theme-elevated text-theme-muted border border-theme uppercase">
              {exercise.equipment}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-theme-muted">
            <span>REST TARGET: <strong className="text-[#78A300] dark:text-[#D4FF00]">{exercise.restTimeSeconds}S</strong></span>
            {exercise.historical1RM && (
              <span>EST. 1RM: <strong className="text-theme-high">{bestCurrent1RM || exercise.historical1RM} {unit}</strong></span>
            )}
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {exercise.equipment === 'barbell' && (
            <button
              onClick={() => {
                const activeSet = exercise.sets.find((s) => !s.completed) || exercise.sets[0];
                onOpenPlateCalculator(
                  exercise.name,
                  activeSet?.weight || 100,
                  (newWeight) => {
                    if (activeSet) {
                      onUpdateSet(exercise.id, activeSet.id, { weight: newWeight });
                    }
                  }
                );
              }}
              className="px-2.5 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-high flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#78A300] dark:text-[#D4FF00]" />
              <span className="hidden sm:inline">PLATES</span>
            </button>
          )}

          {(exercise.notes || (exercise.cues && exercise.cues.length > 0)) && (
            <button
              onClick={() => setShowCues(!showCues)}
              aria-label="Toggle exercise cues and telemetry notes"
              className="px-2.5 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-muted hover:text-theme-high flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00F0FF]" />
              <span className="hidden sm:inline">CUES</span>
              {showCues ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Technical Cues Drawer */}
      {showCues && (
        <div className="bg-theme-canvas px-4 py-3 border-b border-theme animate-fade-in">
          {exercise.notes && (
            <p className="text-xs font-['Inter'] text-theme-high mb-2 leading-relaxed">
              <strong className="text-[#78A300] dark:text-[#D4FF00] font-['Space_Grotesk']">NOTE:</strong> {exercise.notes}
            </p>
          )}
          {exercise.cues && (
            <div className="flex flex-wrap gap-2">
              {exercise.cues.map((cue, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-theme-card border border-theme text-[11px] font-['JetBrains_Mono'] text-theme-muted"
                >
                  ⚡ {cue}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabular Workout Logging Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[340px]">
          <thead>
            <tr className="border-b border-theme text-[10px] sm:text-[11px] font-['JetBrains_Mono'] font-medium text-theme-muted tracking-wider uppercase">
              <th className="py-2 px-1.5 sm:px-3 w-10 sm:w-14 text-center">SET</th>
              <th className="py-2 px-1.5 sm:px-3">PREV</th>
              <th className="py-2 px-1.5 sm:px-3">{unit.toUpperCase()}</th>
              <th className="py-2 px-1.5 sm:px-3">REPS</th>
              <th className="py-2 px-1.5 sm:px-3">RPE</th>
              <th className="py-2 px-1.5 sm:px-3 w-14 sm:w-16 text-center">STATUS</th>
              <th className="py-2 px-1 w-6 sm:w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y border-theme-row">
            {exercise.sets.map((set) => {
              const isActive = activeSetId === set.id;
              const isWarmup = set.type === 'warmup';

              return (
                <tr
                  key={set.id}
                  onClick={() => setActiveSetId(set.id)}
                  className={`transition-colors group ${
                    set.completed
                      ? 'bg-theme-canvas/40'
                      : isActive
                      ? 'bg-theme-elevated volt-glow border-y border-[#78A300] dark:border-[#D4FF00]'
                      : 'hover:bg-theme-elevated/50'
                  }`}
                >
                  {/* Set label */}
                  <td className="py-2 px-1.5 sm:px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded text-[11px] sm:text-xs font-['JetBrains_Mono'] font-bold ${
                        isWarmup
                          ? 'bg-theme-elevated text-theme-muted border border-theme'
                          : set.completed
                          ? 'bg-[#D4FF00]/20 text-[#78A300] dark:text-[#D4FF00] border border-[#78A300]/40 dark:border-[#D4FF00]/40'
                          : 'bg-theme-elevated text-theme-high'
                      }`}
                    >
                      {isWarmup ? 'W' : set.setNumber}
                    </span>
                  </td>

                  {/* Previous Performance */}
                  <td className="py-2 px-1.5 sm:px-3">
                    {set.previousWeight && set.previousReps ? (
                      <span className="text-[11px] sm:text-xs font-['JetBrains_Mono'] text-theme-muted whitespace-nowrap">
                        {set.previousWeight}×{set.previousReps}
                      </span>
                    ) : (
                      <span className="text-xs font-['JetBrains_Mono'] text-theme-muted/50">—</span>
                    )}
                  </td>

                  {/* Weight Input */}
                  <td className="py-2 px-1.5 sm:px-3">
                    <input
                      type="number"
                      step={unit === 'kg' ? '0.5' : '1'}
                      value={set.weight === 0 ? '' : set.weight}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const prEval = checkPersonalRecord(
                          { weight: val, reps: set.reps },
                          set.previousWeight && set.previousReps
                            ? { weight: set.previousWeight, reps: set.previousReps }
                            : undefined
                        );
                        onUpdateSet(exercise.id, set.id, { weight: val, isPR: prEval.isPR });
                      }}
                      className={`w-16 sm:w-24 px-1.5 sm:px-2 py-1.5 rounded tactical-input border font-['JetBrains_Mono'] font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#78A300] dark:focus:border-[#D4FF00] ${
                        set.completed ? 'border-transparent opacity-75' : 'border-theme'
                      }`}
                    />
                  </td>

                  {/* Reps Input */}
                  <td className="py-2 px-1.5 sm:px-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={set.reps === 0 ? '' : set.reps}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        const prEval = checkPersonalRecord(
                          { weight: set.weight, reps: val },
                          set.previousWeight && set.previousReps
                            ? { weight: set.previousWeight, reps: set.previousReps }
                            : undefined
                        );
                        onUpdateSet(exercise.id, set.id, { reps: val, isPR: prEval.isPR });
                      }}
                      className={`w-12 sm:w-16 px-1.5 sm:px-2 py-1.5 rounded tactical-input border font-['JetBrains_Mono'] font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#78A300] dark:focus:border-[#D4FF00] ${
                        set.completed ? 'border-transparent opacity-75' : 'border-theme'
                      }`}
                    />
                  </td>

                  {/* RPE Selector Chip */}
                  <td className="py-2 px-1.5 sm:px-3">
                    <select
                      value={set.rpe || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || undefined;
                        onUpdateSet(exercise.id, set.id, { rpe: val });
                      }}
                      className="px-1 sm:px-2 py-1 rounded bg-theme-elevated border border-theme text-[10px] sm:text-[11px] font-['JetBrains_Mono'] font-bold text-[#0284C7] dark:text-[#00F0FF] focus:outline-none focus:border-[#0284C7] dark:focus:border-[#00F0FF] cursor-pointer"
                    >
                      <option value="">RPE</option>
                      <option value="6.5">@6.5</option>
                      <option value="7.0">@7.0</option>
                      <option value="7.5">@7.5</option>
                      <option value="8.0">@8.0</option>
                      <option value="8.5">@8.5</option>
                      <option value="9.0">@9.0</option>
                      <option value="9.5">@9.5</option>
                      <option value="10.0">@10.0</option>
                    </select>
                  </td>

                  {/* Oversized 36x36px Tactile Completion Button */}
                  <td className="py-2 px-1.5 sm:px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToggleCompleteSet(exercise.id, set)}
                        aria-label={`Toggle ${isWarmup ? 'warmup ' : 'working '}set ${set.setNumber} completion for ${exercise.name}`}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center transition-all transform active:scale-95 ${
                          set.completed
                            ? 'bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117] volt-glow border border-[#9ED100] dark:border-[#D4FF00]'
                            : 'bg-theme-elevated hover:opacity-85 text-theme-muted hover:text-theme-high border border-theme'
                        }`}
                      >
                        <Check className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] ${set.completed ? 'text-[#0D1117]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                      </button>

                      {/* PR Achievement Badge indicator if achieved */}
                      {set.isPR && set.completed && (
                        <div
                          title="Personal Record Beaten!"
                          className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#FF5500]/15 border border-[#FF5500] text-[#D9480F] dark:text-[#FF5500] text-[9px] sm:text-[10px] font-['JetBrains_Mono'] font-bold uppercase ember-glow"
                        >
                          <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current animate-pulse" />
                          <span>PR</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Remove Set */}
                  <td className="py-2 px-1 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSet(exercise.id, set.id);
                      }}
                      aria-label={`Delete ${isWarmup ? 'warmup ' : 'working '}set ${set.setNumber} for ${exercise.name}`}
                      className="p-1 rounded text-theme-muted hover:text-[#FF5500] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Set Management Actions */}
      <div className="p-3 bg-theme-canvas/60 border-t border-theme flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddSet(exercise.id, 'normal')}
            className="px-3 py-1.5 rounded bg-transparent hover:bg-theme-elevated border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-high flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#78A300] dark:text-[#D4FF00]" /> ADD SET
          </button>
          <button
            onClick={() => onAddSet(exercise.id, 'warmup')}
            className="px-3 py-1.5 rounded bg-transparent hover:bg-theme-elevated border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-muted hover:text-theme-high flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-theme-muted" /> ADD WARMUP
          </button>
        </div>

        {/* Total volume for this exercise */}
        <div className="text-[11px] font-['JetBrains_Mono'] text-theme-muted hidden sm:block">
          EXERCISE LOAD: <strong className="text-theme-high">
            {exercise.sets
              .filter((s) => s.completed)
              .reduce((sum, s) => sum + s.weight * s.reps, 0)
              .toLocaleString()} {unit}
          </strong>
        </div>
      </div>
    </div>
  );
};
