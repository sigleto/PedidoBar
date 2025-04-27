// app/(tabs)/index.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido
        <Text style={styles.emoji}> 🎪🎉</Text> {/* Emoticono de feria */}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: "#e91e63" }, // Rosa feria
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/(tabs)/Establecimientos")}
      >
        <Text style={styles.buttonText}>
          Seleccionar o Crear Establecimiento
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: "#4caf50" }, // Verde feria
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/(tabs)/order")}
      >
        <Text style={styles.buttonText}>Ver Pedido Actual</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff5f7", // Rosa muy claro
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    color: "#d81b60", // Rosa fuerte
  },
  emoji: {
    fontSize: 36, // Emoticonos más grandes
  },
  subtitle: {
    fontSize: 16,
    color: "#9c27b0", // Morado
    marginBottom: 40,
    fontWeight: "500",
    fontStyle: "italic",
  },
  button: {
    width: "100%",
    paddingVertical: 16, // Más alto
    paddingHorizontal: 20,
    borderRadius: 50, // Bordes más redondeados como farolillos
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Sombra más pronunciada
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700", // Más negrita
    textAlign: "center",
    textTransform: "uppercase", // Mayúsculas como carteles de feria
  },
});

export default HomeScreen;
