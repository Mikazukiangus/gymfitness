import React, { useState } from 'react';
import { Play, Plus, Clock, Search, Check, Layers } from 'lucide-react';
import { WORKOUT_TEMPLATES, EXERCISE_CATALOG } from '../data/initialData';
import { Exercise, WeightUnit } from '../types/telemetry';

interface ProgramSelectorProps {
  onSelectTemplate: (template: typeof WORKOUT_TEMPLATES[0]) => void;
  onAddExerciseToActiveSession: (exercise: Exercise) => void;
  unit: WeightUnit;
}

export const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  onSelectTemplate,
  onAddExerciseToActiveSession,
  unit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('ALL');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const muscles = ['ALL', 'Chest', 'Back', 'Shoulders', 'Quads', 'Hamstrings', 'Triceps', 'Biceps'];

  const filteredCatalog = EXERCISE_CATALOG.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'ALL' || ex.targetMuscle.toLowerCase().includes(selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  const handleAddFromCatalog = (catExercise: typeof EXERCISE_CATALOG[0]) => {
    const newExercise: Exercise = {
      ...catExercise,
      sets: [
        { id: `s-new-1-${Date.now()}`, setNumber: 1, type: 'normal', weight: unit === 'kg' ? 60 : 135, reps: 8, completed: false },
        { id: `s-new-2-${Date.now()}`, setNumber: 2, type: 'normal', weight: unit === 'kg' ? 60 : 135, reps: 8, completed: false },
        { id: `s-new-3-${Date.now()}`, setNumber: 3, type: 'normal', weight: unit === 'kg' ? 60 : 135, reps: 8, completed: false }
      ]
    };
    onAddExerciseToActiveSession(newExercise);
    setAddedNotice(`Added "${catExercise.name}" to Active Session`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-theme-high tracking-tight">
              TACTICAL ROUTINES & EXERCISE LIBRARY
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#D4FF00]/20 text-[#78A300] dark:text-[#D4FF00] border border-[#78A300]/30 dark:border-[#D4FF00]/30 uppercase">
              SPLIT ARCHITECTURE
            </span>
          </div>
          <p className="text-xs font-['Inter'] text-theme-muted">
            Pre-configured hyper-density training templates and comprehensive athletic movement catalog.
          </p>
        </div>
      </div>

      {addedNotice && (
        <div className="mb-4 p-3 rounded bg-[#D4FF00]/20 border border-[#78A300] dark:border-[#D4FF00] text-[#78A300] dark:text-[#D4FF00] text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> {addedNotice}
        </div>
      )}

      {/* Routine Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {WORKOUT_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-lg bg-theme-card border border-theme hover:border-[#78A300] dark:hover:border-[#D4FF00] transition-all flex flex-col justify-between group overflow-hidden shadow-xs"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#0284C7]/15 dark:bg-[#00F0FF]/15 text-[#0284C7] dark:text-[#00F0FF] border border-[#0284C7]/30 dark:border-[#00F0FF]/30 uppercase">
                  {tpl.focus}
                </span>
                <span className="flex items-center gap-1 text-xs font-['JetBrains_Mono'] text-theme-muted">
                  <Clock className="w-3.5 h-3.5 text-[#78A300] dark:text-[#D4FF00]" /> ~{tpl.estimatedMinutes}m
                </span>
              </div>

              <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high mb-3 group-hover:text-[#78A300] dark:group-hover:text-[#D4FF00] transition-colors">
                {tpl.title}
              </h3>

              <div className="space-y-2 mb-4">
                {tpl.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-theme-muted border-b border-theme-row pb-1">
                    <span className="truncate pr-2">{ex.name}</span>
                    <span className="text-theme-high font-semibold shrink-0">{ex.sets.length} sets</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-theme-canvas/60 border-t border-theme flex items-center justify-between">
              <span className="text-xs font-['JetBrains_Mono'] text-theme-muted">
                {tpl.exercises.length} MOVEMENTS
              </span>
              <button
                onClick={() => onSelectTemplate(tpl)}
                className="px-3.5 py-1.5 rounded bg-[#9ED100] dark:bg-[#D4FF00] hover:opacity-90 text-[#0D1117] text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> LAUNCH SESSION
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Movement Library Search & Instant Add */}
      <div className="rounded-lg bg-theme-card border border-theme p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0284C7] dark:text-[#00F0FF]" />
            <h3 className="text-base font-['Space_Grotesk'] font-bold text-theme-high">
              QUICK-ADD EXERCISE CATALOG
            </h3>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search exercise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded bg-theme-recessed border border-theme text-xs font-['Inter'] text-theme-high focus:border-[#78A300] dark:focus:border-[#D4FF00]"
            />
          </div>
        </div>

        {/* Muscle group filter pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {muscles.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-2.5 py-1 rounded text-xs font-['JetBrains_Mono'] font-semibold transition-colors ${
                selectedMuscle === muscle
                  ? 'bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117]'
                  : 'bg-theme-elevated text-theme-muted hover:text-theme-high'
              }`}
            >
              {muscle.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exercises List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredCatalog.map((ex) => (
            <div
              key={ex.id}
              className="p-3 rounded bg-theme-canvas border border-theme hover:border-[#78A300] dark:hover:border-[#D4FF00] flex items-center justify-between gap-2 transition-colors"
            >
              <div>
                <h4 className="text-xs font-['Space_Grotesk'] font-bold text-theme-high truncate">
                  {ex.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-['JetBrains_Mono'] text-theme-muted mt-0.5">
                  <span className="text-[#0284C7] dark:text-[#00F0FF]">{ex.targetMuscle}</span>
                  <span>•</span>
                  <span>{ex.equipment}</span>
                  {ex.historical1RM && (
                    <>
                      <span>•</span>
                      <span className="text-[#78A300] dark:text-[#D4FF00]">1RM: {ex.historical1RM} {unit}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAddFromCatalog(ex)}
                aria-label={`Add ${ex.name} to workout`}
                className="p-1.5 rounded bg-theme-elevated hover:bg-[#9ED100] dark:hover:bg-[#D4FF00] hover:text-[#0D1117] text-[#78A300] dark:text-[#D4FF00] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
