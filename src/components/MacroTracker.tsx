import React, { useState } from 'react';
import { Utensils, Plus, Trash2 } from 'lucide-react';
import { MealLog, DailyMacroTarget } from '../types/telemetry';
import { calculateMacroCalories } from '../utils/telemetryMath';

interface MacroTrackerProps {
  target: DailyMacroTarget;
  meals: MealLog[];
  onAddMeal: (meal: Omit<MealLog, 'id'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onUpdateTarget: (newTarget: DailyMacroTarget) => void;
}

export const MacroTracker: React.FC<MacroTrackerProps> = ({
  target,
  meals,
  onAddMeal,
  onDeleteMeal,
  onUpdateTarget,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditTarget, setShowEditTarget] = useState(false);

  // Form states
  const [mealName, setMealName] = useState('');
  const [proteinGrams, setProteinGrams] = useState<number>(40);
  const [carbsGrams, setCarbsGrams] = useState<number>(60);
  const [fatGrams, setFatGrams] = useState<number>(15);

  // Target edit form states
  const [targetP, setTargetP] = useState(target.targetProtein);
  const [targetC, setTargetC] = useState(target.targetCarbs);
  const [targetF, setTargetF] = useState(target.targetFat);

  // Compute consumed totals
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  const calorieDelta = totalCalories - target.targetCalories;
  const isSurplus = calorieDelta > 0;

  // Split calculation
  const macroCalc = calculateMacroCalories(totalProtein, totalCarbs, totalFat);

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const mealCals = proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9;
    onAddMeal({
      name: mealName.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      calories: mealCals
    });

    setMealName('');
    setShowAddForm(false);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const newCal = targetP * 4 + targetC * 4 + targetF * 9;
    onUpdateTarget({
      targetProtein: targetP,
      targetCarbs: targetC,
      targetFat: targetF,
      targetCalories: newCal
    });
    setShowEditTarget(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-theme-high tracking-tight">
              MACRO RECOMPOSITION TELEMETRY
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#0284C7]/15 dark:bg-[#00F0FF]/15 text-[#0284C7] dark:text-[#00F0FF] border border-[#0284C7]/30 dark:border-[#00F0FF]/30 uppercase">
              METABOLIC ENGINE
            </span>
          </div>
          <p className="text-xs font-['Inter'] text-theme-muted">
            Real-time substrate partition tracking: Cryo Cyan (Protein), Electric Volt (Carbohydrates), Kinetic Ember (Lipids).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditTarget(!showEditTarget)}
            className="px-3 py-1.5 rounded bg-theme-elevated hover:opacity-85 border border-theme text-xs font-['Space_Grotesk'] font-bold text-theme-muted hover:text-theme-high transition-colors"
          >
            EDIT TARGETS
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded bg-[#0284C7] dark:bg-[#00F0FF] hover:opacity-90 text-white dark:text-[#002022] text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> LOG MEAL MATRIX
          </button>
        </div>
      </div>

      {/* Target Editor Drawer */}
      {showEditTarget && (
        <form onSubmit={handleSaveTarget} className="mb-6 p-4 rounded-lg bg-theme-card border border-theme animate-fade-in">
          <h3 className="text-sm font-['Space_Grotesk'] font-bold text-theme-high mb-3">
            ADJUST DAILY NUTRITIONAL TARGETS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#0284C7] dark:text-[#00F0FF] uppercase block mb-1">
                PROTEIN TARGET (G)
              </label>
              <input
                type="number"
                min="50"
                value={targetP}
                onChange={(e) => setTargetP(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#0284C7] dark:focus:border-[#00F0FF]"
              />
            </div>
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#78A300] dark:text-[#D4FF00] uppercase block mb-1">
                CARBS TARGET (G)
              </label>
              <input
                type="number"
                min="50"
                value={targetC}
                onChange={(e) => setTargetC(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#78A300] dark:focus:border-[#D4FF00]"
              />
            </div>
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#D9480F] dark:text-[#FF5500] uppercase block mb-1">
                FATS TARGET (G)
              </label>
              <input
                type="number"
                min="20"
                value={targetF}
                onChange={(e) => setTargetF(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#D9480F] dark:focus:border-[#FF5500]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowEditTarget(false)}
              className="px-3 py-1.5 rounded bg-transparent border border-theme text-xs font-['Space_Grotesk'] text-theme-muted"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#9ED100] dark:bg-[#D4FF00] text-[#0D1117] text-xs font-['Space_Grotesk'] font-bold"
            >
              SAVE TARGETS
            </button>
          </div>
        </form>
      )}

      {/* Add Meal Form */}
      {showAddForm && (
        <form onSubmit={handleCreateMeal} className="mb-6 p-4 rounded-lg bg-theme-card border border-[#0284C7] dark:border-[#00F0FF] cyan-glow animate-fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-theme pb-2">
            <h3 className="text-sm font-['Space_Grotesk'] font-bold text-theme-high flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#0284C7] dark:text-[#00F0FF]" /> LOG NEW MEAL INTAKE
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-['JetBrains_Mono'] text-theme-muted hover:text-theme-high"
            >
              CLOSE
            </button>
          </div>

          <div className="mb-3">
            <label className="text-[11px] font-['JetBrains_Mono'] text-theme-muted uppercase block mb-1">
              MEAL LABEL / DESCRIPTION
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 04 // POST-TRAINING WHEY & WHITE RICE BOWL"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['Inter'] text-sm text-theme-high focus:border-[#0284C7] dark:focus:border-[#00F0FF]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#0284C7] dark:text-[#00F0FF] uppercase block mb-1">
                PROTEIN (G)
              </label>
              <input
                type="number"
                min="0"
                value={proteinGrams}
                onChange={(e) => setProteinGrams(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#0284C7] dark:focus:border-[#00F0FF]"
              />
            </div>
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#78A300] dark:text-[#D4FF00] uppercase block mb-1">
                CARBS (G)
              </label>
              <input
                type="number"
                min="0"
                value={carbsGrams}
                onChange={(e) => setCarbsGrams(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#78A300] dark:focus:border-[#D4FF00]"
              />
            </div>
            <div>
              <label className="text-[11px] font-['JetBrains_Mono'] text-[#D9480F] dark:text-[#FF5500] uppercase block mb-1">
                FAT (G)
              </label>
              <input
                type="number"
                min="0"
                value={fatGrams}
                onChange={(e) => setFatGrams(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-theme-recessed border border-theme font-['JetBrains_Mono'] text-sm text-theme-high focus:border-[#D9480F] dark:focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-theme pt-3">
            <span className="text-xs font-['JetBrains_Mono'] text-theme-muted">
              TOTAL CALORIES: <strong className="text-[#78A300] dark:text-[#D4FF00]">{proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9} KCAL</strong>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded bg-transparent border border-theme text-xs font-['Space_Grotesk'] text-theme-muted"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#0284C7] dark:bg-[#00F0FF] text-white dark:text-[#002022] text-xs font-['Space_Grotesk'] font-bold"
              >
                COMMIT LOG
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Primary Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Calorie Macro Gauge Tile */}
        <div className="rounded-lg bg-theme-card border border-theme p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-['JetBrains_Mono'] text-theme-muted uppercase tracking-wider">
                ENERGY BALANCE
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold border ${
                  isSurplus
                    ? 'bg-[#FF5500]/15 text-[#D9480F] dark:text-[#FF5500] border-[#FF5500]'
                    : 'bg-[#D4FF00]/15 text-[#78A300] dark:text-[#D4FF00] border-[#78A300] dark:border-[#D4FF00]'
                }`}
              >
                {isSurplus ? `+${calorieDelta} SURPLUS` : `${Math.abs(calorieDelta)} DEFICIT`}
              </span>
            </div>
            <div className="text-3xl font-['JetBrains_Mono'] font-bold text-theme-high tracking-tight">
              {totalCalories.toLocaleString()}
            </div>
            <div className="text-xs font-['JetBrains_Mono'] text-theme-muted mt-0.5">
              OF {target.targetCalories.toLocaleString()} KCAL TARGET
            </div>
          </div>

          <div className="w-full bg-theme-canvas h-2 rounded-xs overflow-hidden mt-4 border border-theme">
            <div
              className={`h-full transition-all duration-500 ${isSurplus ? 'bg-[#FF5500]' : 'bg-[#78A300] dark:bg-[#D4FF00]'}`}
              style={{ width: `${Math.min(100, Math.round((totalCalories / target.targetCalories) * 100))}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="rounded-lg bg-theme-card border border-theme p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#0284C7] dark:text-[#00F0FF] uppercase tracking-wider">
                PROTEIN (CRYO CYAN)
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">
                {Math.round((totalProtein / target.targetProtein) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-['JetBrains_Mono'] font-bold text-theme-high">
              {totalProtein} <span className="text-xs font-normal text-theme-muted">/ {target.targetProtein} g</span>
            </div>
            <div className="text-[11px] font-['JetBrains_Mono'] text-theme-muted mt-0.5">
              {totalProtein * 4} KCAL ({macroCalc.proteinPct}% SPLIT)
            </div>
          </div>

          <div className="w-full bg-theme-canvas h-2 rounded-xs overflow-hidden mt-4 border border-theme">
            <div
              className="h-full bg-[#0284C7] dark:bg-[#00F0FF] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalProtein / target.targetProtein) * 100))}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="rounded-lg bg-theme-card border border-theme p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#78A300] dark:text-[#D4FF00] uppercase tracking-wider">
                CARBOHYDRATES (VOLT)
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">
                {Math.round((totalCarbs / target.targetCarbs) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-['JetBrains_Mono'] font-bold text-theme-high">
              {totalCarbs} <span className="text-xs font-normal text-theme-muted">/ {target.targetCarbs} g</span>
            </div>
            <div className="text-[11px] font-['JetBrains_Mono'] text-theme-muted mt-0.5">
              {totalCarbs * 4} KCAL ({macroCalc.carbsPct}% SPLIT)
            </div>
          </div>

          <div className="w-full bg-theme-canvas h-2 rounded-xs overflow-hidden mt-4 border border-theme">
            <div
              className="h-full bg-[#78A300] dark:bg-[#D4FF00] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalCarbs / target.targetCarbs) * 100))}%` }}
            />
          </div>
        </div>

        {/* Fats Card */}
        <div className="rounded-lg bg-theme-card border border-theme p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-['JetBrains_Mono'] font-bold text-[#D9480F] dark:text-[#FF5500] uppercase tracking-wider">
                LIPIDS / FATS (EMBER)
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-theme-muted">
                {Math.round((totalFat / target.targetFat) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-['JetBrains_Mono'] font-bold text-theme-high">
              {totalFat} <span className="text-xs font-normal text-theme-muted">/ {target.targetFat} g</span>
            </div>
            <div className="text-[11px] font-['JetBrains_Mono'] text-theme-muted mt-0.5">
              {totalFat * 9} KCAL ({macroCalc.fatPct}% SPLIT)
            </div>
          </div>

          <div className="w-full bg-theme-canvas h-2 rounded-xs overflow-hidden mt-4 border border-theme">
            <div
              className="h-full bg-[#D9480F] dark:bg-[#FF5500] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalFat / target.targetFat) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Segmented Linear Split Bar */}
      <div className="rounded-lg bg-theme-card border border-theme p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-['Space_Grotesk'] font-bold text-theme-high uppercase tracking-wider">
            SUBSTRATE PARTITION TELEMETRY
          </span>
          <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono']">
            <span className="flex items-center gap-1.5 text-[#0284C7] dark:text-[#00F0FF]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0284C7] dark:bg-[#00F0FF]" /> {macroCalc.proteinPct}% PROTEIN
            </span>
            <span className="flex items-center gap-1.5 text-[#78A300] dark:text-[#D4FF00]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#78A300] dark:bg-[#D4FF00]" /> {macroCalc.carbsPct}% CARBS
            </span>
            <span className="flex items-center gap-1.5 text-[#D9480F] dark:text-[#FF5500]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D9480F] dark:bg-[#FF5500]" /> {macroCalc.fatPct}% FATS
            </span>
          </div>
        </div>

        {/* High precision segmented bar */}
        <div className="w-full h-4 bg-theme-canvas rounded-xs overflow-hidden flex border border-theme">
          {macroCalc.totalCalories > 0 ? (
            <>
              <div
                style={{ width: `${macroCalc.proteinPct}%` }}
                className="h-full bg-[#0284C7] dark:bg-[#00F0FF] transition-all duration-300"
                title={`Protein: ${totalProtein}g (${macroCalc.proteinPct}%)`}
              />
              <div
                style={{ width: `${macroCalc.carbsPct}%` }}
                className="h-full bg-[#78A300] dark:bg-[#D4FF00] transition-all duration-300"
                title={`Carbs: ${totalCarbs}g (${macroCalc.carbsPct}%)`}
              />
              <div
                style={{ width: `${macroCalc.fatPct}%` }}
                className="h-full bg-[#D9480F] dark:bg-[#FF5500] transition-all duration-300"
                title={`Fat: ${totalFat}g (${macroCalc.fatPct}%)`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-theme-elevated flex items-center justify-center text-[10px] font-['JetBrains_Mono'] text-theme-muted">
              NO INTAKE LOGGED TODAY
            </div>
          )}
        </div>
      </div>

      {/* Meal History Table */}
      <div className="rounded-lg bg-theme-card border border-theme overflow-hidden shadow-xs">
        <div className="p-4 border-b border-theme flex items-center justify-between">
          <h3 className="text-sm font-['Space_Grotesk'] font-bold text-theme-high uppercase tracking-wide">
            DAILY INTAKE MATRIX LOG
          </h3>
          <span className="text-xs font-['JetBrains_Mono'] text-theme-muted">
            {meals.length} LOGGED FEEDING EVENTS
          </span>
        </div>

        <div className="divide-y border-theme-row">
          {meals.map((meal) => (
            <div key={meal.id} className="p-4 flex items-center justify-between gap-4 hover:bg-theme-elevated/40 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-xs font-['JetBrains_Mono'] font-bold text-theme-muted px-2 py-1 rounded bg-theme-canvas border border-theme">
                  {meal.time}
                </span>
                <div>
                  <h4 className="text-sm font-['Space_Grotesk'] font-bold text-theme-high">
                    {meal.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-theme-muted mt-0.5">
                    <span className="text-[#0284C7] dark:text-[#00F0FF]">{meal.protein}g P</span>
                    <span className="text-[#78A300] dark:text-[#D4FF00]">{meal.carbs}g C</span>
                    <span className="text-[#D9480F] dark:text-[#FF5500]">{meal.fat}g F</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-['JetBrains_Mono'] font-bold text-theme-high">
                  {meal.calories} <span className="text-xs text-theme-muted font-normal">KCAL</span>
                </span>
                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  aria-label={`Delete ${meal.name}`}
                  className="p-1.5 rounded text-theme-muted hover:text-[#FF5500] hover:bg-theme-elevated opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {meals.length === 0 && (
            <div className="p-8 text-center text-xs font-['JetBrains_Mono'] text-theme-muted">
              NO MEAL LOGS REGISTERED FOR TODAY
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
