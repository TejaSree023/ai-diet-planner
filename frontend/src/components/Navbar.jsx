import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[#DCC8B1] bg-[#FFF8EF]/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold tracking-wide text-[#6B4E3D] dark:text-brand-100">AI Diet Planner</h1>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
        {token ? (
          <>
            <Link className="btn-secondary" to="/dashboard">Dashboard</Link>
            <Link className="btn-secondary" to="/diet-generator">Plan</Link>
            <Link className="btn-secondary" to="/meal-tracker">Tracker</Link>
            <Link className="btn-secondary" to="/recipes">Recipes</Link>
            <Link className="btn-secondary" to="/progress">Progress</Link>
            <Link className="btn-secondary" to="/profile">Profile</Link>
            <button type="button" onClick={onLogout} className="btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn-secondary" to="/login">Login</Link>
            <Link className="btn-secondary" to="/register">Register</Link>
          </>
        )}
          <button className="btn-secondary" onClick={() => setDarkMode((prev) => !prev)} type="button">
            {darkMode ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
