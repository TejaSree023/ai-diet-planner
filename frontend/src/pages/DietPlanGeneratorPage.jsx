import { useState } from "react";
import { generatePlan } from "../services/dietService";
import { fetchRecipes } from "../services/recipeService";

const mealEmoji = {
  Breakfast: "🍳",
  Lunch: "🥗",
  "Evening Snack": "🍎",
  Dinner: "🍲",
};

const mealTypeToCategory = (mealType) => {
  const value = String(mealType || "").toLowerCase();
  if (value.includes("breakfast")) return "breakfast";
  if (value.includes("snack")) return "snacks";
  return "main-course";
};

const DietPlanGeneratorPage = () => {
  const [planType, setPlanType] = useState("daily");
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [swappingKey, setSwappingKey] = useState("");

  const onGenerate = async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await generatePlan(planType);
      setPlan(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const swapMeal = async ({ meal, dayIndex = -1, mealIndex, isAlternative = false }) => {
    if (!plan) return;

    const key = `${dayIndex}-${mealIndex}-${isAlternative ? "alt" : "main"}`;
    setSwappingKey(key);

    try {
      const response = await fetchRecipes({
        dietType: plan.dietPreference,
        category: mealTypeToCategory(meal.mealType),
        page: (Math.floor(Math.random() * 3) + 1),
      });

      const candidates = (response.items || []).filter((item) => item.name !== meal.dishName);
      if (!candidates.length) {
        setMessage("No alternative meal found right now");
        return;
      }

      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      const replacement = {
        mealType: meal.mealType,
        dishName: picked.name,
        calories: Number(picked.calories || 0),
        protein: Number(picked.protein || 0),
        carbs: Number(picked.carbs || 0),
        fats: Number(picked.fat || 0),
      };

      setPlan((prev) => {
        if (!prev) return prev;

        if (prev.days?.length && dayIndex >= 0) {
          const nextDays = prev.days.map((day, idx) => {
            if (idx !== dayIndex) return day;

            if (isAlternative) {
              const nextAlternatives = [...(day.alternatives || [])];
              nextAlternatives[mealIndex] = replacement;
              return { ...day, alternatives: nextAlternatives };
            }

            const nextMeals = [...(day.meals || [])];
            nextMeals[mealIndex] = replacement;
            return { ...day, meals: nextMeals };
          });

          return { ...prev, days: nextDays };
        }

        const nextMeals = [...(prev.meals || [])];
        nextMeals[mealIndex] = replacement;
        return { ...prev, meals: nextMeals };
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to swap meal");
    } finally {
      setSwappingKey("");
    }
  };

  const renderMeals = (meals, dayIndex = -1, isAlternative = false) => (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {meals.map((meal, mealIndex) => {
        const key = `${dayIndex}-${mealIndex}-${isAlternative ? "alt" : "main"}`;
        return (
        <div key={`${meal.mealType}-${meal.dishName}-${mealIndex}`} className="hover-card overflow-hidden rounded-3xl border border-[#e5d4bf] bg-[#fffaf2] shadow-[0_12px_24px_rgba(114,90,68,0.12)] transition-all duration-300 hover:-translate-y-1">
          <div className="h-28 bg-gradient-to-br from-[#E6F0E4] via-[#F1E7D6] to-[#F7EBDC] p-4 text-3xl">
            {mealEmoji[meal.mealType] || "🍽️"}
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8c6a54]">{meal.mealType}</p>
            <p className="font-semibold text-[#5d4436]">{meal.dishName}</p>
            <p className="text-sm text-[#7d5f4c]">{meal.calories} kcal</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-[#846754]">
              <span className="rounded-xl bg-[#f2e7d7] px-2 py-1">P {meal.protein}g</span>
              <span className="rounded-xl bg-[#e6efdf] px-2 py-1">C {meal.carbs}g</span>
              <span className="rounded-xl bg-[#f3e3d5] px-2 py-1">F {meal.fats}g</span>
            </div>
            <button
              type="button"
              className="btn-secondary !w-full !py-1.5 text-xs"
              onClick={() => swapMeal({ meal, dayIndex, mealIndex, isAlternative })}
              disabled={swappingKey === key}
            >
              {swappingKey === key ? "Swapping..." : "Swap Meal"}
            </button>
          </div>
        </div>
      )})}
    </div>
  );

  return (
    <section className="space-y-5">
      <div className="card page-header">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Meal Planner</p>
        <h2 className="mb-3 mt-1 text-3xl font-semibold text-[#5E4436]">AI Weekly Meal Planner</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="field-group">
            <span>Plan Type</span>
            <select className="input" value={planType} onChange={(e) => setPlanType(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <button type="button" className="btn" onClick={onGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-rose-500">{message}</p>}
      </div>

      {!plan && !loading && (
        <div className="card empty-state">
          <p className="text-lg font-semibold text-[#4A3A2D]">No plan generated yet</p>
          <p className="text-sm text-[#7A5D4A]">Choose a plan type and generate a personalized recommendation.</p>
        </div>
      )}

      {plan && (
        <div className="card space-y-4">
          <h3 className="text-xl font-semibold text-[#5D4436]">Generated {plan.planType} Plan</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            BMI: {plan.bmi} ({plan.bmiCategory}) | BMR: {plan.bmr} | TDEE: {plan.tdee} | Daily Calories: {plan.dailyCalories}
          </p>

          {plan.days?.length ? (
            <div className="space-y-4">
              {plan.days.map((day, dayIndex) => (
                <div key={day.dayLabel} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <h4 className="mb-2 font-semibold">{day.dayLabel}</h4>
                  {renderMeals(day.meals || [], dayIndex, false)}
                  {day.alternatives?.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1 text-sm font-semibold text-brand-700 dark:text-brand-100">Alternatives</p>
                      {renderMeals(day.alternatives, dayIndex, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            renderMeals(plan.meals || [], -1, false)
          )}
        </div>
      )}
    </section>
  );
};

export default DietPlanGeneratorPage;
