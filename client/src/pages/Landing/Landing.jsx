import { Outlet } from "react-router-dom";
import About from "../../components/About/About";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <Outlet />
        </div>

        <div className="auth-right">
          <About />
        </div>
      </div>
    </div>
  );
}
