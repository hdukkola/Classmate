import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, User, Bell, Palette, Info, LogOut, Sparkles, Clock, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type Theme = "light" | "dark-purple" | "ocean";

export function Settings() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") !== "false";
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "dark-purple";
  });
  
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const [aiGradeAccess, setAiGradeAccess] = useState(() => {
    return localStorage.getItem("aiGradeAccess") === "true";
  });
  
  const [use24HourTime, setUse24HourTime] = useState(() => {
    return localStorage.getItem("use24HourTime") === "true";
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Update localStorage when notifications change
  useEffect(() => {
    localStorage.setItem("notifications", notifications.toString());
  }, [notifications]);

  // Update localStorage when aiGradeAccess changes
  useEffect(() => {
    localStorage.setItem("aiGradeAccess", aiGradeAccess.toString());
  }, [aiGradeAccess]);

  // Update localStorage when time format changes
  useEffect(() => {
    localStorage.setItem("use24HourTime", use24HourTime.toString());
  }, [use24HourTime]);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const profileData = {
    name: "Alex Johnson",
    gradeLevel: "12th Grade",
  };

  const themes = [
    {
      id: "light" as Theme,
      name: "Light",
      description: "Classic light mode",
      colors: ["#6b3894", "#945cc1", "#f7f5fa"],
    },
    {
      id: "dark-purple" as Theme,
      name: "Dark Purple",
      description: "Premium purple theme",
      colors: ["#6b3894", "#945cc1", "#0d0c0e"],
    },
    {
      id: "ocean" as Theme,
      name: "Ocean",
      description: "Deep blue theme",
      colors: ["#2563eb", "#0ea5e9", "#0a1628"],
    },
  ];

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[34px] font-bold tracking-tight mb-2" style={{ color: "var(--color-text-primary)" }}>Settings</h1>
        <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Manage your preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <p className="text-sm font-bold mb-3 px-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Profile
        </p>
        <div className="rounded-[24px] overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
        >
          <button className="w-full flex items-center justify-between p-5 active:opacity-70 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>{profileData.name}</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{profileData.gradeLevel}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
          </button>
        </div>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <p className="text-sm font-bold mb-3 px-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Appearance
        </p>
        <div className="rounded-[24px] overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
        >
          {/* Theme Selector */}
          <button 
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-full flex items-center justify-between p-5 active:opacity-70 transition-opacity"
            style={{ borderBottom: showThemePicker ? "1px solid var(--color-border)" : "none" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-primary-soft)" }}>
                <Palette className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              </div>
              <div className="text-left">
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Theme</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {themes.find(t => t.id === theme)?.name}
                </p>
              </div>
            </div>
            <ChevronRight 
              className="w-5 h-5 transition-transform" 
              style={{ 
                color: "var(--color-text-muted)",
                transform: showThemePicker ? "rotate(90deg)" : "rotate(0deg)"
              }} 
            />
          </button>

          {/* Theme Options */}
          {showThemePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {themes.map((themeOption, index) => (
                <motion.button
                  key={themeOption.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setShowThemePicker(false);
                  }}
                  className="w-full flex items-center justify-between p-5 pl-16 active:opacity-70 transition-all hover:bg-opacity-50"
                  style={{ 
                    borderBottom: index < themes.length - 1 ? "1px solid var(--color-border)" : "none",
                    backgroundColor: theme === themeOption.id ? "var(--color-primary-soft)" : "transparent"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {themeOption.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2"
                          style={{ 
                            backgroundColor: color,
                            borderColor: "var(--color-bg-elevated)"
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {themeOption.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {themeOption.description}
                      </p>
                    </div>
                  </div>
                  {theme === themeOption.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <p className="text-sm font-bold mb-3 px-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Preferences
        </p>
        <div className="rounded-[24px] overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
        >
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Notifications</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Grade updates & reminders</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-7">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 rounded-full peer transition-colors cursor-pointer" style={{ backgroundColor: notifications ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>

          {/* 24-Hour Time Toggle */}
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>24-Hour Time</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{use24HourTime ? "16:00" : "4:00 PM"}</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-7">
              <input
                type="checkbox"
                checked={use24HourTime}
                onChange={(e) => setUse24HourTime(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 rounded-full peer transition-colors cursor-pointer" style={{ backgroundColor: use24HourTime ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    use24HourTime ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>

          {/* AI Grade Access Toggle */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>AI Grade Access</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Allow Flora AI to access grades</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-7">
              <input
                type="checkbox"
                checked={aiGradeAccess}
                onChange={(e) => setAiGradeAccess(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 rounded-full peer transition-colors cursor-pointer" style={{ backgroundColor: aiGradeAccess ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    aiGradeAccess ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <p className="text-sm font-bold mb-3 px-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          About
        </p>
        <div className="rounded-[24px] overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
        >
          <button className="w-full flex items-center justify-between p-5 active:opacity-70 transition-opacity" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Version</p>
            </div>
            <p className="font-medium" style={{ color: "var(--color-text-muted)" }}>1.0.0</p>
          </button>

          <button className="w-full flex items-center justify-between p-5 active:opacity-70 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Privacy Policy</p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
          </button>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full rounded-[24px] p-5 active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
        onClick={() => setShowLogoutConfirm(true)}
      >
        <LogOut className="w-5 h-5 text-[#EF4444]" />
        <span className="font-bold text-[#EF4444]">Logout</span>
      </motion.button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="rounded-[28px] p-8 shadow-2xl w-full"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              maxWidth: "420px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
                }}
              >
                <LogOut className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-bold mb-3 text-center"
              style={{ color: "var(--color-text-primary)" }}
            >
              Logout?
            </h2>

            {/* Description */}
            <p
              className="text-center mb-8"
              style={{ color: "var(--color-text-secondary)", fontSize: "15px" }}
            >
              Are you sure you want to sign out of ClassMate?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 rounded-2xl font-bold"
                style={{
                  backgroundColor: "var(--color-bg-secondary)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex-1 py-4 rounded-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                }}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}