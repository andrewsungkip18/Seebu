import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; // ✅ expo-location for reverse geocoding

const Detail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null); // ✅ for human-readable address

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "goals", id), (docSnap) => {
      if (docSnap.exists()) {
        setSpot({ id: docSnap.id, ...docSnap.data() });
      } else {
        setSpot(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  // ✅ fetch human-readable address from coords
 useEffect(() => {
  const fetchAddress = async () => {
    if (spot?.coords) {
      try {
        // ✅ Ask permission first
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        // ✅ Now safe to reverse geocode
        const results = await Location.reverseGeocodeAsync({
          latitude: spot.coords.latitude,
          longitude: spot.coords.longitude,
        });

        if (results.length > 0) {
          const place = results[0];
          const formatted = `${place.name || ""} ${place.street || ""}, ${
            place.city || place.subregion || ""
          }, ${place.region || ""}, ${place.country || ""}`;
          setAddress(formatted.trim());
        }
      } catch (err) {
        console.log("Error getting address:", err);
      }
    }
  };

  fetchAddress();
}, [spot]);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Spot not found</Text>
      </View>
    );
  }

  const sections = [
    { label: "Category", value: spot.category || "N/A", icon: "grid-outline" },
    {
      label: "Description",
      value: spot.description || "N/A",
      icon: "document-text-outline",
    },
  ];

  return (
    <LinearGradient
      colors={["#FDFCFB", "#E2EBF0", "#C9E4DE"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>{spot.spotName}</Text>
        <Text style={styles.subtitle}>Discover the beauty of Cebu ✨</Text>

        {/* Info Card */}
        <BlurView intensity={80} tint="light" style={styles.card}>
          {sections.map((sec, index) => (
            <View key={index} style={styles.infoRow}>
              <Ionicons name={sec.icon} size={20} color="#64748B" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>{sec.label}</Text>
                <Text style={styles.value}>{sec.value}</Text>
              </View>
            </View>
          ))}

          {/* Location Section */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#64748B" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Location</Text>
              

              {address && (
                <Text
                  style={[styles.value, { marginTop: 4, fontStyle: "italic" }]}
                >
                  📍 {address}
                </Text>
              )}

              {spot.coords && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: spot.coords.latitude,
                    longitude: spot.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={spot.coords} title={spot.spotName} />
                </MapView>
              )}
            </View>
          </View>
        </BlurView>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => router.push(`/goals/edit/${spot.id}`)}
            style={styles.button}
          >
            <LinearGradient
              colors={["#60A5FA", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Edit</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.button}>
            <LinearGradient
              colors={["#F87171", "#EF4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons name="arrow-back-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Back</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Detail;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#475569",
    marginBottom: 24,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    backgroundColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.0,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#1E293B",
  },
  map: {
    marginTop: 12,
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
