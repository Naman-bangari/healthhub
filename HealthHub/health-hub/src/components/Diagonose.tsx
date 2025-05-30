import React from 'react';
import { Link } from 'react-router-dom';

const Diagnosis: React.FC = () => {
  return (
    <div className="container py-5">
      <h2 className="display-3 text-center mb-5">Select a Diagnosis</h2>
      <div className="row justify-content-center">

        <div className="col-md-4 mb-4">
          <div className="card shadow-lg p-3 rounded-4">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Pneumonia Detection</h5>
              <p className="card-text text-muted">Detect Pneumonia from chest X-rays using AI.</p>
              <Link to="/pneumonia-diagnose" className="btn btn-outline-success">
                Go to Diagnose
              </Link>
            </div>
          </div>
        </div>

        
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg p-3 rounded-4">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Fracture Detection</h5>
              <p className="card-text text-muted">Detect fractures from X-rays with AI.</p>
              <Link to="/fracture-diagnose" className="btn btn-outline-success">
                Go to Diagnose
              </Link>
            </div>
          </div>
        </div>

        
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg p-3 rounded-4">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Eye Cataract Detection</h5>
              <p className="card-text text-muted">Detect cataracts from eye scans using AI.</p>
              <Link to="/eye-cataract-diagnose" className="btn btn-outline-success">
                Go to Diagnose
              </Link>
            </div>
          </div>
        </div>

       
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg p-3 rounded-4">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Skin Disease Detection</h5>
              <p className="card-text text-muted">Analyze skin conditions from images using AI.</p>
              <Link to="/skin-diagnose" className="btn btn-outline-success">
                Go to Diagnose
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
