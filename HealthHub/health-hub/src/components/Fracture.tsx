import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Fracture: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setPrediction(null);
            setConfidence(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/predict/fracture", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Prediction failed");
            }

            const data = await response.json();
            setPrediction(data.prediction);
            setConfidence(data.confidence);

            let adjustedConfidence = (data.confidence * 100).toFixed(2);
            if (data.prediction !== "Fracture") {
                adjustedConfidence = (-parseFloat(adjustedConfidence)).toFixed(2);
            }

            const updateResponse = await fetch(`http://localhost:8900/health/updateDetection/${user?.customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: 2,
                    confidence: parseFloat(adjustedConfidence),
                    type: data.prediction,
                }),
            });

            if (!updateResponse.ok) {
                throw new Error("Failed to update detection data");
            }

            console.log("Detection result saved successfully.");

        } catch (error) {
            console.error("Prediction error:", error);
            setPrediction("Error");
            setConfidence(null);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 500, width: '100%' }}>
                <h3 className="text-center text-primary mb-4">Fracture Detection</h3>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control mb-3"
                />

                {previewUrl && (
                    <div className="text-center mb-3">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: 300 }}
                        />
                    </div>
                )}

                <div className="d-grid mb-3">
                    <button
                        onClick={handleUpload}
                        className="btn btn-success"
                        disabled={!selectedFile || loading}
                    >
                        {loading ? "Predicting..." : "Upload & Predict"}
                    </button>
                </div>

                {prediction && (
                    <div
                        className={`alert ${prediction === "Fracture"
                            ? "alert-danger"  // Red for Fracture
                            : prediction === "Normal"
                                ? "alert-info"   // Blue for Normal
                                : "alert-secondary"  // Grey for others
                            } mt-3`}
                    >
                        <h4 className="alert-heading">Prediction: {prediction}</h4>
                        {confidence !== null && (
                            <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fracture;
