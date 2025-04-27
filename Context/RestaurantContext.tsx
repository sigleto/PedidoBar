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
  orders: Record<string, OrderItem[]>; // Usamos un objeto para almacenar pedidos por establecimiento
  addToOrder: (product: Product) => void;
  removeFromOrder: (product: Product) => void;
  clearOrder: () => void;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

const ESTABLISHMENTS_KEY = "establishments";
const CURRENT_ESTABLISHMENT_KEY = "currentEstablishment";
const ORDERS_KEY = "orders"; // 🔑 Nueva clave para guardar los pedidos de todos los establecimientos

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [currentEstablishment, setCurrentEstablishmentState] =
    useState<Establishment>();
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({});

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
        const storedOrders = await AsyncStorage.getItem(ORDERS_KEY);

        if (storedEstablishments) {
          const parsedEstablishments = JSON.parse(storedEstablishments);
          setEstablishments(parsedEstablishments);
        }
        if (storedCurrent) {
          const parsedCurrent = JSON.parse(storedCurrent);
          setCurrentEstablishmentState(parsedCurrent);
        }
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
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

  // 🔑 Función para guardar los pedidos de todos los establecimientos
  const saveOrders = async (newOrders: Record<string, OrderItem[]>) => {
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    } catch (error) {
      console.error("Error saving orders:", error);
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

  // Función para añadir un producto al pedido del establecimiento actual
  const addToOrder = (product: Product) => {
    if (!currentEstablishment) return;

    const currentOrders = { ...orders };

    if (!currentOrders[currentEstablishment.id]) {
      currentOrders[currentEstablishment.id] = [];
    }

    const existing = currentOrders[currentEstablishment.id].find(
      (item) => item.product.id === product.id
    );

    if (existing) {
      const updatedOrder = currentOrders[currentEstablishment.id].map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      currentOrders[currentEstablishment.id] = updatedOrder;
    } else {
      currentOrders[currentEstablishment.id] = [
        ...currentOrders[currentEstablishment.id],
        { product, quantity: 1 },
      ];
    }

    setOrders(currentOrders);
    saveOrders(currentOrders);
  };

  // Función para restar un producto del pedido del establecimiento actual
  const removeFromOrder = (product: Product) => {
    if (!currentEstablishment) return;

    const currentOrders = { ...orders };
    const existing = currentOrders[currentEstablishment.id]?.find(
      (item) => item.product.id === product.id
    );

    if (existing) {
      if (existing.quantity === 1) {
        const updatedOrder = currentOrders[currentEstablishment.id].filter(
          (item) => item.product.id !== product.id
        );
        currentOrders[currentEstablishment.id] = updatedOrder;
      } else {
        const updatedOrder = currentOrders[currentEstablishment.id].map(
          (item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
        );
        currentOrders[currentEstablishment.id] = updatedOrder;
      }
    }

    setOrders(currentOrders);
    saveOrders(currentOrders);
  };

  // Función para vaciar el pedido del establecimiento actual
  const clearOrder = () => {
    if (!currentEstablishment) return;

    const currentOrders = { ...orders };
    currentOrders[currentEstablishment.id] = [];
    setOrders(currentOrders);
    saveOrders(currentOrders);
  };

  return (
    <RestaurantContext.Provider
      value={{
        establishments,
        currentEstablishment,
        setCurrentEstablishment,
        addEstablishment,
        addProductToCurrentMenu,
        orders,
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
