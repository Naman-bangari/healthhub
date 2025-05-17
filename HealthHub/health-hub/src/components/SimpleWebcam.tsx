import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as tmImage from '@teachablemachine/image';

const SimpleWebcam: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cameraActive) return;

    let rafId: number;
    let lastTime = performance.now();
    let localModel: tmImage.CustomMobileNet;
    let stopped = false;

    (async () => {
      // 1️⃣ Backend
      await tf.setBackend('webgl');
      await tf.ready();

      // 2️⃣ Start webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (_err) {
            // swallow AbortError on reloads
          }
        }
      } catch (err) {
        console.error('Webcam init error:', err);
        return;
      }

      // 3️⃣ Load model
      try {
        localModel = await tmImage.load('/model/model.json', '/model/metadata.json');
        console.log('Model loaded');
      } catch (err) {
        console.error('Model load error:', err);
        return;
      }

      setLoading(false);

      // 4️⃣ Inference loop
      const loop = (time: number) => {
        if (stopped || !videoRef.current) return;
        if (time - lastTime > 3000) {
          lastTime = time;
          setLoading(true);
          localModel.predict(videoRef.current)
            .then(preds => {
              const top = preds.reduce((a, b) => (a.probability > b.probability ? a : b));
              setPrediction(`${top.className}: ${(top.probability * 100).toFixed(2)}%`);
            })
            .catch(err => console.error('Prediction error:', err))
            .finally(() => setLoading(false));
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
    })();

    return () => {
      
      stopped = true;
      cancelAnimationFrame(rafId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        // completely unload
        videoRef.current.srcObject = null;
        videoRef.current.load();
      }
    };
  }, [cameraActive]);

  const stopCamera = () => {
    setCameraActive(false);
  };

  const goHome = () => {
    stopCamera();
    window.location.href = '/home';
  };

  return (
    <div className="m-5 d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-success text-center">
      <div className="m-3 d-flex gap-2">
        <button className="btn btn-danger" onClick={goHome} style={{ width: 120 }}>
          Go Back
        </button>
        {cameraActive && (
          <button className="btn btn-warning" onClick={stopCamera} style={{ width: 120 }}>
            Stop Camera
          </button>
        )}
      </div>

      <h2 className="mb-4 fw-bold">🩺 Skin Disease Detection</h2>

      {cameraActive && (
        <div className="border border-success rounded shadow p-2 mb-3" style={{ width: 640, height: 500 }}>
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            autoPlay
            playsInline
            muted
            className="rounded bg-black"
          />
        </div>
      )}

      <div className="w-75 mt-3" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="alert alert-success w-100 fw-semibold">
            {prediction ?? 'No prediction yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWebcam;
