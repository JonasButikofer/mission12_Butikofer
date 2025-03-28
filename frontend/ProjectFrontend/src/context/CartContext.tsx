// src/context/CartContext.tsx
import { useState, ReactNode, createContext, useContext } from "react";
import { CartItem } from "../types/CartItem";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

interface CartContextType {
  cart: CartItem[];
  addtoCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  decreaseQuantity: (bookId: number) => void;
  increaseQuantity: (bookId: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addtoCart = (item: CartItem) => {
    setLoading(true);

    setTimeout(() => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((c) => c.bookId === item.bookId);

        if (existingItem) {
          setToastMessage(`${item.title} quantity increased.`);
          setShowToast(true);
          return prevCart.map((c) =>
            c.bookId === item.bookId
              ? { ...c, quantity: c.quantity + 1 }
              : c
          );
        } else {
          setToastMessage(`${item.title} added to cart!`);
          setShowToast(true);
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });

      setLoading(false);
    }, 600); // simulate delay for spinner
  };

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  const decreaseQuantity = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((c) =>
          c.bookId === bookId && c.quantity > 1
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const increaseQuantity = (bookId: number) => {
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.bookId === bookId ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addtoCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        loading,
      }}
    >
      {children}

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Optional Global Spinner */}
      {loading && (
        <div className="position-fixed bottom-0 start-0 p-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
