import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  Outlet
} from "react-router-dom";
import authService from "./services/authService";
import Header from "./components/Layout/Header";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProductDashboard from "./components/Products/ProductDashboard";
import "./assets/css/main.css";
import Profile from "./components/Profile/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await authService.getMe(token);
          setUser(userData.data);
        }
      } catch (err) {
        console.error("Authentication check failed", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const ProtectedRoute = () => {
    if (loading) return <div>Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  const AuthRoute = () => {
    if (loading) return <div>Loading...</div>;
    return !user ? <Outlet /> : <Navigate to="/" />;
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }


  return (
    <BrowserRouter>
      <div className="app-container">
        {user && <Header user={user} onLogout={handleLogout} />}
        <main className="main-content">
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/register"
                element={<Register onRegister={handleLogin} />}
              />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ProductDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
