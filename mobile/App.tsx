import "react-native-gesture-handler";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { colors } from "@/theme/colors";
import { MainTabParamList, RootStackParamList, AuthStackParamList } from "@/types/navigation";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { SignupScreen } from "@/screens/auth/SignupScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { GradesScreen } from "@/screens/GradesScreen";
import { GPAScreen } from "@/screens/GPAScreen";
import { AnalyticsScreen } from "@/screens/AnalyticsScreen";
import { CalendarScreen } from "@/screens/CalendarScreen";
import { AIScreen } from "@/screens/AIScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { ClassDetailScreen } from "@/screens/ClassDetailScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? "home" : "home-outline",
            Grades: focused ? "school" : "school-outline",
            GPA: focused ? "trending-up" : "trending-up-outline",
            Analytics: focused ? "stats-chart" : "stats-chart-outline",
            Calendar: focused ? "calendar" : "calendar-outline",
            AI: focused ? "sparkles" : "sparkles-outline",
            Settings: focused ? "settings" : "settings-outline",
          };
          return <Ionicons name={iconMap[route.name as keyof MainTabParamList]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Grades" component={GradesScreen} />
      <Tab.Screen name="GPA" component={GPAScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loaderText}>Loading ClassMate...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElevated },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <RootStack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <RootStack.Screen name="ClassDetail" component={ClassDetailScreen} options={{ title: "Class Detail" }} />
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    gap: 10,
  },
  loaderText: {
    color: colors.textSecondary,
  },
});
