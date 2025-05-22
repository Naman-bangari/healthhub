import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from 'recharts';

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

const COLORS = ['#4caf50', '#f44336']; // green (no disease), red (disease)

const HealthReport: React.FC = () => {
    const [data, setData] = useState<DetectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8900/health/getAllDetection/${user?.customerId}`);
                if (!res.ok) throw new Error('Failed to fetch health data');
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
            precautions: ["Get an X-ray", "Avoid pressure", "Consult orthopedic doctor"]
        },
        {
            label: "Eye Cataract",
            field: "eye_cataract",
            precautions: ["Use anti-glare glasses", "Avoid bright light", "Eye check-up"]
        },
        {
            label: "Pneumonia",
            field: "pnemonia",
            precautions: ["Rest", "Hydrate", "Consult physician"]
        },
        {
            label: "Skin Disease",
            field: "skin",
            type: "type",
            precautions: ["Use dermatologist creams", "Avoid scratching", "Maintain hygiene"]
        }
    ];

    const getFieldValue = <K extends keyof DetectionData>(obj: DetectionData, key: K): DetectionData[K] => obj[key];

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
                <ul className="list-group list-group-flush mt-2">
                    {tips.map((tip, index) => (
                        <li key={index} className="list-group-item">{tip}</li>
                    ))}
                </ul>
            );
        }
        return null;
    };

    const barChartData = data
        ? adviceList.map(({ label, field }) => {
            const conf = data[field] as number | null;
            return {
                name: label,
                confidence: conf ? Math.abs(conf) : 0,
                positive: conf ? conf > 0 : false
            };
        })
        : [];

    return (
        <div className="container py-5">
            <div className="card shadow-lg p-4 border-0">
                <h2 className="text-center text-primary mb-4">🩺 Comprehensive Health Report</h2>

                {loading && <div className="text-center">Fetching report...</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                {data && (
                    <>
                        <div className="row g-4">
                            {adviceList.map(({ label, field, type, precautions }, idx) => {
                                const rawValue = getFieldValue(data, field);
                                const conf = typeof rawValue === 'number' ? rawValue : null;
                                const typeVal = type ? getFieldValue(data, type) : null;

                                const pieData = [
                                    { name: 'Healthy', value: conf !== null && conf <= 0 ? Math.abs(conf) : 0 },
                                    { name: 'Disease', value: conf !== null && conf > 0 ? conf : 0 }
                                ];

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

                                                <ResponsiveContainer width="100%" height={150}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={50}
                                                            innerRadius={30}
                                                            dataKey="value"
                                                            label={({ name, value }) => value > 0 ? `${name}: ${value.toFixed(1)}%` : ''}
                                                        >
                                                            {pieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>

                                                {renderAdvice(conf, precautions)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bar Chart */}
                        <div className="card mt-5 shadow-sm p-4">
                            <h4 className="mb-3 text-primary">📊 Summary Comparison</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="confidence">
                                        {barChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.positive ? '#f44336' : '#4caf50'} // red or green
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="text-muted mt-2 ms-2">
                                <span className="me-3">
                                    <span className="badge bg-danger">⬛</span> Disease Detected
                                </span>
                                <span>
                                    <span className="badge bg-success">⬛</span> No Disease
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthReport;
