import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))) {
      setError("Please enter a valid phone number");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (role === 'ADMIN' && !adminKey.trim()) {
      setError("Admin registration key is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = { name, phone, email, password, role, adminKey: role === 'ADMIN' ? adminKey : undefined };
      const { data } = await api.post("/auth/register", payload);
      if (data?.success && data?.data?.token) {
        await login(data.data.token);
        const go = role === 'ADMIN' ? '/admin' : '/';
        navigate(go);
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError(err?.response?.data?.errors || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "40px auto", padding: "2rem" }}>
      <h2 className="title" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create your account</h2>
      <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>Sign up to start your banking journey</p>
      
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Full Name</label>
          <input 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            placeholder="Enter your full name" 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              fontSize: "1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              boxSizing: "border-box"
            }} 
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Account Type</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <input 
                type="radio" 
                name="role" 
                value="USER" 
                checked={role==='USER'} 
                onChange={()=>setRole('USER')} 
                style={{ transform: 'scale(1.2)' }}
              /> 
              Regular User
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <input 
                type="radio" 
                name="role" 
                value="ADMIN" 
                checked={role==='ADMIN'} 
                onChange={()=>setRole('ADMIN')} 
                style={{ transform: 'scale(1.2)' }}
              /> 
              Administrator
            </label>
          </div>
        </div>
        
        {role === 'ADMIN' && (
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Admin Registration Key</label>
            <input 
              value={adminKey} 
              onChange={(e)=>setAdminKey(e.target.value)} 
              placeholder="Enter admin registration key" 
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                fontSize: "1rem", 
                border: "1px solid #d1d5db", 
                borderRadius: "0.5rem",
                boxSizing: "border-box"
              }} 
            />
          </div>
        )}
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Phone Number</label>
          <input 
            value={phone} 
            onChange={(e)=>setPhone(e.target.value)} 
            placeholder="Enter your phone number" 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              fontSize: "1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              boxSizing: "border-box"
            }} 
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="you@example.com" 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              fontSize: "1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              boxSizing: "border-box"
            }} 
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              placeholder="Create a strong password (min 5 characters)" 
              required 
              style={{ 
                width: "100%", 
                padding: "0.75rem 3rem 0.75rem 0.75rem", 
                fontSize: "1rem", 
                border: "1px solid #d1d5db", 
                borderRadius: "0.5rem",
                boxSizing: "border-box"
              }} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#6b7280"
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e)=>setConfirmPassword(e.target.value)} 
            placeholder="Confirm your password" 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              fontSize: "1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              boxSizing: "border-box"
            }} 
          />
        </div>
        
        {error && <div className="muted" style={{ color: "#fca5a5", fontSize: "0.9rem", padding: "0.5rem", backgroundColor: "#fef2f2", borderRadius: "0.5rem", border: "1px solid #fecaca" }}>{String(error)}</div>}
        
        <button 
          className="btn primary" 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: "100%", 
            padding: "0.75rem", 
            fontSize: "1.1rem", 
            fontWeight: "600",
            marginTop: "1rem",
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <div className="muted" style={{ fontSize: "1rem" }}>
          Already have an account? <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
