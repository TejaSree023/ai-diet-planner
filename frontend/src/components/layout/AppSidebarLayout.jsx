import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ChatbotWidget from "../ChatbotWidget";

const Icon = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-10h8V3h-8v8Z" fill="currentColor" /></svg>
  ),
  planner: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10Z" fill="currentColor" /></svg>
  ),
  tracker: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2Zm1 5h-2v6l5.2 3.1 1-1.7-4.2-2.5V7Z" fill="currentColor" /></svg>
  ),
  recipe: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M21 3H3v2h18V3Zm-2 4H5v2h14V7Zm-3 4H8v2h8v-2Zm-9 4h10v2H7v-2Zm-2 4h14v2H5v-2Z" fill="currentColor" /></svg>
  ),
  progress: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M3 17h2v4H3v-4Zm4-5h2v9H7v-9Zm4 3h2v6h-2v-6Zm4-8h2v14h-2V7Zm4 4h2v10h-2V11Z" fill="currentColor" /></svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.01-8 4.5V21h16v-2.5c0-2.49-3.58-4.5-8-4.5Z" fill="currentColor" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="m19.14 12.94.86-1.49-1.53-2.65-1.72.27a5.93 5.93 0 0 0-1.08-.63L15.4 6h-3l-.27 1.44c-.38.15-.74.35-1.08.57L9.33 7.7 7.8 10.35l.86 1.49a6.83 6.83 0 0 0 0 1.12l-.86 1.49 1.53 2.65 1.72-.27c.34.24.7.44 1.08.63L12.4 20h3l.27-1.44c.38-.15.74-.35 1.08-.57l1.72.27 1.53-2.65-.86-1.49c.04-.37.04-.75 0-1.18ZM13.9 12a1.9 1.9 0 1 1-3.8 0 1.9 1.9 0 0 1 3.8 0Z" fill="currentColor" /></svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="m15.5 14 5 5-1.5 1.5-5-5V14h-1l-.3-.3A6.5 6.5 0 1 1 14 15.5l.3.3v1h1.2ZM8.5 14A5.5 5.5 0 1 0 3 8.5 5.5 5.5 0 0 0 8.5 14Z" fill="currentColor" /></svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true"><path d="M12 22a2.6 2.6 0 0 0 2.45-1.7h-4.9A2.6 2.6 0 0 0 12 22Zm7-5V11a7 7 0 0 0-5-6.71V3a2 2 0 1 0-4 0v1.29A7 7 0 0 0 5 11v6l-2 2v1h18v-1l-2-2Z" fill="currentColor" /></svg>
  ),
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Icon.dashboard },
  { to: "/meal-planner", label: "Meal Planner", icon: Icon.planner },
  { to: "/tracker", label: "Tracker", icon: Icon.tracker },
  { to: "/recipes", label: "Recipes", icon: Icon.recipe },
  { to: "/progress", label: "Progress", icon: Icon.progress },
  { to: "/profile", label: "Profile", icon: Icon.profile },
  { to: "/settings", label: "Settings", icon: Icon.settings },
];

const SidebarLink = ({ item, active, onClick }) => (
  <Link
    to={item.to}
    onClick={onClick}
    className={`sidebar-link group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      active ? "sidebar-link-active" : "hover:translate-x-0.5"
    }`}
  >
    <span className="sidebar-icon grid h-7 w-7 place-items-center rounded-xl text-base shadow-sm">{item.icon}</span>
    <span>{item.label}</span>
  </Link>
);

const AppSidebarLayout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [toolbarSearch, setToolbarSearch] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 260);
    return () => clearTimeout(timer);
  }, [pathname]);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const submitToolbarSearch = (event) => {
    event.preventDefault();
    const value = toolbarSearch.trim();
    navigate(value ? `/recipes?search=${encodeURIComponent(value)}` : "/recipes");
  };

  const toolbarActions = [
    { label: "Quick Plan", icon: Icon.plus, onClick: () => navigate("/meal-planner") },
    { label: "Progress", icon: Icon.bell, onClick: () => navigate("/progress") },
    { label: "Account", icon: Icon.profile, onClick: () => navigate("/profile") },
  ];

  return (
    <div className="dashboard-bg dashboard-shell grocery-app-bg">
      <div className="dashboard-layout app-frame">
        <button
          type="button"
          className="fixed right-4 top-4 z-40 rounded-xl border border-[#dac7af] bg-[#fff7ee] px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-20 bg-black/25 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`app-sidebar fixed bottom-0 left-0 top-0 z-30 w-[240px] p-4 transition-transform duration-300 md:static md:z-auto md:w-[240px] md:shrink-0 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="sidebar-brand mb-6 rounded-3xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6c9f86]">AI Diet Planner</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2d5b4c]">Fresh Fit</h1>
            <p className="text-xs text-[#7d867f]">Smart nutrition dashboard</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <SidebarLink
                key={item.to}
                item={item}
                active={pathname === item.to}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>

          <div className="sidebar-user mt-6 rounded-2xl p-3 text-sm text-[#5d584d]">
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-xs opacity-80">{user?.email || "health@app"}</p>
            <button type="button" className="btn mt-3 w-full !rounded-xl !py-2 text-xs" onClick={doLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className={`route-loading-bar ${routeLoading ? "active" : ""}`} aria-hidden="true" />
          <header className="top-toolbar mb-4">
            <form className="toolbar-search-wrap" onSubmit={submitToolbarSearch}>
              <button type="submit" className="toolbar-icon" aria-label="Search">
                {Icon.search}
              </button>
              <input
                className="toolbar-search"
                placeholder="Search meals, recipes, nutrients..."
                value={toolbarSearch}
                onChange={(event) => setToolbarSearch(event.target.value)}
              />
            </form>
            <div className="toolbar-actions">
              {toolbarActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="toolbar-btn"
                  onClick={action.onClick}
                  title={action.label}
                  aria-label={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
          </header>
          <Outlet />
          <ChatbotWidget />
        </main>
      </div>
    </div>
  );
};

export default AppSidebarLayout;
