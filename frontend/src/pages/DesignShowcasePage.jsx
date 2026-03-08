const palette = {
  cream: "#F6F1E7",
  beige: "#EBDCC8",
  sand: "#D9C0A7",
  mint: "#CFE3CF",
  sage: "#8FAF8D",
  brown: "#7B5A44",
};

const screens = [
  "Welcome",
  "Login",
  "Sign Up",
  "Profile Setup",
  "BMI Dashboard",
  "Diet Plan",
  "Body Measurements",
  "Calorie Analytics",
  "Weight Progress",
  "Recommendations",
  "Settings",
];

const DoodleFruit = () => (
  <svg viewBox="0 0 72 72" className="h-12 w-12" aria-hidden="true">
    <path d="M25 19c7-8 15-8 22 0" fill="none" stroke="#7B5A44" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="35" cy="38" r="16" fill="#E7A98A" stroke="#7B5A44" strokeWidth="2.2" />
    <path d="M43 20c3-6 8-8 13-8-2 5-6 10-11 12" fill="#8FAF8D" stroke="#7B5A44" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const DoodleVeg = () => (
  <svg viewBox="0 0 72 72" className="h-12 w-12" aria-hidden="true">
    <path d="M36 14c8 9 10 22 10 30 0 10-6 16-10 16s-10-6-10-16c0-8 2-21 10-30z" fill="#CFE3CF" stroke="#7B5A44" strokeWidth="2.2" />
    <path d="M36 14v46" stroke="#7B5A44" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 28c-6-3-9-8-10-14 6 1 12 5 15 11" fill="none" stroke="#7B5A44" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DoodleFit = () => (
  <svg viewBox="0 0 72 72" className="h-12 w-12" aria-hidden="true">
    <rect x="20" y="30" width="32" height="12" rx="4" fill="#D9C0A7" stroke="#7B5A44" strokeWidth="2" />
    <rect x="14" y="27" width="6" height="18" rx="2" fill="#8FAF8D" stroke="#7B5A44" strokeWidth="2" />
    <rect x="52" y="27" width="6" height="18" rx="2" fill="#8FAF8D" stroke="#7B5A44" strokeWidth="2" />
  </svg>
);

const Phone = ({ title, children }) => (
  <article className="relative rounded-[2.1rem] border border-[#D6C8B5] bg-[#FCF8F1] p-3 shadow-[0_18px_40px_rgba(123,90,68,0.18)]">
    <div className="relative h-[540px] w-[252px] overflow-hidden rounded-[1.7rem] border border-[#E5D8C7] bg-[#FFFDF9] p-4">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#DCCFBE]" />
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7A62]">{title}</p>
      {children}
    </div>
  </article>
);

const WelcomeScreen = () => (
  <div className="flex h-[470px] flex-col justify-between rounded-3xl bg-gradient-to-br from-[#F6F1E7] to-[#E9DBC9] p-5">
    <div className="flex items-center justify-between">
      <DoodleFruit />
      <DoodleVeg />
    </div>
    <div>
      <h3 className="text-2xl font-semibold leading-tight text-[#5E4436]">Your AI-powered\nwellness kitchen</h3>
      <p className="mt-3 text-sm text-[#7B5A44]">Personalized plans, mindful calories, and simple habits.</p>
    </div>
    <button className="w-full rounded-2xl bg-[#8FAF8D] px-4 py-3 text-sm font-semibold text-white">Start Journey</button>
  </div>
);

const LoginScreen = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-[#5E4436]">Welcome back</h3>
    <input className="w-full rounded-2xl border border-[#E2D3C2] bg-[#FAF5ED] px-4 py-3 text-sm" placeholder="Email" />
    <input className="w-full rounded-2xl border border-[#E2D3C2] bg-[#FAF5ED] px-4 py-3 text-sm" placeholder="Password" type="password" />
    <button className="w-full rounded-2xl bg-[#8FAF8D] px-4 py-3 text-sm font-semibold text-white">Login</button>
    <p className="text-center text-xs text-[#9A7A62]">Forgot password?</p>
  </div>
);

const SignupScreen = () => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-[#5E4436]">Create account</h3>
    {["Name", "Email", "Password"].map((field) => (
      <input key={field} className="w-full rounded-2xl border border-[#E2D3C2] bg-[#FAF5ED] px-4 py-3 text-sm" placeholder={field} />
    ))}
    <button className="mt-1 w-full rounded-2xl bg-[#7B5A44] px-4 py-3 text-sm font-semibold text-white">Sign Up</button>
  </div>
);

const ProfileSetupScreen = () => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-[#5E4436]">Profile setup</h3>
    <div className="grid grid-cols-2 gap-2">
      {["Age", "Height", "Weight", "Activity"].map((field) => (
        <div key={field} className="rounded-2xl bg-[#F6EFE3] p-3 text-xs text-[#7B5A44]">{field}</div>
      ))}
    </div>
    <div className="rounded-2xl bg-[#E8F0E6] p-3 text-xs text-[#5E4436]">Goal: Weight Loss</div>
    <button className="w-full rounded-2xl bg-[#8FAF8D] px-4 py-3 text-sm font-semibold text-white">Continue</button>
  </div>
);

