import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { Screen } from "@/components/Screen";
import { colors } from "@/theme/colors";
import { classmateLogoDataUri } from "@/assets/logo";
import { publicAnonKey, projectId } from "@/config/supabase";
import { getItem } from "@/storage/storage";
import { calculateGPA, classes } from "@/data/mockData";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage() {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText("");
    setSending(true);
    setMessages((prev) => [...prev, { id: String(Date.now()), role: "user", content }]);

    try {
      const hasGradeAccess = (await getItem("aiGradeAccess")) === "true";
      const gradeData = hasGradeAccess
        ? {
            hasAccess: true,
            gpa: calculateGPA(classes).toFixed(2),
            classes: classes.map((c) => ({ name: c.name, grade: c.grade })),
          }
        : null;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9a43014a/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ message: content, gradeData }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: data.response || "No response." }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Image source={{ uri: classmateLogoDataUri }} style={styles.logo} />
        <View>
          <Text style={styles.title}>Flora AI</Text>
          <Text style={styles.subtitle}>Online</Text>
        </View>
      </View>

      <View style={styles.card}>
        {messages.length === 0 ? (
          <Text style={styles.empty}>Ask Flora about study strategies, grades, and planning.</Text>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.aiBubble]}>
              {message.role === "assistant" ? (
                <Markdown style={{ body: { color: colors.textPrimary } }}>{message.content}</Markdown>
              ) : (
                <Text style={styles.userText}>{message.content}</Text>
              )}
            </View>
          ))
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ask Flora anything..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          onSubmitEditing={sendMessage}
        />
        <Pressable style={[styles.sendButton, !text.trim() && { opacity: 0.6 }]} onPress={sendMessage}>
          <Text style={styles.sendText}>{sending ? "..." : "Send"}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  logo: { width: 38, height: 38 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 12 },
  card: { backgroundColor: colors.bgElevated, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 12, minHeight: 280, gap: 8 },
  empty: { color: colors.textSecondary },
  bubble: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  userBubble: { backgroundColor: colors.primary, alignSelf: "flex-end", maxWidth: "90%" },
  aiBubble: { backgroundColor: colors.bgSoft, alignSelf: "flex-start", maxWidth: "95%", borderColor: colors.border, borderWidth: 1 },
  userText: { color: "white" },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: { flex: 1, backgroundColor: colors.bgElevated, borderColor: colors.border, borderWidth: 1, borderRadius: 12, color: colors.textPrimary, paddingHorizontal: 12, paddingVertical: 10 },
  sendButton: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: "white", fontWeight: "700" },
});
