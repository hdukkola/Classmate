import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// ========================================
// MIDDLEWARE
// ========================================

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ========================================
// AI CHAT ENDPOINT
// ========================================

app.post("/make-server-9a43014a/ai/chat", async (c) => {
  console.log("\n🚀 ===== NEW CHAT REQUEST =====");
  
  try {
    // Step 1: Parse request
    console.log("📝 Step 1: Parsing request body...");
    const requestBody = await c.req.json();
    const { message, gradeData } = requestBody;
    
    console.log("✅ Message received:", message);
    console.log("✅ Grade data:", gradeData ? "Provided" : "Not provided");

    // Step 2: Check API key
    console.log("📝 Step 2: Checking API key...");
    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!openrouterApiKey) {
      console.log("❌ CRITICAL: OpenRouter API key not found in environment!");
      return c.json({
        error: "API key not configured",
        response: "Hey! 👋 I'm Flora, but I need my OpenRouter API key to be configured. Please add it in the Supabase settings!",
      }, 500);
    }
    
    console.log("✅ API key found:", `${openrouterApiKey.substring(0, 15)}...`);

    // Step 3: Build system prompt
    console.log("📝 Step 3: Building prompt...");
    
    // Prepare grade context if available
    let gradeContext = "";
    if (gradeData && gradeData.hasAccess) {
      gradeContext = `\n\nSTUDENT GRADE DATA (User has granted you access):\nCurrent GPA: ${gradeData.gpa}\nClasses:\n${gradeData.classes.map((c: any) => `  - ${c.name}: ${c.grade}%`).join('\n')}\nHighest Grade: ${gradeData.topClass.name} (${gradeData.topClass.grade}%)\nLowest Grade: ${gradeData.lowestClass.name} (${gradeData.lowestClass.grade}%)\n\nUse this data to provide personalized, specific advice about their academic performance.`;
    }

    // Build the prompt with Flora's identity
    const systemPrompt = `You are Flora AI, a friendly and enthusiastic AI study companion built into the ClassMate student productivity app. You help students with their academics, grades, study strategies, time management, and motivation.

YOUR IDENTITY:
- Your name is Flora (not "Flora AI" - just Flora when referring to yourself)
- You're helpful, encouraging, supportive, and always positive
- You use emojis naturally to be friendly and expressive
- You keep responses concise and student-friendly (2-4 paragraphs max)
- You're knowledgeable about study techniques, academic success, and student wellness

FORMATTING:
- Use **bold** for emphasis when needed
- Use bullet points with - or • for lists
- Keep it clean and readable

STUDY PLAN CREATION - IMPORTANT:
When a user asks you to create a study plan or schedule, DO NOT create it immediately. Instead:
1. Ask them HOW MANY study sessions they want
2. Ask them WHICH SUBJECTS or classes to focus on
3. Ask them WHAT TIME OF DAY they prefer (morning, afternoon, evening)
4. Ask them HOW LONG each session should be (30 min, 60 min, 90 min, etc.)
5. Ask them WHAT DATES or date range they want

Be conversational and gather ALL details before creating anything. Ask one or two questions at a time, don't overwhelm them with all questions at once.

ONLY when the user has provided all the details and explicitly says "yes create it" or "go ahead" or "make it", then you can respond with a special format that the system will detect.

Example conversation:
User: "Create a study plan for me"
Flora: "I'd love to help you create a personalized study plan! 📚 Let me ask you a few questions to make it perfect for you.

First, how many study sessions would you like per week? And which subjects or classes should we focus on?"

User: "5 sessions, focus on Math, Chemistry, and English"
Flora: "Great choices! 🎯 

What time of day works best for you?
• Morning (8 AM - 12 PM)
• Afternoon (12 PM - 5 PM)  
• Evening (5 PM - 9 PM)

And how long should each session be? I typically recommend 45-90 minutes for focused studying."

User: "Evening, 60 minutes each"
Flora: "Perfect! Evening sessions for 60 minutes each. 🌙

When would you like to start? Should I schedule them for the next week?"

User: "Yes please!"
Flora: "CREATING_STUDY_PLAN
Sessions: 5
Subjects: Math, Chemistry, English, Math, Chemistry
Time: 18:00
Duration: 60
Start Date: tomorrow
END_PLAN

Perfect! I've created your personalized study plan with 5 sessions! 📅✨

Check your Calendar tab to see all your study sessions scheduled. You can edit or delete any session directly from the Calendar! 🌸"

The system will detect the CREATING_STUDY_PLAN block and automatically create the events. DO NOT mention this technical detail to the user.

CRITICAL FORMAT RULES:
• Time: Always use 24-hour format (18:00, not 6 PM)
• Duration: Always use MINUTES (60, 90, 120, etc., NOT hours like 1 or 1.5)
• Subjects: Comma-separated list that will cycle through sessions
• Start Date: Use "today", "tomorrow", "next week", or a specific date

${gradeContext}

${gradeContext ? 'The student has enabled grade access, so you can see their actual grades and provide personalized advice.' : 'The student has NOT enabled grade access yet. You can still help with general study advice, but suggest they enable "AI Grade Access" in Settings for personalized insights.'}

Remember: You're Flora, their supportive AI study buddy. Be warm, helpful, and motivating!`;

    const userPrompt = message;

    console.log("📤 Sending to OpenRouter with prompt...");
    console.log("System:", systemPrompt.substring(0, 100) + "...");
    console.log("User:", userPrompt);

    // Step 4: Try OpenRouter models
    console.log("📝 Step 4: Calling OpenRouter API...");
    
    const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
    
    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    // Try multiple free models in order of preference
    const models = [
      "meta-llama/llama-3.2-3b-instruct",
      "google/gemini-flash-1.5-8b",
      "mistralai/mistral-7b-instruct",
      "meta-llama/llama-3.1-8b-instruct",
    ];

    let lastError = null;

    for (const model of models) {
      console.log(`🔍 Trying model: ${model}`);
      
      const payload = {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      };

      try {
        const response = await fetch(openRouterUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://classmate-app.figma.com",
            "X-Title": "ClassMate AI"
          },
          body: JSON.stringify(payload),
        });

        console.log(`📥 Response status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ OpenRouter succeeded with ${model}!`);
          console.log(`📦 FULL RESPONSE:`, JSON.stringify(data, null, 2));

          // Extract AI response
          let aiResponse = "";
          
          if (data.choices && data.choices.length > 0) {
            const choice = data.choices[0];
            console.log(`📋 Choice structure:`, JSON.stringify(choice, null, 2));
            
            if (choice.message?.content) {
              aiResponse = choice.message.content.trim();
              console.log(`✅ Extracted text (${aiResponse.length} chars)`);
              console.log(`📝 EXTRACTED TEXT: "${aiResponse}"`);
            } else {
              console.log(`❌ No content found in choice`);
            }
          } else {
            console.log(`❌ No choices in response`);
          }

          // If extraction failed, use fallback
          if (!aiResponse) {
            console.log("⚠️ Extraction failed, using fallback response");
            aiResponse = "Hey there! 👋 I'm Flora, your study companion! I'm here to help you with academic advice, study tips, and grade insights. What's on your mind? 🌸";
          }

          // Detect if Flora wants to create calendar events
          let eventsCreated = 0;
          if (aiResponse.includes("CREATING_STUDY_PLAN")) {
            console.log("📅 Flora wants to create a study plan! Parsing details...");
            
            // Extract the plan details from Flora's response
            const planMatch = aiResponse.match(/CREATING_STUDY_PLAN\n([\s\S]*?)END_PLAN/);
            
            if (planMatch) {
              const planText = planMatch[1];
              console.log("📋 Plan text:", planText);
              
              // Parse the details
              const sessionsMatch = planText.match(/Sessions:\s*(\d+)/);
              const subjectsMatch = planText.match(/Subjects:\s*(.+)/);
              const timeMatch = planText.match(/Time:\s*(.+)/);
              const durationMatch = planText.match(/Duration:\s*(\d+)/);
              const startDateMatch = planText.match(/Start Date:\s*(.+)/);
              
              if (sessionsMatch && subjectsMatch && timeMatch && durationMatch && startDateMatch) {
                const sessionCount = parseInt(sessionsMatch[1]);
                const subjects = subjectsMatch[1].split(',').map(s => s.trim());
                const time = timeMatch[1].trim();
                const duration = parseInt(durationMatch[1]);
                const startDateText = startDateMatch[1].trim();
                
                console.log("✅ Parsed:", { sessionCount, subjects, time, duration, startDateText });
                
                // Calculate start date
                const today = new Date();
                let startDate = new Date(today);
                
                if (startDateText.toLowerCase() === "tomorrow") {
                  startDate.setDate(today.getDate() + 1);
                } else if (startDateText.toLowerCase() === "today") {
                  // Keep today
                } else if (startDateText.toLowerCase().includes("next week")) {
                  startDate.setDate(today.getDate() + 7);
                } else {
                  // Try to parse as date
                  const parsed = new Date(startDateText);
                  if (!isNaN(parsed.getTime())) {
                    startDate = parsed;
                  }
                }
                
                // Create events
                const events: any[] = [];
                for (let i = 0; i < sessionCount; i++) {
                  const eventDate = new Date(startDate);
                  eventDate.setDate(startDate.getDate() + i);
                  const dateStr = eventDate.toISOString().split('T')[0];
                  
                  const subject = subjects[i % subjects.length];
                  
                  const event = {
                    title: `Study: ${subject}`,
                    description: `Focused study session for ${subject}`,
                    date: dateStr,
                    time: time,
                    duration: duration,
                    topic: subject
                  };
                  
                  events.push(event);
                  
                  // Save to database
                  const eventId = `calendar_event_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                  const eventData = {
                    id: eventId,
                    ...event,
                    createdAt: new Date().toISOString(),
                  };
                  
                  await kv.set(eventId, eventData);
                  eventsCreated++;
                  
                  // Small delay to ensure unique IDs
                  await new Promise(resolve => setTimeout(resolve, 5));
                }
                
                console.log(`✅ Created ${eventsCreated} calendar events!`);
                
                // Remove the technical block from the response
                aiResponse = aiResponse.replace(/CREATING_STUDY_PLAN\n[\s\S]*?END_PLAN\n\n/, '');
              }
            }
          }

          // Return response
          console.log("📝 Sending response to client...");
          console.log(`🎉 ===== CHAT REQUEST COMPLETE =====\n`);

          return c.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
            success: true,
            model: model,
            eventsCreated: eventsCreated,
          });
        } else {
          const errorText = await response.text();
          lastError = `${model} failed (${response.status}): ${errorText}`;
          console.log(`   ❌ ${lastError}`);
        }
      } catch (e: any) {
        lastError = `${model} exception: ${e.message}`;
        console.log(`   ❌ ${lastError}`);
      }
    }

    // If all models failed
    console.log(`❌ All OpenRouter models failed. Last error: ${lastError}`);
    console.log(`🤖 Using local fallback AI...`);
    
    // Parse the error to check if it's rate limiting
    const isRateLimited = lastError && lastError.includes("429");
    
    // Smart local fallback - analyze the message and respond intelligently
    const messageLower = message.toLowerCase();
    let fallbackResponse = "";
    let studyPlanEvents = null;
    
    // Study plan creation
    if (messageLower.includes("study plan") || messageLower.includes("create schedule") || messageLower.includes("plan my week") || messageLower.includes("schedule study")) {
      fallbackResponse = "I'd love to help you create a personalized study plan! 📚 Let me ask you a few questions to make it perfect for you.\n\nFirst, how many study sessions would you like? And which subjects or classes should we focus on?";
    }
    // Study habits & strategies
    else if (messageLower.includes("study") || messageLower.includes("focus") || messageLower.includes("concentrate")) {
      fallbackResponse = "Hey! 👋 Here are some tried-and-true study strategies:\n\n📚 Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. Repeat!\n\n✍️ Active Recall: Test yourself instead of just re-reading notes. Write down what you remember without looking.\n\n🎯 Focus Environment: Find a quiet space, put your phone away, and use website blockers if needed.\n\nWhat subject are you studying for?";
    }
    // Grade analysis
    else if (messageLower.includes("grade") || messageLower.includes("gpa") || messageLower.includes("score")) {
      if (gradeData && gradeData.hasAccess) {
        fallbackResponse = `Looking at your grades! 📊\n\n🎯 Current GPA: ${gradeData.gpa} - You're doing great!\n\n⭐ Top Performance: ${gradeData.topClass.name} at ${gradeData.topClass.grade}% - keep up the amazing work!\n\n💪 Growth Opportunity: ${gradeData.lowestClass.name} at ${gradeData.lowestClass.grade}% - let's focus on bringing this up!\n\nQuick tip: Dedicate 30 extra minutes per week to ${gradeData.lowestClass.name}. Small, consistent effort makes a big difference! 🌸`;
      } else {
        fallbackResponse = "I'd love to help with your grades! 📊\n\nTo give you personalized insights, enable \"AI Grade Access\" in your Settings. Then I can analyze your GPA, identify areas for improvement, and suggest targeted study strategies!\n\nIn the meantime, what subject would you like general study tips for?";
      }
    }
    // Motivation & goals
    else if (messageLower.includes("motivat") || messageLower.includes("goal") || messageLower.includes("stress")) {
      fallbackResponse = "I hear you! 💙 School can be overwhelming, but you've got this!\n\n🌟 Remember: Progress > Perfection. Small improvements each day add up to big results.\n\n🎯 Set SMART Goals: Specific, Measurable, Achievable, Relevant, Time-bound. Like \"Study chemistry for 30 min daily this week.\"\n\n🧘 Self-Care Matters: Take breaks, sleep 7-8 hours, and don't forget to have fun! Burnt-out students don't learn well.\n\nWhat's one small goal you can set for this week?";
    }
    // Time management
    else if (messageLower.includes("time") || messageLower.includes("schedul") || messageLower.includes("procrastinat")) {
      fallbackResponse = "Time management is KEY! ⏰ Here's what works:\n\n📅 Time Blocking: Dedicate specific hours to specific subjects. Treat study time like appointments you can't miss.\n\n🎯 Priority Matrix: Do urgent+important tasks first, schedule important-but-not-urgent tasks, and minimize the rest.\n\n⚡ Beat Procrastination: Use the \"2-minute rule\" - if it takes less than 2 minutes, do it NOW. For bigger tasks, commit to just 5 minutes to build momentum!\n\nWhat's the biggest time-waster in your day?";
    }
    // Subject-specific help
    else if (messageLower.includes("math") || messageLower.includes("calculus") || messageLower.includes("algebra")) {
      fallbackResponse = "Math tips! 🔢\n\n✏️ Practice, Practice, Practice: Do problems until patterns click. Math is a skill that builds with repetition.\n\n🎯 Show Your Work: Even if it's tedious, writing steps helps you catch mistakes and understand the process.\n\n💡 Khan Academy & YouTube: Free resources that explain concepts in different ways until one clicks!\n\n🤝 Study Groups: Explaining problems to others solidifies your own understanding.\n\nWhat math topic are you working on?";
    }
    else if (messageLower.includes("english") || messageLower.includes("writing") || messageLower.includes("essay")) {
      fallbackResponse = "Writing excellence! ✍️\n\n📝 Outline First: Spend 10 minutes planning before writing. It saves time and makes better essays.\n\n🎯 Strong Thesis: Every paragraph should support your main argument. Stay focused!\n\n📚 Read Actively: Annotate, highlight, ask questions as you read. Engaged reading = better comprehension.\n\n✨ Revise Ruthlessly: First draft is for getting ideas down. Second draft is where magic happens!\n\nWhat are you writing about?";
    }
    else if (messageLower.includes("science") || messageLower.includes("biology") || messageLower.includes("chemistry") || messageLower.includes("physics")) {
      fallbackResponse = "Science success! 🔬\n\n🎯 Understand, Don't Memorize: Focus on WHY things work, not just WHAT happens. Concepts stick better than facts.\n\n📊 Visual Learning: Draw diagrams, watch animations, use flashcards with images. Science is visual!\n\n🔄 Connect to Real Life: How does this apply to the world around you? Real-world connections make abstract concepts concrete.\n\n💡 Lab Work Matters: Pay attention in labs - hands-on experience cements theoretical knowledge!\n\nWhich science are you studying?";
    }
    // Test prep
    else if (messageLower.includes("test") || messageLower.includes("exam") || messageLower.includes("quiz")) {
      fallbackResponse = "Test prep mode! 📝\n\n🎯 Start Early: Cramming = stressed brain that forgets quickly. Space out studying over several days.\n\n✅ Practice Tests: Do old quizzes/practice problems under timed conditions. This builds confidence!\n\n📚 Study Groups: Quiz each other, explain concepts, fill knowledge gaps together.\n\n😴 Sleep Before: All-nighters hurt more than help. Well-rested brains recall better!\n\n🍎 Test Day: Eat breakfast, arrive early, breathe deeply. You've got this!\n\nWhen's your test?";
    }
    // Greetings
    else if (messageLower.includes("hello") || messageLower.includes("hi ") || messageLower.includes("hey")) {
      fallbackResponse = "Hey there! 👋 I'm Flora, your AI study companion! 🌸\n\nI'm here to help you with:\n• Study strategies & time management ⏰\n• Grade analysis & GPA insights 📊\n• Motivation & goal setting 🎯\n• Subject-specific tips 📚\n• Test prep & exam strategies 📝\n\nWhat can I help you with today?";
    }
    // Default helpful response
    else {
      fallbackResponse = "Hey! I'm Flora 🌸\n\nI'm currently running on local mode (OpenRouter is temporarily unavailable), but I can still help!\n\nI can give you advice on:\n• 📚 Study habits & strategies\n• 📊 Grade analysis (enable in Settings!)\n• 🎯 Goal setting & motivation\n• ⏰ Time management\n• 📝 Test preparation\n• ✍️ Subject-specific tips\n\nWhat would you like to know about?";
    }
    
    console.log(`✅ Generated fallback response (${fallbackResponse.length} chars)`);
    console.log(`🎉 ===== CHAT REQUEST COMPLETE (FALLBACK) =====\n`);

    return c.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      success: true,
      model: "local-fallback",
      usingFallback: true,
      studyPlanEvents: studyPlanEvents
    });

  } catch (error: any) {
    console.log("❌ ===== CHAT REQUEST FAILED =====");
    console.log("   Error:", error.message);
    console.log("   Stack:", error.stack);
    console.log("================================\n");
    
    return c.json({
      error: error.message,
      response: "Hi! I'm Flora 🌸 I'm having a little trouble right now. Try asking me about study strategies, time management, or how to improve your grades! 📚",
      stack: error.stack,
    }, 500);
  }
});

// ========================================
// CALENDAR ROUTES
// ========================================

app.get("/make-server-9a43014a/calendar/events", async (c) => {
  try {
    const events = await kv.getByPrefix("calendar_event_");
    return c.json({ events: events || [] });
  } catch (error: any) {
    console.error("Error fetching calendar events:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9a43014a/calendar/events", async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, date, time, duration, topic } = body;

    const eventId = `calendar_event_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const event = {
      id: eventId,
      title,
      description,
      date,
      time,
      duration,
      topic,
      createdAt: new Date().toISOString(),
    };

    await kv.set(eventId, event);
    return c.json(event);
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-9a43014a/calendar/events/:id", async (c) => {
  try {
    const eventId = c.req.param("id");
    await kv.del(eventId);
    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting calendar event:", error);
    return c.json({ error: error.message }, 500);
  }
});

// ========================================
// AI CHAT HISTORY
// ========================================

app.get("/make-server-9a43014a/ai/history", async (c) => {
  try {
    const history = await kv.get("ai_chat_history");
    return c.json({ history: history || [] });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9a43014a/ai/history", async (c) => {
  try {
    const { message, response } = await c.req.json();
    
    const history = (await kv.get("ai_chat_history")) || [];
    
    history.push({
      id: `msg_${Date.now()}`,
      userMessage: message,
      aiResponse: response,
      timestamp: new Date().toISOString(),
    });

    const trimmedHistory = history.slice(-50);
    
    await kv.set("ai_chat_history", trimmedHistory);
    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error saving chat history:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-9a43014a/ai/history", async (c) => {
  try {
    await kv.set("ai_chat_history", []);
    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error clearing chat history:", error);
    return c.json({ error: error.message }, 500);
  }
});

console.log("🚀 Server starting...");
console.log("🔑 Checking for OpenRouter API key...");
const apiKey = Deno.env.get("OPENROUTER_API_KEY");
if (apiKey) {
  console.log(`✅ OpenRouter API key found: ${apiKey.substring(0, 15)}...`);
} else {
  console.log("⚠️ WARNING: OpenRouter API key not found!");
}

Deno.serve(app.fetch);