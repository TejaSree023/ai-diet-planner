import { useNavigate } from "react-router-dom";

const TermsOfUsePage = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A54]">Legal</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#2F2F2B]">Terms of Use</h2>
        <p className="mt-2 text-sm text-[#6B665E]">
          This dashboard provides wellness guidance for informational purposes and does not replace professional
          medical advice. You are responsible for your use of plans and recommendations.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#6B665E]">
          <li>Use recommendations as a guide and adjust based on your health needs.</li>
          <li>Keep your profile data accurate for better diet results.</li>
          <li>Do not share your account credentials with others.</li>
          <li>Contact a healthcare professional for medical concerns.</li>
        </ul>
        <button type="button" className="btn mt-4" onClick={() => navigate("/settings")}>Back to Settings</button>
      </div>
    </section>
  );
};

export default TermsOfUsePage;
