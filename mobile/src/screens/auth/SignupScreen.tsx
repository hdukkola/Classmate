import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/types/navigation";
import { colors } from "@/theme/colors";
import { useAuth } from "@/contexts/AuthContext";
import { classmateLogoDataUri } from "@/assets/logo";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    if (!result.ok) setError(result.error ?? "Signup failed");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: classmateLogoDataUri }} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor={colors.textSecondary} style={styles.input} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.textSecondary} autoCapitalize="none" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.textSecondary} secureTextEntry style={styles.input} />
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" placeholderTextColor={colors.textSecondary} secureTextEntry style={styles.input} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={onSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: 24, gap: 12 },
  logo: { width: 84, height: 84, alignSelf: "center", marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "800", color: colors.textPrimary, textAlign: "center", marginBottom: 8 },
  input: { backgroundColor: colors.bgElevated, borderColor: colors.border, borderWidth: 1, borderRadius: 12, color: colors.textPrimary, paddingHorizontal: 14, paddingVertical: 12 },
  error: { color: colors.danger, fontSize: 13 },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "white", fontWeight: "700" },
  link: { color: colors.info, textAlign: "center", marginTop: 8 },
});
