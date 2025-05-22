import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DetectionData {
    fracture: number | null;
    eye_cataract: number | null;
    pnemonia: number | null;
    skin: number | null;
    type: string | null;
}

interface Advice {
    label: string;
    field: keyof DetectionData;
    type?: keyof DetectionData;
    precautions: string[];
}

const HealthReport: React.FC = () => {
    const [data, setData] = useState<DetectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, logout, user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8900/health/getAllDetection/${user?.customerId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch health data');
                }
                const result = await res.json();
                setData(result);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const adviceList: Advice[] = [
        {
            label: "Bone Fracture",
            field: "fracture",
            precautions: ["Get an X-ray", "Avoid putting pressure on the affected area", "Consult an orthopedic doctor"]
        },
        {
            label: "Eye Cataract",
            field: "eye_cataract",
            precautions: ["Use anti-glare glasses", "Avoid bright light", "Schedule an eye check-up"]
        },
        {
            label: "Pneumonia",
            field: "pnemonia",
            precautions: ["Take rest", "Drink plenty of fluids", "Consult a physician immediately"]
        },
        {
            label: "Skin Disease",
            field: "skin",
            type: "type",
            precautions: ["Use dermatologist-recommended creams", "Avoid scratching", "Maintain skin hygiene"]
        }
    ];

    const getFieldValue = <K extends keyof DetectionData>(obj: DetectionData, key: K): DetectionData[K] => {
        return obj[key];
    };

    const renderCondition = (confidence: number | null) => {
        if (confidence === null) return <span className="badge bg-secondary">Not Checked</span>;
        return confidence > 0
            ? <span className="badge bg-danger">Detected ❌</span>
            : <span className="badge bg-success">No Disease ✅</span>;
    };

    const renderConfidence = (confidence: number | null) => {
        if (confidence === null) return "N/A";
        return `${Math.abs(confidence).toFixed(2)}%`;
    };

    const renderAdvice = (confidence: number | null, tips: string[]) => {
        if (confidence !== null && confidence > 0) {
            return (
                <ul className="list-group list-group-flush">
                    {tips.map((tip, index) => (
                        <li key={index} className="list-group-item">{tip}</li>
                    ))}
                </ul>
            );
        }
        return null;
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg p-4 border-0">
                <h2 className="text-center text-primary mb-4">🩺 Comprehensive Health Report</h2>

                {loading && <div className="text-center">Fetching report...</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {data && (
                    <div className="row g-4">
                        {adviceList.map(({ label, field, type, precautions }, idx) => {
                            const rawValue = getFieldValue(data, field);
                            const conf = typeof rawValue === 'number' ? rawValue : null;
                            const typeVal = type ? getFieldValue(data, type) : null;

                            return (
                                <div className="col-md-6" key={idx}>
                                    <div className="card border rounded shadow-sm h-100">
                                        <div className="card-body">
                                            <h5 className="card-title d-flex justify-content-between align-items-center">
                                                {label}
                                                {renderCondition(conf)}
                                            </h5>
                                            <p className="card-text">
                                                <strong>Confidence:</strong> {renderConfidence(conf)}
                                                {typeVal && conf !== null && conf > 0 && (
                                                    <>
                                                        <br /><strong>Type:</strong> {typeVal}
                                                    </>
                                                )}
                                            </p>
                                            {conf !== null && conf > 0 && (
                                                <>
                                                    <h6 className="mt-3">Recommended Precautions:</h6>
                                                    {renderAdvice(conf, precautions)}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthReport;
