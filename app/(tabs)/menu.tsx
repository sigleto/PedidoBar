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
} from "react-native";
import { useRouter } from "expo-router";
import { useRestaurant } from "../../Context/RestaurantContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const MenuScreen = () => {
  const { currentEstablishment, addProductToCurrentMenu } = useRestaurant();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
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

    const newProduct = {
      id: Date.now().toString(),
      name: productName.trim(),
      price: parseFloat(productPrice),
    };
    addProductToCurrentMenu(newProduct);
    setProductName("");
    setProductPrice("");
    Keyboard.dismiss();
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
          renderItem={({ item }) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginRight: 10,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  priceText: {
    fontWeight: "600",
    color: "#4a6fa5",
  },
  emptyMenuContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyMenuText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#4a6fa5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  finishButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#27ae60",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MenuScreen;
