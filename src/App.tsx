import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExerciseCard } from './components/ExerciseCard';
import { RestChronometer } from './components/RestChronometer';
import { PlateCalculatorModal } from './components/PlateCalculatorModal';
import { MacroTracker } from './components/MacroTracker';
import { AnalyticsHub } from './components/AnalyticsHub';
import { ProgramSelector } from './components/ProgramSelector';
import { FinishWorkoutModal } from './components/FinishWorkoutModal';
import {
  INITIAL_WORKOUT_SESSION,
  INITIAL_MACRO_TARGET,
  INITIAL_MEAL_LOGS,
  RECENT_PERSONAL_RECORDS,
} from './data/initialData';
import {
  WorkoutSession,
  WorkoutSet,
  Exercise,
  WeightUnit,
  MealLog,
  DailyMacroTarget,
  PersonalRecord
} from './types/telemetry';
import {
  calculateWorkoutMetrics,
  calculate1RM,
  checkPersonalRecord,
} from './utils/telemetryMath';
import {
  playSetCompleteTone,
  playPRAchievementTone
} from './utils/audioChimes';
import { Plus, Check, Flame, Timer } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'active' | 'programs' | 'analytics' | 'macros'>('active');
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dark / Light Mode state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kinetiq_theme') || localStorage.getItem('kinetic_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
  });

  // Apply dark class to <html> element whenever theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('kinetiq_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active workout state
  const [session, setSession] = useState<WorkoutSession>(INITIAL_WORKOUT_SESSION);
  const [sessionDuration, setSessionDuration] = useState<number>(INITIAL_WORKOUT_SESSION.durationSeconds);

  // Nutrition state
  const [macroTarget, setMacroTarget] = useState<DailyMacroTarget>(INITIAL_MACRO_TARGET);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(INITIAL_MEAL_LOGS);

  // PR records
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(RECENT_PERSONAL_RECORDS);

  // Rest Chronometer state
  const [restTimerOpen, setRestTimerOpen] = useState(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState(90);
  const [restTimerExercise, setRestTimerExercise] = useState<string | undefined>();
  const [restTimerSetNum, setRestTimerSetNum] = useState<number | undefined>();

  // Plate Calculator Modal state
  const [plateCalcModal, setPlateCalcModal] = useState<{
    isOpen: boolean;
    exerciseName: string;
    currentWeight: number;
    onApply?: (weight: number) => void;
  }>({
    isOpen: false,
    exerciseName: '',
    currentWeight: 100
  });

  // Finish Workout Modal state
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Live PR Banner
  const [activePRAlert, setActivePRAlert] = useState<{
    exerciseName: string;
    weight: number;
    reps: number;
    estimated1RM: number;
  } | null>(null);

  // Workout duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live session metrics
  const sessionMetrics = calculateWorkoutMetrics(session.exercises);

  // Set update handlers
  const handleUpdateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            return { ...s, ...updates };
          })
        };
      })
    }));
  };

  const handleToggleCompleteSet = (exerciseId: string, set: WorkoutSet) => {
    const exercise = session.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const willComplete = !set.completed;
    const current1RM = calculate1RM(set.weight, set.reps);

    // Evaluate PR
    const prResult = checkPersonalRecord(
      { weight: set.weight, reps: set.reps },
      exercise.historical1RM ? { weight: exercise.historical1RM, reps: 1, estimated1RM: exercise.historical1RM } : undefined
    );

    const isPR = willComplete && (prResult.isPR || (exercise.historical1RM ? current1RM > exercise.historical1RM : false));

    handleUpdateSet(exerciseId, set.id, {
      completed: willComplete,
      completedAt: willComplete ? new Date().toISOString() : undefined,
      isPR
    });

    if (willComplete) {
      if (soundEnabled) {
        if (isPR) {
          playPRAchievementTone();
        } else {
          playSetCompleteTone();
        }
      }

      // If PR achieved, show toast and register in PR ledger
      if (isPR) {
        setActivePRAlert({
          exerciseName: exercise.name,
          weight: set.weight,
          reps: set.reps,
          estimated1RM: current1RM
        });

        const newPR: PersonalRecord = {
          id: `pr-${Date.now()}`,
          exerciseName: exercise.name.replace(/^\d+\s*\/\/\s*/, ''),
          date: 'TODAY',
          weight: set.weight,
          reps: set.reps,
          estimated1RM: current1RM,
          delta1RM: prResult.delta1RM || 2.5
        };
        setPersonalRecords((prev) => [newPR, ...prev]);

        setTimeout(() => setActivePRAlert(null), 5000);
      }

      // Auto-trigger Rest Chronometer for next set
      setRestTimerSeconds(exercise.restTimeSeconds || 90);
      setRestTimerExercise(exercise.name);
      setRestTimerSetNum(set.setNumber + 1);
      setRestTimerOpen(true);
    }
  };

  const handleAddSet = (exerciseId: string, type: 'normal' | 'warmup') => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const nextSetNum = type === 'warmup' ? 1 : ex.sets.filter((s) => s.type !== 'warmup').length + 1;
        const newSet: WorkoutSet = {
          id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          setNumber: nextSetNum,
          type,
          previousWeight: lastSet?.weight || 100,
          previousReps: lastSet?.reps || 8,
          weight: lastSet?.weight || 100,
          reps: lastSet?.reps || 8,
          rpe: 8.0,
          completed: false
        };
        return {
          ...ex,
          sets: [...ex.sets, newSet]
        };
      })
    }));
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s) => s.id !== setId)
        };
      })
    }));
  };

  const handleOpenPlateCalculator = (
    exerciseName: string,
    currentWeight: number,
    onApply: (weight: number) => void
  ) => {
    setPlateCalcModal({
      isOpen: true,
      exerciseName,
      currentWeight,
      onApply
    });
  };

  const handleSelectTemplate = (tpl: any) => {
    setSession({
      id: `session-${Date.now()}`,
      title: tpl.title,
      subtitle: `${tpl.focus.toUpperCase()} // ACTIVE CYCLE`,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      isFinished: false,
      exercises: tpl.exercises
    });
    setSessionDuration(0);
    setActiveTab('active');
  };

  const handleAddExerciseToActiveSession = (exercise: Exercise) => {
    setSession((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
  };

  const handleConfirmFinish = () => {
    setShowFinishModal(false);
  };

  return (
    <div className="min-h-screen bg-theme-canvas text-theme-high font-['Inter'] flex flex-col antialiased transition-colors duration-150">
      {/* Top Navigation & Telemetry HUD */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unit={unit}
        setUnit={setUnit}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        toggleTheme={toggleTheme}
        sessionDuration={sessionDuration}
        totalVolume={sessionMetrics.totalVolume}
        prCount={sessionMetrics.prCount}
      />

      {/* Floating PR Alert Notification Banner */}
      {activePRAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md p-3.5 rounded-lg bg-theme-card border-2 border-[#FF5500] ember-glow flex items-center justify-between gap-3 animate-bounce shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#FF5500]/20 flex items-center justify-center text-[#D9480F] dark:text-[#FF5500]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-['JetBrains_Mono'] font-bold text-[#D9480F] dark:text-[#FF5500] uppercase tracking-wider block">
                ★ NEW PERSONAL RECORD DETECTED ★
              </span>
              <p className="text-xs font-['Space_Grotesk'] font-bold text-theme-high">
                {activePRAlert.exerciseName}: {activePRAlert.weight} {unit} × {activePRAlert.reps} (1RM: {activePRAlert.estimated1RM} {unit})
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePRAlert(null)}
            className="text-xs font-['JetBrains_Mono'] text-theme-muted hover:text-theme-high px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        {activeTab === 'active' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
            {/* Session Headline & Subtitle */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117] tracking-wider uppercase">
                    LIVE LOGGING SESSION
                  </span>
                  <span className="text-xs font-['JetBrains_Mono'] text-theme-muted">
                    {sessionMetrics.completedSets} OF {sessionMetrics.totalSets} SETS COMPLETED ({sessionMetrics.completionPercentage}%)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-theme-high tracking-tight">
                  {session.title}
                </h1>
                <p className="text-xs sm:text-sm font-['JetBrains_Mono'] text-theme-muted mt-1">
                  {session.subtitle}
                </p>
              </div>

              {/* Progress and quick stats tile */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 rounded bg-theme-card border border-theme text-right shadow-xs">
                  <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block">
                    SESSION TONNAGE
                  </span>
                  <span className="text-base sm:text-lg font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00]">
                    {sessionMetrics.totalVolume.toLocaleString()} {unit}
                  </span>
                </div>

                <div className="px-3.5 py-2 rounded bg-theme-card border border-theme text-right shadow-xs">
                  <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase block">
                    SESSION RPE
                  </span>
                  <span className="text-base sm:text-lg font-['JetBrains_Mono'] font-bold text-[#0284C7] dark:text-[#00F0FF]">
                    @{sessionMetrics.avgRpe || '8.5'}
                  </span>
                </div>
              </div>
            </div>

            {/* List of Exercise Matrix Containers */}
            <div className="space-y-4">
              {session.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  unit={unit}
                  onUpdateSet={handleUpdateSet}
                  onToggleCompleteSet={handleToggleCompleteSet}
                  onAddSet={handleAddSet}
                  onDeleteSet={handleDeleteSet}
                  onOpenPlateCalculator={handleOpenPlateCalculator}
                />
              ))}
            </div>

            {/* Add Exercise Prompt Button */}
            <div
              className="mt-6 p-4 rounded-lg bg-theme-card/60 border-2 border-dashed border-theme hover:border-[#78A300] dark:hover:border-[#D4FF00] flex flex-col items-center justify-center text-center transition-colors group cursor-pointer"
              onClick={() => setActiveTab('programs')}
            >
              <div className="p-2 rounded bg-theme-elevated group-hover:bg-[#9ED100] dark:group-hover:bg-[#D4FF00] group-hover:text-[#0D1117] text-[#78A300] dark:text-[#D4FF00] transition-colors mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-['Space_Grotesk'] font-bold text-theme-high">
                APPEND MOVEMENT FROM CATALOG
              </span>
              <span className="text-xs font-['Inter'] text-theme-muted mt-0.5">
                Browse 20+ calibrated strength exercises or load additional workout split blocks.
              </span>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <ProgramSelector
            onSelectTemplate={handleSelectTemplate}
            onAddExerciseToActiveSession={handleAddExerciseToActiveSession}
            unit={unit}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsHub
            personalRecords={personalRecords}
            unit={unit}
          />
        )}

        {activeTab === 'macros' && (
          <MacroTracker
            target={macroTarget}
            meals={mealLogs}
            onAddMeal={(meal) => setMealLogs((prev) => [
              ...prev,
              { id: `m-${Date.now()}`, ...meal }
            ])}
            onDeleteMeal={(mealId) => setMealLogs((prev) => prev.filter((m) => m.id !== mealId))}
            onUpdateTarget={(newTarget) => setMacroTarget(newTarget)}
          />
        )}
      </main>

      {/* Floating Rest Chronometer Drawer */}
      {restTimerOpen && (
        <RestChronometer
          initialSeconds={restTimerSeconds}
          isActive={true}
          onClose={() => setRestTimerOpen(false)}
          soundEnabled={soundEnabled}
          exerciseName={restTimerExercise}
          setNumber={restTimerSetNum}
        />
      )}

      {/* Barbell Plate Calculator Modal */}
      {plateCalcModal.isOpen && (
        <PlateCalculatorModal
          initialWeight={plateCalcModal.currentWeight}
          unit={unit}
          onApplyWeight={plateCalcModal.onApply}
          onClose={() => setPlateCalcModal((prev) => ({ ...prev, isOpen: false }))}
          exerciseName={plateCalcModal.exerciseName}
        />
      )}

      {/* Finish Workout Summary Modal */}
      {showFinishModal && (
        <FinishWorkoutModal
          session={session}
          unit={unit}
          onConfirmFinish={handleConfirmFinish}
          onCancel={() => setShowFinishModal(false)}
        />
      )}

      {/* Sticky Bottom Action Drawer */}
      {activeTab === 'active' && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-theme-drawer border-t border-theme backdrop-blur-xl px-4 py-3 shadow-2xl transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Session mini telemetry */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRestTimerOpen(!restTimerOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-theme-elevated hover:opacity-85 border border-theme text-xs font-['JetBrains_Mono'] font-bold text-theme-high transition-colors"
              >
                <Timer className="w-4 h-4 text-[#78A300] dark:text-[#D4FF00]" />
                <span className="hidden sm:inline">REST TIMER</span>
              </button>

              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-['JetBrains_Mono'] text-theme-muted uppercase">
                  PROGRESSION
                </span>
                <span className="text-xs font-['JetBrains_Mono'] font-bold text-theme-high">
                  {sessionMetrics.completedSets} of {sessionMetrics.totalSets} Sets ({sessionMetrics.completionPercentage}%)
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('programs')}
                className="px-3.5 py-2.5 rounded bg-transparent hover:bg-theme-elevated border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-high transition-colors hidden sm:flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#78A300] dark:text-[#D4FF00]" /> ADD EXERCISE
              </button>

              <button
                onClick={() => setShowFinishModal(true)}
                className="px-6 py-2.5 rounded bg-[#9ED100] dark:bg-[#D4FF00] hover:opacity-90 active:scale-[0.98] text-[#0D1117] text-xs sm:text-sm font-['Space_Grotesk'] font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>FINISH WORKOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
