import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type Establishment = {
  id: string;
  name: string;
  menu: Product[];
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

type RestaurantContextType = {
  establishments: Establishment[];
  currentEstablishment?: Establishment;
  setCurrentEstablishment: (establishment: Establishment) => void;
  addEstablishment: (name: string) => void;
  removeEstablishment: (id: string) => void; // NUEVO
  addProductToCurrentMenu: (product: Product) => void;
  editProductInCurrentMenu: (product: Product) => void;
  removeProductFromCurrentMenu: (productId: string) => void; // NUEVO
  orders: Record<string, OrderItem[]>;
  addToOrder: (product: Product) => void;
  removeFromOrder: (product: Product) => void;
  clearOrder: () => void;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

const ESTABLISHMENTS_KEY = "establishments";
const CURRENT_ESTABLISHMENT_KEY = "currentEstablishment";
const ORDERS_KEY = "orders";

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [currentEstablishment, setCurrentEstablishmentState] =
    useState<Establishment>();
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({});

  // Cargar datos almacenados al iniciar
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

  // Guardar establecimientos
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

  // Guardar establecimiento actual
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

  // Guardar pedidos
  const saveOrders = async (newOrders: Record<string, OrderItem[]>) => {
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    } catch (error) {
      console.error("Error saving orders:", error);
    }
  };

  // Añadir establecimiento nuevo
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

  // Eliminar establecimiento
  const removeEstablishment = (id: string) => {
    const updatedEstablishments = establishments.filter((e) => e.id !== id);
    setEstablishments(updatedEstablishments);
    saveEstablishments(updatedEstablishments);

    // Si el eliminado es el actual, limpiar currentEstablishment
    if (currentEstablishment?.id === id) {
      setCurrentEstablishmentState(undefined);
      AsyncStorage.removeItem(CURRENT_ESTABLISHMENT_KEY);
    }

    // También eliminar pedidos asociados
    const updatedOrders = { ...orders };
    delete updatedOrders[id];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  // Establecer establecimiento actual
  const setCurrentEstablishment = (establishment: Establishment) => {
    setCurrentEstablishmentState(establishment);
    saveCurrentEstablishment(establishment);
  };

  // Añadir producto al menú del establecimiento actual
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

  // Editar producto en el menú del establecimiento actual
  const editProductInCurrentMenu = (updatedProduct: Product) => {
    if (!currentEstablishment) return;
    const updatedMenu = currentEstablishment.menu.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    const updatedEstablishment = { ...currentEstablishment, menu: updatedMenu };
    const updatedEstablishments = establishments.map((e) =>
      e.id === updatedEstablishment.id ? updatedEstablishment : e
    );
    setEstablishments(updatedEstablishments);
    saveEstablishments(updatedEstablishments);
    setCurrentEstablishmentState(updatedEstablishment);
    saveCurrentEstablishment(updatedEstablishment);
  };

  // Eliminar producto del menú del establecimiento actual
  const removeProductFromCurrentMenu = (productId: string) => {
    if (!currentEstablishment) return;
    const updatedMenu = currentEstablishment.menu.filter(
      (product) => product.id !== productId
    );
    const updatedEstablishment = { ...currentEstablishment, menu: updatedMenu };
    const updatedEstablishments = establishments.map((e) =>
      e.id === updatedEstablishment.id ? updatedEstablishment : e
    );
    setEstablishments(updatedEstablishments);
    saveEstablishments(updatedEstablishments);
    setCurrentEstablishmentState(updatedEstablishment);
    saveCurrentEstablishment(updatedEstablishment);
  };

  // Añadir producto al pedido del establecimiento actual
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

  // Restar producto del pedido del establecimiento actual
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

  // Vaciar pedido del establecimiento actual
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
        removeEstablishment, // NUEVO
        addProductToCurrentMenu,
        editProductInCurrentMenu,
        removeProductFromCurrentMenu, // NUEVO
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
