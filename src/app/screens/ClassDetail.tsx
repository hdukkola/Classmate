import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, MapPin, ChevronDown } from "lucide-react";
import { fetchGrades, fetchClassAssignments } from "../services/hacApi";
import { getGradeColor, getGradeBadge, getBadgeTextColor, getGradeGlow } from "../utils/gradeBadges";

export function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadClassData();
  }, [classId]);

  const loadClassData = async () => {
    try {
      const grades = await fetchGrades();
      if (grades && grades.classes) {
        const foundClass = grades.classes.find((c: any) => c.id === classId);
        if (foundClass) {
          setClassData(foundClass);
          
          // Try to load assignments for this class
          try {
            const assignmentsData = await fetchClassAssignments(classId!);
            setAssignments(assignmentsData.assignments || []);
          } catch (error) {
            console.error("Error loading assignments:", error);
            setAssignments([]);
          }
        }
      }
    } catch (error) {
      console.error("Error loading class data:", error);
    }
  };

  // Show placeholder immediately while data loads
  if (!classData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>
        <div className="px-4 pt-6">
          <div className="h-8 w-32 bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-12 w-64 bg-gray-700 rounded mb-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const filteredAssignments = selectedCategory === "all" 
    ? assignments 
    : assignments.filter(a => a.category === selectedCategory);

  const categories = [
    { id: "all", label: "All" },
    { id: "summative", label: "Summative" },
    { id: "performance", label: "Performance" },
    { id: "practice", label: "Practice" }
  ];

  // Calculate category grades
  const calculateCategoryGrade = (categoryAssignments: typeof assignments) => {
    if (categoryAssignments.length === 0) return 0;
    const totalWeight = categoryAssignments.reduce((sum, a) => sum + a.weight, 0);
    const weightedScore = categoryAssignments.reduce((sum, a) => {
      const percentage = (a.score / a.maxScore) * 100;
      return sum + (percentage * a.weight);
    }, 0);
    return Math.round(weightedScore / totalWeight);
  };
  
  // Get ordinal suffix for period number
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };
  
  const performanceGrade = calculateCategoryGrade(assignments.filter(a => a.category === "performance"));
  const summativeGrade = calculateCategoryGrade(assignments.filter(a => a.category === "summative"));
  
  return (
    <div 
      className="min-h-screen pb-24"
      style={{
        backgroundColor: "var(--color-bg-primary)"
      }}
    >
      {/* Header with Back Button */}
      <div className="px-4 pt-6 pb-4">
        <button 
          onClick={() => navigate("/grades")}
          className="w-12 h-12 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ 
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <ArrowLeft className="w-6 h-6" style={{ color: "var(--color-text-primary)" }} />
        </button>
      </div>

      {/* Grade Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center mb-8"
      >
        {/* Current Grade Label */}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            marginBottom: "16px"
          }}
        >
          Current Grade
        </span>
        
        {/* Grade Badge */}
        <div className="relative" style={{ width: "200px", height: "200px" }}>
          <img 
            src={getGradeBadge(classData.grade)}
            alt="Grade Badge"
            className="w-full h-full"
            style={{ filter: `drop-shadow(0 10px 30px ${getGradeGlow(classData.grade)})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "64px",
                fontWeight: 800,
                color: getBadgeTextColor(classData.grade),
                lineHeight: 1
              }}
            >
              {classData.grade}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Class Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mb-6 rounded-[24px] p-6"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <h1
          className="mb-4"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "var(--color-text-primary)",
          }}
        >
          {classData.name}
        </h1>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary-soft)" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  marginBottom: "2px"
                }}
              >
                Teacher
              </p>
              <p 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)"
                }}
              >
                {classData.teacher}
              </p>
            </div>
          </div>

          {classData.room && (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-accent-soft)" }}
              >
                <MapPin className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
              </div>
              <div>
                <p 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    marginBottom: "2px"
                  }}
                >
                  Room
                </p>
                <p 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)"
                  }}
                >
                  {classData.room}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Performance & Summative Grade Cards */}
      <div className="px-4 space-y-4">
        {/* Performance Grade Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[24px] overflow-hidden"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Performance Header */}
          <button
            onClick={() => setSelectedCategory("performance")}
            className="w-full p-5 flex items-center gap-4 active:scale-[0.99] transition-transform"
          >
            {/* Grade Badge */}
            <div className="flex-shrink-0 relative" style={{ width: "60px", height: "60px" }}>
              <img 
                src={getGradeBadge(performanceGrade)}
                alt="Grade Badge"
                className="w-full h-full"
                style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(performanceGrade)})` }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: getBadgeTextColor(performanceGrade),
                }}
              >
                {performanceGrade}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "4px",
                }}
              >
                Performance Grade
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {assignments.filter(a => a.category === "performance").length} assignments
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              className="flex-shrink-0 transition-transform"
              style={{
                width: "20px",
                height: "20px",
                color: "var(--color-text-muted)",
                transform: selectedCategory === "performance" ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Performance Assignments Dropdown */}
          {selectedCategory === "performance" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t"
              style={{ borderColor: "var(--color-text-muted)" }}
            >
              {assignments.filter(a => a.category === "performance").map((assignment, index) => {
                const percentage = Math.round((assignment.score / assignment.maxScore) * 100);
                return (
                  <div
                    key={assignment.id}
                    className="px-5 py-4 flex items-center justify-between"
                    style={{
                      backgroundColor: index % 2 === 0 ? "var(--color-bg-secondary)" : "var(--color-bg-elevated)",
                    }}
                  >
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {assignment.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "13px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {assignment.score}/{assignment.maxScore} • {assignment.weight}% weight
                      </p>
                    </div>
                    <div className="flex-shrink-0 relative" style={{ width: "45px", height: "45px" }}>
                      <img 
                        src={getGradeBadge(percentage)}
                        alt="Grade"
                        className="w-full h-full"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: getBadgeTextColor(percentage),
                        }}
                      >
                        {percentage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Summative Grade Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-[24px] overflow-hidden"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Summative Header */}
          <button
            onClick={() => setSelectedCategory("summative")}
            className="w-full p-5 flex items-center gap-4 active:scale-[0.99] transition-transform"
          >
            {/* Grade Badge */}
            <div className="flex-shrink-0 relative" style={{ width: "60px", height: "60px" }}>
              <img 
                src={getGradeBadge(summativeGrade)}
                alt="Grade Badge"
                className="w-full h-full"
                style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(summativeGrade)})` }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: getBadgeTextColor(summativeGrade),
                }}
              >
                {summativeGrade}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "4px",
                }}
              >
                Summative Grade
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {assignments.filter(a => a.category === "summative").length} assignments
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              className="flex-shrink-0 transition-transform"
              style={{
                width: "20px",
                height: "20px",
                color: "var(--color-text-muted)",
                transform: selectedCategory === "summative" ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Summative Assignments Dropdown */}
          {selectedCategory === "summative" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t"
              style={{ borderColor: "var(--color-text-muted)" }}
            >
              {assignments.filter(a => a.category === "summative").map((assignment, index) => {
                const percentage = Math.round((assignment.score / assignment.maxScore) * 100);
                return (
                  <div
                    key={assignment.id}
                    className="px-5 py-4 flex items-center justify-between"
                    style={{
                      backgroundColor: index % 2 === 0 ? "var(--color-bg-secondary)" : "var(--color-bg-elevated)",
                    }}
                  >
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {assignment.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "13px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {assignment.score}/{assignment.maxScore} • {assignment.weight}% weight
                      </p>
                    </div>
                    <div className="flex-shrink-0 relative" style={{ width: "45px", height: "45px" }}>
                      <img 
                        src={getGradeBadge(percentage)}
                        alt="Grade"
                        className="w-full h-full"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: getBadgeTextColor(percentage),
                        }}
                      >
                        {percentage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pt-6 pb-24 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[20px] p-5"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              marginBottom: "8px"
            }}
          >
            Assignments
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              lineHeight: 1
            }}
          >
            {assignments.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[20px] p-5"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              marginBottom: "8px"
            }}
          >
            Credits
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              lineHeight: 1
            }}
          >
            {classData.credits}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-[20px] p-5"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              marginBottom: "8px"
            }}
          >
            Teacher
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              lineHeight: 1.2
            }}
          >
            {classData.teacher}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-[20px] p-5"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              marginBottom: "8px"
            }}
          >
            Period
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              lineHeight: 1.2
            }}
          >
            {getOrdinalSuffix(classData.period)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}