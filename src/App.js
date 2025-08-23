import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import initializeApp from "./app/init";
import RequireAuth from "./app/requireAuth";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const VerifyCode = lazy(() => import("./pages/VerifyCode"));
const Documentation = lazy(() => import("./pages/Documentation"));

initializeApp();

function App() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <Router>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/app/*" element={<Layout />} />
          </Route>

          {/* Fallback: arahkan sesuai token */}
          <Route
            path="*"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/app/welcome" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
