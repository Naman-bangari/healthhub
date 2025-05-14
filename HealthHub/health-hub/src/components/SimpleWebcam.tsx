import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

const SimpleWebcam: React.FC = () => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          if (!isPlaying) {
            await webcamRef.current.play();
            setIsPlaying(true);
          }
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load('/model/model.json', '/model/metadata.json');
        setModel(loadedModel);
        console.log('Model loaded');
      } catch (err) {
        console.error('Error loading model:', err);
      }
    };

    loadModel();
    setupWebcam();

    const intervalId = setInterval(captureAndPredict, 3000);

    return () => {
      console.log('Cleaning up webcam...');
      clearInterval(intervalId);
      if (webcamRef.current) {
        const stream = webcamRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          webcamRef.current.srcObject = null;
        }
      }
    };
  }, [isPlaying]);

  const captureAndPredict = async () => {
    if (webcamRef.current && model) {
      setLoading(true); // Set loading to true when prediction starts

      const canvas = document.createElement('canvas');
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);

      const photo = canvas.toDataURL('image/png');
      const image = new Image();
      image.src = photo;
      image.onload = async () => {
        const predictions = await model.predict(image);
        const topPrediction = predictions.reduce((a, b) =>
          a.probability > b.probability ? a : b
        );
        setPrediction(
          `Prediction: ${topPrediction.className}, Confidence: ${(topPrediction.probability * 100).toFixed(2)}%`
        );

        setLoading(false); // Set loading to false after prediction is done
      };
    }
  };

  const handleReloadAndGoHome = () => {
    window.location.href = '/home';  
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-success text-center">
      <button 
        className="btn btn-danger mt-3" 
        onClick={handleReloadAndGoHome} 
        style={{ width: '200px' }}>
        Go Back
      </button>
      <h2 className="mb-4 fw-bold">🩺 Skin Disease Detection</h2>

      <div className="border border-success rounded shadow p-2 mb-3" style={{ width: 640, height: 500 }}>
        <video
          ref={webcamRef}
          width="100%"
          height="100%"
          autoPlay
          muted
          className="rounded"
        />
      </div>

      {/* Fixed height for the prediction/loading area */}
      <div className="w-75 mt-3" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          prediction && (
            <div className="alert alert-success w-100 fw-semibold">
              {prediction}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SimpleWebcam;
