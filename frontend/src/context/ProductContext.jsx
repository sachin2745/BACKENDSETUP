"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemsinSession = JSON.parse(localStorage.getItem("cartItems"));

  const [cartItems, setCartItems] = useState(cartItemsinSession || []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems"); // Ensure localStorage is cleared when cart is empty
    }
  }, [cartItems]);

  const addItemToCart = (itemId) => {
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
      setCartItems([...cartItems, { productId: itemId, quantity: 1 }]);
    }
  };

  const removeItemFromCart = (itemId) => {
    const exist = cartItems.find((cartItem) => cartItem.productId === itemId);

    if (exist.quantity === 1) {
      setCartItems(
        cartItems.filter((cartItem) => cartItem.productId !== itemId)
      );
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.productId === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const removeoneitem = (itemId) => {
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
        getCartItemsCount,
        removeoneitem,
        getSingleItemCartTotal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProductContext = () => useContext(ProductContext);

export default useProductContext;
