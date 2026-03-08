import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    activityLevel: "moderate",
    dietPreference: "veg",
    goal: "maintenance",
    allergies: "",
    wakeTime: "07:00",
    sleepTime: "23:00",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    if (!form.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!form.password || form.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        ...form,
        allergies: form.allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        reminderSettings: {
          water: true,
          meals: true,
          weighIn: false,
        },
      });
      login(response.token, response.user);
      navigate("/meal-planner");
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot reach backend API. Start the backend server on http://localhost:5000 and try again."
          : "Registration failed");
      if (/email already/i.test(serverMessage)) {
        setErrors({ email: "Email already registered" });
      }
      setMessage(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-brand-panel">
        <p className="auth-kicker">AI Diet Planner</p>
        <h1 className="auth-title">Build your personal health workspace</h1>
        <p className="auth-subtitle">
          Set your profile once and get custom meal plans, nutrient insights, and progress tracking.
        </p>

        <div className="auth-highlights">
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">Profile</p>
            <p className="auth-highlight-label">Personalized setup</p>
          </div>
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">Meals</p>
            <p className="auth-highlight-label">Diet recommendations</p>
          </div>
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">Progress</p>
            <p className="auth-highlight-label">Track weekly goals</p>
          </div>
        </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Create Account</p>
          <h2 className="mb-4 mt-1 text-3xl font-semibold text-[#2F2F2B]">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className={`input ${errors.name ? "!border-rose-300 !bg-rose-50" : ""}`} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input className={`input ${errors.email ? "!border-rose-300 !bg-rose-50" : ""}`} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input
              className={`input ${errors.password ? "!border-rose-300 !bg-rose-50" : ""}`}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />

            <div className="rounded-2xl border border-[#e7dccf] bg-[#fffaf3] p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8C6A54]">Quick Onboarding</p>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="field-group">
                  <span>Activity Level</span>
                  <select className="input" name="activityLevel" value={form.activityLevel} onChange={handleChange}>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </label>

                <label className="field-group">
                  <span>Diet Preference</span>
                  <select className="input" name="dietPreference" value={form.dietPreference} onChange={handleChange}>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </label>

                <label className="field-group">
                  <span>Goal</span>
                  <select className="input" name="goal" value={form.goal} onChange={handleChange}>
                    <option value="maintenance">Maintenance</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="weight-gain">Weight Gain</option>
                    <option value="muscle-gain">Muscle Gain</option>
                  </select>
                </label>

                <label className="field-group">
                  <span>Allergies (comma separated)</span>
                  <input className="input" name="allergies" placeholder="Peanut, soy" value={form.allergies} onChange={handleChange} />
                </label>

                <label className="field-group">
                  <span>Wake Time</span>
                  <input className="input" name="wakeTime" type="time" value={form.wakeTime} onChange={handleChange} />
                </label>

                <label className="field-group">
                  <span>Sleep Time</span>
                  <input className="input" name="sleepTime" type="time" value={form.sleepTime} onChange={handleChange} />
                </label>
              </div>
            </div>

            <button className="btn w-full" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          </form>
          {(errors.name || errors.email || errors.password) && <p className="mt-2 text-sm text-rose-500">{errors.name || errors.email || errors.password}</p>}
          {message && <p className="mt-3 text-sm text-rose-500">{message}</p>}
          <p className="mt-3 text-sm text-[#6B665E]">
            Already have an account? <Link to="/login" className="font-semibold text-[#2a9f61]">Login</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
