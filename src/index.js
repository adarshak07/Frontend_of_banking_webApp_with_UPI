
// Suppress dev overlay for handled/expected Axios 401/403 rejections.
// We still log a warning so developers can see it in the console.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event && event.reason;
  const status = reason && reason.response && reason.response.status;
  if (status === 401 || status === 403) {
    event.preventDefault();
    console.warn('[Soft-handled] API returned', status, 'before auth was ready.');
  }
});

import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
