import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles } from "lucide-react";
import { classes, calculateGPA } from "../data/mockData";
import floraLogo from "figma:asset/e8d95d2d8b336ca3bd69c9a1a1cf7b84851bce61.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Flora, your AI study assistant. I can help you analyze your grades, suggest study strategies, and answer questions about your academic performance. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if AI has access to grades (from settings)
  const hasGradeAccess = localStorage.getItem("aiGradeAccess") === "true";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    if (!hasGradeAccess) {
      return "I don't have access to your grade data yet. You can enable this in Settings > AI Settings to get personalized academic insights!";
    }

    const lowerMessage = userMessage.toLowerCase();
    const gpa = calculateGPA(classes);
    const topClass = classes.reduce((max, cls) => cls.grade > max.grade ? cls : max, classes[0]);
    const lowestClass = classes.reduce((min, cls) => cls.grade < min.grade ? cls : min, classes[0]);

    // GPA-related queries
    if (lowerMessage.includes("gpa") || lowerMessage.includes("average")) {
      return `Your current unweighted GPA is ${gpa.toFixed(2)}. That's ${gpa >= 3.7 ? "excellent work! Keep it up! 🌟" : gpa >= 3.0 ? "doing great! With some focus, you can push it even higher! 💪" : "a solid foundation. Let's work together to improve it! 📚"}`;
    }

    // Top/best class queries
    if (lowerMessage.includes("best") || lowerMessage.includes("top") || lowerMessage.includes("highest")) {
      return `Your top-performing class is ${topClass.name} with a grade of ${topClass.grade}%! ${topClass.grade >= 94 ? "Outstanding work! 🏆" : "Great job! 🎯"} What strategies are working well for you in this class?`;
    }

    // Struggling/lowest class queries
    if (lowerMessage.includes("struggling") || lowerMessage.includes("worst") || lowerMessage.includes("lowest") || lowerMessage.includes("improve")) {
      return `${lowestClass.name} (${lowestClass.grade}%) might need some extra attention. Here are some strategies:\n\n1. Review material daily for 20-30 minutes\n2. Form a study group with classmates\n3. Visit your teacher during office hours\n4. Break down complex topics into smaller chunks\n\nWould you like specific study tips for this subject?`;
    }

    // Study tips
    if (lowerMessage.includes("study") || lowerMessage.includes("tips") || lowerMessage.includes("help")) {
      return `Here are some proven study strategies:\n\n📚 Active Recall: Test yourself instead of re-reading\n⏰ Pomodoro Technique: 25 min focused work, 5 min break\n📝 Cornell Notes: Organize notes for better retention\n🎯 Spaced Repetition: Review material at increasing intervals\n\nWhich subject would you like specific help with?`;
    }

    // General classes overview
    if (lowerMessage.includes("class") || lowerMessage.includes("overview") || lowerMessage.includes("summary")) {
      const classesInfo = classes.map(c => `• ${c.name}: ${c.grade}%`).join("\n");
      return `Here's your current academic overview:\n\n${classesInfo}\n\nOverall GPA: ${gpa.toFixed(2)}\n\nYou're doing well! ${lowestClass.grade < 85 ? `Focus a bit more on ${lowestClass.name} to bring up your overall average.` : "Keep up the great work! 🌟"}`;
    }

    // Default response
    return `I'm here to help with your academic journey! You can ask me about:\n\n• Your GPA and grades\n• Study strategies and tips\n• Which classes need focus\n• Time management advice\n\nWhat would you like to explore?`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-5 flex items-center gap-3"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          minHeight: "70px",
        }}
      >
        <img
          src={floraLogo}
          alt="Flora AI"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
        <div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "28px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
            }}
          >
            Flora AI
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
            }}
          >
            Your AI Study Assistant
          </p>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-[20px] px-5 py-4"
                style={{
                  backgroundColor:
                    message.role === "user"
                      ? "var(--color-primary)"
                      : "var(--color-bg-elevated)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={floraLogo}
                      alt="Flora"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--color-primary)",
                      }}
                    >
                      Flora
                    </span>
                  </div>
                )}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.5,
                    color:
                      message.role === "user"
                        ? "var(--color-text-onAccent)"
                        : "var(--color-text-primary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div
              className="max-w-[80%] rounded-[20px] px-5 py-4 flex items-center gap-2"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={floraLogo}
                alt="Flora"
                style={{ width: "20px", height: "20px" }}
              />
              <div className="flex gap-1">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (show when no user messages yet) */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p
            className="mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Try asking:
          </p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {[
              "What's my GPA?",
              "Which class should I focus on?",
              "Give me study tips",
              "Show my class overview",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="flex-shrink-0 px-4 py-2 rounded-full active:scale-95 transition-transform"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-text-muted)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {prompt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className="px-4 pb-6 pt-4"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderTop: "1px solid var(--color-text-muted)",
        }}
      >
        <div
          className="rounded-[24px] px-5 py-3 flex items-center gap-3"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <Sparkles
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask Flora anything..."
            className="flex-1 bg-transparent outline-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: "var(--color-text-primary)",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
            style={{
              backgroundColor: inputValue.trim()
                ? "var(--color-primary)"
                : "var(--color-bg-secondary)",
            }}
          >
            <Send
              className="w-5 h-5"
              style={{
                color: inputValue.trim()
                  ? "var(--color-text-onAccent)"
                  : "var(--color-text-muted)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
