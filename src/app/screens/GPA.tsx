import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { calculateGPA, classes } from "../data/mockData";

export function GPA() {
  const gpa = calculateGPA(classes);
  const weightedGPA = (gpa * 1.08).toFixed(2);
  const totalCredits = classes.reduce((sum, cls) => sum + cls.credits, 0);
  const progress = (gpa / 4) * 100;

  // Mock GPA trend data
  const trendData = [
    { semester: "S1", gpa: 3.65 },
    { semester: "S2", gpa: 3.72 },
    { semester: "S3", gpa: 3.78 },
    { semester: "S4", gpa: 3.82 },
  ];

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[34px] font-bold tracking-tight mb-2" style={{ color: "var(--color-text-primary)" }}>GPA</h1>
        <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Academic performance overview
        </p>
      </motion.div>

      {/* Main GPA Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-[24px] p-10 mb-5"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-premium)",
        }}
      >
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-white/80 text-sm font-semibold mb-8 uppercase tracking-wide">
            Current GPA
          </p>

          {/* Circular Progress Ring */}
          <div className="relative w-56 h-56 mb-8">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="16"
                fill="none"
              />
              <motion.circle
                cx="112"
                cy="112"
                r="100"
                stroke="white"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(progress / 100) * 628.32} 628.32`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 628.32" }}
                animate={{ strokeDasharray: `${(progress / 100) * 628.32} 628.32` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-[72px] font-bold text-white leading-none mb-2">
                  {gpa.toFixed(2)}
                </div>
                <div className="text-white/80 text-sm font-medium">out of 4.0</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-5"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <p className="text-sm mb-2 font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Weighted GPA
          </p>
          <p className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{weightedGPA}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-5"
          style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
        >
          <p className="text-sm mb-2 font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Unweighted GPA
          </p>
          <p className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{gpa.toFixed(2)}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[20px] p-5 mb-5"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <p className="text-sm mb-2 font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Total Credits
        </p>
        <p className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{totalCredits}</p>
      </motion.div>

      {/* GPA Trend Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-[24px] p-6"
        style={{ backgroundColor: "var(--color-bg-elevated)", boxShadow: "var(--shadow-md)" }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>GPA Trend</h2>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <defs>
              <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b3894" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6b3894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="semester"
              stroke="#7a7487"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[3.0, 4.0]}
              stroke="#7a7487"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-elevated)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="#6b3894"
              strokeWidth={3}
              dot={{ fill: "#6b3894", r: 6 }}
              activeDot={{ r: 8 }}
              fill="url(#gpaGradient)"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-text-muted)" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Overall Trend</span>
            <div className="flex items-center gap-1 font-semibold" style={{ color: "#22C55E" }}>
              <span>↗</span>
              <span className="text-sm">Improving</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}