import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { PersonalRecord, WeightUnit } from '../types/telemetry';
import { VOLUME_PROGRESSION_DATA } from '../data/initialData';

interface AnalyticsHubProps {
  personalRecords: PersonalRecord[];
  unit: WeightUnit;
}

export const AnalyticsHub: React.FC<AnalyticsHubProps> = ({
  personalRecords,
  unit,
}) => {
  const [selectedLift, setSelectedLift] = useState<'bench' | 'squat' | 'deadlift' | 'ohp'>('bench');

  const liftHistories = {
    bench: [
      { date: 'SEP 04', weight: 115, estimated1RM: 115 },
      { date: 'SEP 18', weight: 120, estimated1RM: 122 },
      { date: 'OCT 02', weight: 122.5, estimated1RM: 125 },
      { date: 'OCT 16', weight: 125, estimated1RM: 128 },
      { date: 'OCT 29', weight: 130, estimated1RM: 130 },
    ],
    squat: [
      { date: 'SEP 06', weight: 150, estimated1RM: 155 },
      { date: 'SEP 20', weight: 155, estimated1RM: 162 },
      { date: 'OCT 04', weight: 160, estimated1RM: 168 },
      { date: 'OCT 18', weight: 165, estimated1RM: 172 },
      { date: 'OCT 27', weight: 170, estimated1RM: 175 },
    ],
    deadlift: [
      { date: 'SEP 08', weight: 190, estimated1RM: 195 },
      { date: 'SEP 22', weight: 200, estimated1RM: 205 },
      { date: 'OCT 06', weight: 205, estimated1RM: 210 },
      { date: 'OCT 20', weight: 210, estimated1RM: 218 },
      { date: 'OCT 26', weight: 215, estimated1RM: 225 },
    ],
    ohp: [
      { date: 'SEP 10', weight: 70, estimated1RM: 72 },
      { date: 'SEP 24', weight: 72.5, estimated1RM: 75 },
      { date: 'OCT 08', weight: 75, estimated1RM: 78 },
      { date: 'OCT 22', weight: 77.5, estimated1RM: 80 },
      { date: 'OCT 29', weight: 80, estimated1RM: 85 },
    ]
  };

  const currentHistory = liftHistories[selectedLift];
  const maxLift = Math.max(...currentHistory.map((d) => d.estimated1RM));
  const minLift = Math.min(...currentHistory.map((d) => d.estimated1RM));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-theme-high tracking-tight">
              PERFORMANCE & PR TELEMETRY
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#FF5500]/15 text-[#D9480F] dark:text-[#FF5500] border border-[#FF5500]/30 uppercase">
              METRIC PROTOCOL
            </span>
          </div>
          <p className="text-xs font-['Inter'] text-theme-muted">
            Quantitative 1RM velocity models, weekly tonnage curves, and verified personal records.
          </p>
        </div>
      </div>

      {/* 1RM Progression Telemetry Visualizer */}
      <div className="rounded-lg bg-theme-card border border-theme p-5 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-['JetBrains_Mono'] text-[#0284C7] dark:text-[#00F0FF] uppercase tracking-wider block">
              ONE-REP MAX ESTIMATE TRAJECTORY
            </span>
            <h3 className="text-lg font-['Space_Grotesk'] font-bold text-theme-high">
              {selectedLift === 'bench' ? 'INCLINE / FLAT BENCH PRESS' :
               selectedLift === 'squat' ? 'HIGH-BAR BACK SQUAT' :
               selectedLift === 'deadlift' ? 'CONVENTIONAL DEADLIFT' : 'OVERHEAD PRESS'}
            </h3>
          </div>

          {/* Lift Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-theme-canvas p-1 rounded border border-theme">
            {[
              { id: 'bench', label: 'BENCH' },
              { id: 'squat', label: 'SQUAT' },
              { id: 'deadlift', label: 'DEADLIFT' },
              { id: 'ohp', label: 'OHP' }
            ].map((lift) => (
              <button
                key={lift.id}
                onClick={() => setSelectedLift(lift.id as any)}
                className={`px-3 py-1 text-xs font-['Space_Grotesk'] font-bold rounded transition-colors ${
                  selectedLift === lift.id
                    ? 'bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117]'
                    : 'text-theme-muted hover:text-theme-high'
                }`}
              >
                {lift.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Telemetry Curve */}
        <div className="bg-theme-canvas p-4 rounded border border-theme h-64 flex flex-col justify-between relative overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-6 px-10 pointer-events-none opacity-40">
            <div className="border-b border-theme w-full" />
            <div className="border-b border-theme w-full" />
            <div className="border-b border-theme w-full" />
            <div className="border-b border-theme w-full" />
          </div>

          {/* Chart SVG */}
          <svg className="w-full h-44 overflow-visible relative z-10" viewBox="0 0 500 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--border-active)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--border-active)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            {(() => {
              const points = currentHistory.map((pt, i) => {
                const x = 30 + (i / (currentHistory.length - 1)) * 440;
                const normalizedY = 130 - ((pt.estimated1RM - (minLift - 10)) / (maxLift - minLift + 20)) * 110;
                return `${x},${normalizedY}`;
              });
              const pathD = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ') + ` L 470,140 L 30,140 Z`;
              const lineD = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');

              return (
                <>
                  <path d={pathD} fill="url(#curveGradient)" />
                  <path d={lineD} fill="none" stroke="var(--border-active)" strokeWidth="3" strokeLinecap="round" />
                  {currentHistory.map((pt, i) => {
                    const x = 30 + (i / (currentHistory.length - 1)) * 440;
                    const y = 130 - ((pt.estimated1RM - (minLift - 10)) / (maxLift - minLift + 20)) * 110;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="var(--bg-canvas)" stroke="var(--border-active)" strokeWidth="2.5" />
                        <text
                          x={x}
                          y={y - 12}
                          fill="var(--text-high)"
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.estimated1RM} {unit}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Timeline labels */}
          <div className="flex justify-between px-6 text-[10px] font-['JetBrains_Mono'] text-theme-muted z-10 border-t border-theme pt-2">
            {currentHistory.map((pt, i) => (
              <span key={i}>{pt.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Volume Tonnage Progression + Muscle Strain Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weekly Volume Progression */}
        <div className="rounded-lg bg-theme-card border border-theme p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] text-[#0284C7] dark:text-[#00F0FF] uppercase tracking-wider block">
                TONNAGE PROGRESSION
              </span>
              <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high">
                WEEKLY LOAD TELEMETRY
              </h3>
            </div>
            <span className="text-xs font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]">
              PEAK: 51.2T
            </span>
          </div>

          <div className="space-y-3">
            {VOLUME_PROGRESSION_DATA.map((item, idx) => {
              const maxVol = 55000;
              const widthPct = Math.round((item.volume / maxVol) * 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-['JetBrains_Mono'] mb-1">
                    <span className="text-theme-muted font-medium">{item.week}</span>
                    <span className="text-theme-high font-bold">
                      {(item.volume / 1000).toFixed(1)}k {unit} <span className="text-[#0284C7] dark:text-[#00F0FF] font-normal">(@{item.intensity})</span>
                    </span>
                  </div>
                  <div className="w-full bg-theme-canvas h-2.5 rounded-xs overflow-hidden border border-theme">
                    <div
                      className="h-full bg-gradient-to-r from-[#0284C7] dark:from-[#00F0FF] to-[#78A300] dark:to-[#D4FF00] rounded-xs transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Muscle Group Strain Matrix */}
        <div className="rounded-lg bg-theme-card border border-theme p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-['JetBrains_Mono'] text-[#D9480F] dark:text-[#FF5500] uppercase tracking-wider block">
                FATIGUE & STRAIN DISTRIBUTION
              </span>
              <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high">
                ACTIVE MUSCLE RECOVERY MATRIX
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#FF5500]/15 text-[#D9480F] dark:text-[#FF5500] border border-[#FF5500]/30">
              STRAIN: 88%
            </span>
          </div>

          <div className="space-y-3">
            {[
              { group: 'CHEST / ANTERIOR DELT', strain: 94, status: 'HIGH STRAIN (48H RECOVERY)' },
              { group: 'TRICEPS / BRACHII', strain: 82, status: 'OPTIMAL STIMULUS' },
              { group: 'LATS / POSTERIOR CHAIN', strain: 35, status: 'RECOVERED (READY)' },
              { group: 'QUADS / GLUTES', strain: 20, status: 'FULLY FRESH' },
              { group: 'MEDIAL DELTOIDS', strain: 89, status: 'HIGH RECOVERY DEMAND' }
            ].map((m, idx) => (
              <div key={idx} className="p-2.5 rounded bg-theme-canvas border border-theme">
                <div className="flex justify-between text-xs font-['JetBrains_Mono'] mb-1">
                  <span className="text-theme-high font-bold">{m.group}</span>
                  <span className={m.strain > 80 ? 'text-[#D9480F] dark:text-[#FF5500]' : 'text-[#0284C7] dark:text-[#00F0FF]'}>
                    {m.strain}% ({m.status})
                  </span>
                </div>
                <div className="w-full bg-theme-card h-2 rounded-xs overflow-hidden">
                  <div
                    className={`h-full ${m.strain > 80 ? 'bg-[#FF5500]' : 'bg-[#0284C7] dark:bg-[#00F0FF]'}`}
                    style={{ width: `${m.strain}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PR Achievement Ledger */}
      <div className="rounded-lg bg-theme-card border border-theme overflow-hidden shadow-xs">
        <div className="p-4 border-b border-theme flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#D9480F] dark:text-[#FF5500] fill-current" />
            <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high uppercase tracking-wide">
              PERSONAL RECORD (PR) TELEMETRY LEDGER
            </h3>
          </div>
          <span className="text-xs font-['JetBrains_Mono'] text-[#D9480F] dark:text-[#FF5500]">
            VERIFIED METRICS
          </span>
        </div>

        <div className="divide-y border-theme-row">
          {personalRecords.map((pr) => (
            <div key={pr.id} className="p-4 flex items-center justify-between gap-4 hover:bg-theme-elevated/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#FF5500]/15 border border-[#FF5500] flex items-center justify-center ember-glow">
                  <Flame className="w-5 h-5 text-[#D9480F] dark:text-[#FF5500] fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-['Space_Grotesk'] font-bold text-theme-high">
                    {pr.exerciseName}
                  </h4>
                  <p className="text-xs font-['JetBrains_Mono'] text-theme-muted">
                    {pr.date} • {pr.weight} {unit} × {pr.reps} REPS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-sm font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]">
                    EST. 1RM {pr.estimated1RM} {unit}
                  </div>
                  <div className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#D9480F] dark:text-[#FF5500]">
                    +{pr.delta1RM} {unit} INCREASE
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
