import React from 'react';
import { Volume2, VolumeX, Dumbbell, Calendar, BarChart3, Utensils, Flame, Sun, Moon } from 'lucide-react';
import { WeightUnit } from '../types/telemetry';
import { formatTime } from '../utils/telemetryMath';

interface HeaderProps {
  activeTab: 'active' | 'programs' | 'analytics' | 'macros';
  setActiveTab: (tab: 'active' | 'programs' | 'analytics' | 'macros') => void;
  unit: WeightUnit;
  setUnit: (unit: WeightUnit) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sessionDuration: number;
  totalVolume: number;
  prCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unit,
  setUnit,
  soundEnabled,
  setSoundEnabled,
  theme,
  toggleTheme,
  sessionDuration,
  totalVolume,
  prCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-theme-header backdrop-blur-md border-b border-theme transition-colors">
      {/* Top Telemetry Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-theme-card border border-theme flex items-center justify-center relative group shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#78A300] animate-pulse shadow-[0_0_8px_#D4FF00]" />
            <div className="absolute inset-0 rounded border border-[#D4FF00]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold tracking-tight text-theme-high">
                KINETIQ OBSIDIAN
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#D4FF00]/20 text-[#78A300] dark:text-[#D4FF00] border border-[#78A300]/30 dark:border-[#D4FF00]/30 tracking-wider">
                SYS.V4
              </span>
            </div>
            <p className="text-[10px] font-['JetBrains_Mono'] text-theme-muted tracking-wider uppercase hidden sm:block">
              QUANTITATIVE ATHLETIC TELEMETRY
            </p>
          </div>
        </div>

        {/* Live session readout & quick toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* PR counter pill if any PRs in session */}
          {prCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF5500]/15 border border-[#FF5500] text-[#D9480F] dark:text-[#FF5500] text-xs font-['JetBrains_Mono'] font-bold">
              <Flame className="w-3.5 h-3.5 animate-bounce" />
              <span>{prCount} PR{prCount > 1 ? 'S' : ''}</span>
            </div>
          )}

          {/* Volume Tonnage display */}
          <div className="hidden md:flex flex-col items-end px-2.5 py-1 rounded bg-theme-card border border-theme">
            <span className="text-[9px] font-['JetBrains_Mono'] text-theme-muted uppercase tracking-wider">
              SESSION VOLUME
            </span>
            <span className="text-xs font-['JetBrains_Mono'] font-bold text-theme-high">
              {totalVolume.toLocaleString()} {unit.toUpperCase()}
            </span>
          </div>

          {/* Session Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-theme-card border border-theme">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78A300] dark:bg-[#D4FF00]" />
            <span className="text-xs sm:text-sm font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00] tracking-wider">
              {formatTime(sessionDuration)}
            </span>
          </div>

          {/* Unit Switcher */}
          <button
            onClick={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')}
            aria-label="Toggle weight units"
            className="px-2 py-1.5 rounded bg-theme-elevated hover:opacity-80 border border-theme text-[11px] font-['JetBrains_Mono'] font-bold text-theme-high transition-colors"
          >
            {unit.toUpperCase()}
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? 'Disable audio feedback' : 'Enable audio feedback'}
            className="p-1.5 rounded bg-theme-elevated hover:opacity-80 border border-theme text-theme-muted hover:text-theme-high transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#78A300] dark:text-[#D4FF00]" />
            ) : (
              <VolumeX className="w-4 h-4 text-theme-muted" />
            )}
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-theme-high transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#D4FF00]" />
                <span className="text-[10px] font-['JetBrains_Mono'] font-bold text-[#D4FF00] hidden sm:inline">
                  LIGHT
                </span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#0F172A]" />
                <span className="text-[10px] font-['JetBrains_Mono'] font-bold text-[#0F172A] hidden sm:inline">
                  DARK
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-theme-row">
        <button
          onClick={() => setActiveTab('active')}
          aria-label="Active Workout Telemetry Matrix"
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-['Space_Grotesk'] font-semibold tracking-wide flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'active'
              ? 'border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00] bg-theme-card/60'
              : 'border-transparent text-theme-muted hover:text-theme-high hover:bg-theme-card/30'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>ACTIVE SESSION</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          aria-label="Programs and Template Library"
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-['Space_Grotesk'] font-semibold tracking-wide flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'programs'
              ? 'border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00] bg-theme-card/60'
              : 'border-transparent text-theme-muted hover:text-theme-high hover:bg-theme-card/30'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>PROGRAMS & SPLITS</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          aria-label="Telemetry Analytics and PR Ledger"
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-['Space_Grotesk'] font-semibold tracking-wide flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00] bg-theme-card/60'
              : 'border-transparent text-theme-muted hover:text-theme-high hover:bg-theme-card/30'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>ANALYTICS & PRs</span>
        </button>

        <button
          onClick={() => setActiveTab('macros')}
          aria-label="Macro Recomposition and Nutrition"
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-['Space_Grotesk'] font-semibold tracking-wide flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'macros'
              ? 'border-[#0284C7] dark:border-[#00F0FF] text-[#0284C7] dark:text-[#00F0FF] bg-theme-card/60'
              : 'border-transparent text-theme-muted hover:text-theme-high hover:bg-theme-card/30'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>MACRO RECOMP</span>
        </button>
      </nav>
    </header>
  );
};
