import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { getClassesByQuarter } from "../data/mockData";
import { getGradeBadge, getBadgeTextColor, getGradeGlow } from "../utils/gradeBadges";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function GradesNew() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  // Get classes for the selected period
  const displayClasses = getClassesByQuarter(selectedPeriod);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-4"
      >
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "34px",
            color: "var(--color-text-primary)",
            marginBottom: "4px"
          }}
        >
          Grades
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
          color: "var(--color-text-secondary)"
        }}>
          View your class performance
        </p>
      </motion.div>

      {/* Quarter/Marking Period Selector */}
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
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className="flex-1 py-2.5 rounded-[12px] transition-all active:scale-95"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: selectedPeriod === period.id ? "var(--color-primary)" : "transparent",
                color: selectedPeriod === period.id ? "#FFFFFF" : "var(--color-text-secondary)",
              }}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="px-4 space-y-4">
        {displayClasses.map((cls, index) => (
          <motion.button
            key={`${selectedPeriod}-${cls.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/class/${cls.id}`)}
            className="w-full rounded-[20px] p-5 flex items-center gap-4 active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Grade Circle */}
            <div className="flex-shrink-0 relative" style={{ width: "60px", height: "60px" }}>
              <img 
                src={getGradeBadge(cls.grade)}
                alt="Grade Badge"
                className="w-full h-full"
                style={{ filter: `drop-shadow(0 4px 12px ${getGradeGlow(cls.grade)})` }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: getBadgeTextColor(cls.grade),
                }}
              >
                {cls.grade}
              </span>
            </div>

            {/* Class Info */}
            <div className="flex-1 text-left">
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "4px",
                }}
              >
                {cls.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {cls.teacher}
              </p>
            </div>

            {/* Arrow Indicator */}
            <ChevronDown
              className="flex-shrink-0 -rotate-90"
              style={{
                width: "20px",
                height: "20px",
                color: "var(--color-text-muted)",
              }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}