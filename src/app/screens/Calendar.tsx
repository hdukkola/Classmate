import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, BookOpen, Clock, Trash2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { formatTime } from "../utils/timeFormat";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  topic?: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  // New event form state
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("18:00");
  const [newEventDuration, setNewEventDuration] = useState("60");
  const [newEventTopic, setNewEventTopic] = useState("");

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    if (!newEventTitle || !newEventDate) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            title: newEventTitle,
            description: newEventTopic ? `Topic: ${newEventTopic}` : "",
            date: newEventDate,
            time: newEventTime,
            duration: parseInt(newEventDuration),
            topic: newEventTopic,
          }),
        }
      );

      if (response.ok) {
        setShowAddEvent(false);
        setNewEventTitle("");
        setNewEventTopic("");
        setNewEventDate("");
        loadEvents();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Delete this study session? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        loadEvents();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth();

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "34px",
                color: "var(--color-text-primary)",
                lineHeight: 1.2,
              }}
            >
              Calendar
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                marginTop: "4px",
              }}
            >
              Plan your study sessions
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddEvent(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
            }}
          >
            <Plus className="w-6 h-6" style={{ color: "white" }} />
          </motion.button>
        </div>

        {/* Month Navigation */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <motion.button whileTap={{ scale: 0.9 }} onClick={previousMonth} className="p-2">
            <ChevronLeft className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </motion.button>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "var(--color-text-primary)",
            }}
          >
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} className="p-2">
            <ChevronRight className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center py-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />;
            }

            const dayEvents = getEventsForDay(day);
            const today = isToday(day);

            return (
              <motion.button
                key={day}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className="aspect-square rounded-2xl p-2 flex flex-col items-center justify-center relative"
                style={{
                  backgroundColor: today
                    ? "var(--color-primary)"
                    : dayEvents.length > 0
                    ? "var(--color-primary-soft)"
                    : "var(--color-bg-elevated)",
                  border: `1px solid ${today ? "transparent" : "var(--color-border)"}`,
                  boxShadow: today ? "0 4px 12px rgba(139, 92, 246, 0.3)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: today ? "white" : "var(--color-text-primary)",
                  }}
                >
                  {day}
                </span>
                {dayEvents.length > 0 && !today && (
                  <div className="flex gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      {selectedDate && (
        <div className="px-4 mt-6">
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "var(--color-text-primary)",
              marginBottom: "12px",
            }}
          >
            {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h3>
          {getEventsForDay(selectedDate.getDate()).length === 0 ? (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "var(--color-text-secondary)",
                }}
              >
                No study sessions planned
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {getEventsForDay(selectedDate.getDate()).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--color-primary-soft)" }}
                    >
                      <BookOpen className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div className="flex-1">
                      <h4
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "var(--color-text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {event.title}
                      </h4>
                      {event.description && (
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "14px",
                            color: "var(--color-text-secondary)",
                            marginBottom: "8px",
                          }}
                        >
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "13px",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {formatTime(event.time)} • {event.duration} min
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteEvent(event.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-bg-secondary)" }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: "var(--color-error)" }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowAddEvent(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[600px] rounded-t-[32px] pb-32"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 p-6 pb-4 rounded-t-[32px]" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <div className="flex items-center justify-between">
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "24px",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    New Study Session
                  </h3>
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-bg-secondary)" }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-6 space-y-4">
                <div>
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g., Study for Math Quiz"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      color: "var(--color-text-primary)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEventTopic}
                    onChange={(e) => setNewEventTopic(e.target.value)}
                    placeholder="e.g., Quadratic Equations"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "16px",
                      color: "var(--color-text-primary)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Date
                  </label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="YYYY-MM-DD (e.g., 2026-03-15)"
                    className="w-full px-4 py-4 rounded-xl"
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      border: "2px solid var(--color-border)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "17px",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      outline: "none",
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="HH:MM (e.g., 18:00)"
                      className="w-full px-4 py-4 rounded-xl"
                      style={{
                        backgroundColor: "var(--color-bg-secondary)",
                        border: "2px solid var(--color-border)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newEventDuration}
                      onChange={(e) => setNewEventDuration(e.target.value)}
                      min="15"
                      step="15"
                      placeholder="e.g., 60"
                      className="w-full px-4 py-4 rounded-xl"
                      style={{
                        backgroundColor: "var(--color-bg-secondary)",
                        border: "2px solid var(--color-border)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={createEvent}
                  disabled={!newEventTitle || !newEventDate}
                  className="w-full py-4 rounded-2xl mt-6"
                  style={{
                    background: newEventTitle && newEventDate
                      ? "var(--gradient-primary)"
                      : "var(--color-bg-secondary)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: newEventTitle && newEventDate ? "white" : "var(--color-text-muted)",
                    boxShadow: newEventTitle && newEventDate
                      ? "0 10px 30px rgba(139, 92, 246, 0.4)"
                      : "none",
                  }}
                >
                  Create Study Session
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}