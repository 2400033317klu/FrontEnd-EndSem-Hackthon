import React, { useState } from "react";
import { loadUsers, saveUsers } from "../utils/storage";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) {
      e.name = "Name is required.";
    }
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email format.";
    }
    if (!form.password.trim()) {
      e.password = "Password is required.";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    const users = loadUsers();
    if (mode === "register") {
      if (users.find((u) => u.email === form.email)) {
        setErrors({ email: "Email already registered." });
        return;
      }
      const newUser = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };
      users.push(newUser);
      saveUsers(users);
      setMessage("Registration successful. Please login.");
      setMode("login");
    } else {
      const match = users.find(
        (u) => u.email === form.email.trim() && u.password === form.password
      );
      if (!match) {
        setErrors({
          email: "Invalid credentials.",
          password: "Invalid credentials.",
        });
        return;
      }
      sessionStorage.setItem("ep_current_user", JSON.stringify(match));
      onLogin(match);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{mode === "login" ? "Login" : "Register"}</div>
          <div className="card-subtitle">Authentication using localStorage (front-end only).</div>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setErrors({});
            setMessage("");
          }}
        >
          {mode === "login" ? "New here? Register" : "Have account? Login"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Student / Admin name" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@college.edu" />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Min 6 characters" />
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin / Faculty</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {mode === "login" ? "Login" : "Register"}
        </button>
        {message && <div className="success-text">{message}</div>}
      </form>

      <p className="tiny" style={{ marginTop: 8 }}>
        <strong>Authentication:</strong> Users are stored in localStorage; active user is stored in sessionStorage.
      </p>
    </section>
  );
}
