import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  DismissKeyboardView,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Product, StoreLists } from './src/types';
import { STORES, getDefaultStoreLists } from './src/defaults';

const STORAGE_KEY = '@super_lists_v1';
const NAME_KEY = '@user_name';

export default function App() {
  const [userName, setUserName] = useState<string>('Cristian');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [activeStore, setActiveStore] = useState<string>('Walmart');
  const [lists, setLists] = useState<StoreLists>(getDefaultStoreLists());
  
  // Estados para agregar nuevos productos
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');

  // Cargar datos guardados al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedName = await AsyncStorage.getItem(NAME_KEY);
      if (savedName) setUserName(savedName);

      const savedLists = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Guardar lista activa permanentemente
  const saveCurrentList = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
      Alert.alert('¡Éxito!', `La lista de ${activeStore} se ha guardado correctamente.`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la lista.');
    }
  };

  const saveName = async (name: string) => {
    try {
      await AsyncStorage.setItem(NAME_KEY, name);
      setIsEditingName(false);
    } catch (error) {
      console.error('Error al guardar el nombre:', error);
    }
  };

  // Controladores de productos
  const updateQuantity = (id: string, delta: number) => {
    setLists(prevLists => {
      const currentList = prevLists[activeStore].map(product => {
        if (product.id === id) {
          const newQty = Math.max(0, product.quantity + delta);
          return { ...product, quantity: newQty };
        }
        return product;
      });
      return { ...prevLists, [activeStore]: currentList };
    });
  };

  const updatePrice = (id: string, value: string) => {
    // Validar y limpiar la entrada a formato decimal
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const numericPrice = parseFloat(cleanedValue) || 0;

    setLists(prevLists => {
      const currentList = prevLists[activeStore].map(product => {
        if (product.id === id) {
          return { ...product, priceStr: cleanedValue, price: numericPrice };
        }
        return product;
      });
      return { ...prevLists, [activeStore]: currentList };
    });
  };

  const deleteProduct = (id: string) => {
    setLists(prevLists => ({
      ...prevLists,
      [activeStore]: prevLists[activeStore].filter(product => product.id !== id),
    }));
  };

  const addProduct = () => {
    if (!newProductName.trim()) {
      Alert.alert('Aviso', 'Ingresa el nombre del producto.');
      return;
    }

    const priceNum = parseFloat(newProductPrice) || 0;
    const newProduct: Product = {
      id: Date.now().toString(),
      name: newProductName.trim(),
      priceStr: newProductPrice ? priceNum.toString() : '0',
      price: priceNum,
      quantity: 1,
    };

    setLists(prevLists => ({
      ...prevLists,
      [activeStore]: [newProduct, ...prevLists[activeStore]],
    }));

    setNewProductName('');
    setNewProductPrice('');
    Keyboard.dismiss();
  };

  // Calcular el total de la lista actual
  const currentStoreList = lists[activeStore] || [];
  const totalPrice = currentStoreList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const activeStoreColor = STORES.find(s => s.name === activeStore)?.color || '#000';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Encabezado y Saludo */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hola, </Text>
          {isEditingName ? (
            <TextInput
              style={styles.nameInput}
              value={userName}
              onChangeText={setUserName}
              onBlur={() => saveName(userName)}
              onSubmitEditing={() => saveName(userName)}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingName(true)}>
              <Text style={styles.userNameText}>{userName} ✎</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>Gestiona tu canasta por sucursal</Text>
      </View>

      {/* Selector de Sucursales */}
      <View style={styles.storesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STORES}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.storesContainer}
          renderItem={({ item }) => {
            const isActive = item.name === activeStore;
            return (
              <TouchableOpacity
                style={[
                  styles.storeBadge,
                  isActive && { backgroundColor: item.color, borderColor: item.color },
                ]}
                onPress={() => setActiveStore(item.name)}
              >
                <Text style={[styles.storeText, isActive && styles.storeTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Formulario rápido para agregar producto */}
      <View style={styles.addFormContainer}>
        <TextInput
          style={[styles.input, styles.flex2]}
          placeholder="Nuevo producto..."
          placeholderTextColor="#888"
          value={newProductName}
          onChangeText={setNewProductName}
        />
        <TextInput
          style={[styles.input, styles.flex1]}
          placeholder="$ Precio"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={newProductPrice}
          onChangeText={setNewProductPrice}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: activeStoreColor }]} 
          onPress={addProduct}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de Productos */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.listContainer}
      >
        <FlatList
          data={currentStoreList}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* Izquierda: Información y Precio Editable */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.priceEditContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    value={item.priceStr}
                    onChangeText={val => updatePrice(item.id, val)}
                  />
                  <Text style={styles.unitText}> c/u</Text>
                </View>
              </View>

              {/* Derecha: Controles de Cantidad y Eliminar */}
              <View style={styles.controlsContainer}>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={16} color="#333" />
                  </TouchableOpacity>
                  
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={16} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Subtotal del item */}
                <Text style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteProduct(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos en esta lista. ¡Agrega algunos arriba!</Text>
          }
        />
      </KeyboardAvoidingView>

      {/* Pie de página: Total y Botón de Guardado */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Estimado:</Text>
          <Text style={[styles.totalAmount, { color: activeStoreColor }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: activeStoreColor }]}
          onPress={saveCurrentList}
        >
          <Ionicons name="save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Guardar Lista de {activeStore}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 15,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  userNameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  nameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    padding: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  storesWrapper: {
    height: 50,
  },
  storesContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  storeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    height: 38,
    justifyContent: 'center',
  },
  storeText: {
    fontWeight: '600',
    color: '#666',
  },
  storeTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addFormContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: '#333',
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  priceEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  priceInput: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    minWidth: 50,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  unitText: {
    fontSize: 13,
    color: '#888',
  },
  controlsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    padding: 2,
    marginBottom: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  qtyText: {
    marginHorizontal: 12,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    paddingTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 15,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});