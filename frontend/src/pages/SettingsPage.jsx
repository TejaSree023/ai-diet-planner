import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAllLogs, deleteAccount, exportMyData, getProfile, updateProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const toPrettyJson = (value) => JSON.stringify(value ?? [], null, 2);

const buildTxtExport = (payload) => {
  const lines = [
    "AI DIET PLANNER - DATA EXPORT",
    `Exported At: ${payload?.exportedAt || new Date().toISOString()}`,
    "",
    "USER",
    toPrettyJson(payload?.user),
    "",
    "DIET PLANS",
    `Count: ${payload?.dietPlans?.length || 0}`,
    toPrettyJson(payload?.dietPlans),
    "",
    "MEAL LOGS",
    `Count: ${payload?.mealLogs?.length || 0}`,
    toPrettyJson(payload?.mealLogs),
    "",
    "PROGRESS LOGS",
    `Count: ${payload?.progressLogs?.length || 0}`,
    toPrettyJson(payload?.progressLogs),
  ];

  return lines.join("\n");
};

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({ water: true, meals: true, weighIn: false });
  const [units, setUnits] = useState("metric");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profile = await getProfile();
        setNotifications({
          water: profile.reminderSettings?.water !== false,
          meals: profile.reminderSettings?.meals !== false,
          weighIn: Boolean(profile.reminderSettings?.weighIn),
        });
        setWakeTime(profile.wakeTime || "07:00");
        setSleepTime(profile.sleepTime || "23:00");
      } catch {
        // Keep defaults when profile read fails.
      }
    };

    loadSettings();
  }, []);

  const goTo = (path) => navigate(path);

  const saveReminderSettings = async (nextSettings, nextWake = wakeTime, nextSleep = sleepTime) => {
    try {
      setIsSaving(true);
      await updateProfile({
        wakeTime: nextWake,
        sleepTime: nextSleep,
        reminderSettings: nextSettings,
      });
      setMessage("Settings updated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleReminder = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    await saveReminderSettings(next);
  };

  const onTimeChange = async (key, value) => {
    if (key === "wake") {
      setWakeTime(value);
      await saveReminderSettings(notifications, value, sleepTime);
      return;
    }

    setSleepTime(value);
    await saveReminderSettings(notifications, wakeTime, value);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const payload = await exportMyData();
      const textContent = buildTxtExport(payload);
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ai-diet-data-${new Date().toISOString().slice(0, 10)}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Your TXT data export is ready");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = async () => {
    const confirmed = window.confirm("Delete all tracker and meal logs? Your account and preferences will stay.");
    if (!confirmed) return;

    try {
      setIsClearing(true);
      await clearAllLogs();
      setMessage("All logs have been deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to clear logs");
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    const typed = window.prompt("Type DELETE to confirm account removal.");
    if (typed !== "DELETE") {
      setMessage("Account deletion cancelled. Type DELETE exactly to confirm.");
      return;
    }

    try {
      setIsDeleting(true);
      setMessage("");
      await deleteAccount();
      logout();
      navigate("/login");
    } catch (error) {
      const responseMessage = error.response?.data?.message;
      const isUnauthorized = error.response?.status === 401;
      const isNetworkError = error.code === "ERR_NETWORK";

      if (isNetworkError) {
        setMessage("Cannot reach backend API. Start backend on http://localhost:5000 and try again.");
      } else if (isUnauthorized) {
        setMessage("Session expired. Please login again and retry account deletion.");
      } else {
        setMessage(responseMessage || "Failed to delete account");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Settings</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#5E4436]">Personalize your experience</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card hover-card space-y-4">
          <h3 className="text-lg font-semibold text-[#5E4436]">Preferences</h3>

          <label className="flex items-center justify-between rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3">
            <span className="text-sm text-[#6d5645]">Water reminders</span>
            <input type="checkbox" checked={notifications.water} onChange={() => toggleReminder("water")} />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3">
            <span className="text-sm text-[#6d5645]">Meal reminders</span>
            <input type="checkbox" checked={notifications.meals} onChange={() => toggleReminder("meals")} />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3">
            <span className="text-sm text-[#6d5645]">Weekly weigh-in reminder</span>
            <input type="checkbox" checked={notifications.weighIn} onChange={() => toggleReminder("weighIn")} />
          </label>

          <div className="rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3">
            <p className="text-sm text-[#6d5645]">Units</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={`btn-secondary ${units === "metric" ? "!bg-[#D9E8D6]" : ""}`}
                onClick={() => setUnits("metric")}
              >
                Metric (cm/kg)
              </button>
              <button
                type="button"
                className={`btn-secondary ${units === "imperial" ? "!bg-[#D9E8D6]" : ""}`}
                onClick={() => setUnits("imperial")}
              >
                Imperial
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="field-group rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] p-3">
              <span>Wake Time</span>
              <input className="input" type="time" value={wakeTime} onChange={(event) => onTimeChange("wake", event.target.value)} />
            </label>
            <label className="field-group rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] p-3">
              <span>Sleep Time</span>
              <input className="input" type="time" value={sleepTime} onChange={(event) => onTimeChange("sleep", event.target.value)} />
            </label>
          </div>

          {isSaving && <p className="text-xs text-[#6d5645]">Saving preferences...</p>}
        </div>

        <div className="card hover-card space-y-3">
          <h3 className="text-lg font-semibold text-[#5E4436]">Account</h3>
          <button
            type="button"
            className="w-full rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3 text-left text-sm text-[#6d5645] hover:bg-[#f7ecdf]"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting your data..." : "Export My Data (TXT)"}
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-[#f1d8c5] bg-[#fff4ea] px-4 py-3 text-left text-sm text-[#8a5a3f] hover:bg-[#fbe7d7]"
            onClick={handleClearLogs}
            disabled={isClearing}
          >
            {isClearing ? "Clearing logs..." : "Delete All Logs"}
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3 text-left text-sm text-[#6d5645] hover:bg-[#f7ecdf]"
            onClick={() => goTo("/privacy-policy")}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3 text-left text-sm text-[#6d5645] hover:bg-[#f7ecdf]"
            onClick={() => goTo("/terms-of-use")}
          >
            Terms of Use
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-[#e4d3c0] bg-[#fff8ef] px-4 py-3 text-left text-sm text-[#6d5645] hover:bg-[#f7ecdf]"
            onClick={() => goTo("/support")}
          >
            Support
          </button>
          <button
            type="button"
            disabled={isDeleting}
            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleDeleteAccount}
          >
            {isDeleting ? "Deleting account..." : "Delete Account"}
          </button>

          <div className="rounded-2xl border border-[#dbe7df] bg-[#f7fbf8] p-3 text-xs text-[#5b665f]">
            <p className="font-semibold text-[#476054]">AI Safety Note</p>
            <p className="mt-1">This app provides wellness suggestions, not medical diagnosis. Consult a qualified professional for medical conditions.</p>
          </div>

          {message && (
            <p className={`text-sm ${/fail|error|cancel/i.test(message) ? "text-rose-600" : "text-[#2F7A66]"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
