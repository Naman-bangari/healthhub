import React, { useState, useRef, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';

type Prediction = {
  className: string;
  probability: number;
};

const SkinPredictor: React.FC = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [maxPrediction, setMaxPrediction] = useState<Prediction | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);

  const modelURL = '/model/';
  const metadataURL = '/model/';

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(
          modelURL + 'model.json',
          metadataURL + 'metadata.json'
        );
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Model loading error:', error);
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (imageRef.current && typeof reader.result === 'string') {
          imageRef.current.src = reader.result;
          setMaxPrediction(null);
          setIsImageUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setIsImageUploaded(false);
    }
  };


  useEffect(() => {
    console.log("Image uploaded:", isImageUploaded);
  }, [isImageUploaded]);

  const { isAuthenticated, logout, user } = useAuth();

  const predict = async () => {
    if (!model || !imageRef.current) return;

    setLoading(true);

    try {
      const predictions = await model.predict(imageRef.current);
      const topPrediction = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );
      setMaxPrediction(topPrediction);

      // Prepare adjusted confidence
      let adjustedConfidence = (topPrediction.probability * 100).toFixed(2);

      // Save result to backend
      const saveResponse = await fetch(`http://localhost:8900/health/updateDetection/${user?.customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 4,
          confidence: parseFloat(adjustedConfidence),
          type: topPrediction.className,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to update skin prediction data");
      }

      console.log("Skin prediction result saved successfully.");

    } catch (error) {
      console.error("Prediction error:", error);
      setMaxPrediction(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 500, width: '100%' }}>
        <div className="card-body text-center">
          <h2 className="text-center text-primary mb-4">Skin Disease Predictor</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control mb-3"

          />
          <div className="mb-4" style={{ display: isImageUploaded ? 'block' : 'none' }}>
            <img ref={imageRef} alt="upload" className="img-fluid" style={{ maxWidth: '300px' }} />
          </div>

          <div className="d-grid mb-3">
            <button
              onClick={predict}
              className="btn btn-success"
              disabled={!model || !isImageUploaded}
            >
              {loading ? "Predicting..." : "Upload & Predict"}
            </button>
          </div>
          {maxPrediction && (
            <div
              className={`alert text-center mt-3 ${maxPrediction.className.toLowerCase() === 'normal skin'
                ? 'alert-info'
                : 'alert-danger'
                }`}
              role="alert"
            >
              <h4 className="mb-1">Prediction: {maxPrediction.className}</h4>
              <p className="mb-0">
                Confidence: {(maxPrediction.probability * 100).toFixed(2)}%
              </p>
            </div>
          )}




        </div>
      </div>
    </div>
  );
};

export default SkinPredictor;
