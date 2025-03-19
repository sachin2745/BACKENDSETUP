"use client";
import { createContext, useContext, useEffect, useState } from "react";
import useConsumerContext from "./ConsumerContext";

const ProductContext = createContext();

const ISSERVER = typeof window === "undefined";

export const ProductProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { currentConsumer } = useConsumerContext();

  // Fetch cart items for the current consumer from localStorage
  const getCartItemsForConsumer = () => {
    if (ISSERVER) return [];
    const allCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    return allCartItems.filter(
      (cartItem) => cartItem.consumerId === currentConsumer?.consumerId
    );
  };

  const [cartItems, setCartItems] = useState(getCartItemsForConsumer());

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    if (ISSERVER) return;

    if (cartItems.length > 0) {
      const allCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = [
        ...allCartItems.filter(
          (item) => item.consumerId !== currentConsumer?.consumerId
        ),
        ...cartItems,
      ];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      const allCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const filteredCartItems = allCartItems.filter(
        (item) => item.consumerId !== currentConsumer?.consumerId
      );
      localStorage.setItem("cartItems", JSON.stringify(filteredCartItems));
    }
  }, [cartItems, currentConsumer]);

  const addItemToCart = (itemId, price, delPrice, quantity = 1) => {
    if (!currentConsumer) return; // Prevent adding items if no consumer is logged in

    const exist = cartItems.find((cartItem) => cartItem.productId === itemId);

    if (exist) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.productId === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: itemId,
          quantity, // Use passed quantity instead of default 1
          price,
          delPrice,
          consumerId: currentConsumer.consumerId, // Store consumer ID
        },
      ]);
    }
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(
      cartItems
        .map((cartItem) =>
          cartItem.productId === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const removeOneItem = (itemId) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.productId !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (itemId) => {
    return cartItems.some((cartItem) => cartItem.productId === itemId);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0
    );
  };

  const getCartDelTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.delPrice || 0) * item.quantity,
      0
    );
  };

  const getSingleItemCartTotal = (itemId, productDiscountPrice) => {
    const item = cartItems.find((cartItem) => cartItem.productId === itemId);
    return item ? item.quantity * (productDiscountPrice || 0) : 0;
  };

  // const getCartItemsCount = () => {
  //   return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  // };

  const getCartItemsCount = () => {
    return cartItems.length;
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;

    setCartItems(
      cartItems.map((cartItem) =>
        cartItem.productId === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        cartOpen,
        setCartOpen,
        cartItems,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        isInCart,
        getCartTotal,
        getCartDelTotal,
        getCartItemsCount,
        removeOneItem,
        getSingleItemCartTotal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProductContext = () => useContext(ProductContext);

export default useProductContext;
