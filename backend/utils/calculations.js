const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(2));
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const calculateBMR = ({ gender, weight, height, age }) => {
  const safeGender = gender === "female" ? "female" : "male";

  if (safeGender === "male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }

  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
};

const getActivityFactor = (activityLevel) => {
  if (activityLevel === "active") return 1.55;
  if (activityLevel === "moderate") return 1.375;
  return 1.2;
};

const calculateTDEE = ({ bmr, activityLevel }) => {
  return Math.round(bmr * getActivityFactor(activityLevel));
};

const calculateDailyCalories = ({ tdee, goal }) => {
  if (goal === "weight-loss") {
    return Math.max(1200, Math.round(tdee - 400));
  }
  if (goal === "weight-gain") {
    return Math.round(tdee + 350);
  }
  if (goal === "muscle-gain") {
    return Math.round(tdee + 300);
  }

  return Math.round(tdee);
};

module.exports = {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
};
