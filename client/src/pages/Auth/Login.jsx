import "./Auth.css";
import { useState, useContext, useEffect } from "react";
import api from "../../Api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const [emailError, setEmailError] = useState("");
const [passwordError, setPasswordError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
     setEmailError("");
  setPasswordError("");

    try {
      const res = await api.post("/user/login", form);
      login(res.data.token);
      navigate("/home");
    } catch (err) {
  const msg = err.response?.data?.msg;

  if (msg === "USER_NOT_FOUND") {
    setEmailError("User not found");
  }

  if (msg === "PASSWORD_INCORRECT") {
    setPasswordError("Password is incorrect");
  }
}
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login to your account</h2>

      <p className="auth-top-text">
        Don't have an account? <Link to="/auth/signup">Create one</Link>
      </p>

      {emailError && <p className="auth-error">{emailError}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        {passwordError && <p className="auth-error">{passwordError}</p>}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="auth-btn">Login</button>
      </form>
    </div>
  );
}
