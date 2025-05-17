import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  
  email: string;
  customerId: string; 
};


interface AuthContextType {
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === "true";
  });

  const login = (userData: User) => {
    const expirationTime = Date.now() + 3600000; // 1 hour
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authExpiration", expirationTime.toString());
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authExpiration");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    localStorage.setItem("darkMode", newMode.toString());
    setDarkMode(newMode);
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const expirationTime = localStorage.getItem("authExpiration");
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && expirationTime && storedUser) {
      if (Date.now() > parseInt(expirationTime)) {
        logout();
      } else {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, darkMode, toggleDarkMode, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
