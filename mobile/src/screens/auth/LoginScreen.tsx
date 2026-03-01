import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/types/navigation";
import { colors } from "@/theme/colors";
import { useAuth } from "@/contexts/AuthContext";
import { classmateLogoDataUri } from "@/assets/logo";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
    setLoading(true);
    setError("");
    const result = await login(email.trim(), password);
    if (!result.ok) setError(result.error ?? "Login failed");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: classmateLogoDataUri }} style={styles.logo} />
      <Text style={styles.title}>ClassMate</Text>
      <Text style={styles.subtitle}>Your AI-Powered Study Companion</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        style={styles.input}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>No account? Create one</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  logo: { width: 84, height: 84, alignSelf: "center", marginBottom: 8 },
  title: { fontSize: 34, fontWeight: "800", color: colors.textPrimary, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 12 },
  input: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: { color: colors.danger, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "white", fontWeight: "700" },
  link: { color: colors.info, textAlign: "center", marginTop: 8 },
});
