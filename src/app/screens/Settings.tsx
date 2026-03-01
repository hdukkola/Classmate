import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, User, Bell, Moon, Info, LogOut, Sparkles } from "lucide-react";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiGradeAccess, setAiGradeAccess] = useState(() => {
    return localStorage.getItem("aiGradeAccess") === "true";
  });

  // Update localStorage when aiGradeAccess changes
  useEffect(() => {
    localStorage.setItem("aiGradeAccess", aiGradeAccess.toString());
  }, [aiGradeAccess]);

  const profileData = {
    name: "Alex Johnson",
    gradeLevel: "12th Grade",
  };

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
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", borderTop: "1px solid var(--color-text-muted)" }}
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
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
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

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-primary-soft)" }}>
                <Moon className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Dark Mode</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Auto-detected</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-7">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
                disabled
              />
              <div className="w-12 h-7 rounded-full opacity-50 cursor-not-allowed" style={{ backgroundColor: "var(--color-text-muted)" }}>
                <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full" />
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
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <button className="w-full flex items-center justify-between p-5 active:opacity-70 transition-opacity" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
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
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <LogOut className="w-5 h-5 text-[#EF4444]" />
        <span className="font-bold text-[#EF4444]">Logout</span>
      </motion.button>
    </div>
  );
}