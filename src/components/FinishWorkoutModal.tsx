import React from 'react';
import { Award, CheckCircle2, Flame, X } from 'lucide-react';
import { WorkoutSession, WeightUnit } from '../types/telemetry';
import { calculateWorkoutMetrics, formatTime } from '../utils/telemetryMath';

interface FinishWorkoutModalProps {
  session: WorkoutSession;
  unit: WeightUnit;
  onConfirmFinish: () => void;
  onCancel: () => void;
}

export const FinishWorkoutModal: React.FC<FinishWorkoutModalProps> = ({
  session,
  unit,
  onConfirmFinish,
  onCancel,
}) => {
  const metrics = calculateWorkoutMetrics(session.exercises);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-lg bg-theme-card border border-[#78A300] dark:border-[#D4FF00] volt-glow p-6 text-center shadow-2xl relative">
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute right-4 top-4 text-theme-muted hover:text-theme-high p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-[#D4FF00]/20 border-2 border-[#78A300] dark:border-[#D4FF00] flex items-center justify-center mx-auto mb-4">
          <Award className="w-7 h-7 text-[#78A300] dark:text-[#D4FF00]" />
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#D4FF00]/20 text-[#78A300] dark:text-[#D4FF00] border border-[#78A300]/30 dark:border-[#D4FF00]/30 tracking-widest uppercase mb-1 inline-block">
          SESSION DEBRIEF // TELEMETRY COMPLETE
        </span>

        <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-theme-high tracking-tight mb-1">
          {session.title}
        </h2>
        <p className="text-xs font-['Inter'] text-theme-muted mb-6">
          Quantitative kinetiq training cycle successfully completed.
        </p>

        {/* Key Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded bg-theme-canvas border border-theme">
            <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block mb-1">
              DURATION
            </span>
            <span className="text-base font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]">
              {formatTime(session.durationSeconds)}
            </span>
          </div>

          <div className="p-3 rounded bg-theme-canvas border border-theme">
            <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block mb-1">
              TOTAL LOAD
            </span>
            <span className="text-base font-['JetBrains_Mono'] font-bold text-theme-high">
              {metrics.totalVolume.toLocaleString()} {unit}
            </span>
          </div>

          <div className="p-3 rounded bg-theme-canvas border border-theme">
            <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block mb-1">
              SETS DONE
            </span>
            <span className="text-base font-['JetBrains_Mono'] font-bold text-[#0284C7] dark:text-[#00F0FF]">
              {metrics.completedSets} / {metrics.totalSets}
            </span>
          </div>

          <div className="p-3 rounded bg-theme-canvas border border-theme">
            <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block mb-1">
              AVG INTENSITY
            </span>
            <span className="text-base font-['JetBrains_Mono'] font-bold text-[#D9480F] dark:text-[#FF5500]">
              @{metrics.avgRpe || '8.5'}
            </span>
          </div>
        </div>

        {/* PR Achievements if hit */}
        {metrics.prCount > 0 && (
          <div className="mb-6 p-3.5 rounded bg-[#FF5500]/15 border border-[#FF5500] text-left flex items-center gap-3">
            <Flame className="w-6 h-6 text-[#D9480F] dark:text-[#FF5500] fill-current shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-['Space_Grotesk'] font-bold text-[#D9480F] dark:text-[#FF5500] uppercase tracking-wide">
                {metrics.prCount} PERSONAL RECORD{metrics.prCount > 1 ? 'S' : ''} ACHIEVED!
              </div>
              <p className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">
                New strength velocity baseline established and recorded in system ledger.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded bg-transparent hover:bg-theme-elevated border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-muted hover:text-theme-high transition-colors"
          >
            RETURN TO SESSION
          </button>
          <button
            onClick={onConfirmFinish}
            className="flex-1 py-2.5 rounded bg-[#9ED100] dark:bg-[#D4FF00] hover:opacity-90 text-[#0D1117] text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" /> COMMIT TO LOG
          </button>
        </div>
      </div>
    </div>
  );
};
