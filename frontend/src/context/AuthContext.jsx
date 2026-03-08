import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const syncUserFromBackend = async () => {
    if (!token) return;

    try {
      const profile = await getProfile();
      const nextUser = {
        id: profile._id,
        name: profile.name,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
        dietPreference: profile.dietPreference,
        goal: profile.goal || profile.healthGoal,
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    } catch {
      // Keep local values if profile refresh fails.
    }
  };

  useEffect(() => {
    syncUserFromBackend();
  }, [token]);

  const login = (authToken, authUser) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout, setUser, syncUserFromBackend }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
