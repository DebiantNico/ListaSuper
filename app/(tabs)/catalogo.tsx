import { useStore } from "@/context/store";
import { defaultBasket } from "@/data/products";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Catalogo() {
  const { currentStore } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo</Text>
      <Text style={styles.subtitle}>Precios base en {currentStore}</Text>

      <FlatList
        data={defaultBasket}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.basePrice.toFixed(2)}</Text>
          </View>
        )}
      />
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
    marginBottom: 10,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    marginTop: 5,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
