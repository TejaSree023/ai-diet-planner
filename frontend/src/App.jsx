import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppSidebarLayout from "./components/layout/AppSidebarLayout";
import { useAuth } from "./context/AuthContext";
import { WellnessProvider } from "./context/WellnessContext";
import { initializeMobileApp, isMobileApp } from "./services/mobileStorage";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DietPlanGeneratorPage = lazy(() => import("./pages/DietPlanGeneratorPage"));
const MealTrackerPage = lazy(() => import("./pages/MealTrackerPage"));
const RecipeBookPage = lazy(() => import("./pages/RecipeBookPage"));
const ProgressTrackerPage = lazy(() => import("./pages/ProgressTrackerPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const TermsOfUsePage = lazy(() => import("./pages/TermsOfUsePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    // Initialize mobile-specific features if running on a mobile app
    if (isMobileApp()) {
      initializeMobileApp();
    }
  }, []);

  return (
    <WellnessProvider>
      <Suspense fallback={<div className="p-6 text-sm text-[#6B665E]">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppSidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/meal-planner" element={<DietPlanGeneratorPage />} />
            <Route path="/tracker" element={<MealTrackerPage />} />
            <Route path="/recipes" element={<RecipeBookPage />} />
            <Route path="/progress" element={<ProgressTrackerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </WellnessProvider>
  );
}

export default App;
