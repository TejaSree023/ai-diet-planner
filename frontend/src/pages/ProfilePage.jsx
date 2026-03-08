import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import HeightWeightBodyCard from "../components/profile/HeightWeightBodyCard";

const defaultProfile = {
  name: "",
  age: "",
  height: "",
  weight: "",
  gender: "male",
  activityLevel: "sedentary",
  dietPreference: "veg",
  goal: "maintenance",
  allergies: "",
};

const normalizeDietPreference = (value) => {
  const raw = String(value || "veg").toLowerCase().trim();
  if (["non-veg", "non veg", "nonveg", "non_veg", "nonvegetarian", "non-vegetarian"].includes(raw)) {
    return "non-veg";
  }
  if (["egg", "eggetarian", "eggeterian", "eggitarian"].includes(raw)) {
    return "eggetarian";
  }
  if (raw === "vegan") {
    return "vegan";
  }
  return "veg";
};

const ProfilePage = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(defaultProfile);
  const [metrics, setMetrics] = useState(null);
  const [message, setMessage] = useState("");

  const applyProfileData = (data) => {
    setProfile({
      name: data.name || "",
      age: data.age || "",
      height: data.height || "",
      weight: data.weight || "",
      gender: data.gender || "male",
      activityLevel: data.activityLevel || "sedentary",
      dietPreference: normalizeDietPreference(data.dietPreference),
      goal: data.goal || data.healthGoal || "maintenance",
      allergies: (data.allergies || []).join(", "),
    });
    setMetrics(data.metrics || null);
    setUser({ id: data._id, name: data.name, email: data.email });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        applyProfileData(data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to fetch profile");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setProfile((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await updateProfile({
        ...profile,
        age: Number(profile.age),
        height: Number(profile.height),
        weight: Number(profile.weight),
        allergies: profile.allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setMessage("Profile updated successfully");
      const refreshed = await getProfile();
      applyProfileData(refreshed);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save profile");
    }
  };

  return (
    <section className="profile-split-layout">
      <div className="card profile-form-card">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Profile</p>
        <h2 className="text-2xl font-semibold text-[#5E4436]">User Profile</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="input sm:col-span-2" name="name" placeholder="Name" value={profile.name} onChange={handleChange} required />
          <input className="input" name="age" type="number" placeholder="Age" value={profile.age} onChange={handleChange} required />
          <input className="input" name="height" type="number" placeholder="Height (cm)" value={profile.height} onChange={handleChange} required />
          <input className="input" name="weight" type="number" placeholder="Weight (kg)" value={profile.weight} onChange={handleChange} required />

          <select className="input" name="gender" value={profile.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select className="input" name="activityLevel" value={profile.activityLevel} onChange={handleChange}>
            <option value="sedentary">Sedentary</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>

          <select className="input" name="dietPreference" value={profile.dietPreference} onChange={handleChange}>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="eggetarian">Eggetarian</option>
          </select>

          <select className="input" name="goal" value={profile.goal} onChange={handleChange}>
            <option value="weight-loss">Weight Loss</option>
            <option value="weight-gain">Weight Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle-gain">Muscle Gain</option>
          </select>

          <input
            className="input sm:col-span-2"
            name="allergies"
            placeholder="Allergies (comma separated)"
            value={profile.allergies}
            onChange={handleChange}
          />

          <button className="btn sm:col-span-2" type="submit">Save Profile</button>
          {message && <p className="sm:col-span-2 text-sm text-[#7B5C49]">{message}</p>}
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F5ECDF] p-3 text-sm text-[#6F5443]"><strong>BMI:</strong> {metrics?.bmi ?? "-"}</div>
          <div className="rounded-2xl bg-[#E8F0E6] p-3 text-sm text-[#506A58]"><strong>Daily Calories:</strong> {metrics?.dailyCalories ?? "-"}</div>
          <div className="rounded-2xl bg-[#F5ECDF] p-3 text-sm text-[#6F5443]"><strong>Goal:</strong> {profile.goal}</div>
          <div className="rounded-2xl bg-[#E8F0E6] p-3 text-sm text-[#506A58]"><strong>BMR/TDEE:</strong> {metrics?.bmr ?? "-"} / {metrics?.tdee ?? "-"}</div>
        </div>
      </div>

      <div className="profile-body-column">
        <HeightWeightBodyCard height={profile.height} weight={profile.weight} />
      </div>
    </section>
  );
};

export default ProfilePage;
