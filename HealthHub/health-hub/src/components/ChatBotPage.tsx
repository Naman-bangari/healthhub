import React, { useState } from "react";
import SymptomSelector from "./SymptomSelector";
import symptomOptions, { SymptomOption } from "./SymptonOption";
import { MultiValue } from "react-select";

type PredictResponse = {
  diseases: string[];
  descriptions: Record<string, string>;
  precautions: Record<string, string[]>;
};

const ChatBotPage: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] =
    useState<MultiValue<SymptomOption>>([]);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map((sym) => sym.value),
        }),
      });
      if (!res.ok) {
        throw new Error("Prediction failed. Check server.");
      }
      const data: PredictResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
  <h2 className="text-center mb-4">Disease Predictor</h2>

  <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
    <div className="mb-3">
      <label className="form-label fw-semibold">Select Symptoms:</label>
      <SymptomSelector
        value={selectedSymptoms}
        onChange={setSelectedSymptoms}
        symptomOptions={symptomOptions}
      />
      <small className="form-text text-muted">You can select multiple symptoms.</small>
    </div>

    <button
      type="submit"
      className="btn btn-primary w-100 py-2"
      disabled={loading}
    >
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {loading ? "Predicting..." : "Predict"}
    </button>
  </form>

  {error && (
    <div className="alert alert-danger mt-4 d-flex align-items-center" role="alert">
      <span className="me-2">❌</span> {error}
    </div>
  )}

  {response && response.diseases.length > 0 && (
    <div className="mt-4">
      {response.diseases.map((disease) => (
        <div key={disease} className="card mb-3 shadow-sm rounded">
          <div className="card-body">
            <h5 className="card-title fw-bold text-dark">{disease}</h5>
            <h6 className="mt-3 fw-semibold text-info">Description</h6>
            <p className="mb-3 ">{response.descriptions[disease]}</p>
            <h6 className="fw-semibold text-success">Precautions</h6>
            <ul className="mb-0">
              {response.precautions[disease].map((prec, idx) => (
                <li key={idx}>{prec}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )}

  {response && response.diseases.length === 0 && (
    <div className="alert alert-warning mt-4 d-flex align-items-center" role="alert">
      <span className="me-2">⚠️</span> No diseases matched your symptoms.
    </div>
  )}
</div>

  );
};

export default ChatBotPage;
