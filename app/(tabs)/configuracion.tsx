import { useStore } from "@/context/store";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const stores = ["Walmart", "Aurrerá", "Costco", "Sams", "3B"];

export default function Configuracion() {
  const { currentStore, setCurrentStore } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      <Text style={styles.sectionTitle}>Selecciona tu tienda</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stores.map((store) => (
          <TouchableOpacity
            key={store}
            style={[
              styles.storeButton,
              currentStore === store && styles.storeButtonActive,
            ]}
            onPress={() => setCurrentStore(store)}
          >
            <Text
              style={[
                styles.storeText,
                currentStore === store && styles.storeTextActive,
              ]}
            >
              {store}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Tienda actual: <Text style={styles.bold}>{currentStore}</Text>
        </Text>
        <Text style={styles.subText}>
          La lista y precios cambiarán según la tienda seleccionada.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#555",
    fontWeight: "600",
  },
  storeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#e0e5ec",
    marginRight: 10,
  },
  storeButtonActive: {
    backgroundColor: "#007AFF",
  },
  storeText: {
    color: "#4a4a4a",
    fontWeight: "600",
  },
  storeTextActive: {
    color: "#ffffff",
  },
  infoBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d2e3fc",
  },
  infoText: {
    fontSize: 16,
    color: "#1967d2",
  },
  bold: {
    fontWeight: "bold",
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});
