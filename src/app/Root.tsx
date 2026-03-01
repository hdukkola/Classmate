import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, GraduationCap, TrendingUp, BarChart3, CalendarDays, Sparkles, Settings } from "lucide-react";
import { motion } from "motion/react";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/grades", icon: GraduationCap, label: "Grades" },
    { path: "/gpa", icon: TrendingUp, label: "GPA" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/calendar", icon: CalendarDays, label: "Calendar" },
    { path: "/ai", icon: Sparkles, label: "AI" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="relative min-h-screen mx-auto" style={{ backgroundColor: "var(--color-bg-primary)", maxWidth: "600px", width: "100%" }}>
      <Outlet />

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto" style={{ maxWidth: "600px", width: "100%" }}>
        <div
          className="mx-4 mb-3 rounded-[20px] backdrop-blur-xl px-2 py-2"
          style={{ 
            backgroundColor: "var(--glass-bg)", 
            border: "1px solid var(--glass-border)", 
            boxShadow: "var(--shadow-xl)" 
          }}
        >
          <div className="flex items-center justify-between gap-0.5">
            {tabs.map((tab) => {
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 transition-all active:scale-95"
                >
                  {active && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "var(--gradient-primary-soft)",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative">
                    <tab.icon
                      className="w-5 h-5 transition-colors"
                      style={{
                        color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                        strokeWidth: active ? 2.5 : 2,
                      }}
                    />
                  </div>
                  <span
                    className="relative text-[10px] font-semibold transition-colors"
                    style={{ color: active ? "var(--color-primary)" : "var(--color-text-muted)" }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}