import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/evangadi-header-logo.png";
import "./Header.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/auth/login");
  }

  return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="Evangadi" className="header-logo" />

        <nav className="header-nav">
          <Link to={user ? "/home" : "/"}>Home</Link>
          <Link to="/how-it-works">How it Works</Link>

          {user ? (
            <button className="header-btn" onClick={handleLogout}>
              LogOut
            </button>
          ) : (
            <Link to="/auth/login" className="header-btn">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