const BmiDashboardScreen = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-[#5E4436]">BMI Dashboard</h3>
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-2xl bg-[#F5EDDF] p-3 text-center text-xs"><p className="text-lg font-semibold text-[#5E4436]">24.1</p><p>BMI</p></div>
      <div className="rounded-2xl bg-[#F5EDDF] p-3 text-center text-xs"><p className="text-lg font-semibold text-[#5E4436]">1560</p><p>BMR</p></div>
      <div className="rounded-2xl bg-[#F5EDDF] p-3 text-center text-xs"><p className="text-lg font-semibold text-[#5E4436]">2100</p><p>TDEE</p></div>
    </div>
    <div className="rounded-2xl bg-[#E8F0E6] p-4 text-sm text-[#5E4436]">You're in the healthy range. Keep balanced meals.</div>
  </div>
);

const DietPlanScreen = () => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-[#5E4436]">Today's plan</h3>
    {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal) => (
      <div key={meal} className="rounded-2xl border border-[#E5D9CA] bg-[#FFF8EF] p-3 text-sm">
        <p className="font-semibold text-[#6B4E3D]">{meal}</p>
        <p className="text-xs text-[#8C6A54]">Balanced Indian meal • 320 kcal</p>
      </div>
    ))}
  </div>
);

const BodyScreen = () => (
  <div className="h-[470px] rounded-3xl bg-[#FAF6EE] p-3">
    <p className="text-center text-sm font-semibold text-[#6B4E3D]">Your body</p>
    <div className="relative mt-4 h-[400px]">
      <div className="absolute left-1/2 top-6 h-72 w-20 -translate-x-1/2 rounded-[40px] bg-[#C9D2C5] opacity-40" />
      <span className="absolute right-2 top-12 text-xs text-[#7B5A44]">Neck: 34 cm</span>
      <span className="absolute left-2 top-36 text-xs text-[#7B5A44]">Chest: 94 cm</span>
      <span className="absolute right-2 top-52 text-xs text-[#7B5A44]">Waist: 78 cm</span>
      <span className="absolute left-2 top-64 text-xs text-[#7B5A44]">Hips: 98 cm</span>
    </div>
  </div>
);

const CalorieScreen = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-[#5E4436]">Calorie analytics</h3>
    <div className="mx-auto grid h-40 w-40 place-items-center rounded-full" style={{ background: "conic-gradient(#8FAF8D 0 68%, #E8DFD1 68% 100%)" }}>
      <div className="grid h-28 w-28 place-items-center rounded-full bg-[#FFFDF9] text-center">
        <p className="text-xs text-[#8C6A54]">Consumed</p>
        <p className="text-xl font-semibold text-[#5E4436]">68%</p>
      </div>
    </div>
    <p className="text-center text-xs text-[#7B5A44]">1420 / 2100 kcal</p>
  </div>
);

const WeightScreen = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-[#5E4436]">Weight progress</h3>
    <div className="rounded-2xl bg-[#F6EFE3] p-3">
      <svg viewBox="0 0 220 120" className="h-28 w-full">
        <path d="M10 95 C50 88, 70 80, 110 76 C140 73, 165 63, 210 40" stroke="#8FAF8D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="210" cy="40" r="5" fill="#7B5A44" />
      </svg>
      <p className="text-xs text-[#8C6A54]">-3.4 kg in 8 weeks</p>
    </div>
  </div>
);

const RecommendationScreen = () => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-[#5E4436]">Food recommendations</h3>
    {["Poha + sprouts", "Dal + roti + salad", "Paneer bowl"].map((item) => (
      <div key={item} className="flex items-center justify-between rounded-2xl bg-[#F7F0E4] p-3 text-sm text-[#6B4E3D]">
        <span>{item}</span>
        <span className="text-xs">AI Pick</span>
      </div>
    ))}
    <div className="flex gap-2 pt-2">
      <DoodleFruit />
      <DoodleFit />
    </div>
  </div>
);

const SettingsScreen = () => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-[#5E4436]">Settings</h3>
    {["Profile", "Notifications", "Units (cm/kg)", "Theme", "Privacy"].map((item) => (
      <div key={item} className="rounded-2xl border border-[#E4D6C5] bg-[#FAF6EF] p-3 text-sm text-[#6B4E3D]">{item}</div>
    ))}
    <button className="w-full rounded-2xl bg-[#7B5A44] px-4 py-3 text-sm font-semibold text-white">Save</button>
  </div>
);

const renderer = {
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  "Sign Up": SignupScreen,
  "Profile Setup": ProfileSetupScreen,
  "BMI Dashboard": BmiDashboardScreen,
  "Diet Plan": DietPlanScreen,
  "Body Measurements": BodyScreen,
  "Calorie Analytics": CalorieScreen,
  "Weight Progress": WeightScreen,
  Recommendations: RecommendationScreen,
  Settings: SettingsScreen,
};

const DesignShowcasePage = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F7F1E8] via-[#F2E8D9] to-[#E6D7C4] p-6 md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#CFDFC5] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#E4C8A8] opacity-30 blur-3xl" />

      <header className="relative z-10 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8C6A54]">Dribbble-style Concept Board</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#5E4436]">AI Diet Planner Mobile App UI/UX</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#7B5A44]">Minimal earthy aesthetic with rounded components, hand-drawn doodles, soft gradients, and startup-ready health app presentation.</p>
        </div>
        <div className="flex gap-2">
          <DoodleFruit />
          <DoodleVeg />
          <DoodleFit />
        </div>
      </header>

      <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {screens.map((name) => {
          const ScreenComponent = renderer[name];
          return (
            <Phone key={name} title={name}>
              <ScreenComponent />
            </Phone>
          );
        })}
      </div>
    </section>
  );
};

export default DesignShowcasePage;
