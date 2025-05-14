import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginSignup: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  // Validation states
  const [nameValid, setNameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:8900/health/checkAuth/${email}/${password}`);
      const result = await response.json();

      if (result === true) {
        login();
        navigate("/home");
      } else {
        setError("Email or password doesn't match.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  const handleSignUp = async () => {
    // Final validation before sending request
    if (!nameValid || !passwordValid) {
      setError("Please correct the errors above.");
      return;
    }

    const payload = {
      customerName,
      emailId: email,
      password,
      age: Number(age),
      gender
    };

    try {
      const response = await fetch("http://localhost:8900/health/addCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.customerId) {
        alert("Sign-up successful! Please log in.");
        setIsSignUp(false);
        setError("");
      } else if (result.message === "customer mail already exist") {
        setError("Email already taken.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("Server error during sign-up.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    if (!isSignUp) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4 display-5">{isSignUp ? "Sign Up" : "Login"}</h2>

              <form onSubmit={handleSubmit}>
                {isSignUp && (
                  <>
                    {/* Name Field */}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${!nameValid ? "is-invalid" : ""}`}
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomerName(value);
                          setNameValid(value.trim().split(/\s+/).length >= 2);
                        }}
                        required
                      />
                      {!nameValid && (
                        <div className="invalid-feedback">
                          Please enter both first and last name.
                        </div>
                      )}
                    </div>

                    {/* Age Field */}
                    <div className="mb-3">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Gender Field */}
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${!passwordValid && isSignUp ? "is-invalid" : ""}`}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
                      setPasswordValid(passwordRegex.test(value));
                    }}
                    required
                  />
                  {!passwordValid && isSignUp && (
                    <div className="invalid-feedback">
                      Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && <div className="text-danger mb-3">{error}</div>}

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success">
                    {isSignUp ? "Sign Up" : "Login"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                      setPasswordValid(true);
                      setNameValid(true);
                    }}
                  >
                    {isSignUp
                      ? "Already have an account? Login"
                      : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
