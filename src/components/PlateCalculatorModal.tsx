import React, { useState } from 'react';
import { X, Check, Dumbbell } from 'lucide-react';
import { WeightUnit } from '../types/telemetry';
import { calculateBarbellPlates } from '../utils/telemetryMath';

interface PlateCalculatorModalProps {
  initialWeight: number;
  unit: WeightUnit;
  onApplyWeight?: (weight: number) => void;
  onClose: () => void;
  exerciseName?: string;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  initialWeight,
  unit,
  onApplyWeight,
  onClose,
  exerciseName
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight || (unit === 'kg' ? 100 : 225));
  const [barWeight, setBarWeight] = useState<number>(unit === 'kg' ? 20 : 45);

  const plateColors: Record<number, { bg: string; text: string; border: string }> = {
    // Metric
    25: { bg: '#DC2626', text: '#FFFFFF', border: '#B91C1C' },
    20: { bg: '#2563EB', text: '#FFFFFF', border: '#1D4ED8' },
    15: { bg: '#EAB308', text: '#000000', border: '#CA8A04' },
    10: { bg: '#16A34A', text: '#FFFFFF', border: '#15803D' },
    5: { bg: '#F8FAFC', text: '#0F172A', border: '#94A3B8' },
    2.5: { bg: '#1E293B', text: '#F8FAFC', border: '#475569' },
    1.25: { bg: '#94A3B8', text: '#0F172A', border: '#CBD5E1' },
    // Imperial
    45: { bg: '#2563EB', text: '#FFFFFF', border: '#1D4ED8' },
    35: { bg: '#EAB308', text: '#000000', border: '#CA8A04' },
  };

  const calculation = calculateBarbellPlates(targetWeight, barWeight, unit);

  const handleNudge = (delta: number) => {
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 100) / 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-lg bg-theme-card border border-theme shadow-2xl p-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-theme pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-theme-elevated text-[#78A300] dark:text-[#D4FF00]">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high">
                OLYMPIC PLATE CALCULATOR
              </h3>
              {exerciseName && (
                <p className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">
                  TARGET EXERCISE: {exerciseName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close plate calculator"
            className="p-1 rounded text-theme-muted hover:text-theme-high hover:bg-theme-elevated"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Weight Input & Controls */}
        <div className="bg-theme-canvas p-4 rounded border border-theme mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-['JetBrains_Mono'] text-theme-muted uppercase tracking-wider">
              TARGET LOAD ({unit.toUpperCase()})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">BAR:</span>
              <button
                onClick={() => setBarWeight(unit === 'kg' ? 20 : 45)}
                className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold border transition-colors ${
                  barWeight === (unit === 'kg' ? 20 : 45)
                    ? 'bg-[#D4FF00]/20 border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00]'
                    : 'bg-theme-elevated border-theme text-theme-muted'
                }`}
              >
                {unit === 'kg' ? '20 KG' : '45 LBS'} (MEN)
              </button>
              <button
                onClick={() => setBarWeight(unit === 'kg' ? 15 : 35)}
                className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold border transition-colors ${
                  barWeight === (unit === 'kg' ? 15 : 35)
                    ? 'bg-[#D4FF00]/20 border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00]'
                    : 'bg-theme-elevated border-theme text-theme-muted'
                }`}
              >
                {unit === 'kg' ? '15 KG' : '35 LBS'} (WOMEN)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={unit === 'kg' ? '2.5' : '5'}
                min={barWeight}
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || barWeight)}
                className="w-32 bg-theme-recessed border border-theme text-[#78A300] dark:text-[#D4FF00] font-['JetBrains_Mono'] font-bold text-2xl px-3 py-2 rounded focus:outline-none focus:border-[#78A300] dark:focus:border-[#D4FF00]"
              />
              <span className="text-sm font-['JetBrains_Mono'] text-theme-muted">{unit}</span>
            </div>

            {/* Quick Nudge Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleNudge(-10)}
                className="px-2 py-1 bg-theme-elevated hover:opacity-85 border border-theme rounded text-xs font-['JetBrains_Mono'] font-bold text-theme-high"
              >
                -10
              </button>
              <button
                onClick={() => handleNudge(-2.5)}
                className="px-2 py-1 bg-theme-elevated hover:opacity-85 border border-theme rounded text-xs font-['JetBrains_Mono'] font-bold text-theme-high"
              >
                -2.5
              </button>
              <button
                onClick={() => handleNudge(2.5)}
                className="px-2 py-1 bg-theme-elevated hover:opacity-85 border border-theme rounded text-xs font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]"
              >
                +2.5
              </button>
              <button
                onClick={() => handleNudge(10)}
                className="px-2 py-1 bg-theme-elevated hover:opacity-85 border border-theme rounded text-xs font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Barbell Sleeve Visualizer */}
        <div className="bg-theme-canvas p-5 rounded border border-theme mb-4 overflow-x-auto">
          <div className="text-[11px] font-['JetBrains_Mono'] text-theme-muted uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>PER SIDE LOADING PROFILE</span>
            <span className="text-[#0284C7] dark:text-[#00F0FF]">{((targetWeight - barWeight) / 2).toFixed(1)} {unit} / side</span>
          </div>

          {/* Graphical sleeve */}
          <div className="flex items-center min-h-[90px] px-2 py-3 bg-theme-card rounded border border-theme">
            {/* Barbell shaft */}
            <div className="w-16 h-3 bg-gradient-to-r from-zinc-600 to-zinc-400 rounded-l relative flex items-center justify-end">
              <span className="text-[9px] font-['JetBrains_Mono'] text-zinc-300 pr-1 select-none">BAR</span>
            </div>
            {/* Collar stopper */}
            <div className="w-3.5 h-14 bg-zinc-500 rounded-sm border-r border-zinc-700 shadow-md" />
            
            {/* Plate Stack Per Side */}
            <div className="flex items-center gap-1 pl-1">
              {calculation.platesPerSide.length === 0 ? (
                <span className="text-xs font-['JetBrains_Mono'] text-theme-muted italic pl-3">
                  Unloaded bar ({barWeight} {unit})
                </span>
              ) : (
                calculation.platesPerSide.flatMap((plate, pIdx) =>
                  Array.from({ length: plate.count }).map((_, cIdx) => {
                    const styling = plateColors[plate.weight] || { bg: '#334155', text: '#FFFFFF', border: '#475569' };
                    const heightClass =
                      plate.weight >= 25 ? 'h-20 w-4' :
                      plate.weight >= 20 ? 'h-18 w-4' :
                      plate.weight >= 15 ? 'h-16 w-3.5' :
                      plate.weight >= 10 ? 'h-14 w-3' :
                      plate.weight >= 5 ? 'h-11 w-2.5' :
                      'h-8 w-2';

                    return (
                      <div
                        key={`${pIdx}-${cIdx}`}
                        className={`${heightClass} rounded-xs flex items-center justify-center font-['JetBrains_Mono'] font-bold shadow-md transition-all group relative cursor-default`}
                        style={{ backgroundColor: styling.bg, border: `1px solid ${styling.border}` }}
                      >
                        <span 
                          className="text-[8px] transform -rotate-90 select-none whitespace-nowrap"
                          style={{ color: styling.text }}
                        >
                          {plate.weight}
                        </span>
                      </div>
                    );
                  })
                )
              )}
            </div>

            {/* Sleeve end cap */}
            <div className="w-12 h-4 bg-gradient-to-r from-zinc-400 to-zinc-600 rounded-r border-l border-zinc-700 ml-1" />
          </div>

          {/* Plates Breakdown Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {calculation.platesPerSide.map((plate) => {
              const styling = plateColors[plate.weight] || { bg: '#334155', text: '#FFFFFF', border: '#475569' };
              return (
                <div
                  key={plate.weight}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-theme-elevated border border-theme"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: styling.bg }}
                  />
                  <span className="text-xs font-['JetBrains_Mono'] font-bold text-theme-high">
                    {plate.count}x {plate.weight} {unit}
                  </span>
                </div>
              );
            })}
          </div>

          {calculation.remainder > 0 && (
            <p className="text-[11px] font-['JetBrains_Mono'] text-[#D9480F] dark:text-[#FF5500] mt-2">
              Note: Remainder of {calculation.remainder} {unit} requires micro-plates or rounding.
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-transparent border border-theme hover:bg-theme-elevated text-xs font-['Space_Grotesk'] font-bold text-theme-muted hover:text-theme-high transition-colors"
          >
            DISMISS
          </button>
          {onApplyWeight && (
            <button
              onClick={() => {
                onApplyWeight(calculation.totalAchieved);
                onClose();
              }}
              className="px-4 py-2 rounded bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117] text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> APPLY {calculation.totalAchieved} {unit.toUpperCase()} TO SET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
