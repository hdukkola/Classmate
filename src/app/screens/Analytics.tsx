import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Award, BookOpen, Flame, Zap, Clock, BarChart3 } from "lucide-react";
import { getGradeBadge, getBadgeTextColor, getGradeGlow, getGradeColor } from "../utils/gradeBadges";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { fetchGrades } from "../services/hacApi";

export function Analytics() {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const grades = await fetchGrades();
      if (grades && grades.classes) {
        setClasses(grades.classes);
      }
    } catch (error) {
      console.error("Error loading grades:", error);
    }
  };

  const calculateGPA = (classList: any[]) => {
    if (classList.length === 0) return 0;
    const total = classList.reduce((sum, cls) => sum + cls.grade, 0);
    return total / classList.length;
  };

  const weeklyPerformanceData = [
    { week: "W1", score: 92 },
    { week: "W2", score: 89 },
    { week: "W3", score: 94 },
    { week: "W4", score: calculateGPA(classes) },
  ];

  const studyStreak = 12;
  
  const achievements = [
    { id: 1, title: "4.0 GPA", description: "Maintain straight A's", icon: "🎯", earned: true, current: 3.8, target: 4.0, color: "#8B5CF6" },
    { id: 2, title: "Top 10%", description: "Rank in top 10% of class", icon: "📈", earned: false, current: 12, target: 10, color: "#3B82F6" },
    { id: 3, title: "All A's", description: "Get A in every class", icon: "💯", earned: false, current: 4, target: 6, color: "#10B981" },
  ];

  const [simulatedScore, setSimulatedScore] = useState(85);
  const [selectedClass, setSelectedClass] = useState(classes.length > 0 ? classes[0]?.id : "");
  const [selectedCategory, setSelectedCategory] = useState<"performance" | "summative">("summative");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentGPA = calculateGPA(classes);
  
  // Find the selected class
  const currentClass = classes.find(c => c.id === selectedClass) || classes[0] || { id: "", grade: 85 };
  
  // Calculate impact based on category weight
  const categoryWeight = selectedCategory === "summative" ? 0.015 : 0.005;
  const projectedGPA = currentClass ? (currentGPA + (simulatedScore - (currentClass.grade || 85)) * categoryWeight).toFixed(2) : "0.00";

  // Academic Risk Meter
  const riskLevel = currentGPA >= 3.5 ? "low" : currentGPA >= 3.0 ? "medium" : "high";
  const riskColor = riskLevel === "low" ? "#22C55E" : riskLevel === "medium" ? "#F59E0B" : "#EF4444";
  const riskAngle = riskLevel === "low" ? 30 : riskLevel === "medium" ? 90 : 150;
  const riskPercentage = riskLevel === "low" ? 15 : riskLevel === "medium" ? 50 : 85;

  // Subject strength radar data
  const subjectStrength = [
    { subject: "Math", score: 97 },
    { subject: "English", score: 89 },
    { subject: "Physics", score: 76 },
    { subject: "History", score: 65 },
    { subject: "CS", score: 94 },
    { subject: "Spanish", score: 91 },
  ];

  // Calculate stats
  const avgGrade = classes.length > 0 ? classes.reduce((sum, cls) => sum + cls.grade, 0) / classes.length : 0;
  const classesAtRisk = classes.filter(cls => cls.grade < 75).length;
  const improvementPotential = classes.filter(cls => cls.grade < 90).length;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-4"
      >
        <h1 
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: "34px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}
        >
          Analytics
        </h1>
        <p style={{ 
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
          color: "var(--color-text-secondary)" 
        }}>
          Data-driven insights for success
        </p>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "var(--color-primary-soft)" }}
          >
            <BarChart3 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {avgGrade.toFixed(0)}%
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            Avg Grade
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "#EF444420" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#EF4444" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {classesAtRisk}
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            At Risk
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "#22C55E20" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "#22C55E" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {improvementPotential}
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            Can Improve
          </p>
        </motion.div>
      </div>

      {/* Academic Risk Meter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="mx-5 mb-5 rounded-[24px] p-8"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)", overflow: "visible" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center" 
            style={{ 
              background: riskLevel === "low" 
                ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
                : riskLevel === "medium"
                ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            }}
          >
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "2px"
            }}>
              Academic Risk Meter
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: "var(--color-text-secondary)"
            }}>
              Based on current performance
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Gauge - increased size and added padding for glow */}
          <div className="relative mb-8" style={{ width: "100%", maxWidth: "320px", padding: "20px 0" }}>
            <svg viewBox="0 0 240 140" className="w-full h-full" style={{ overflow: "visible" }}>
              <defs>
                {/* Glow filter for the active arc */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background arc */}
              <path
                d="M 40 100 A 80 80 0 0 1 200 100"
                fill="none"
                stroke="var(--color-bg-secondary)"
                strokeWidth="28"
                strokeLinecap="round"
              />
              
              {/* Active arc with glow */}
              <motion.path
                d="M 40 100 A 80 80 0 0 1 200 100"
                fill="none"
                stroke={riskColor}
                strokeWidth="28"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (riskAngle / 180) * 251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (riskAngle / 180) * 251.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                filter="url(#glow)"
                style={{
                  filter: `drop-shadow(0 0 16px ${riskColor}90) drop-shadow(0 0 8px ${riskColor}60)`
                }}
              />
            </svg>
          </div>

          {/* Risk Level Display - larger */}
          <div 
            className="px-10 py-5 rounded-[24px] mb-5"
            style={{ 
              backgroundColor: `${riskColor}15`,
              border: `2px solid ${riskColor}50`
            }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "40px",
              fontWeight: 900,
              color: riskColor,
              textAlign: "center",
              lineHeight: 1
            }}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
            </p>
          </div>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "var(--color-text-secondary)",
            textAlign: "center"
          }}>
            You're in the <span style={{ fontWeight: 700 }}>{riskLevel === "low" ? "top 85%" : riskLevel === "medium" ? "middle 50%" : "bottom 15%"}</span> of students
          </p>
        </div>
      </motion.div>

      {/* Grade Projection Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)" }}
          >
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "2px"
            }}>
              GPA Projection Simulator
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "var(--color-text-secondary)"
            }}>
              See how your next test affects GPA
            </p>
          </div>
        </div>

        {/* Class Selector */}
        <div className="mb-4">
          <label style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            marginBottom: "8px",
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Select Class
          </label>
          <div className="relative">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full rounded-[16px] px-5 py-4 transition-all active:scale-98"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                boxShadow: isDropdownOpen 
                  ? "0 8px 24px -4px rgba(107, 56, 148, 0.5)" 
                  : "0 4px 16px -4px rgba(107, 56, 148, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: currentClass.color }}
                />
                <span>{currentClass.name} • {currentClass.grade}%</span>
              </div>
              <motion.svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path 
                  d="M4 6L8 10L12 6" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                  style={{ backgroundColor: "transparent" }}
                />
                
                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-[20px] overflow-hidden z-20"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.3)",
                    border: "1px solid var(--color-bg-secondary)",
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  {classes.map((cls, index) => (
                    <motion.button
                      key={cls.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        setSelectedClass(cls.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-5 py-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: selectedClass === cls.id 
                          ? "var(--color-bg-secondary)" 
                          : "transparent",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: index < classes.length - 1 
                          ? "1px solid var(--color-bg-secondary)" 
                          : "none",
                      }}
                    >
                      {/* Class Info */}
                      <div className="flex-1 text-left">
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: "2px",
                        }}>
                          {cls.name}
                        </p>
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                        }}>
                          {cls.teacher}
                        </p>
                      </div>

                      {/* Grade Badge */}
                      <div 
                        className="px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: cls.grade >= 94 
                            ? "#6b389420" 
                            : cls.grade >= 85 
                            ? "#3B82F620" 
                            : cls.grade >= 70 
                            ? "#10B98120" 
                            : "#EF444420",
                        }}
                      >
                        <span style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: getGradeColor(cls.grade),
                        }}>
                          {cls.grade}%
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <label style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            marginBottom: "8px",
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Assessment Type
          </label>
          <div 
            className="flex gap-2 p-1.5 rounded-[16px]"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <button
              onClick={() => setSelectedCategory("performance")}
              className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: selectedCategory === "performance" ? "var(--color-primary)" : "transparent",
                color: selectedCategory === "performance" ? "#FFFFFF" : "var(--color-text-secondary)",
              }}
            >
              Performance
            </button>
            <button
              onClick={() => setSelectedCategory("summative")}
              className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: selectedCategory === "summative" ? "var(--color-primary)" : "transparent",
                color: selectedCategory === "summative" ? "#FFFFFF" : "var(--color-text-secondary)",
              }}
            >
              Summative
            </button>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-muted)",
            marginTop: "6px"
          }}>
            {selectedCategory === "summative" 
              ? "Tests & exams have higher impact on GPA" 
              : "Homework & quizzes have lower impact on GPA"}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-4">
            <label style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-text-primary)"
            }}>
              Next Assessment Score
            </label>
            <motion.span 
              key={simulatedScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "40px",
                fontWeight: 900,
                color: "var(--color-primary)",
                lineHeight: 1
              }}
            >
              {simulatedScore}%
            </motion.span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={simulatedScore}
            onChange={(e) => setSimulatedScore(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${simulatedScore}%, var(--color-bg-secondary) ${simulatedScore}%, var(--color-bg-secondary) 100%)`,
            }}
          />
          
          {/* Score markers */}
          <div className="flex justify-between mt-2">
            {[0, 25, 50, 75, 100].map((mark) => (
              <span 
                key={mark}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  fontWeight: 600
                }}
              >
                {mark}
              </span>
            ))}
          </div>
        </div>

        <div 
          className="rounded-[20px] p-6"
          style={{ 
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            boxShadow: "0 8px 24px -4px rgba(107, 56, 148, 0.3)"
          }}
        >
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Projected New GPA
          </p>
          <motion.p
            key={projectedGPA}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "56px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              marginBottom: "8px"
            }}
          >
            {projectedGPA}
          </motion.p>
          <div className="flex items-center gap-2">
            {Number(projectedGPA) > currentGPA ? (
              <TrendingUp className="w-5 h-5 text-white" />
            ) : Number(projectedGPA) < currentGPA ? (
              <TrendingDown className="w-5 h-5 text-white" />
            ) : null}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)"
            }}>
              {Number(projectedGPA) > currentGPA ? "+" : ""}{Math.abs(Number(projectedGPA) - currentGPA).toFixed(2)} from current {currentGPA.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Performance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "2px"
            }}>
              Performance Trend
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "var(--color-text-secondary)"
            }}>
              Last 6 weeks
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyPerformanceData}>
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[70, 100]}
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-elevated)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "var(--color-text-primary)" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={3}
              fill="url(#performanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div 
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--color-bg-secondary)" }}
        >
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "var(--color-text-secondary)"
          }}>
            Overall Trend
          </span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#22C55E"
            }}>
              +3.4% this month
            </span>
          </div>
        </div>
      </motion.div>

      {/* Daily Check In */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ 
          background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
          boxShadow: "0 8px 24px -4px rgba(245, 158, 11, 0.4)"
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "2px"
            }}>
              Daily Check In
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)"
            }}>
              Keep the momentum going!
            </p>
          </div>
        </div>

        <div className="flex items-end gap-8 mb-6">
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Current Streak
            </p>
            <div className="flex items-baseline gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1
                }}
              >
                {studyStreak}
              </motion.span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.8)"
              }}>
                days
              </span>
            </div>
          </div>

          <div className="pb-2">
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "4px"
            }}>
              Longest
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1
            }}>
              {studyStreak}
            </p>
          </div>
        </div>

        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(studyStreak / studyStreak) * 100}%` }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.8)",
          marginTop: "8px"
        }}>
          {studyStreak - studyStreak} days to beat your record!
        </p>
      </motion.div>

      {/* Subject Performance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EC4899 0%, #D946EF 100%)" }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "2px"
            }}>
              Subject Performance
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "var(--color-text-secondary)"
            }}>
              Top and bottom performers
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {classes
            .sort((a, b) => b.grade - a.grade)
            .slice(0, 3)
            .map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-[16px]"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div className="flex-shrink-0 relative" style={{ width: "50px", height: "50px" }}>
                  <img 
                    src={getGradeBadge(cls.grade)}
                    alt="Grade"
                    className="w-full h-full"
                    style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(cls.grade)})` }}
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: getBadgeTextColor(cls.grade),
                    }}
                  >
                    {cls.grade}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {cls.name}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "var(--color-text-secondary)"
                  }}>
                    {cls.teacher}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Achievement Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-5 mb-6 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" }}
          >
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "2px"
            }}>
              Achievement Milestones
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "var(--color-text-secondary)"
            }}>
              Your academic goals
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {achievements.map((milestone, index) => {
            const progress = (milestone.current / milestone.target) * 100;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)"
                  }}>
                    {milestone.title}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: milestone.color
                  }}>
                    {milestone.current.toFixed(1)} / {milestone.target}
                  </p>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-bg-secondary)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ delay: 0.55 + index * 0.1, duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: milestone.color,
                      boxShadow: `0 0 10px ${milestone.color}40`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}