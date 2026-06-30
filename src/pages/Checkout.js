import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    mobile: "",
    contact: "",
  });
  const [placing, setPlacing] = useState(false);

  const deliveryFee = cartTotal >= 2000 ? 0 : 200;
  const grandTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getItemPrice = (item) => {
    const price = item.discount > 0 ? item.discountedPrice : item.price;
    const sizeMultiplier = item.size === "Small" ? 0.8 : item.size === "Large" ? 1.3 : 1;
    return Math.round(price * sizeMultiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!form.address || !form.city || !form.mobile || !form.contact) {
      toast.error("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacing(true);
    try {
      for (const item of cartItems) {
        await api.post("/api/orders", {
          plantId: item._id,
          quantity: item.quantity,
          address: form.address,
          city: form.city,
          mobile: form.mobile,
          contact: form.contact,
          paymentMethod: "cod",
        });
      }
      clearCart();
      toast.success("Order placed successfully! Check My Orders for tracking.");
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-empty">
            <h2>No items to checkout</h2>
            <p>Add some plants to your cart first.</p>
            <Link to="/shop" className="btn-primary">Browse Plants</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, color: "var(--primary)", fontWeight: 600 }}>
          <FiArrowLeft /> Back to Cart
        </Link>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Shipping Details</h2>

            {!isLoggedIn && (
              <div style={{ background: "#FFF3E0", padding: 16, borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                Please <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>login</Link> to place your order.
              </div>
            )}

            <div className="form-group">
              <label>Full Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House #, Street, Area, Landmark"
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Pattoki, Lahore, Karachi"
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="e.g. 03001234567"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Name *</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Receiver's name"
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select disabled>
                <option>Cash on Delivery (COD)</option>
              </select>
              <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4 }}>
                Only Cash on Delivery is available currently
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={placing || !isLoggedIn}
            >
              {placing ? "Placing Order..." : `Place Order - Rs. ${Math.round(grandTotal)}`}
            </button>
          </form>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className="checkout-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-light)" }}>
                    {item.size} x {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  Rs. {getItemPrice(item) * item.quantity}
                </div>
              </div>
            ))}

            <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 16 }}>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>Rs. {Math.round(cartTotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>Rs. {Math.round(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
