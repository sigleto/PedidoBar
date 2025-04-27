// app/(tabs)/establishment.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useRestaurant } from "../../Context/RestaurantContext";
import { MaterialIcons } from "@expo/vector-icons";

const EstablishmentScreen = () => {
  const { establishments, addEstablishment, setCurrentEstablishment } =
    useRestaurant();
  const [newName, setNewName] = useState("");
  const router = useRouter();

  const handleCreate = () => {
    if (newName.trim() === "") return;
    addEstablishment(newName.trim());
    setNewName("");
    Keyboard.dismiss();
    router.push("/(tabs)/menu");
  };

  const handleSelect = (establishmentId: string) => {
    const selected = establishments.find((e) => e.id === establishmentId);
    if (selected) {
      setCurrentEstablishment(selected);
      router.push("/(tabs)/order");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Elige Establecimiento</Text>

      <FlatList
        data={establishments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item.id)}
            style={styles.establishmentCard}
          >
            <MaterialIcons name="restaurant" size={24} color="#4a6fa5" />
            <Text style={styles.establishmentName}>{item.name}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info-outline" size={40} color="#888" />
            <Text style={styles.emptyText}>
              No hay establecimientos registrados
            </Text>
          </View>
        }
      />

      <View style={styles.createContainer}>
        <Text style={styles.sectionTitle}>Crear nuevo establecimiento</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="Nombre del establecimiento"
          placeholderTextColor="#999"
          style={styles.input}
          onSubmitEditing={handleCreate}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          disabled={!newName.trim()}
        >
          <Text style={styles.createButtonText}>
            <MaterialIcons name="add-business" size={18} color="white" /> Crear
            y añadir carta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  establishmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  establishmentName: {
    fontSize: 18,
    marginLeft: 12,
    marginRight: "auto",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  createContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
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
  createButton: {
    backgroundColor: "#4a6fa5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    opacity: 1,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EstablishmentScreen;
