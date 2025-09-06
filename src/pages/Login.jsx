import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8082";

  useEffect(() => {
    checkSsoStatus();

    // Handle OAuth error codes from query params
    const oauthError = searchParams.get("error");
    if (oauthError) {
      const errorMessages = {
        sso_disabled: "SSO is currently disabled. Please use email and password to sign in.",
        oauth_error: "OAuth authentication failed. Please try again or use email and password.",
        oauth_failed: "OAuth authentication failed. Please try again or use email and password.",
        oauth_session_expired: "OAuth session expired. Please try signing in again.",
        oauth_access_denied: "Access denied. Please grant necessary permissions and try again.",
        oauth_invalid_grant: "Invalid OAuth request. Please try again."
      };
      setError(errorMessages[oauthError] || "Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const checkSsoStatus = async () => {
    try {
      const response = await api.get(`${API}/auth/sso-status`);
      setSsoEnabled(response.data.enabled);
    } catch (err) {
      console.log("SSO status check failed, assuming disabled");
      setSsoEnabled(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`${API}/auth/login`, { email, password });
      if (data?.success && data?.data?.token) {
        login(data.data.token);
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err?.response?.data?.errors || err.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    if (ssoEnabled) {
      window.location.href = `${API}/oauth2/authorization/google`;
    } else {
      setError("SSO is currently disabled. Please use email and password to sign in.");
    }
  };

  return (
    <div
      className="card"
      style={{ maxWidth: 600, margin: "40px auto", padding: "2rem" }}
    >
      <h2
        className="title"
        style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
      >
        Welcome back
      </h2>
      <p
        className="muted"
        style={{ fontSize: "1.1rem", marginBottom: "2rem" }}
      >
        Log in to continue to your banking dashboard
      </p>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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

        {error && (
          <div
            className="muted"
            style={{
              color: "#fca5a5",
              fontSize: "0.9rem",
              padding: "0.5rem",
              backgroundColor: "#fef2f2",
              borderRadius: "0.5rem",
              border: "1px solid #fecaca"
            }}
          >
            {String(error)}
          </div>
        )}

        <button
          className="btn primary"
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            marginTop: "1rem"
          }}
        >
          Sign In
        </button>
      </form>

      {ssoEnabled && (
        <>
          <div
            style={{
              margin: "2rem 0",
              textAlign: "center",
              position: "relative"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "#e5e7eb"
              }}
            ></div>
            <span
              style={{
                backgroundColor: "white",
                padding: "0 1rem",
                color: "#6b7280",
                fontSize: "0.9rem"
              }}
            >
              or
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <div className="muted" style={{ fontSize: "1rem" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
