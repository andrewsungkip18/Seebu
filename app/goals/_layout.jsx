import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GoalsProvider } from "../../contexts/GoalsContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6A88" />
      </View>
    );
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -4, // bring text closer to icon
            fontWeight: "600",
          },
          tabBarActiveTintColor: "#FF6A88",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            borderRadius: 24,
            height: 70,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            overflow: "hidden",
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 6,
          },
          tabBarIconStyle: {
            marginBottom: -2, // fixes icon centering
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint="light"
              style={{
                flex: 1,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["#FDFCFB", "#E2EBF0", "#C9E4DE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </BlurView>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Spots",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Add",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="edit/[id]"
          options={{
            href: null, // hidden tab
          }}
        />
        <Tabs.Screen
          name="[id]"
          options={{
            href: null, // hidden tab
          }}
        />
      </Tabs>
    </GoalsProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
