import { useStore } from "@/context/store";
import { defaultBasket } from "@/data/products";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BasketItem = {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
};

export default function App() {
  const insets = useSafeAreaInsets();
  const { currentStore } = useStore();
  const [basket, setBasket] = useState<BasketItem[]>([]);

  // Estados para el producto nuevo
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    loadData(currentStore);
  }, [currentStore]);

  const loadData = async (store: string): Promise<void> => {
    try {
      const savedData = await AsyncStorage.getItem(`@list_${store}`);
      if (savedData) {
        setBasket(JSON.parse(savedData) as BasketItem[]);
      } else {
        setBasket([...defaultBasket]);
      }
    } catch (e) {
      console.error("Error cargando datos", e);
    }
  };

  const saveData = async (
    store: string,
    newBasket: BasketItem[],
  ): Promise<void> => {
    setBasket(newBasket);
    try {
      await AsyncStorage.setItem(`@list_${store}`, JSON.stringify(newBasket));
    } catch (e) {
      console.error("Error guardando datos", e);
    }
  };

  const updateQuantity = (id: string, delta: number): void => {
    const newBasket = basket.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveData(currentStore, newBasket);
  };

  const updatePrice = (id: string, newPrice: string): void => {
    const newBasket = basket.map((item) => {
      if (item.id === id) {
        return { ...item, basePrice: parseFloat(newPrice) || 0 };
      }
      return item;
    });
    saveData(currentStore, newBasket);
  };

  // Función para agregar un producto personalizado
  const addCustomProduct = () => {
    if (newProductName.trim() === "") return; // No agregar si está vacío

    const newItem = {
      id: Date.now().toString(), // Genera un ID único basado en la fecha
      name: newProductName.trim(),
      basePrice: parseFloat(newProductPrice) || 0,
      quantity: 1, // Por defecto le ponemos 1 al agregarlo
    };

    const newBasket = [...basket, newItem];
    saveData(currentStore, newBasket);

    // Limpiar los campos después de agregar
    setNewProductName("");
    setNewProductPrice("");
  };

  const total = basket.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0,
  );

  // Componente que renderiza la opción de añadir producto al final de la lista
  const renderAddProductSection = () => (
    <View style={styles.addProductContainer}>
      <Text style={styles.addTitle}>¿Falta algo? Agrégalo aquí:</Text>
      <View style={styles.addInputsRow}>
        <TextInput
          style={[styles.input, styles.inputName]}
          placeholder="Nombre del producto"
          value={newProductName}
          onChangeText={setNewProductName}
        />
        <TextInput
          style={[styles.input, styles.inputPrice]}
          placeholder="$ Precio"
          keyboardType="numeric"
          value={newProductPrice}
          onChangeText={setNewProductPrice}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addCustomProduct}>
        <Text style={styles.addButtonText}>+ Agregar a la lista</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Text style={styles.header}>Hola, Usuario* 👋</Text>

        {/* Lista de Productos */}
        <FlatList
          data={basket}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }} // Espacio para que no lo tape el footer
          ListFooterComponent={renderAddProductSection} // Aquí inyectamos el formulario para nuevos productos
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>

              <View style={styles.row}>
                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.btnMath}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.btnMathText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.btnMath}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.btnMathText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    value={String(item.basePrice)}
                    onChangeText={(text) => updatePrice(item.id, text)}
                  />
                </View>
              </View>
            </View>
          )}
        />

        {/* Footer Fijo con el Total */}
        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total aproximado:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 50,
    color: "#1a1a1a",
  },
  storeSelectorContainer: { height: 60, marginTop: 15, paddingLeft: 20 },
  storeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#e0e5ec",
    marginRight: 10,
    justifyContent: "center",
  },
  storeButtonActive: { backgroundColor: "#007AFF" },
  storeButtonText: { color: "#4a4a4a", fontWeight: "600" },
  storeButtonTextActive: { color: "#ffffff" },
  storeTitle: {
    fontSize: 18,
    color: "#666",
    marginHorizontal: 20,
    marginBottom: 15,
    fontWeight: "600",
  },
  productCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 5,
  },
  btnMath: { paddingHorizontal: 15, paddingVertical: 5 },
  btnMathText: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    width: 25,
    textAlign: "center",
  },
  priceContainer: { flexDirection: "row", alignItems: "center" },
  currencySymbol: { fontSize: 16, color: "#666", marginRight: 5 },
  priceInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 80,
    textAlign: "right",
    fontSize: 16,
  },

  // Estilos nuevos para agregar productos
  addProductContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d2e3fc",
  },
  addTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1967d2",
    marginBottom: 10,
  },
  addInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputName: { flex: 2, marginRight: 10 },
  inputPrice: { flex: 1, textAlign: "center" },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  totalLabel: { fontSize: 18, color: "#666" },
  totalAmount: { fontSize: 24, fontWeight: "bold", color: "#007AFF" },
});
