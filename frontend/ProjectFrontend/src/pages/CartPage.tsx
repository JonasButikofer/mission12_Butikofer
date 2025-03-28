import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import 'bootstrap/dist/css/bootstrap.min.css';



function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Calculate totals per item and overall
  const cartWithTotals = cart.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }));

  const total = cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartWithTotals.map((item: CartItem) => (
              <tr key={item.bookId}>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.subtotal.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {cart.length > 0 && (
        <h4>Total: <strong>${total.toFixed(2)}</strong></h4>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );
}

export default CartPage;