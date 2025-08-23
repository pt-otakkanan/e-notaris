// src/app/RequireAuth.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service"; // pastikan pathnya sesuai

export default function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  // checking | authed | failed

  useEffect(() => {
    async function verify() {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("failed");
        return;
      }

      try {
        // cek token ke backend
        await AuthService.checkToken(); // ini akan hit /auth/check-token
        setStatus("authed");
      } catch (err) {
        // kalau token tidak valid / expired
        localStorage.removeItem("token");
        localStorage.removeItem("role_id");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        setStatus("failed");
      }
    }

    verify();
  }, []);

  if (status === "checking") {
    return <div className="p-8">Memeriksa sesi...</div>;
  }

  if (status === "failed") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
