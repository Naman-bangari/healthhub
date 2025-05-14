// src/components/AuthPage.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake auth logic (you can replace this with real logic)
    login();
    navigate("/home");
  };

  return (
    <div className="container mt-5">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" required />
          </div>
        )}
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>
      <p className="mt-3">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
