import React, { useEffect, useState } from 'react';
import { Play, Pause, Plus, Minus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { formatTime } from '../utils/telemetryMath';
import { playRestWarningTone, playRestFinishedTone } from '../utils/audioChimes';

interface RestChronometerProps {
  initialSeconds?: number;
  isActive: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  exerciseName?: string;
  setNumber?: number;
}

export const RestChronometer: React.FC<RestChronometerProps> = ({
  initialSeconds = 90,
  isActive,
  onClose,
  soundEnabled,
  exerciseName,
  setNumber
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(isActive);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemainingSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds, exerciseName, setNumber]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (soundEnabled) playRestFinishedTone();
            setIsRunning(false);
            return 0;
          }
          if (prev <= 10 && prev > 1 && soundEnabled) {
            playRestWarningTone();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, remainingSeconds, soundEnabled]);

  const progressFraction = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressFraction);
  const isFinalTen = remainingSeconds > 0 && remainingSeconds <= 10;
  const isCompleted = remainingSeconds === 0;

  const handleAdjust = (delta: number) => {
    setRemainingSeconds((prev) => Math.max(0, prev + delta));
    setTotalSeconds((prev) => Math.max(prev + delta, remainingSeconds + delta));
  };

  const handleSetPreset = (secs: number) => {
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(true);
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-theme-drawer border border-[#78A300] dark:border-[#D4FF00] volt-glow cursor-pointer backdrop-blur-md transition-all hover:scale-105 shadow-xl"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#78A300] dark:bg-[#D4FF00] animate-pulse" />
        <span className="text-xs font-['JetBrains_Mono'] font-bold text-theme-high">
          REST: <span className="text-[#78A300] dark:text-[#D4FF00]">{formatTime(remainingSeconds)}</span>
        </span>
        <ChevronUp className="w-4 h-4 text-theme-muted" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-2 sm:right-6 z-50 w-[320px] sm:w-[360px] rounded-lg bg-theme-drawer border border-theme shadow-2xl backdrop-blur-xl p-4 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-theme pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isFinalTen ? 'bg-[#FF5500] animate-ping' : isCompleted ? 'bg-[#78A300] dark:bg-[#D4FF00]' : 'bg-[#0284C7] dark:bg-[#00F0FF]'}`} />
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-theme-high uppercase">
            REST CHRONOMETER
          </span>
          {isFinalTen && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-['JetBrains_Mono'] bg-[#FF5500]/20 text-[#D9480F] dark:text-[#FF5500] border border-[#FF5500] animate-pulse">
              PREP NEXT SET
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize rest timer"
            className="p-1 text-theme-muted hover:text-theme-high rounded hover:bg-theme-elevated"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close rest timer"
            className="p-1 text-theme-muted hover:text-[#FF5500] rounded hover:bg-theme-elevated"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {exerciseName && (
        <div className="mb-3 text-[11px] font-['JetBrains_Mono'] text-theme-muted truncate">
          UP NEXT: <span className="text-theme-high font-semibold">{exerciseName}</span> {setNumber ? `(SET ${setNumber})` : ''}
        </div>
      )}

      {/* Circular Progress & Numerical Readout */}
      <div className="flex items-center justify-center gap-6 my-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Base track */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              className="text-[#E2E8F0] dark:text-[#21262D]"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Active stroke */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke={isFinalTen ? '#FF5500' : 'var(--border-active)'}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>

          {/* Central monospaced countdown clock */}
          <div className="absolute flex flex-col items-center justify-center">
            <span
              className={`font-['JetBrains_Mono'] font-bold text-2xl tracking-tighter ${
                isFinalTen
                  ? 'text-[#D9480F] dark:text-[#FF5500] scale-110 transition-transform'
                  : isCompleted
                  ? 'text-[#78A300] dark:text-[#D4FF00]'
                  : 'text-theme-high'
              }`}
            >
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase tracking-widest mt-0.5">
              {isCompleted ? 'READY' : 'RECOVERY'}
            </span>
          </div>
        </div>

        {/* Nudge Adjusters */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleAdjust(15)}
            className="px-2.5 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-[11px] font-['JetBrains_Mono'] font-semibold text-theme-high flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3 text-[#78A300] dark:text-[#D4FF00]" /> 15S
          </button>
          <button
            onClick={() => handleAdjust(-15)}
            className="px-2.5 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-[11px] font-['JetBrains_Mono'] font-semibold text-theme-high flex items-center gap-1 transition-colors"
          >
            <Minus className="w-3 h-3 text-[#D9480F] dark:text-[#FF5500]" /> 15S
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1.5 rounded border text-[11px] font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-1 transition-all ${
              isRunning
                ? 'bg-theme-elevated border-theme text-theme-muted hover:text-theme-high'
                : 'bg-[#9ED100] dark:bg-[#D4FF00] border-[#9ED100] dark:border-[#D4FF00] text-[#0D1117]'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isRunning ? 'PAUSE' : 'START'}
          </button>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-theme">
        {[60, 90, 120, 180].map((sec) => (
          <button
            key={sec}
            onClick={() => handleSetPreset(sec)}
            className={`py-1 text-[11px] font-['JetBrains_Mono'] font-bold rounded border transition-colors ${
              totalSeconds === sec && isRunning
                ? 'bg-[#D4FF00]/20 border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00]'
                : 'bg-theme-elevated/60 hover:bg-theme-elevated border-theme text-theme-muted hover:text-theme-high'
            }`}
          >
            {sec}S
          </button>
        ))}
      </div>
    </div>
  );
};
