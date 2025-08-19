import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { FiMoreVertical } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";

const Header = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-left">
          <Link to="/" className="logo">
            {" "}
            <h2 className="brown">Invo Manage</h2>
          </Link>
        </div>

        <div
          className="mobile-menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMoreVertical size={24} color="black" />
        </div>

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          {user && (
            <>
              <h4>Welcome, {user.username}</h4>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Products
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Profile
              </NavLink>
              <div className="user-section">
                {user ? (
                  <>
                    {menuOpen ? (
                      <NavLink onClick={handleLogout} >
                        Logout
                      </NavLink>
                    ) : (
                        <button onClick={handleLogout} className="btn-icon">
                          <IoLogOut />
                        </button>
                    )}
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
