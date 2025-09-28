import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

const SpotsList = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSpots(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "goals", id);
      await deleteDoc(docRef);
      console.log("Spot deleted:", id);
    } catch (error) {
      console.log("Error deleting spot:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.spotCard}
      onPress={() => router.push(`/goals/${item.id}`)}
    >
      <LinearGradient
        colors={["#FF9A8B", "#FF6A88", "#FF99AC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <Text style={styles.spotName}>{item.spotName || "Unnamed Spot"}</Text>
        <Text style={styles.category}>{item.category || "Uncategorized"}</Text>
        <Text style={styles.location}>{item.location}</Text>

        <Pressable
          onPress={() => setSelectedSpot(item)}
          style={styles.dotsBtn}
        >
          <Text style={styles.dots}>⋮</Text>
        </Pressable>
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#FDFCFB", "#E2EBF0", "#C9E4DE"]}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🏝️ Cebu Tourist Spots</Text>

        {/* Floating Logout Button */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={async () => {
            try {
              await signOut(auth);
              router.replace("/auth/login");
            } catch (err) {
              console.log("Logout error:", err);
            }
          }}
        >
          <LinearGradient
            colors={["#FF6A88", "#FF9A76"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="log-out-outline" size={24} color="white" />
        </Pressable>

        <FlatList
          data={spots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No spots added yet.</Text>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* Options Modal */}
        <Modal
          visible={!!selectedSpot}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedSpot(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setSelectedSpot(null)}
          >
            <View style={styles.modalContent}>
             

              <Pressable
                style={styles.modalItem}
                onPress={() => {
                  handleDelete(selectedSpot.id);
                  setSelectedSpot(null);
                }}
              >
                <Text style={[styles.modalText, { color: "#EF4444" }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SpotsList;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "800",
    color: "#1E293B",
  },
  spotCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    position: "relative",
  },
  spotName: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  dotsBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
  },
  dots: {
    fontSize: 20,
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
    fontStyle: "italic",
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  logoutBtn: {
    position: "absolute",
    bottom: 5,
    marginBottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6A88",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 10,
  },
});
