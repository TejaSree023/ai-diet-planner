import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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

    if (!form.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!form.password) {
      setErrors({ password: "Password is required" });
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(form);
      login(response.token, response.user);
      navigate("/dashboard");
    } catch (error) {
      const serverMessage = error.response?.data?.message || "Login failed";
      if (/invalid credentials/i.test(serverMessage)) {
        setErrors({ email: "Check email/password", password: "Check email/password" });
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
        <h1 className="auth-title">Track smarter nutrition every day</h1>
        <p className="auth-subtitle">
          Personalized diets, macro tracking, and progress analytics in one dashboard.
        </p>

        <div className="auth-highlights">
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">1000+</p>
            <p className="auth-highlight-label">Foods in dataset</p>
          </div>
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">AI</p>
            <p className="auth-highlight-label">Plan generation</p>
          </div>
          <div className="auth-highlight-card">
            <p className="auth-highlight-value">7D</p>
            <p className="auth-highlight-label">Weekly insights</p>
          </div>
        </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Welcome Back</p>
          <h2 className="mb-4 mt-1 text-3xl font-semibold text-[#2F2F2B]">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className={`input ${errors.email ? "!border-rose-300 !bg-rose-50" : ""}`} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input
              className={`input ${errors.password ? "!border-rose-300 !bg-rose-50" : ""}`}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button className="btn w-full" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>
          {(errors.email || errors.password) && <p className="mt-2 text-sm text-rose-500">{errors.email || errors.password}</p>}
          {message && <p className="mt-3 text-sm text-rose-500">{message}</p>}
          <p className="mt-3 text-sm text-[#6B665E]">
            New here? <Link to="/register" className="font-semibold text-[#2a9f61]">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
