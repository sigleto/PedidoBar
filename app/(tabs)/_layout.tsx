// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { RestaurantProvider } from "../../Context/RestaurantContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <RestaurantProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#007aff",
          tabBarInactiveTintColor: "#8e8e93",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -3 },
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="establishment"
          options={{
            title: "Establecimientos",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="storefront" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Carta",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="menu-book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Pedido",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="shopping-cart" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </RestaurantProvider>
  );
}
