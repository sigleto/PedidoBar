// context/RestaurantContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Establishment = {
  id: string;
  name: string;
  menu: Product[];
};

type OrderItem = {
  product: Product;
  quantity: number;
};

type RestaurantContextType = {
  establishments: Establishment[];
  currentEstablishment?: Establishment;
  setCurrentEstablishment: (establishment: Establishment) => void;
  addEstablishment: (name: string) => void;
  addProductToCurrentMenu: (product: Product) => void;
  order: OrderItem[];
  addToOrder: (product: Product) => void;
  removeFromOrder: (product: Product) => void;
  clearOrder: () => void;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

const ESTABLISHMENTS_KEY = "establishments";
const CURRENT_ESTABLISHMENT_KEY = "currentEstablishment";
const ORDER_KEY = "order"; // 🔑 Nueva clave para guardar el pedido

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [currentEstablishment, setCurrentEstablishmentState] =
    useState<Establishment>();
  const [order, setOrder] = useState<OrderItem[]>([]);

  // 🔵 Al iniciar la app, cargar datos almacenados
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEstablishments = await AsyncStorage.getItem(
          ESTABLISHMENTS_KEY
        );
        const storedCurrent = await AsyncStorage.getItem(
          CURRENT_ESTABLISHMENT_KEY
        );
        // 🔑 Cargar el pedido almacenado
        const storedOrder = await AsyncStorage.getItem(ORDER_KEY);

        if (storedEstablishments) {
          const parsedEstablishments = JSON.parse(storedEstablishments);
          setEstablishments(parsedEstablishments);
        }
        if (storedCurrent) {
          const parsedCurrent = JSON.parse(storedCurrent);
          setCurrentEstablishmentState(parsedCurrent);
        }
        // 🔑 Si hay un pedido guardado, cárgalo
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder);
          setOrder(parsedOrder);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // 🔵 Guardar establecimientos en AsyncStorage
  const saveEstablishments = async (newEstablishments: Establishment[]) => {
    try {
      await AsyncStorage.setItem(
        ESTABLISHMENTS_KEY,
        JSON.stringify(newEstablishments)
      );
    } catch (error) {
      console.error("Error saving establishments:", error);
    }
  };

  // 🔵 Guardar el establecimiento actual
  const saveCurrentEstablishment = async (establishment: Establishment) => {
    try {
      await AsyncStorage.setItem(
        CURRENT_ESTABLISHMENT_KEY,
        JSON.stringify(establishment)
      );
    } catch (error) {
      console.error("Error saving current establishment:", error);
    }
  };

  // 🔑 Función para guardar el pedido en AsyncStorage
  const saveOrder = async (orderToSave: OrderItem[]) => {
    try {
      await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(orderToSave));
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Función para añadir un establecimiento
  const addEstablishment = (name: string) => {
    const newEstablishment: Establishment = {
      id: Date.now().toString(),
      name,
      menu: [],
    };
    const updated = [...establishments, newEstablishment];
    setEstablishments(updated);
    saveEstablishments(updated);
    setCurrentEstablishmentState(newEstablishment);
    saveCurrentEstablishment(newEstablishment);
  };

  // Función para establecer el establecimiento actual
  const setCurrentEstablishment = (establishment: Establishment) => {
    setCurrentEstablishmentState(establishment);
    saveCurrentEstablishment(establishment);
  };

  // Función para añadir un producto al menú del establecimiento actual
  const addProductToCurrentMenu = (product: Product) => {
    if (!currentEstablishment) return;
    const updated = {
      ...currentEstablishment,
      menu: [...currentEstablishment.menu, product],
    };
    const updatedEstablishments = establishments.map((e) =>
      e.id === updated.id ? updated : e
    );
    setEstablishments(updatedEstablishments);
    saveEstablishments(updatedEstablishments);
    setCurrentEstablishmentState(updated);
    saveCurrentEstablishment(updated);
  };

  // Función para añadir un producto al pedido
  const addToOrder = (product: Product) => {
    setOrder((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const updatedOrder = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        saveOrder(updatedOrder); // 🔑 Guardar el pedido actualizado
        return updatedOrder;
      }
      const updatedOrder = [...prev, { product, quantity: 1 }];
      saveOrder(updatedOrder); // 🔑 Guardar el pedido actualizado
      return updatedOrder;
    });
  };

  // Función para restar un producto del pedido
  const removeFromOrder = (product: Product) => {
    setOrder((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity === 1) {
          const updatedOrder = prev.filter(
            (item) => item.product.id !== product.id
          );
          saveOrder(updatedOrder); // 🔑 Guardar el pedido actualizado
          return updatedOrder;
        }
        const updatedOrder = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        saveOrder(updatedOrder); // 🔑 Guardar el pedido actualizado
        return updatedOrder;
      }
      return prev;
    });
  };

  // Función para vaciar el pedido
  const clearOrder = () => {
    setOrder([]);
    saveOrder([]); // 🔑 Guardar el pedido vacío
  };

  return (
    <RestaurantContext.Provider
      value={{
        establishments,
        currentEstablishment,
        setCurrentEstablishment,
        addEstablishment,
        addProductToCurrentMenu,
        order,
        addToOrder,
        removeFromOrder,
        clearOrder,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(
      "useRestaurant debe usarse dentro de un RestaurantProvider"
    );
  }
  return context;
};
