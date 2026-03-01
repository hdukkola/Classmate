import { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import logo from "figma:asset/e8d95d2d8b336ca3bd69c9a1a1cf7b84851bce61.png";
import { loginToHAC } from "../../services/hacApi";

interface LoginProps {
  onLoginSuccess: (accessToken: string, user: any) => void;
  onSwitchToSignup: () => void;
}

export function Login({ onLoginSuccess, onSwitchToSignup }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  
  // Hardcoded to Coppell ISD - users don't need to enter district URL
  const districtUrl = "https://hac.coppellisd.com";

  const handleDebug = async () => {
    if (!username || !password) {
      setError("Please enter username and password first");
      return;
    }

    setError("");
    setLoading(true);
    setDebugInfo("Testing HAC API directly...");

    try {
      // Test the HAC API directly without going through our backend
      const testUrl = `https://homeaccesscenterapi.vercel.app/api/name?link=${encodeURIComponent(districtUrl)}&user=${encodeURIComponent(username)}&pass=${encodeURIComponent(password)}`;
      
      console.log("🧪 Testing HAC API directly:", testUrl.replace(/pass=[^&]+/, 'pass=***'));
      
      const response = await fetch(testUrl);
      const data = await response.text();
      
      console.log("🧪 Direct API Response Status:", response.status);
      console.log("🧪 Direct API Response:", data);
      
      setDebugInfo(`Status: ${response.status}\n\nResponse:\n${data}`);
      
    } catch (err: any) {
      console.error("🧪 Direct API Error:", err);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginToHAC({ districtUrl, username, password });
      
      if (result.success) {
        // Store session in localStorage
        localStorage.setItem("classmate_access_token", result.sessionToken || "");
        localStorage.setItem("classmate_user", JSON.stringify({
          id: result.studentId,
          name: result.studentName,
        }));
        
        // IMPORTANT: Don't set loading to false here - let the App component handle it
        // The login success will trigger a re-render and the user will see the app
        onLoginSuccess(result.sessionToken || "", {
          id: result.studentId,
          name: result.studentName,
        });
      } else {
        setError(result.error || "Failed to connect to HAC");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("HAC Login error:", err);
      setError(err.message || "An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(107, 56, 148, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107, 56, 148, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107, 56, 148, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(148, 92, 193, 0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          marginBottom: "40px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.img
          src={logo}
          alt="ClassMate Logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 20px",
            display: "block",
            filter: "drop-shadow(0 0 30px rgba(107, 56, 148, 0.8)) drop-shadow(0 0 60px rgba(148, 92, 193, 0.6)) drop-shadow(0 10px 40px rgba(107, 56, 148, 0.5))",
          }}
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "42px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "8px",
            letterSpacing: "0.015em",
            textShadow: "0 4px 20px rgba(107, 56, 148, 0.4)",
          }}
        >
          ClassMate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.5)",
            fontWeight: 500,
          }}
        >
          Your AI-Powered Study Companion
        </motion.p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(20, 20, 20, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header with Icon */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Sparkles size={24} style={{ color: "#ffffff" }} />
            <h2
              style={{
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Welcome Back
            </h2>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Username
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <User
                size={20}
                style={{
                  position: "absolute",
                  left: "16px",
                  color: "rgba(255, 255, 255, 0.6)",
                  zIndex: 1,
                }}
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your HAC username"
                required
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 48px",
                  borderRadius: "16px",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Password
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Lock
                size={20}
                style={{
                  position: "absolute",
                  left: "16px",
                  color: "rgba(255, 255, 255, 0.6)",
                  zIndex: 1,
                }}
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "16px 48px",
                  borderRadius: "16px",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: "rgba(255, 255, 255, 0.6)" }} />
                ) : (
                  <Eye size={20} style={{ color: "rgba(255, 255, 255, 0.6)" }} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              style={{
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1.5px solid rgba(239, 68, 68, 0.5)",
                marginBottom: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "#FECACA",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "16px",
              border: "none",
              background: loading
                ? "rgba(255, 255, 255, 0.2)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))",
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "24px",
              boxShadow: loading
                ? "none"
                : "0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  display: "inline-block",
                  marginRight: "8px",
                }}
              >
                ⚡
              </motion.div>
            )}
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          {/* Signup Link */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.8)",
                margin: 0,
              }}
            >
              Don't have an account?{" "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onSwitchToSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Sign Up
              </motion.button>
            </p>
          </div>
        </form>
      </motion.div>

      {/* Privacy Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: "24px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.6)",
          textAlign: "center",
          maxWidth: "400px",
          position: "relative",
          zIndex: 1,
        }}
      >
        🔒 Your data is encrypted and secure. We protect your privacy.
      </motion.p>
    </div>
  );
}