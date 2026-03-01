import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Brain } from "lucide-react";
import { calculateGPA } from "../data/mockData";

export function Analytics() {
  const [simulatedScore, setSimulatedScore] = useState(85);
  const currentGPA = 3.82;
  const projectedGPA = (currentGPA + (simulatedScore - 85) * 0.009).toFixed(2);

  // Academic Risk Meter
  const riskLevel = currentGPA >= 3.5 ? "low" : currentGPA >= 3.0 ? "medium" : "high";
  const riskColor = riskLevel === "low" ? "#22C55E" : riskLevel === "medium" ? "#F59E0B" : "#EF4444";
  const riskAngle = riskLevel === "low" ? 30 : riskLevel === "medium" ? 90 : 150;

  // Performance Heatmap Data (5 weeks x 7 days)
  const generateHeatmapData = () => {
    const data = [];
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const strength = Math.random();
        data.push({ week, day, strength });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const getHeatmapColor = (strength: number) => {
    if (strength > 0.75) return "#22C55E";
    if (strength > 0.5) return "#3B82F6";
    if (strength > 0.25) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[34px] font-bold tracking-tight mb-2" style={{ color: "var(--color-text-primary)" }}>Analytics</h1>
        <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Data-driven insights for success
        </p>
      </motion.div>

      {/* Academic Risk Meter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[24px] p-6 mb-5"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Academic Risk Meter</h2>
        </div>

        <div className="flex flex-col items-center">
          {/* Gauge */}
          <div className="relative w-48 h-24 mb-4">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="#9e98a8"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Colored arc */}
              <motion.path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke={riskColor}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (riskAngle / 180) * 251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (riskAngle / 180) * 251.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* Needle */}
              <motion.line
                x1="100"
                y1="80"
                x2="100"
                y2="30"
                stroke={riskColor}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ transform: "rotate(-90deg)" }}
                animate={{ transform: `rotate(${riskAngle - 90}deg)` }}
                style={{ transformOrigin: "100px 80px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <circle cx="100" cy="80" r="6" fill={riskColor} />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold mb-1" style={{ color: riskColor }}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Based on current performance trends
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grade Projection Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[24px] p-6 mb-5"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Grade Projection</h2>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-3">
            <label className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Next Math Test Score
            </label>
            <span className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
              {simulatedScore}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={simulatedScore}
            onChange={(e) => setSimulatedScore(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${simulatedScore}%, var(--color-text-muted) ${simulatedScore}%, var(--color-text-muted) 100%)`,
            }}
          />
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--gradient-primary-soft)", border: "1px solid var(--color-primary-soft)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Projected New GPA
          </p>
          <motion.p
            key={projectedGPA}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {projectedGPA}
          </motion.p>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
            {Number(projectedGPA) > currentGPA ? "↗" : Number(projectedGPA) < currentGPA ? "↘" : "→"}{" "}
            {Math.abs(Number(projectedGPA) - currentGPA).toFixed(2)} from current
          </p>
        </div>
      </motion.div>

      {/* Performance Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[24px] p-6 mb-5"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Performance Heatmap</h2>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Last 5 weeks of academic activity
        </p>

        {/* Day labels */}
        <div className="flex gap-2 mb-2 ml-8">
          {days.map((day, i) => (
            <div key={i} className="w-8 text-center text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((week) => (
            <div key={week} className="flex gap-2 items-center">
              <span className="text-xs font-semibold w-6" style={{ color: "var(--color-text-muted)" }}>
                W{week + 1}
              </span>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const dataPoint = heatmapData.find((d) => d.week === week && d.day === day);
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (week * 7 + day) * 0.01 }}
                      className="w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: dataPoint ? getHeatmapColor(dataPoint.strength) : "var(--color-bg-secondary)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4" style={{ borderTop: "1px solid var(--color-text-muted)" }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EF4444]" />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#F59E0B]" />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#3B82F6]" />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#22C55E]" />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Excellent</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}