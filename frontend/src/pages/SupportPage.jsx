import { useNavigate } from "react-router-dom";

const SupportPage = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Help</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#2F2F2B]">Support</h2>
        <p className="mt-2 text-sm text-[#6B665E]">
          Need help with diet plans, tracking, or account issues? Reach support at
          {" "}
          <a className="font-semibold text-[#2a9f61]" href="mailto:support@aidietplanner.app">support@aidietplanner.app</a>
          .
        </p>
        <div className="mt-4 rounded-2xl border border-[#dfe9e3] bg-[#f7fbf8] p-4 text-sm text-[#5D665F]">
          Include your registered email and a short issue description for faster response.
        </div>
        <button type="button" className="btn mt-4" onClick={() => navigate("/settings")}>Back to Settings</button>
      </div>
    </section>
  );
};

export default SupportPage;
