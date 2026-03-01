import { motion } from "motion/react";
import { calculateGPA, getClassesByQuarter, periodDataHistory } from "../data/mockData";
import { getGradeBadge, getBadgeTextColor, getGradeGlow } from "../utils/gradeBadges";
import { TrendingUp, TrendingDown, Award, Target, BookOpen } from "lucide-react";
import { useState } from "react";

export function GPA() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [gpaType, setGpaType] = useState<"unweighted" | "weighted">("unweighted");
  
  // Get classes for the selected period
  const displayClasses = getClassesByQuarter(selectedPeriod);
  
  // Calculate GPA for the selected period
  const unweightedGPA = calculateGPA(displayClasses);
  const weightedGPA = parseFloat((unweightedGPA * 1.08).toFixed(2));
  const displayedGPA = gpaType === "weighted" ? weightedGPA : unweightedGPA;
  const totalCredits = displayClasses.reduce((sum, cls) => sum + cls.credits, 0);
  const progress = (displayedGPA / (gpaType === "weighted" ? 5.0 : 4.0)) * 100;

  // Calculate letter grade from GPA
  const getLetterGrade = (gpaValue: number) => {
    if (gpaValue >= 3.85) return "A+";
    if (gpaValue >= 3.5) return "A";
    if (gpaValue >= 3.0) return "A-";
    if (gpaValue >= 2.85) return "B+";
    if (gpaValue >= 2.5) return "B";
    if (gpaValue >= 2.0) return "B-";
    return "C+";
  };

  // Convert numeric grade to GPA points
  const gradeToGPA = (grade: number) => {
    if (grade >= 93) return 4.0;
    if (grade >= 90) return 3.7;
    if (grade >= 87) return 3.3;
    if (grade >= 83) return 3.0;
    if (grade >= 80) return 2.7;
    if (grade >= 77) return 2.3;
    if (grade >= 73) return 2.0;
    if (grade >= 70) return 1.7;
    return 1.0;
  };

  // Sort classes by grade (highest to lowest)
  const sortedClasses = [...displayClasses].sort((a, b) => b.grade - a.grade);

  // Calculate grade distribution
  const gradeDistribution = {
    "A (90-100)": displayClasses.filter(c => c.grade >= 90).length,
    "B (80-89)": displayClasses.filter(c => c.grade >= 80 && c.grade < 90).length,
    "C (70-79)": displayClasses.filter(c => c.grade >= 70 && c.grade < 80).length,
    "D/F (0-69)": displayClasses.filter(c => c.grade < 70).length,
  };

  const currentData = periodDataHistory[selectedPeriod as keyof typeof periodDataHistory];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--color-bg-primary)", overflow: "visible" }}>
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
          GPA Calculator
        </h1>
        <p style={{ 
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
          color: "var(--color-text-secondary)" 
        }}>
          Track your academic performance
        </p>
      </motion.div>

      {/* Semester Selector */}
      <div className="px-5 mb-5">
        <div 
          className="flex gap-2 p-1.5 rounded-[16px]"
          style={{ backgroundColor: "var(--color-bg-elevated)" }}
        >
          {[
            { id: "current", label: "Current" },
            { id: "q1", label: "Q1" },
            { id: "q2", label: "Q2" },
            { id: "q3", label: "Q3" },
            { id: "q4", label: "Q4" }
          ].map((sem) => (
            <button
              key={sem.id}
              onClick={() => setSelectedPeriod(sem.id)}
              className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: selectedPeriod === sem.id ? "var(--color-primary)" : "transparent",
                color: selectedPeriod === sem.id ? "#FFFFFF" : "var(--color-text-secondary)",
              }}
            >
              {sem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weighted/Unweighted Toggle */}
      <div className="px-5 mb-5">
        <div 
          className="flex gap-2 p-1.5 rounded-[16px]"
          style={{ backgroundColor: "var(--color-bg-elevated)" }}
        >
          <button
            onClick={() => setGpaType("unweighted")}
            className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: gpaType === "unweighted" ? "var(--color-primary)" : "transparent",
              color: gpaType === "unweighted" ? "#FFFFFF" : "var(--color-text-secondary)",
            }}
          >
            Unweighted
          </button>
          <button
            onClick={() => setGpaType("weighted")}
            className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: gpaType === "weighted" ? "var(--color-primary)" : "transparent",
              color: gpaType === "weighted" ? "#FFFFFF" : "var(--color-text-secondary)",
            }}
          >
            Weighted
          </button>
        </div>
      </div>

      {/* Hero GPA Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-5 mb-5 relative rounded-[28px] p-8"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
          boxShadow: "0 20px 50px -12px rgba(107, 56, 148, 0.4)",
          overflow: "visible"
        }}
      >
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Current GPA Label */}
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-white/90" />
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}>
              {gpaType === "weighted" ? "Weighted" : "Unweighted"} GPA
            </p>
          </div>

          {/* Circular Progress Ring with proper overflow handling */}
          <div className="relative mb-6" style={{ width: "208px", height: "208px", padding: "8px" }}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 208 208" style={{ overflow: "visible" }}>
              <defs>
                {/* Glow filter for the progress ring */}
                <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background circle */}
              <circle
                cx="104"
                cy="104"
                r="92"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="14"
                fill="none"
              />
              
              {/* Progress circle with glow */}
              <motion.circle
                cx="104"
                cy="104"
                r="92"
                stroke="white"
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${(progress / 100) * 578} 578`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 578" }}
                animate={{ strokeDasharray: `${(progress / 100) * 578} 578` }}
                transition={{ duration: 2, ease: "easeOut" }}
                filter="url(#ringGlow)"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))"
                }}
              />
            </svg>
            
            {/* GPA Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={`${gpaType}-${selectedPeriod}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1,
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                }}
              >
                {displayedGPA.toFixed(2)}
              </motion.div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.8)",
                marginTop: "8px"
              }}>
                out of {gpaType === "weighted" ? "5.0" : "4.0"}
              </p>
            </div>
          </div>

          {/* Letter Grade Badge */}
          <div 
            className="px-6 py-2.5 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)"
            }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#FFFFFF"
            }}>
              {getLetterGrade(displayedGPA)} Student
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "var(--color-primary-soft)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {currentData.weighted}
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            Weighted
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "var(--color-accent-soft)" }}
          >
            <BookOpen className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {currentData.credits}
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            Credits
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[20px] p-4"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "#22C55E20" }}
          >
            <Target className="w-5 h-5" style={{ color: "#22C55E" }} />
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}>
            {Math.round(progress)}%
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--color-text-secondary)"
          }}>
            To 4.0
          </p>
        </motion.div>
      </div>

      {/* Grade Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "20px"
        }}>
          Grade Distribution
        </h2>

        <div className="space-y-4">
          {Object.entries(gradeDistribution).map(([grade, count], index) => {
            const total = displayClasses.length;
            const percentage = (count / total) * 100;
            const colors = {
              "A (90-100)": "#6b3894",
              "B (80-89)": "#3B82F6",
              "C (70-79)": "#F59E0B",
              "D/F (0-69)": "#EF4444"
            };
            
            return (
              <div key={grade}>
                <div className="flex items-center justify-between mb-2">
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)"
                  }}>
                    {grade}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--color-text-secondary)"
                  }}>
                    {count} classes
                  </p>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-bg-secondary)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: colors[grade as keyof typeof colors],
                      boxShadow: `0 0 10px ${colors[grade as keyof typeof colors]}40`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Class Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-5 mb-5 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "20px"
        }}>
          Class Breakdown
        </h2>

        <div className="space-y-3">
          {sortedClasses.map((cls, index) => {
            const classGPA = gradeToGPA(cls.grade);
            
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-[16px]"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                {/* Grade Badge */}
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

                {/* Class Info */}
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
                    {cls.credits} credit{cls.credits !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* GPA Points */}
                <div className="flex-shrink-0 text-right">
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "var(--color-text-primary)",
                    lineHeight: 1
                  }}>
                    {classGPA.toFixed(1)}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    color: "var(--color-text-secondary)",
                    marginTop: "2px"
                  }}>
                    GPA
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* GPA Impact Analyzer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-5 mb-6 rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "16px"
        }}>
          GPA Impact Analysis
        </h2>

        <div className="space-y-4">
          {/* Highest Impact */}
          <div 
            className="p-4 rounded-[16px]"
            style={{ 
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#22C55E",
                  marginBottom: "4px"
                }}>
                  Highest Positive Impact
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: "2px"
                }}>
                  {sortedClasses[0].name}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "var(--color-text-secondary)"
                }}>
                  {sortedClasses[0].grade}% • Contributing +{gradeToGPA(sortedClasses[0].grade).toFixed(2)} points
                </p>
              </div>
            </div>
          </div>

          {/* Lowest Impact */}
          <div 
            className="p-4 rounded-[16px]"
            style={{ 
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#EF4444",
                  marginBottom: "4px"
                }}>
                  Needs Improvement
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: "2px"
                }}>
                  {sortedClasses[sortedClasses.length - 1].name}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "var(--color-text-secondary)"
                }}>
                  {sortedClasses[sortedClasses.length - 1].grade}% • Potential to raise GPA by {((4.0 - gradeToGPA(sortedClasses[sortedClasses.length - 1].grade)) * 0.125).toFixed(2)} points
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}