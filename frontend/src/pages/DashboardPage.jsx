import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchDashboard } from "../services/dietService";
import NutrientDonut from "../components/charts/NutrientDonut";
import SkeletonCard from "../components/ui/SkeletonCard";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard();
      setDashboard(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const latestPlan = dashboard?.latestPlan;
  const user = dashboard?.user;
  const todayProgress = dashboard?.todayProgress;

  const macroTotals = (latestPlan?.meals || []).reduce(
    (acc, meal) => {
      acc.protein += Number(meal.protein || 0);
      acc.carbs += Number(meal.carbs || 0);
      acc.fats += Number(meal.fats || 0);
      return acc;
    },
    { protein: 0, carbs: 0, fats: 0 }
  );

  const calorieConsumed = (latestPlan?.meals || []).reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  const calorieTarget = Number(latestPlan?.dailyCalories || 2000);
  const categories = [
    "Breakfast",
    "Lunch",
    "Snacks",
    "Dinner",
    "Hydration",
    "Protein",
    "Low Carb",
    "Dessert",
  ];

  const today = new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

  const checklist = [
    {
      label: "Generate meal plan",
      done: Boolean(latestPlan),
      action: () => navigate("/meal-planner"),
      actionLabel: "Open Planner",
    },
    {
      label: "Log today calories",
      done: Number(todayProgress?.caloriesConsumed || 0) > 0,
      action: () => navigate("/tracker"),
      actionLabel: "Log Calories",
    },
    {
      label: "Update hydration",
      done: Number(todayProgress?.waterIntake || 0) > 0,
      action: () => navigate("/tracker"),
      actionLabel: "Log Water",
    },
    {
      label: "Track workout",
      done: Number(todayProgress?.exerciseMinutes || 0) > 0,
      action: () => navigate("/tracker"),
      actionLabel: "Log Exercise",
    },
    {
      label: "Complete profile",
      done: Boolean(user?.height && user?.weight && user?.age && user?.gender),
      action: () => navigate("/profile"),
      actionLabel: "Edit Profile",
    },
  ];

  const reminderCards = [
    {
      key: "water",
      enabled: user?.reminderSettings?.water !== false,
      title: "Hydration reminder",
      text: "Drink a glass of water now to stay consistent with your hydration target.",
      action: "Log Water",
      to: "/tracker",
      completed: Number(todayProgress?.waterIntake || 0) > 0,
    },
    {
      key: "meals",
      enabled: user?.reminderSettings?.meals !== false,
      title: "Meal reminder",
      text: "Review your next meal now so you stay on track with calorie goals.",
      action: "Open Planner",
      to: "/meal-planner",
      completed: Boolean(latestPlan),
    },
    {
      key: "weighIn",
      enabled: Boolean(user?.reminderSettings?.weighIn),
      title: "Weekly weigh-in reminder",
      text: "Record weight once this week to keep your trend insights accurate.",
      action: "Track Progress",
      to: "/progress",
      completed: Boolean(todayProgress?.weight),
    },
  ].filter((item) => item.enabled && !item.completed);

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonCard lines={2} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
        <SkeletonCard lines={5} className="h-72" />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="card page-header">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7B7468]">Smart Dashboard</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#2F2F2B]">Your wellness snapshot</h2>
        <p className="mt-1 text-sm text-[#6B665E]">Welcome back, {user?.name || "friend"}. Stay consistent today.</p>
        <div className="greeting-strip mt-4">
          <p>{today}</p>
          <button type="button" className="btn-secondary !py-1.5 text-sm" onClick={() => navigate("/meal-planner")}>
            Generate Today&apos;s Plan
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card hover-card">
          <h3 className="text-sm text-[#7B7468]">Target Calories</h3>
          <p className="text-2xl font-bold tracking-tight text-[#2F2F2B]">{latestPlan?.dailyCalories || 0}</p>
        </div>
        <div className="card hover-card">
          <h3 className="text-sm text-[#7B7468]">Current BMI</h3>
          <p className="text-2xl font-bold tracking-tight text-[#2F2F2B]">{latestPlan?.bmi || "-"}</p>
        </div>
        <div className="card hover-card">
          <h3 className="text-sm text-[#7B7468]">Goal</h3>
          <p className="text-2xl font-bold capitalize tracking-tight text-[#2F2F2B]">{latestPlan?.healthGoal || user?.goal || "-"}</p>
        </div>
        <div className="card hover-card">
          <h3 className="text-sm text-[#7B7468]">BMR / TDEE</h3>
          <p className="text-xl font-bold tracking-tight text-[#2F2F2B]">{latestPlan?.bmr || "-"} / {latestPlan?.tdee || "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2F2F2B]">Today&apos;s Checklist</h3>
            <p className="text-xs text-[#6B665E]">{checklist.filter((item) => item.done).length}/{checklist.length} completed</p>
          </div>
          {checklist.map((item) => (
            <div key={item.label} className="checklist-row">
              <div className="flex items-center gap-2">
                <span className={`check-dot ${item.done ? "done" : ""}`} />
                <p className="text-sm text-[#4F4A43]">{item.label}</p>
              </div>
              {!item.done && (
                <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={item.action}>
                  {item.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2F2F2B]">In-App Reminders</h3>
            <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => navigate("/settings")}>
              Configure
            </button>
          </div>
          {reminderCards.length ? reminderCards.map((item) => (
            <div key={item.key} className="reminder-card">
              <p className="text-sm font-semibold text-[#3F4B45]">{item.title}</p>
              <p className="text-xs text-[#6A6E68]">{item.text}</p>
              <button type="button" className="btn mt-2 !py-1.5 text-xs" onClick={() => navigate(item.to)}>
                {item.action}
              </button>
            </div>
          )) : (
            <p className="text-sm text-[#6B665E]">No pending reminders right now. Great consistency.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-[#2F2F2B]">Categories</h3>
          <button type="button" className="btn-secondary !py-1.5 text-sm">Filter</button>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
          {categories.map((category) => (
            <div key={category} className="hover-card rounded-2xl border border-[#dde8e1] bg-white px-3 py-3 text-center text-sm font-semibold text-[#4A5B53]">
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NutrientDonut title="Calories" value={calorieConsumed} target={calorieTarget} color="#8FAF8D" />
        <NutrientDonut title="Protein (g)" value={macroTotals.protein} target={90} color="#7BA0C4" />
        <NutrientDonut title="Carbs (g)" value={macroTotals.carbs} target={260} color="#D5A676" />
        <NutrientDonut title="Fat (g)" value={macroTotals.fats} target={70} color="#B287B0" />
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-[#2F2F2B]">Popular Meals</h2>
          <p className="text-sm font-semibold text-[#3a9c67]">View More</p>
        </div>

        {latestPlan?.meals?.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {latestPlan.meals.map((meal) => (
              <div key={`${latestPlan._id}-${meal.mealType}`} className="hover-card rounded-3xl border border-[#dbe7df] bg-white p-3">
                <div className="mb-3 rounded-2xl bg-gradient-to-br from-[#eef7f0] to-[#f6f8f3] p-4 text-center text-sm font-semibold text-[#4D5E56]">
                  {meal.mealType}
                </div>
                <p className="text-xl font-bold text-[#2F2F2B]">{meal.dishName}</p>
                <p className="mt-1 text-xs text-[#7A817D]">{meal.calories} kcal | P {meal.protein} | C {meal.carbs} | F {meal.fats}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6B665E]">No plan generated yet. Go to Diet Plan Generator.</p>
        )}
      </div>

      <div className="card chart-card">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-[#2F2F2B]">Weekly Calories Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard?.weeklyCalories || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
              <Bar dataKey="calories" fill="#8FAF8D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {message && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">{message}</p>}

      {!latestPlan && !message && (
        <div className="card empty-state">
          <p className="text-lg font-semibold text-[#3A3A34]">No diet plan available yet</p>
          <p className="text-sm text-[#6B665E]">Create your first AI meal plan and unlock personalized insights.</p>
          <button type="button" className="btn mt-3" onClick={() => navigate("/meal-planner")}>
            Create Plan
          </button>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
