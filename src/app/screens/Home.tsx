import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, TrendingUp, Award, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { getGradeColor, getGradeBadge, getGPAColor, getGPABadge, getBadgeTextColor, getGPABadgeTextColor, getGPAGlow, getGradeGlow } from "../utils/gradeBadges";
import { fetchGrades, getStudentInfo } from "../services/hacApi";
import { HACStatusBanner } from "../components/HACStatusBanner";

export function Home() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [gpaTab, setGpaTab] = useState<"unweighted" | "weighted">("unweighted");
  const studentInfo = getStudentInfo();

  // Load HAC data on mount
  useEffect(() => {
    async function loadData() {
      const result = await fetchGrades();
      console.log("📚 Home: Fetched grades:", result);
      
      if (result?.classes) {
        // Process classes - no need to combine teacher since there's no teacher
        const processed = result.classes.map((cls: any) => ({
          ...cls,
          fullName: cls.name // Just use the name directly
        }));
        setClasses(processed);
      }
    }
    
    loadData();
  }, []);

  // Calculate GPA from classes with grades > 0
  const validClasses = classes.filter(c => c.grade > 0);
  const avgGrade = validClasses.length > 0
    ? validClasses.reduce((sum, c) => sum + c.grade, 0) / validClasses.length
    : 0;
  
  const unweightedGPA = avgGrade;
  const weightedGPA = avgGrade * 1.08;
  const currentGPA = gpaTab === "unweighted" ? unweightedGPA : weightedGPA;

  // Find top and lowest classes (only from classes with grades)
  const topClass = validClasses.length > 0
    ? validClasses.reduce((max, c) => c.grade > max.grade ? c : max, validClasses[0])
    : null;
  const lowestClass = validClasses.length > 0
    ? validClasses.reduce((min, c) => c.grade < min.grade ? c : min, validClasses[0])
    : null;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-5 flex items-center justify-between"
        style={{ 
          backgroundColor: "var(--color-bg-elevated)",
          minHeight: "70px"
        }}
      >
        <div className="flex-1">
          <h1 
            className="mb-1" 
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2
            }}
          >
            Home
          </h1>
          <p 
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--color-text-secondary)"
            }}
          >
            {studentInfo ? `Hi, ${studentInfo.name}!` : "Hi!"}
          </p>
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary-soft)" }}
        >
          <User className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
        </div>
      </motion.div>

      {/* HAC Status Banner */}
      <HACStatusBanner />

      <div className="px-4 pt-6 space-y-6">
        {/* GPA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/gpa")}
          className="rounded-[24px] p-8 active:scale-[0.98] transition-transform cursor-pointer"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGpaTab("unweighted");
              }}
              className="flex-1 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: gpaTab === "unweighted" ? "var(--color-primary)" : "var(--color-bg-elevated)",
                color: gpaTab === "unweighted" ? "var(--color-text-onAccent)" : "var(--color-text-secondary)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                border: gpaTab === "unweighted" ? "none" : "1px solid var(--color-text-muted)"
              }}
            >
              Unweighted
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGpaTab("weighted");
              }}
              className="flex-1 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: gpaTab === "weighted" ? "var(--color-primary)" : "var(--color-bg-elevated)",
                color: gpaTab === "weighted" ? "var(--color-text-onAccent)" : "var(--color-text-secondary)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                border: gpaTab === "weighted" ? "none" : "1px solid var(--color-text-muted)"
              }}
            >
              Weighted
            </button>
          </div>

          {/* GPA Circle */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              key={`${gpaTab}-${currentGPA}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center relative"
              style={{
                width: "200px",
                height: "200px"
              }}
            >
              {getGPABadge(currentGPA) ? (
                <>
                  <img 
                    src={getGPABadge(currentGPA)!} 
                    alt="GPA Badge"
                    className="absolute inset-0 w-full h-full"
                    style={{ filter: `drop-shadow(0 10px 30px ${getGPAGlow(currentGPA)})` }}
                  />
                  <span
                    className="relative z-10"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 800,
                      fontSize: "64px",
                      color: getGPABadgeTextColor(currentGPA),
                      lineHeight: 1
                    }}
                  >
                    {currentGPA.toFixed(2)}
                  </span>
                  <span
                    className="relative z-10"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "rgba(255, 255, 255, 0.9)",
                      marginTop: "8px"
                    }}
                  >
                    {gpaTab === "unweighted" ? "Unweighted" : "Weighted"}
                  </span>
                </>
              ) : (
                <div
                  className="rounded-full flex flex-col items-center justify-center"
                  style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: getGPAColor(currentGPA),
                    boxShadow: "var(--shadow-premium)"
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 800,
                      fontSize: "64px",
                      color: "#ffffff",
                      lineHeight: 1
                    }}
                  >
                    {currentGPA.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "rgba(255, 255, 255, 0.9)",
                      marginTop: "8px"
                    }}
                  >
                    {gpaTab === "unweighted" ? "Unweighted" : "Weighted"}
                  </span>
                </div>
              )}
            </motion.div>
            
            <p 
              className="mt-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "20px",
                color: "var(--color-text-primary)"
              }}
            >
              Current GPA
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto hide-scrollbar -mx-4 px-4"
        >
          <div className="flex gap-4 pb-2">
            {/* Top Class */}
            {topClass && (
              <button 
                onClick={() => navigate(`/class/${topClass.id}`)}
                className="flex-shrink-0 rounded-[20px] p-6 flex flex-col active:scale-[0.98] transition-transform"
                style={{ 
                  width: "200px", 
                  height: "180px",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      color: "var(--color-text-secondary)",
                      fontWeight: 600,
                      textAlign: "left"
                    }}
                  >
                    Top Class
                  </p>
                </div>
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 relative" style={{ width: "60px", height: "60px" }}>
                    <img 
                      src={getGradeBadge(topClass.grade)!}
                      alt="Grade Badge"
                      className="w-full h-full"
                      style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(topClass.grade)})` }}
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: getBadgeTextColor(topClass.grade),
                      }}
                    >
                      {topClass.grade}
                    </span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3
                      }}
                    >
                      {topClass.fullName}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Lowest Class */}
            {lowestClass && (
              <button 
                onClick={() => navigate(`/class/${lowestClass.id}`)}
                className="flex-shrink-0 rounded-[20px] p-6 flex flex-col active:scale-[0.98] transition-transform"
                style={{ 
                  width: "200px", 
                  height: "180px",
                  backgroundColor: "var(--color-bg-secondary)",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6" style={{ color: "var(--color-warning)" }} />
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      color: "var(--color-text-secondary)",
                      fontWeight: 600,
                      textAlign: "left"
                    }}
                  >
                    Needs Focus
                  </p>
                </div>
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 relative" style={{ width: "60px", height: "60px" }}>
                    <img 
                      src={getGradeBadge(lowestClass.grade)!}
                      alt="Grade Badge"
                      className="w-full h-full"
                      style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(lowestClass.grade)})` }}
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: getBadgeTextColor(lowestClass.grade),
                      }}
                    >
                      {lowestClass.grade}
                    </span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3
                      }}
                    >
                      {lowestClass.fullName}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* View Analytics */}
            <button 
              onClick={() => navigate('/analytics')}
              className="flex-shrink-0 rounded-[20px] p-6 flex flex-col justify-center items-center active:scale-[0.98] transition-transform"
              style={{ 
                width: "200px", 
                height: "180px",
                backgroundColor: "var(--color-bg-secondary)",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <TrendingUp 
                className="w-16 h-16 mb-4" 
                style={{ color: "var(--color-primary)" }} 
              />
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  color: "var(--color-text-primary)",
                  fontWeight: 700,
                  textAlign: "center"
                }}
              >
                View Analytics
              </p>
            </button>
          </div>
        </motion.div>

        {/* Classes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[24px] overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="px-5 pt-5 pb-3">
            <h2 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--color-text-primary)"
              }}
            >
              All Classes ({classes.length})
            </h2>
          </div>
          
          <div>
            {classes.map((cls, index) => (
              <button
                key={cls.id}
                onClick={() => navigate(`/class/${cls.id}`)}
                className="w-full px-5 py-4 flex items-center justify-between active:scale-[0.98] transition-transform"
                style={{
                  backgroundColor: index % 2 === 0 ? "var(--color-bg-secondary)" : "var(--color-bg-elevated)",
                  minHeight: "70px"
                }}
              >
                <div className="flex-1 text-left">
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      marginBottom: "4px"
                    }}
                  >
                    {cls.fullName}
                  </p>
                  <p 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: "var(--color-text-secondary)"
                    }}
                  >
                    {cls.grade > 0 ? `Grade: ${cls.grade}%` : 'No grade yet'}
                  </p>
                </div>
                <div className="text-right">
                  {cls.grade > 0 ? (
                    <div className="relative" style={{ width: "50px", height: "50px" }}>
                      <img 
                        src={getGradeBadge(cls.grade)!}
                        alt="Grade Badge"
                        className="w-full h-full"
                        style={{ filter: `drop-shadow(0 2px 8px ${getGradeGlow(cls.grade)})` }}
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
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "var(--color-bg-elevated)",
                        border: "2px solid var(--color-text-muted)"
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        --
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => navigate("/gpa")}
            className="w-full rounded-[20px] py-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "var(--color-text-onAccent)" }} />
            <span 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "var(--color-text-onAccent)"
              }}
            >
              View Full GPA
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}