// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { RestaurantProvider } from "../../Context/RestaurantContext";

export default function TabsLayout() {
  return (
    <RestaurantProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#007aff",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
          }}
        />
        <Tabs.Screen
          name="establishment"
          options={{
            title: "Establecimientos",
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Carta",
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Pedido",
          }}
        />
      </Tabs>
    </RestaurantProvider>
  );
}
