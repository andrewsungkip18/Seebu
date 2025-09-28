import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useGoals } from "../../hooks/useGoals";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth } from "../../firebaseConfig";
import MapView, { Marker } from "react-native-maps";

const Create = () => {
  const [spotName, setSpotName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [description, setDescription] = useState("");

  const { createGoal } = useGoals();
  const router = useRouter();
  const params = useLocalSearchParams();

  const { latitude, longitude, spotName: pSpot, category: pCat, description: pDesc } = params;

  useEffect(() => {
    if (pSpot !== undefined) setSpotName(pSpot);
    if (pCat !== undefined) setCategory(pCat);
    if (pDesc !== undefined) setDescription(pDesc);

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      setCoords({ latitude: lat, longitude: lng });

      const fetchLocation = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setLocation(data?.display_name || `${lat}, ${lng}`);
        } catch {
          setLocation(`${lat}, ${lng}`);
        }
      };
      fetchLocation();
    }
  }, [latitude, longitude, pSpot, pCat, pDesc]);

  const handleSubmit = async () => {
    if (!spotName.trim()) {
      alert("Please enter a spot name");
      return;
    }
    if (!coords) {
      alert("Please pick a location on the map");
      return;
    }

    await createGoal({
      spotName,
      category,
      location,
      coords,
      description,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setSpotName("");
    setCategory("");
    setLocation("");
    setCoords(null);
    setDescription("");

    Keyboard.dismiss();
    router.push("/goals");
  };

  return (
    <LinearGradient colors={["#FDFCFB", "#E2EBF0", "#C9E4DE"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🌴 Add a New Spot</Text>
          <Text style={styles.subtitle}>Share Cebu’s hidden gems with the world 🌊</Text>

          <BlurView intensity={80} tint="light" style={styles.card}>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Spot Name (e.g., Magellan’s Cross)"
                value={spotName}
                onChangeText={setSpotName}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="grid-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Category (Beach, Historical, Nature...)"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Location (pick from map or type manually)"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/map",
                  params: { spotName, category, description },
                })
              }
              style={styles.mapButton}
            >
              <Ionicons name="map-outline" size={20} color="#2563EB" />
              <Text style={styles.mapButtonText}>Pick on Map</Text>
            </Pressable>

            {coords && (
              <MapView
                style={styles.mapPreview}
                initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={coords} title={spotName || "Pinned Spot"} />
              </MapView>
            )}

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
        </ScrollView>

        {/* Floating Save Button */}
        <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.floatingButton, pressed && { transform: [{ scale: 0.95 }] }]}>
          <LinearGradient
            colors={["#FF9A8B", "#FF6A88", "#FF99AC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Save Spot</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Create;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 150 }, // space for floating button
  title: { fontSize: 30, fontWeight: "800", color: "#1E293B", textAlign: "center", marginBottom: 6, marginTop: 10 },
  subtitle: { fontSize: 15, textAlign: "center", color: "#475569", marginBottom: 24 },
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
  input: { flex: 1, fontSize: 15, marginLeft: 8, color: "#0F172A" },
  textarea: { height: 100, textAlignVertical: "top" },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#EFF6FF",
  },
  mapButtonText: { marginLeft: 8, color: "#2563EB", fontSize: 15, fontWeight: "600" },
  mapPreview: {
    width: Dimensions.get("window").width - 60,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    marginBottom: 70,
    right: 20,
    width: 140,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#FF6A88",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonGradient: { paddingVertical: 16, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },
});
