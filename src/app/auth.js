// src/app/auth.js
const PUBLIC_ROUTES = [
  "login",
  "forgot-password",
  "register",
  "documentation",
  "verify-code",
];

const checkAuth = () => {
  const TOKEN = localStorage.getItem("token");
  const isPublicPage = PUBLIC_ROUTES.some((r) =>
    window.location.pathname.includes(r)
  );
  if (!TOKEN && !isPublicPage) {
    window.location.href = "/login";
    return null;
  }
  return TOKEN;
};

export default checkAuth;
