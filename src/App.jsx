// src/App.jsx
import { useState } from "react";
import InputForm from "./components/InputForm";

function calculateResults(form) {
  // 1. Parse inputs
  const age = Number(form.age);
  const heightCm = Number(form.height) * 2.54;
  const weightLbs = Number(form.weight);
  const weightKg = weightLbs / 2.20462;           // lbs → kg
  const goalWeightLbs = Number(form.goalWeight);
  const goalWeightKg = goalWeightLbs / 2.20462;   // lbs → kg

  // 2. BMR (Mifflin–St Jeor)
  const s = form.gender === "male" ? 5 : -161;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;

  // 3. Activity multiplier
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };
  const tdee = bmr * multipliers[form.activity];

  // 4. Initialize
  let calories = Math.round(tdee);
  let weeksToGoal = null;
  let warning = "";
  let maxPace = null;

  // 5. Compute client’s chosen pace for cut
  if (form.goal === "cut" && goalWeightKg && goalWeightKg < weightKg) {
    const totalLossLbs = weightLbs - goalWeightLbs;
    const maxWeeklyLbs = weightLbs * 0.01;                // 1% bodyweight/week
    const safeDailyDeficit = Math.min(500, (maxWeeklyLbs * 3500) / 7);

    // chosen pace calories & weeks
    calories = Math.max(1300, Math.round(tdee - safeDailyDeficit));
    const weeklyLossLbs = Math.round((safeDailyDeficit * 7) / 3500 * 100) / 100;
    weeksToGoal = Math.ceil(totalLossLbs / weeklyLossLbs);

    if (tdee - safeDailyDeficit < 1300) {
      warning = "Calorie goal floored to 1300 kcal/day for safety.";
    }

    // compute max safe pace
    const maxDailyDeficit = (maxWeeklyLbs * 3500) / 7;
    const maxCalories = Math.max(1300, Math.round(tdee - maxDailyDeficit));
    const maxWeeksToGoal = Math.ceil(totalLossLbs / maxWeeklyLbs);

    // base macros (protein always same)
    const proteinGrams = Math.round(weightLbs * 1);            // 1 g per lb

    // macros at chosen pace
    const fatGrams = Math.round((calories * 0.25) / 9);
    const carbGrams = Math.round((calories - (proteinGrams * 4 + fatGrams * 9)) / 4);

    // macros at max safe pace
    const fatMax = Math.round((maxCalories * 0.25) / 9);
    const carbMax = Math.round((maxCalories - (proteinGrams * 4 + fatMax * 9)) / 4);

    maxPace = {
      weeklyLossLbs: Math.round(maxWeeklyLbs * 100) / 100,
      calories: maxCalories,
      weeksToGoal: maxWeeksToGoal,
      macros: {
        protein: proteinGrams,
        fat: fatMax,
        carbs: carbMax,
      },
    };
  }

  // 6. Bulk
  if (form.goal === "bulk" && goalWeightKg && goalWeightKg > weightKg) {
    calories = Math.round(tdee + 250);
    const totalGainLbs = goalWeightLbs - weightLbs;
    weeksToGoal = Math.ceil(totalGainLbs / 0.5); // 0.5 lb/week
  }

  // 7. Chosen pace macros (reuse variables from cut if cut, else for bulk/maintain)
  const proteinGrams = Math.round(weightLbs * 1);
  const fatGrams = Math.round((calories * 0.25) / 9);
  const carbGrams = Math.round((calories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return {
    calories,
    tdee: Math.round(tdee),
    weeksToGoal,
    warning,
    macros: {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    },
    maxPace,
  };
}

function App() {
  const [results, setResults] = useState(null);

  function handleSubmit(form) {
    setResults(calculateResults(form));
  }

  return (
    <div
      className="
        min-h-screen
        flex flex-col items-center justify-start
        pt-8 pb-16 px-4
        bg-[#6bc04b]
        bg-[url('/background.png')] bg-cover bg-center
      "
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Simple Plan Logo"
        className="w-56 mb-6 mt-4"
      />

      {/* Input Form */}
      <InputForm onSubmit={handleSubmit} />

      {/* Results Card */}
      {results && (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Your Results</h3>

          {/* Chosen Calories */}
          <div>
            <span className="font-medium">Calories/day:</span>{" "}
            <span className="font-mono text-2xl">{results.calories}</span>
          </div>

          {/* Chosen Weeks */}
          {results.weeksToGoal !== null && (
            <div>
              <span className="font-medium">Weeks to goal:</span>{" "}
              <span className="font-mono text-2xl">{results.weeksToGoal}</span>
            </div>
          )}

          {/* Warning */}
          {results.warning && (
            <div className="text-sm text-yellow-800 bg-yellow-100 rounded p-2">
              {results.warning}
            </div>
          )}

          {/* Chosen Pace Macros */}
          {results.macros && (
            <div className="pt-4 border-t border-gray-200 space-y-1">
              <div>
                <span className="font-medium">Protein:</span>{" "}
                <span className="font-mono">{results.macros.protein} g</span>
              </div>
              <div>
                <span className="font-medium">Fat:</span>{" "}
                <span className="font-mono">{results.macros.fat} g</span>
              </div>
              <div>
                <span className="font-medium">Carbs:</span>{" "}
                <span className="font-mono">{results.macros.carbs} g</span>
              </div>
            </div>
          )}

          {/* Max Safe Pace */}
          {results.maxPace && (
            <div className="pt-4 border-t border-gray-200 space-y-1">
              <h4 className="font-medium text-gray-700">Max Safe Pace</h4>
              <div>
                <span className="font-medium">Loss/week:</span>{" "}
                <span className="font-mono">{results.maxPace.weeklyLossLbs} lb</span>
              </div>
              <div>
                <span className="font-medium">Calories/day:</span>{" "}
                <span className="font-mono">{results.maxPace.calories}</span>
              </div>
              <div>
                <span className="font-medium">Weeks at max pace:</span>{" "}
                <span className="font-mono">{results.maxPace.weeksToGoal}</span>
              </div>
              {/* Max Pace Macros */}
              <div className="pt-2 space-y-1">
                <div>
                  <span className="font-medium">Protein:</span>{" "}
                  <span className="font-mono">{results.maxPace.macros.protein} g</span>
                </div>
                <div>
                  <span className="font-medium">Fat:</span>{" "}
                  <span className="font-mono">{results.maxPace.macros.fat} g</span>
                </div>
                <div>
                  <span className="font-medium">Carbs:</span>{" "}
                  <span className="font-mono">{results.maxPace.macros.carbs} g</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;