import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchProgress, saveProgress } from "../services/trackerService";
import SkeletonCard from "../components/ui/SkeletonCard";

const ProgressTrackerPage = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: "", height: "", caloriesConsumed: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchProgress(30);
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const save = async () => {
    const optimisticLog = {
      date: form.date,
      weight: Number(form.weight),
      bmi: form.height ? Number((Number(form.weight) / ((Number(form.height) / 100) ** 2)).toFixed(1)) : 0,
      caloriesConsumed: Number(form.caloriesConsumed || 0),
    };

    setLogs((prev) => {
      const idx = prev.findIndex((item) => new Date(item.date).toISOString().slice(0, 10) === form.date);
      if (idx === -1) return [...prev, optimisticLog].sort((a, b) => new Date(a.date) - new Date(b.date));
      const next = [...prev];
      next[idx] = { ...next[idx], ...optimisticLog };
      return next;
    });

    try {
      await saveProgress({
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
        caloriesConsumed: Number(form.caloriesConsumed || 0),
      });
      setMessage("Progress saved");
      await loadLogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save progress");
      await loadLogs();
    }
  };

  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString(),
    weight: log.weight,
    bmi: log.bmi,
  }));

  const latest = logs[logs.length - 1];

  const getAverage = (items, key) => {
    if (!items.length) return 0;
    const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
    return total / items.length;
  };

  const recentWeek = logs.slice(-7);
  const previousWeek = logs.slice(-14, -7);

  const recentWeightAvg = getAverage(recentWeek, "weight");
  const previousWeightAvg = getAverage(previousWeek, "weight");
  const recentBmiAvg = getAverage(recentWeek, "bmi");
  const previousBmiAvg = getAverage(previousWeek, "bmi");

  const weightDelta = recentWeightAvg - previousWeightAvg;
  const bmiDelta = recentBmiAvg - previousBmiAvg;

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonCard lines={3} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
        <SkeletonCard lines={5} className="h-80" />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="card page-header">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Progress Analytics</p>
        <h2 className="mb-3 mt-1 text-3xl font-semibold text-[#5E4436]">Track your transformation</h2>
        <div className="grid gap-2 md:grid-cols-4">
          <label className="field-group">
            <span>Date</span>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} />
          </label>
          <label className="field-group">
            <span>Weight (kg)</span>
            <input className="input" placeholder="Current weight" type="number" value={form.weight} onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))} />
          </label>
          <label className="field-group">
            <span>Height (cm)</span>
            <input className="input" placeholder="Current height" type="number" value={form.height} onChange={(e) => setForm((prev) => ({ ...prev, height: e.target.value }))} />
          </label>
          <label className="field-group">
            <span>Calories</span>
            <input className="input" placeholder="Calories consumed" type="number" value={form.caloriesConsumed} onChange={(e) => setForm((prev) => ({ ...prev, caloriesConsumed: e.target.value }))} />
          </label>
        </div>
        <button className="btn mt-3" onClick={save} type="button">Save Progress</button>
        {message && <p className="mt-2 text-sm text-[#2F7A66]">{message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card hover-card">
          <p className="text-sm text-[#8C6A54]">Current Weight</p>
          <p className="text-2xl font-semibold text-[#5E4436]">{latest?.weight ?? "-"} kg</p>
        </div>
        <div className="card hover-card">
          <p className="text-sm text-[#8C6A54]">Current BMI</p>
          <p className="text-2xl font-semibold text-[#5E4436]">{latest?.bmi ?? "-"}</p>
        </div>
        <div className="card hover-card">
          <p className="text-sm text-[#8C6A54]">Entries</p>
          <p className="text-2xl font-semibold text-[#5E4436]">{logs.length}</p>
        </div>
        <div className="card hover-card">
          <p className="text-sm text-[#8C6A54]">Goal Completion</p>
          <p className="text-2xl font-semibold text-[#5E4436]">{logs.length ? Math.min(100, logs.length * 5) : 0}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card hover-card">
          <p className="text-xs uppercase tracking-[0.12em] text-[#8C6A54]">This Week vs Last Week</p>
          <h3 className="mt-1 text-lg font-semibold text-[#5E4436]">Weight Trend</h3>
          <p className={`mt-2 text-sm ${weightDelta <= 0 ? "text-[#2f7a66]" : "text-[#9b5b3b]"}`}>
            {weightDelta <= 0 ? "Improved" : "Increased"} by {Math.abs(weightDelta).toFixed(1)} kg average
          </p>
        </div>

        <div className="card hover-card">
          <p className="text-xs uppercase tracking-[0.12em] text-[#8C6A54]">This Week vs Last Week</p>
          <h3 className="mt-1 text-lg font-semibold text-[#5E4436]">BMI Trend</h3>
          <p className={`mt-2 text-sm ${bmiDelta <= 0 ? "text-[#2f7a66]" : "text-[#9b5b3b]"}`}>
            {bmiDelta <= 0 ? "Improved" : "Increased"} by {Math.abs(bmiDelta).toFixed(1)} points average
          </p>
        </div>
      </div>

      <div className="card h-80 chart-card">
        <h3 className="mb-2 text-lg font-semibold text-[#5E4436]">Weight & BMI Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="weight" stroke="#8FAF8D" strokeWidth={3} />
            <Line dataKey="bmi" stroke="#7B5A44" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!logs.length && (
        <div className="card empty-state">
          <p className="text-lg font-semibold text-[#4A3A2D]">No progress logs yet</p>
          <p className="text-sm text-[#7A5D4A]">Start by saving your first entry to visualize your transformation curve.</p>
        </div>
      )}
    </section>
  );
};

export default ProgressTrackerPage;
