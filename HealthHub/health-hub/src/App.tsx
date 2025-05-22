// src/App.tsx
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import Diaganose from "./components/Diagonose";
import AboutUs from "./components/AboutUs";
import Pneumonia from "./components/Pneumonia-diagnose";
import Fracture from "./components/Fracture";
import Eyecataract from "./components/Eyecataract";
import SkinPredictor from "./components/SkinPredictor";
import SimpleWebcam from "./components/SimpleWebcam";
import LoginSignup from "./components/LoginSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatBotPage from "./components/ChatBotPage";
import HealthReport from "./components/HealthReport";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const isLiveCamPage = location.pathname === "/live-cam";

  return (
    <>
      {!isLiveCamPage && (
        <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
          <div className="container">
            <Link className="navbar-brand" to="/">HealthHub</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Link className="nav-link active" to="/home">Home</Link></li>
                <li className="nav-item"><Link className="nav-link active" to="/diaganose">Diaganose</Link></li>
                <li className="nav-item"><Link className="nav-link active" to="/aboutUs">AboutUs</Link></li>
                <li className="nav-item mb-1">
                  <button className={`btn ${darkMode ? "btn-secondary" : "btn-warning"} rounded-circle`} onClick={toggleDarkMode}
                    style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "30px" }}>
                    {darkMode ? "🌙" : "🌞"}
                  </button>
                </li>
                {isAuthenticated ? (
                  <>
                    <li className="nav-item ms-1">
                      <button className="btn btn-success" onClick={handleLogout}>Logout</button>
                    </li>
                    <li className="nav-item ms-2">
                      <Link className="btn btn-secondary fw-bold " to="/report">
                        RPT
                      </Link>
                    </li>

                  </>
                ) : (
                  <li className="nav-item ms-1">
                    <Link className="btn btn-secondary" to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/diaganose" element={<ProtectedRoute><Diaganose /></ProtectedRoute>} />
        <Route path="/pneumonia-diagnose" element={<ProtectedRoute><Pneumonia /></ProtectedRoute>} />
        <Route path="/fracture-diagnose" element={<ProtectedRoute><Fracture /></ProtectedRoute>} />
        <Route path="/eye-cataract-diagnose" element={<ProtectedRoute><Eyecataract /></ProtectedRoute>} />
        <Route path="/skin-diagnose" element={<ProtectedRoute><SkinPredictor /></ProtectedRoute>} />
        <Route path="/live-cam" element={<ProtectedRoute><SimpleWebcam /></ProtectedRoute>} />
        <Route path="/symptoms" element={<ProtectedRoute><ChatBotPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><HealthReport /></ProtectedRoute>} />
      </Routes>
    </>
  );
};


const Root: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default Root;
