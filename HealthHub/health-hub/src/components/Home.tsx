import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleLearnMoreClick = () => {
    navigate("/aboutUs");
  };

  return (
    <div className="home-page container-fluid py-5 px-5 white-shadow-text">
      <div className="text-center mb-5">
        <h1 className="display-4 text-success fw-bold">Welcome to HealthHub</h1>
        <p className="lead text-muted fw-bold">
          Empowering you with smart tools to stay healthier every day.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-success btn-lg" onClick={() => navigate('/login')}>Get Started</button>
          <button className="btn btn-outline-success btn-lg" onClick={handleLearnMoreClick}>
            Learn More
          </button>
        </div>
      </div>

      <div className="row text-center">
        {/* First Card (AI Health Diagnosis) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-black border-0">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title text-success fw-bold">AI Health Diagnosis</h5>
              <p className="card-text text-muted">
                Upload X-rays or scans to detect Pneumonia, Fractures, and more using our CNN-based image diagnosis model.
              </p>
              <Link to="/diaganose" className="btn btn-outline-success">
                Try Diagnosis
              </Link>
            </div>
          </div>
        </div>

        {/* Second Card (Smart Health Score) */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-black border-1">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title text-success fw-bold">Smart Health Score</h5>
              <p className="card-text text-muted">
                Calculate your BMI and get a wellness score (1-10) using your steps, heart rate, and personal data.
              </p>
              <Link to="/aboutUs" className="btn btn-outline-success">
                Check Your Score
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Third Card (Live Webcam Diagnosis) */}
      <div className="row d-flex justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-black border-1">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title text-success fw-bold">Live Webcam Diagnosis</h5>
              <p className="card-text text-muted">
                Use your webcam to perform live diagnosis for various health conditions.
              </p>
              <Link to="/live-cam" className="btn btn-outline-success">
                Start Live Cam
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
