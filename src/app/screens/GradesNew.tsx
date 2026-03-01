import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { classes } from "../data/mockData";
import { getGradeBadge, getBadgeTextColor, getGradeGlow } from "../utils/gradeBadges";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type MarkingPeriod = "MP1" | "MP2" | "MP3" | "MP4";

export function GradesNew() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<MarkingPeriod>("MP1");

  const periods: MarkingPeriod[] = ["MP1", "MP2", "MP3", "MP4"];

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-5 flex items-center justify-between relative"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          minHeight: "70px"
        }}
      >
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "var(--color-text-primary)",
          }}
        >
          Grades
        </h1>
      </motion.div>

      {/* Marking Period Tabs */}
      <div className="px-4 mb-6">
        <div
          className="rounded-[16px] p-1 flex gap-1"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
          }}
        >
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className="flex-1 py-3 rounded-[12px] font-medium transition-all active:scale-95"
              style={{
                backgroundColor: selectedPeriod === period ? "var(--color-primary)" : "transparent",
                color: selectedPeriod === period ? "var(--color-text-onAccent)" : "var(--color-text-secondary)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Marking Period {period.replace("MP", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="px-4 space-y-4">
        {classes.map((cls, index) => (
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