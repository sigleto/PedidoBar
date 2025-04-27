// app/+not-found.tsx
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Pantalla no encontrada
      </Text>
      <Text style={{ fontSize: 16, marginTop: 12 }}>
        Vuelve atrás para continuar.
      </Text>
    </View>
  );
}
