import "./Auth.css";
import { useState, useContext, useEffect } from "react";
import api from "../../Api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/user/register", form);

      const res = await api.post("/user/login", {
        email: form.email,
        password: form.password,
      });

      login(res.data.token);
      navigate("/home");
    } catch (err) {
  const msg = err.response?.data?.msg;

  // If backend sent password length message
  if (msg && msg.toLowerCase().includes("at least 8 characters")) {
    setError("Password must be at least 8 characters long");
  } 
  // Any other error 
  else {
    setError("Signup failed. Please check your information and try again.");
  }
}
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Join the network</h2>

      <p className="auth-top-text">
        Already have an account? <Link to="/auth/login">Sign in</Link>
      </p>

      

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <div className="auth-row">
          <input
            name="firstname"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="auth-btn">Agree and Join</button>
      </form>

      <p className="auth-footer-text">
        I agree to the <span>privacy policy</span> and <span>terms of service</span>.
      </p>
    </div>
  );
}
