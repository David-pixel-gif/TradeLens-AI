import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

// ✅ Page Imports
import LandingPage from "./pages/LandingPage"; // 🌍 Redirect here after logout
import HomePage from "./pages/HomePage"; // 🏡 Shown after login
import Notifications from "./pages/Notifications"; // 📰 AI & Market Insights
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

// ✅ Component Imports
import Footer from "./components/Footer";
import CustomNavbar from "./components/Navbar";

// ✅ Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ======================================================
// 🧩 Layout Wrapper
// ======================================================
function LayoutWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Navbar and Footer on login/register/landing pages only
  const hideLayoutPaths = ["/login", "/register", "/landing"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  // ======================================================
  // 🔐 Enforce Secure Logout (Global Watcher)
  // ======================================================
  useEffect(() => {
    const handleLogoutSecurity = () => {
      if (localStorage.getItem("loggedOut") === "true") {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();

        // Disable back navigation after logout
        window.history.pushState(null, "", "/landing");
        window.onpopstate = () => {
          window.history.pushState(null, "", "/landing");
        };

        // Redirect to landing page instead of homepage
        navigate("/landing", { replace: true });
      }
    };

    handleLogoutSecurity();
  }, [navigate]);

  return (
    <>
      {!hideLayout && <CustomNavbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

// ======================================================
// 🚀 Main App Component
// ======================================================
function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* ✅ Landing Page */}
          <Route path="/landing" element={<LandingPage />} />

          {/* ✅ Home Page (after login) */}
          <Route path="/" element={<HomePage />} />

          {/* ✅ Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* ⚙️ Future Expansion */}
          {/* <Route path="/support" element={<SupportPage />} /> */}
          {/* <Route path="/vision" element={<VisionPage />} /> */}
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
