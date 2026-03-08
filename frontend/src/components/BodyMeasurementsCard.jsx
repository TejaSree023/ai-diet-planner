import { useState } from "react";

const FIELDS = [
  { key: "neck", label: "Neck", pos: "left-[70%] top-[16%]" },
  { key: "chest", label: "Chest", pos: "left-[7%] top-[35%]" },
  { key: "waist", label: "Waist", pos: "left-[70%] top-[54%]" },
  { key: "hips", label: "Hip", pos: "left-[7%] top-[63%]" },
];

const displayCm = (value) => (value || value === 0 ? `${value} cm` : "-- cm");

const BodyMeasurementsCard = ({ gender, measurements, onSaveMeasurement }) => {
  const [editingKey, setEditingKey] = useState(null);
  const [draftValue, setDraftValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const startEdit = (fieldKey) => {
    setMessage("");
    setEditingKey(fieldKey);
    setDraftValue(measurements?.[fieldKey] ?? "");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraftValue("");
  };

  const saveMeasurement = async (fieldKey) => {
    try {
      setSaving(true);
      setMessage("");
      const nextValue = draftValue === "" ? null : Number(draftValue);
      await onSaveMeasurement(fieldKey, nextValue);
      setEditingKey(null);
      setMessage("Measurement updated");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to save measurement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card space-y-4">
      <div>
        <h3 className="text-base font-semibold text-center">Your body</h3>
      </div>

      <div className="measurement-layout">
        <div className="body-stage">
          <div className={`body-silhouette ${gender === "female" ? "female" : "male"}`}>
            <div className="head" />
            <div className="torso" />
            <div className="left-arm" />
            <div className="right-arm" />
            <div className="left-leg" />
            <div className="right-leg" />
          </div>

          {FIELDS.map((field) => (
            <div key={field.key} className={`measurement-tag ${field.pos}`}>
              <p className="measurement-title">{field.label}: {displayCm(measurements?.[field.key])}</p>
              {editingKey === field.key ? (
                <div className="mt-1 flex items-center gap-1">
                  <input
                    className="input !w-20 !px-2 !py-1 text-xs"
                    type="number"
                    min="0"
                    step="0.1"
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                  />
                  <button
                    className="btn !px-2 !py-1 text-xs"
                    type="button"
                    onClick={() => saveMeasurement(field.key)}
                    disabled={saving}
                  >
                    Save
                  </button>
                  <button className="btn-secondary !px-2 !py-1 text-xs" type="button" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="measurement-link" type="button" onClick={() => startEdit(field.key)}>
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-brand-700 dark:text-brand-100">{message}</p>}
    </section>
  );
};

export default BodyMeasurementsCard;
