import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Legal</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#2F2F2B]">Privacy Policy</h2>
        <p className="mt-2 text-sm text-[#6B665E]">
          We store account, profile, and activity data to provide personalized meal and progress insights. Your data
          is used only for app functionality and is not sold to third parties.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6B665E]">
          <li>Profile and health inputs are stored securely in your account.</li>
          <li>You can update or delete your account from Settings at any time.</li>
          <li>Authentication tokens are stored locally for signed-in sessions.</li>
          <li>For support, use the Support section in Settings.</li>
        </ul>
        <button type="button" className="btn mt-4" onClick={() => navigate("/settings")}>Back to Settings</button>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
