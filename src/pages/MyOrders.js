import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiDownload, FiPackage, FiTruck, FiCheck, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { jsPDF } from "jspdf";

const MyOrders = () => {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "status-pending";
      case "Shipped": return "status-shipped";
      case "Delivered": return "status-delivered";
      default: return "";
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case "Pending": return "16%";
      case "Shipped": return "50%";
      case "Delivered": return "100%";
      default: return "0%";
    }
  };

  const getStepState = (status, step) => {
    const order = ["Pending", "Shipped", "Delivered"];
    const statusIdx = order.indexOf(status);
    const stepIdx = order.indexOf(step);
    if (stepIdx < statusIdx) return "completed";
    if (stepIdx === statusIdx) return "active";
    return "";
  };

  const downloadReceipt = (order) => {
    const doc = new jsPDF();
    const plant = order.plantId;
    const plantName = plant ? plant.name : "N/A";
    const plantPrice = plant ? (plant.discount > 0 ? plant.discountedPrice : plant.price) : 0;
    const totalBill = plantPrice * (order.quantity || 1);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
      year: "numeric", month: "long", day: "numeric"
    });

    // Header
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PlantTaxa", 20, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Plants & Nursery | Pattoki, Pakistan", 20, 32);

    // Receipt title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Order Receipt", 20, 55);

    // Order info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    let y = 68;
    const lineHeight = 8;

    const addRow = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(String(value), 80, y);
      y += lineHeight;
    };

    addRow("Order ID:", order._id);
    addRow("Date:", orderDate);
    addRow("Status:", order.status);

    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 125, 50);
    doc.text("Order Details", 20, y);
    y += 10;

    doc.setFontSize(11);
    addRow("Plant:", plantName);
    addRow("Category:", plant ? plant.category : "N/A");
    addRow("Quantity:", String(order.quantity || 1));
    addRow("Unit Price:", `Rs. ${Math.round(plantPrice)}`);

    y += 5;
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 125, 50);
    doc.text("Shipping Info", 20, y);
    y += 10;

    doc.setFontSize(11);
    addRow("Contact:", order.contact);
    addRow("Mobile:", order.mobile);
    addRow("City:", order.city);
    addRow("Address:", order.address);
    addRow("Payment:", "Cash on Delivery");

    y += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, 170, 20, "F");
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 125, 50);
    doc.text(`Total Bill: Rs. ${Math.round(totalBill)}`, 25, y + 8);

    y += 30;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for shopping with PlantTaxa!", 20, y);
    doc.text("Location: Pattoki, Punjab, Pakistan | www.planttaxa.store", 20, y + 6);

    doc.save(`PlantTaxa-Receipt-${order._id.slice(-8)}.pdf`);
  };

  if (!isLoggedIn) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="cart-empty">
            <FiPackage style={{ fontSize: 64, color: "var(--text-light)", marginBottom: 16 }} />
            <h2>Login to track your orders</h2>
            <p>You need to be logged in to view your order history.</p>
            <Link to="/login" className="btn-primary">
              Login Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="section-header" style={{ textAlign: "left" }}>
          <h2>My Orders</h2>
          <p>Track your orders and download receipts</p>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="cart-empty">
            <FiPackage style={{ fontSize: 64, color: "var(--text-light)", marginBottom: 16 }} />
            <h2>No orders yet</h2>
            <p>Start shopping and your orders will appear here.</p>
            <Link to="/shop" className="btn-primary">
              Browse Plants <FiArrowRight />
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const plant = order.plantId;
            const plantName = plant ? plant.name : "N/A";
            const plantPrice = plant ? (plant.discount > 0 ? plant.discountedPrice : plant.price) : 0;
            const totalBill = plantPrice * (order.quantity || 1);
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
              year: "numeric", month: "short", day: "numeric"
            });

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: "var(--text-light)" }}>{orderDate}</div>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  <div className="order-detail-item">
                    <div className="detail-label">Plant</div>
                    <div className="detail-value">{plantName}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="detail-label">Quantity</div>
                    <div className="detail-value">{order.quantity || 1}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="detail-label">Total Bill</div>
                    <div className="detail-value" style={{ color: "var(--primary)", fontWeight: 700 }}>
                      Rs. {Math.round(totalBill)}
                    </div>
                  </div>
                  <div className="order-detail-item">
                    <div className="detail-label">Payment</div>
                    <div className="detail-value">Cash on Delivery</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="detail-label">City</div>
                    <div className="detail-value">{order.city}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="detail-label">Contact</div>
                    <div className="detail-value">{order.contact}</div>
                  </div>
                </div>

                {/* Order Progress Tracker */}
                <div className="order-progress">
                  <div className="progress-fill" style={{ width: getProgressWidth(order.status) }}></div>
                  {[
                    { status: "Pending", icon: <FiPackage />, label: "Order Placed" },
                    { status: "Shipped", icon: <FiTruck />, label: "Shipped" },
                    { status: "Delivered", icon: <FiCheck />, label: "Delivered" },
                  ].map((step) => (
                    <div key={step.status} className={`progress-step ${getStepState(order.status, step.status)}`}>
                      <div className="step-dot">{step.icon}</div>
                      <div className="step-label">{step.label}</div>
                    </div>
                  ))}
                </div>

                {/* Download Receipt Button */}
                <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                  <button className="btn-download" onClick={() => downloadReceipt(order)}>
                    <FiDownload /> Download Receipt (PDF)
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
