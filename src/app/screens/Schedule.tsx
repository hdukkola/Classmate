import { useState } from "react";
import { schedule } from "../data/mockData";
import { Clock, MapPin } from "lucide-react";

export function Schedule() {
  const [view, setView] = useState<"today" | "week">("today");

  const todaySchedule = schedule;
  const weekSchedule = {
    Monday: schedule,
    Tuesday: schedule,
    Wednesday: schedule,
    Thursday: schedule,
    Friday: schedule,
  };

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold" style={{ color: "var(--color-text-primary)" }}>Schedule</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>Your class timetable</p>
      </div>

      {/* Segmented Control */}
      <div className="rounded-2xl p-1 mb-6 flex" style={{ backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-text-muted)" }}>
        <button
          onClick={() => setView("today")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            view === "today"
              ? "shadow-sm"
              : "active:opacity-70"
          }`}
          style={{
            backgroundColor: view === "today" ? "var(--color-bg-elevated)" : "transparent",
            color: view === "today" ? "var(--color-primary)" : "var(--color-text-muted)",
          }}
        >
          Today
        </button>
        <button
          onClick={() => setView("week")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            view === "week"
              ? "shadow-sm"
              : "active:opacity-70"
          }`}
          style={{
            backgroundColor: view === "week" ? "var(--color-bg-elevated)" : "transparent",
            color: view === "week" ? "var(--color-primary)" : "var(--color-text-muted)",
          }}
        >
          Week
        </button>
      </div>

      {/* Today View */}
      {view === "today" && (
        <div className="space-y-4">
          {todaySchedule.map((item) => (
            <div
              key={item.id}
              className="rounded-[20px] p-5 active:scale-[0.98] transition-transform"
              style={{ 
                backgroundColor: "var(--color-bg-elevated)", 
                boxShadow: "var(--shadow-sm)", 
                border: "1px solid var(--color-text-muted)", 
                borderLeftColor: item.color, 
                borderLeftWidth: 4 
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Clock className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>{item.className}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {item.startTime} - {item.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.room}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div className="space-y-6 pb-20">
          {Object.entries(weekSchedule).map(([day, items]) => (
            <div key={day}>
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>{day}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${day}-${item.id}`}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ 
                      backgroundColor: "var(--color-bg-elevated)", 
                      boxShadow: "var(--shadow-sm)", 
                      border: "1px solid var(--color-text-muted)", 
                      borderLeftColor: item.color, 
                      borderLeftWidth: 3 
                    }}
                  >
                    <div className="flex-shrink-0">
                      <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>{item.startTime}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.endTime}</p>
                    </div>
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{item.className}</p>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}