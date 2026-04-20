import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const STORAGE_KEY = "wellness_state_v1";

const initialState = {
  waterMl: 0,
  quickNote: "",
};

const WellnessContext = createContext(null);

// Reducer centralizes dashboard wellness updates (hydration + quick note).
const reducer = (state, action) => {
  switch (action.type) {
    case "hydrate": {
      const amount = Number(action.payload || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return state;
      }
      return { ...state, waterMl: state.waterMl + amount };
    }
    case "setNote":
      return { ...state, quickNote: action.payload || "" };
    case "resetHydration":
      return { ...state, waterMl: 0 };
    default:
      return state;
  }
};

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialState;
    }
    const parsed = JSON.parse(raw);
    return {
      waterMl: Number(parsed.waterMl || 0),
      quickNote: typeof parsed.quickNote === "string" ? parsed.quickNote : "",
    };
  } catch {
    return initialState;
  }
};

export const WellnessProvider = ({ children }) => {
  // useReducer manages predictable state transitions for shared wellness data.
  const [state, dispatch] = useReducer(reducer, initialState, loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
};

// useContext consumer hook for reading/updating shared wellness state.
export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error("useWellness must be used within WellnessProvider");
  }
  return context;
};
