// app/(tabs)/MenuScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useRestaurant } from "../../Context/RestaurantContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import type { Product } from "../../Context/RestaurantContext";

const MenuScreen = () => {
  const {
    currentEstablishment,
    addProductToCurrentMenu,
    editProductInCurrentMenu,
    removeProductFromCurrentMenu, // NUEVO
  } = useRestaurant();

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const router = useRouter();

  if (currentEstablishment === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a6fa5" />
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </View>
    );
  }

  if (!currentEstablishment) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={40} color="#e74c3c" />
        <Text style={styles.errorText}>
          No hay establecimiento seleccionado
        </Text>
      </View>
    );
  }

  const handleAddProduct = () => {
    if (productName.trim() === "" || isNaN(Number(productPrice))) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName.trim(),
      price: parseFloat(productPrice),
    };
    addProductToCurrentMenu(newProduct);
    setProductName("");
    setProductPrice("");
    Keyboard.dismiss();
  };

  // Abrir modal de edición
  const openEditModal = (product: Product) => {
    setEditProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditModalVisible(true);
  };

  // Guardar cambios de edición
  const handleEditProduct = () => {
    if (!editName.trim() || isNaN(Number(editPrice)) || !editProductId) return;
    editProductInCurrentMenu({
      id: editProductId,
      name: editName.trim(),
      price: parseFloat(editPrice),
    });
    setEditModalVisible(false);
    setEditProductId(null);
    setEditName("");
    setEditPrice("");
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que quieres eliminar "${product.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removeProductFromCurrentMenu(product.id),
        },
      ]
    );
  };

  const handleFinish = () => {
    router.push("/(tabs)/order");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            Carta de {currentEstablishment.name}
          </Text>
          <MaterialIcons name="restaurant-menu" size={28} color="#4a6fa5" />
        </View>

        <FlatList
          data={currentEstablishment.menu}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.menuList}
          renderItem={({ item }: { item: Product }) => (
            <View style={styles.menuItem}>
              <FontAwesome
                name="cutlery"
                size={18}
                color="#4a6fa5"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>
                {item.name} -{" "}
                <Text style={styles.priceText}>{item.price.toFixed(2)} €</Text>
              </Text>
              <TouchableOpacity
                onPress={() => openEditModal(item)}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={20} color="#4a6fa5" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProduct(item)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyMenuContainer}>
              <MaterialIcons name="info-outline" size={40} color="#888" />
              <Text style={styles.emptyMenuText}>La carta está vacía</Text>
            </View>
          }
        />

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Añadir nuevo producto</Text>

          <TextInput
            placeholder="Nombre del producto"
            placeholderTextColor="#999"
            value={productName}
            onChangeText={setProductName}
            style={styles.input}
            onSubmitEditing={handleAddProduct}
          />

          <TextInput
            placeholder="Precio (€)"
            placeholderTextColor="#999"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="numeric"
            style={styles.input}
            onSubmitEditing={handleAddProduct}
          />

          <TouchableOpacity
            style={[
              styles.button,
              (!productName.trim() || isNaN(Number(productPrice))) &&
                styles.buttonDisabled,
            ]}
            onPress={handleAddProduct}
            disabled={!productName.trim() || isNaN(Number(productPrice))}
          >
            <Text style={styles.buttonText}>
              <MaterialIcons
                name="add-circle-outline"
                size={18}
                color="white"
              />{" "}
              Añadir producto
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>
          <MaterialIcons name="check-circle" size={18} color="white" /> Terminar
          y empezar a pedir
        </Text>
      </TouchableOpacity>

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Editar producto</Text>
            <TextInput
              placeholder="Nombre del producto"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
            <TextInput
              placeholder="Precio (€)"
              value={editPrice}
              onChangeText={setEditPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleEditProduct}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDisabled]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fa" },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4a6fa5",
    flex: 1,
  },
  menuList: { gap: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  menuIcon: { marginRight: 10 },
  menuItemText: { flex: 1, fontSize: 16, color: "#333" },
  priceText: { color: "#4a6fa5", fontWeight: "bold" },
  editButton: { marginLeft: 8, padding: 4 },
  deleteButton: { marginLeft: 4, padding: 4 },
  emptyMenuContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  emptyMenuText: {
    marginTop: 8,
    color: "#888",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f0f2f7",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#4a6fa5",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#b0c4de",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  finishButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#4a6fa5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f6fa",
  },
  loadingText: { marginTop: 12, color: "#4a6fa5", fontSize: 16 },
  errorText: { marginTop: 12, color: "#e74c3c", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
});
