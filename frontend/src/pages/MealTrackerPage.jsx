import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchProgress, saveProgress } from "../services/trackerService";
import { getProfile } from "../services/authService";
import SkeletonCard from "../components/ui/SkeletonCard";

const MealTrackerPage = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    weight: "",
    caloriesConsumed: "",
    waterIntake: "",
    exerciseMinutes: "",
  });
  const [summary, setSummary] = useState([]);
  const [profileHeight, setProfileHeight] = useState(170);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await fetchProgress(7);
      setSummary(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load tracker data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    getProfile().then((data) => {
      if (data?.height) {
        setProfileHeight(Number(data.height));
      }
    }).catch(() => {
      // Keep fallback height for logging if profile fetch fails.
    });
  }, []);

  const onSave = async () => {
    const optimistic = {
      date,
      caloriesConsumed: Number(form.caloriesConsumed || 0),
      waterIntake: Number(form.waterIntake || 0),
      exerciseMinutes: Number(form.exerciseMinutes || 0),
    };

    setSummary((prev) => {
      const idx = prev.findIndex((item) => new Date(item.date).toISOString().slice(0, 10) === date);
      if (idx === -1) return [...prev, optimistic].sort((a, b) => new Date(a.date) - new Date(b.date));
      const next = [...prev];
      next[idx] = { ...next[idx], ...optimistic };
      return next;
    });

    try {
      await saveProgress({
        date,
        weight: Number(form.weight || 0),
        height: Number(profileHeight || 170),
        caloriesConsumed: Number(form.caloriesConsumed || 0),
        waterIntake: Number(form.waterIntake || 0),
        exerciseMinutes: Number(form.exerciseMinutes || 0),
      });

      setMessage("Daily tracker saved");
      await loadSummary();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save tracker");
      await loadSummary();
    }
  };

  const chartData = useMemo(
    () =>
      summary.map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        calories: Number(item.caloriesConsumed || 0),
        waterIntake: Number(item.waterIntake || 0),
        exerciseMinutes: Number(item.exerciseMinutes || 0),
      })),
    [summary]
  );

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={5} className="h-80" />
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard lines={4} className="h-72" />
          <SkeletonCard lines={4} className="h-72" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="card page-header">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Daily Tracker</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#5E4436]">Log your daily metrics</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="field-group">
            <span>Date</span>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="field-group">
            <span>Weight (kg)</span>
            <input
              className="input"
              placeholder="Enter weight"
              type="number"
              value={form.weight}
              onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
            />
          </label>
          <label className="field-group">
            <span>Calories</span>
            <input
              className="input"
              placeholder="Calories consumed"
              type="number"
              value={form.caloriesConsumed}
              onChange={(e) => setForm((prev) => ({ ...prev, caloriesConsumed: e.target.value }))}
            />
          </label>
          <label className="field-group">
            <span>Water (L)</span>
            <input
              className="input"
              placeholder="Water intake"
              type="number"
              value={form.waterIntake}
              onChange={(e) => setForm((prev) => ({ ...prev, waterIntake: e.target.value }))}
            />
          </label>
          <label className="field-group">
            <span>Exercise (min)</span>
            <input
              className="input"
              placeholder="Exercise minutes"
              type="number"
              value={form.exerciseMinutes}
              onChange={(e) => setForm((prev) => ({ ...prev, exerciseMinutes: e.target.value }))}
            />
          </label>
        </div>

        <button className="btn mt-4" onClick={onSave} type="button">
          Save Daily Log
        </button>
        {message && <p className="mt-2 text-sm text-[#2F7A66]">{message}</p>}
      </div>

      <div className="card h-80 chart-card">
        <h3 className="mb-2 text-lg font-semibold text-[#5E4436]">Weekly Calorie Trend</h3>
        <ResponsiveContainer width="100%" height="88%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8FAF8D" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card h-72 chart-card">
          <h3 className="mb-2 text-lg font-semibold text-[#5E4436]">Weekly Hydration (L)</h3>
          <ResponsiveContainer width="100%" height="86%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="waterIntake" fill="#6DAF9B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-72 chart-card">
          <h3 className="mb-2 text-lg font-semibold text-[#5E4436]">Weekly Exercise (min)</h3>
          <ResponsiveContainer width="100%" height="86%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="exerciseMinutes" stroke="#3F8D72" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!summary.length && (
        <div className="card empty-state">
          <p className="text-lg font-semibold text-[#4A3A2D]">No tracker entries yet</p>
          <p className="text-sm text-[#7A5D4A]">Save your first daily log to unlock trends and insights.</p>
        </div>
      )}
    </section>
  );
};

export default MealTrackerPage;
