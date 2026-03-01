import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { Login } from "./screens/Auth/Login";
import { Signup } from "./screens/Auth/Signup";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("classmate_access_token");
    const storedUser = localStorage.getItem("classmate_user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (accessToken: string, userData: any) => {
    console.log("✅ App: Login successful!", { accessToken, userData });
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
  };

  const handleLogout = async () => {
    try {
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

  // Not authenticated - show login/signup
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

  // Authenticated - show the full app with routing
  return (
    <AuthContext.Provider value={{ user, logout: handleLogout }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}
