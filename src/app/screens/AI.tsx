import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Brain, TrendingUp, BookOpen, Target, Calendar } from "lucide-react";
import { classes, calculateGPA } from "../data/mockData";
import floraLogo from "figma:asset/e8d95d2d8b336ca3bd69c9a1a1cf7b84851bce61.png";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  studyPlan?: StudyPlanEvent[];
}

interface StudyPlanEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
}

export function AI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addingToCalendar, setAddingToCalendar] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  const hasInitializedRef = useRef(false);
  const isSendingRef = useRef(false);
  const lastSentMessageRef = useRef<string>("");
  const lastSentTimeRef = useRef<number>(0);
  const processedResponsesRef = useRef<Set<string>>(new Set());
  const hasGradeAccess = localStorage.getItem("aiGradeAccess") === "true";

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize only once on mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setMessages([]);
      console.log("🌸 Flora AI initialized");
    }
  }, []);

  const addStudyPlanToCalendar = async (events: StudyPlanEvent[], messageId: string) => {
    setAddingToCalendar(messageId);
    console.log("📅 Adding study plan to calendar:", events);

    try {
      // Create all events in parallel
      const promises = events.map(event => 
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/calendar/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(event),
        })
      );

      await Promise.all(promises);
      
      console.log("✅ Study plan added to calendar successfully!");
      
      // Add confirmation message
      const confirmMessage: Message = {
        id: generateUniqueId(),
        role: "assistant",
        content: `✅ **Success!** I've added all ${events.length} study sessions to your Calendar! 🎉\n\nHead over to the Calendar tab to see your personalized study schedule. Good luck with your studies! 📚✨`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, confirmMessage]);
      setAddingToCalendar(null);
    } catch (error: any) {
      console.error("❌ Error adding to calendar:", error);
      
      const errorMessage: Message = {
        id: generateUniqueId(),
        role: "assistant",
        content: `❌ Oops! There was an error adding the study plan to your calendar: ${error.message}\n\nPlease try again!`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setAddingToCalendar(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // HARDCORE DUPLICATE PREVENTION
    const now = Date.now();
    const messageContent = inputValue.trim();
    
    // Prevent if currently sending
    if (isSendingRef.current) {
      console.warn("⚠️ BLOCKED: Already sending a message");
      return;
    }
    
    // Prevent duplicate content within 2 seconds
    if (
      lastSentMessageRef.current === messageContent &&
      now - lastSentTimeRef.current < 2000
    ) {
      console.warn("⚠️ BLOCKED: Duplicate message within 2s:", messageContent);
      return;
    }
    
    console.log("✅ SENDING MESSAGE:", messageContent);
    
    // Update trackers
    lastSentMessageRef.current = messageContent;
    lastSentTimeRef.current = now;
    isSendingRef.current = true;

    const userMessageId = generateUniqueId();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      let gradeData = null;
      if (hasGradeAccess) {
        const gpa = calculateGPA(classes);
        const topClass = classes.reduce((max, cls) => cls.grade > max.grade ? cls : max, classes[0]);
        const lowestClass = classes.reduce((min, cls) => cls.grade < min.grade ? cls : min, classes[0]);
        
        gradeData = {
          hasAccess: true,
          gpa: gpa.toFixed(2),
          classes: classes.map(c => ({ name: c.name, grade: c.grade })),
          topClass: { name: topClass.name, grade: topClass.grade },
          lowestClass: { name: lowestClass.name, grade: lowestClass.grade },
        };
      }

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/ai/chat`;
      console.log("🌐 Calling API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message: messageToSend,
          gradeData,
        }),
      });

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("📦 Response data:", data);

      const aiMessageId = generateUniqueId();
      const aiResponse: Message = {
        id: aiMessageId,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        studyPlan: data.studyPlanEvents || undefined,
      };
      
      console.log(`✅ Adding AI response with ID: ${aiMessageId}`);
      console.log(`📝 Response content preview: "${data.response.substring(0, 50)}..."`);
      
      // Create a fingerprint for this response
      const responseFingerprint = `${data.response.substring(0, 100)}-${now}`;
      
      // Use callback to ensure we're working with latest state
      setMessages((prev) => {
        // Check if we already have this exact content from the last message
        if (prev.length > 0) {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === "assistant" && lastMsg.content === data.response) {
            console.warn("⚠️ BLOCKED: Exact duplicate content detected in last message");
            return prev;
          }
        }
        
        // Check if this response was already processed
        if (processedResponsesRef.current.has(responseFingerprint)) {
          console.warn("⚠️ BLOCKED: Response already processed");
          return prev;
        }
        
        // Mark this response as processed
        processedResponsesRef.current.add(responseFingerprint);
        
        // Clean up old fingerprints (keep last 10)
        if (processedResponsesRef.current.size > 10) {
          const arr = Array.from(processedResponsesRef.current);
          processedResponsesRef.current = new Set(arr.slice(-10));
        }
        
        console.log(`📝 Adding message to array (prev length: ${prev.length})`);
        return [...prev, aiResponse];
      });
      
      setIsTyping(false);
      isSendingRef.current = false;
      console.log("✅ Message send complete");

    } catch (error: any) {
      console.error("❌ Chat Error:", error);
      console.error("❌ Error type:", error.constructor.name);
      console.error("❌ Error message:", error.message);
      
      // Determine error type and provide helpful message
      let errorContent = "";
      
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        // Network error - server might be down or CORS issue
        errorContent = `🔌 **Connection Error**\n\nI'm having trouble connecting to the server. This could mean:\n\n1. 🌐 The server might be starting up (wait 10-20 seconds)\n2. 🔄 Network connectivity issue\n3. 🛑 Server might be offline\n\n💡 **Try this:**\n• Wait a few seconds and try again\n• Check your internet connection\n• Click the 🐛 debug button and run diagnostics\n\nError: ${error.message}`;
      } else if (error.message && error.message.includes("rate-limit")) {
        // Rate limit
        errorContent = "Hi! I'm Flora 🌸\n\nOpenRouter's free tier is currently rate-limited. This is normal - free models are shared among many users.\n\n💡 **Quick fixes:**\n1. ⏰ Wait 2-3 minutes and try again\n2. 🔄 The rate limit usually resets quickly\n3. 💰 Upgrade to paid models for instant access (~$0.001/message)\n\nI'll be ready when you are! Just send another message. 😊";
      } else if (error.message && error.message.includes("500")) {
        // Server error
        errorContent = `⚠️ **Server Error**\n\nThe server encountered an error. This usually means:\n\n• The AI service might be temporarily unavailable\n• Try again in a few moments\n\nError: ${error.message}`;
      } else {
        // Generic error
        errorContent = `Sorry, I encountered an error: ${error.message}`;
      }
      
      const errorMessageId = generateUniqueId();
      const errorMessage: Message = {
        id: errorMessageId,
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => {
        const alreadyExists = prev.some(msg => msg.id === errorMessageId);
        if (alreadyExists) {
          return prev;
        }
        return [...prev, errorMessage];
      });
      setIsTyping(false);
      isSendingRef.current = false;
    }
  };

  const suggestedQuestions = [
    { icon: Brain, text: "How can I improve my study habits?" },
    { icon: TrendingUp, text: "Analyze my current grades" },
    { icon: BookOpen, text: "Give me tips for my lowest class" },
    { icon: Target, text: "Help me set academic goals?" },
  ];

  const runDiagnostic = async () => {
    console.log("🔧 Running diagnostic...");
    setDebugInfo("Running diagnostic...");
    
    try {
      // Test 1: Health check
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/health`;
      const healthRes = await fetch(healthUrl, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });
      const healthData = await healthRes.json();
      console.log("✅ Health Response:", healthRes.status, healthData);
      
      // Test 2: API key check
      const keyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/debug/apikey`;
      const keyRes = await fetch(keyUrl, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });
      const keyData = await keyRes.json();
      console.log("🔑 API Key Response:", keyRes.status, keyData);
      
      // Test 3: OpenRouter test
      const geminiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/debug/test-gemini`;
      const geminiRes = await fetch(geminiUrl, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });
      const geminiData = await geminiRes.json();
      console.log("🤖 OpenRouter Response:", geminiRes.status, geminiData);
      
      // Test 4: Full chat test
      const chatUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/ai/chat`;
      const chatRes = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message: "Test: Say hello!",
          gradeData: null,
        }),
      });
      const chatData = await chatRes.json();
      console.log("💬 Chat Response:", chatRes.status, chatData);
      
      const report = `DIAGNOSTIC RESULTS
==================
${healthRes.ok ? "✅" : "❌"} Health: ${healthRes.status}
   ${JSON.stringify(healthData).substring(0, 50)}

${keyRes.ok ? "✅" : "❌"} API Key: ${keyRes.status}
   Has Key: ${keyData.hasKey}
   ${keyData.keyPreview || "none"}

${geminiRes.ok ? "✅" : "❌"} OpenRouter: ${geminiRes.status}
   ${geminiData.success ? "✅ " + geminiData.model : "❌ " + (geminiData.error || "Failed")}
   ${geminiData.extractedText?.substring(0, 40) || ""}
   ${geminiData.errorDetails ? "\n   Error Details:" : ""}
   ${geminiData.errorDetails?.map((e: any) => `\n   - ${e.model}: ${e.status || ""} ${e.error?.substring(0, 60) || e.error || ""}`).join("") || ""}

${chatRes.ok ? "✅" : "❌"} Chat: ${chatRes.status}
   ${chatData.response?.substring(0, 50) || chatData.error || ""}
   Model: ${chatData.model || "unknown"}
   ${chatData.usingFallback ? "⚠️ Using fallback mode" : ""}

==================
${geminiData.hint || ""}

Check console for full details!`;
      
      setDebugInfo(report);
      console.log("📊 FULL DIAGNOSTIC DATA:");
      console.log("  Health:", healthData);
      console.log("  API Key:", keyData);
      console.log("  OpenRouter:", geminiData);
      console.log("  Chat:", chatData);
      
    } catch (error: any) {
      const errorReport = `DIAGNOSTIC FAILED!
${error.message}

Check console for stack trace!`;
      setDebugInfo(errorReport);
      console.error("❌ Diagnostic error:", error);
    }
  };

  return (
    <div
      className="min-h-screen pb-24 flex flex-col"
      style={{
        backgroundColor: "var(--color-bg-primary)",
      }}
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
        <motion.img
          src={floraLogo}
          alt="Flora AI"
          style={{
            width: "40px",
            height: "40px",
          }}
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex-1">
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
            }}
          >
            Flora AI
          </h1>
          <motion.p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ● Online
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 pt-12 pb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <img
                src={floraLogo}
                alt="Flora"
                style={{
                  width: "100px",
                  height: "100px",
                  filter: "drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))",
                }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "28px",
                color: "var(--color-text-primary)",
                marginTop: "24px",
                textAlign: "center",
              }}
            >
              Hey, I'm Flora
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                marginTop: "8px",
                textAlign: "center",
                maxWidth: "300px",
              }}
            >
              Your AI study companion powered by free open-source AI. Ask me anything about your grades, study strategies, or academic goals.
            </motion.p>

            {/* Quick action cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 w-full px-4"
            >
              <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
                {suggestedQuestions.map((action, index) => (
                  <motion.button
                    key={action.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputValue(action.text)}
                    className="p-5 rounded-2xl flex flex-col items-center justify-center gap-3"
                    style={{
                      backgroundColor: "var(--color-bg-elevated)",
                      boxShadow: "var(--shadow-md)",
                      border: "1px solid var(--color-border)",
                      cursor: "pointer",
                      minHeight: "130px",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: "var(--color-primary-soft)",
                      }}
                    >
                      <action.icon className="w-7 h-7" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        textAlign: "center",
                        lineHeight: "1.3",
                      }}
                    >
                      {action.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {!hasGradeAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 p-4 rounded-2xl max-w-sm"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-primary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    textAlign: "center",
                  }}
                >
                  💡 Enable "AI Grade Access" in Settings for personalized insights
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="max-w-[85%] rounded-[20px] px-5 py-4"
                    style={{
                      backgroundColor:
                        message.role === "user"
                          ? "var(--color-primary)"
                          : "var(--color-bg-elevated)",
                      boxShadow: message.role === "user" 
                        ? "0 4px 20px rgba(139, 92, 246, 0.3)"
                        : "var(--shadow-sm)",
                      border: message.role === "assistant" 
                        ? "1px solid var(--color-border)"
                        : "none",
                    }}
                  >
                    {message.role === "assistant" && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 mb-2"
                      >
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
                      </motion.div>
                    )}
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "15px",
                        lineHeight: 1.6,
                        color:
                          message.role === "user"
                            ? "var(--color-text-onAccent)"
                            : "var(--color-text-primary)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                    
                    {/* Add to Calendar Button - shown if message has a study plan */}
                    {message.role === "assistant" && message.studyPlan && message.studyPlan.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addStudyPlanToCalendar(message.studyPlan!, message.id)}
                        disabled={addingToCalendar === message.id}
                        className="mt-4 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: addingToCalendar === message.id 
                            ? "var(--color-bg-secondary)" 
                            : "var(--color-primary)",
                          color: "var(--color-text-onAccent)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          border: "none",
                          cursor: addingToCalendar === message.id ? "not-allowed" : "pointer",
                          boxShadow: addingToCalendar === message.id 
                            ? "none" 
                            : "0 4px 15px rgba(139, 92, 246, 0.4)",
                          opacity: addingToCalendar === message.id ? 0.7 : 1,
                        }}
                      >
                        {addingToCalendar === message.id ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Calendar className="w-5 h-5" />
                            </motion.div>
                            Adding to Calendar...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            Add to Calendar ({message.studyPlan.length} sessions)
                          </>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className="px-5 py-4 rounded-[20px] flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <img
                    src={floraLogo}
                    alt="Flora"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar - fixed at bottom */}
      <div
        className="px-4 pb-6 pt-4"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div
          className="rounded-[24px] px-5 py-3 flex items-center gap-3"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "var(--color-primary)" }}
            />
          </motion.div>
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
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform disabled:opacity-50"
            style={{
              backgroundColor: inputValue.trim()
                ? "var(--color-primary)"
                : "var(--color-bg-secondary)",
              boxShadow: inputValue.trim() 
                ? "0 0 20px rgba(139, 92, 246, 0.5)"
                : "none",
            }}
            animate={inputValue.trim() ? {
              boxShadow: [
                "0 0 15px rgba(139, 92, 246, 0.4)",
                "0 0 25px rgba(139, 92, 246, 0.6)",
                "0 0 15px rgba(139, 92, 246, 0.4)",
              ],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
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
          </motion.button>
        </div>
      </div>
    </div>
  );
}