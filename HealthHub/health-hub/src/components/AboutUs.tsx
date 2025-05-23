import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-4 text-success fw-bold">About HealthHub</h1>
        <p className="lead text-muted">
          Your personalized gateway to smarter healthcare.
        </p>
      </div>

      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">Our Mission</h5>
              <p className="card-text text-muted">
                At HealthHub, we aim to empower individuals with AI-driven tools for early disease detection and wellness tracking, making healthcare more accessible and proactive.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">What We Offer</h5>
              <p className="card-text text-muted">
                From diagnosing conditions like pneumonia and fractures to calculating health scores based on your data, we provide easy-to-use and accurate tools for everyone.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">Our Vision</h5>
              <p className="card-text text-muted">
                We envision a future where everyone has access to personalized healthcare insights, driven by advanced technology and a passion for well-being.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className=" text-success">
          Made with ❤️ by the HealthHub team. Your health, our priority.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
