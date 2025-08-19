import React, { useState } from "react";
import authService from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";


const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      const token = res.token;
      if (token) {
        const userData = await authService.getMe(token);
        onLogin(userData.data);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className=" text-animation">Login into InvoManage</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <button className="btn-customized" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

         <div className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
      </form>
    </div>
  );
};

export default Login;