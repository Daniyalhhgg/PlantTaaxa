import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingBag style={{ fontSize: 64, color: "var(--text-light)", marginBottom: 16 }} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any plants yet.</p>
            <Link to="/shop" className="btn-primary">
              Browse Plants <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getItemPrice = (item) => {
    const price = item.discount > 0 ? item.discountedPrice : item.price;
    const sizeMultiplier = item.size === "Small" ? 0.8 : item.size === "Large" ? 1.3 : 1;
    return Math.round(price * sizeMultiplier);
  };

  const deliveryFee = cartTotal >= 2000 ? 0 : 200;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="section-header" style={{ textAlign: "left", marginBottom: 28 }}>
          <h2>Shopping Cart</h2>
          <p>{cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart</p>
        </div>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const itemPrice = getItemPrice(item);
              const imageUrl = item.imageUrl || (item.images && item.images[0]) || "/logo192.png";
              return (
                <tr key={`${item._id}-${item.size}`}>
                  <td>
                    <div className="cart-item-info">
                      <img src={imageUrl} alt={item.name} className="cart-item-img" />
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-size">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Size">{item.size}</td>
                  <td data-label="Price">Rs. {itemPrice}</td>
                  <td data-label="Quantity">
                    <div className="quantity-controls" style={{ display: "inline-flex" }}>
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td data-label="Total" style={{ fontWeight: 600 }}>
                    Rs. {itemPrice * item.quantity}
                  </td>
                  <td>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item._id, item.size)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <button className="btn-secondary" onClick={clearCart} style={{ color: "#ff4444", borderColor: "#ff4444" }}>
            Clear Cart
          </button>
          <Link to="/shop" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>Rs. {Math.round(cartTotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
          </div>
          {deliveryFee > 0 && (
            <div style={{ fontSize: 12, color: "var(--primary)", marginBottom: 8 }}>
              Add Rs. {Math.round(2000 - cartTotal)} more for free delivery
            </div>
          )}
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>Rs. {Math.round(grandTotal)}</span>
          </div>
          <Link to="/checkout" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
            Proceed to Checkout <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
