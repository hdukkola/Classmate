import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { Login } from "./screens/Auth/Login";
import { Signup } from "./screens/Auth/Signup";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Initialize theme and check auth on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark-purple";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check localStorage first
      const token = localStorage.getItem("classmate_access_token");
      const storedUser = localStorage.getItem("classmate_user");

      if (token && storedUser) {
        // For now, trust localStorage. We'll verify with Supabase on first API call
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Session check error:", error);
      // Clear invalid data
      localStorage.removeItem("classmate_access_token");
      localStorage.removeItem("classmate_user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (accessToken: string, userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
  };

  const handleLogout = async () => {
    try {
      // Dynamically import supabase only when needed
      const { supabase } = await import("../lib/supabase");
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("classmate_access_token");
    localStorage.removeItem("classmate_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--gradient-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid rgba(107, 56, 148, 0.2)",
              borderTopColor: "#6b3894",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, logout: handleLogout }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}