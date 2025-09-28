import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditDelivery = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [spotName, setSpotName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch spot data
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSpotName(data.spotName || "");
          setCategory(data.category || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
        }
      } catch (error) {
        console.log("Error fetching spot:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [id]);

  const handleUpdate = async () => {
    if (!spotName.trim() || !location.trim()) {
      alert("Please enter Spot Name and Location.");
      return;
    }

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        spotName,
        category,
        location,
        description,
        updatedAt: new Date(),
      });

      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating spot:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6A88" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FDFCFB", "#E2EBF0", "#C9E4DE"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>✏️ Edit Spot</Text>
          <Text style={styles.subtitle}>Update your Cebu gem 🏝️</Text>

          <BlurView intensity={80} tint="light" style={styles.card}>
            {/* Spot Name */}
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Spot Name"
                value={spotName}
                onChangeText={setSpotName}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Category */}
            <View style={styles.inputWrapper}>
              <Ionicons name="grid-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Category (Beach, Historical...)"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Location */}
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Description */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Tell us more about this spot..."
                value={description}
                onChangeText={setDescription}
                multiline
                placeholderTextColor="#94A3B8"
              />
            </View>
          </BlurView>

          {/* Save Button */}
          <Pressable onPress={handleUpdate} style={styles.button}>
            <LinearGradient
              colors={["#FF9A8B", "#FF6A88", "#FF99AC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditDelivery;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#475569",
    marginBottom: 24,
  },
  card: {
    borderRadius: 6,
    padding: 20,
    marginBottom: 30,
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.0,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    color: "#0F172A",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF6A88",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFCFB",
  },
});
