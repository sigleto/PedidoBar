// app/(tabs)/order.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRestaurant } from "../../Context/RestaurantContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const OrderScreen = () => {
  const {
    currentEstablishment,
    addToOrder,
    order,
    clearOrder,
    removeFromOrder,
  } = useRestaurant();

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

  const getTotal = () => {
    return order
      .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            Pedido en {currentEstablishment.name}
          </Text>
          <FontAwesome name="cutlery" size={24} color="#4a6fa5" />
        </View>

        <Text style={styles.sectionTitle}>Menú disponible</Text>

        <FlatList
          data={currentEstablishment.menu}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.menuList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => addToOrder(item)}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>
                {item.name} -{" "}
                <Text style={styles.priceText}>{item.price.toFixed(2)} €</Text>
              </Text>
              <MaterialIcons name="add-circle" size={24} color="#27ae60" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyMenuContainer}>
              <MaterialIcons name="info-outline" size={40} color="#888" />
              <Text style={styles.emptyMenuText}>La carta está vacía</Text>
            </View>
          }
        />

        <Text style={styles.sectionTitle}>Tu pedido</Text>

        {order.length === 0 ? (
          <View style={styles.emptyOrderContainer}>
            <MaterialIcons name="shopping-cart" size={40} color="#888" />
            <Text style={styles.emptyOrderText}>No has añadido productos</Text>
          </View>
        ) : (
          <FlatList
            data={order}
            scrollEnabled={false}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.orderList}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>
                    {item.product.name}
                    <Text style={styles.orderItemQuantity}>
                      {" "}
                      × {item.quantity}
                    </Text>
                  </Text>
                  <Text style={styles.orderItemPrice}>
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.orderItemActions}>
                  <TouchableOpacity
                    onPress={() => removeFromOrder(item.product)}
                    style={styles.removeButton}
                  >
                    <MaterialIcons name="remove" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {order.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {getTotal()} €</Text>
          </View>
        )}
      </ScrollView>

      {order.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearOrder}>
          <Text style={styles.clearButtonText}>
            <MaterialIcons name="delete" size={18} color="white" /> Vaciar
            pedido
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "500",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 16,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  menuItemText: {
    fontSize: 16,
    color: "#333",
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
  emptyOrderContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyOrderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  orderItemQuantity: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "normal",
  },
  orderItemPrice: {
    fontSize: 16,
    color: "#27ae60",
    fontWeight: "600",
    marginTop: 4,
  },
  orderItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  totalContainer: {
    backgroundColor: "#2c3e50",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  clearButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#e74c3c",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderScreen;
