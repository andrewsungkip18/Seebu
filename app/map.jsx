import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const MapScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // restore any passed text fields so they are returned back to create
  const paramSpotName = params.spotName || "";
  const paramCategory = params.category || "";
  const paramDescription = params.description || "";

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleConfirm = () => {
    if (!selectedLocation) return;

    // use router.replace to avoid stacking a new Create instance
    router.replace({
      pathname: "/goals/create",
      params: {
        // use consistent keys (strings)
        latitude: String(selectedLocation.latitude),
        longitude: String(selectedLocation.longitude),
        // pass back current form text so Create can restore them
        spotName: paramSpotName,
        category: paramCategory,
        description: paramDescription,
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.3157, // Cebu default
          longitude: 123.8854,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Spot" />
        )}
      </MapView>

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>
        <Text style={styles.infoText}>
          {selectedLocation
            ? `📍 Lat: ${selectedLocation.latitude.toFixed(
                4
              )}, Lng: ${selectedLocation.longitude.toFixed(4)}`
            : "Tap on the map to drop a pin"}
        </Text>

        <Pressable
          style={[
            styles.button,
            !selectedLocation && { backgroundColor: "#CBD5E1" },
          ]}
          disabled={!selectedLocation}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Confirm Location</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "#B91C1C" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
  },
  infoText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
