import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const PlantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await api.get(`/api/plants/${id}`);
        setPlant(res.data);
      } catch (err) {
        console.error("Error fetching plant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  if (loading) {
    return <div className="loading-spinner" style={{ minHeight: "60vh" }}><div className="spinner"></div></div>;
  }

  if (!plant) {
    return (
      <div className="no-results" style={{ minHeight: "60vh", paddingTop: 100 }}>
        <h3>Plant not found</h3>
        <p>The plant you're looking for doesn't exist.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 16 }}>
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>
    );
  }

  const images = plant.images && plant.images.length > 0 ? plant.images : [plant.imageUrl || "/logo192.png"];
  const hasDiscount = plant.discount > 0;
  const sizeMultiplier = selectedSize === "Small" ? 0.8 : selectedSize === "Large" ? 1.3 : 1;
  const currentPrice = hasDiscount ? plant.discountedPrice : plant.price;
  const finalPrice = Math.round(currentPrice * sizeMultiplier);

  const handleAddToCart = () => {
    addToCart(plant, selectedSize, quantity);
    toast.success(`${plant.name} (${selectedSize}) added to cart!`);
  };

  const whatsappMsg = `Hi PlantTaxa! I'm interested in ${plant.name} (${selectedSize} size, Qty: ${quantity}). Price: Rs. ${finalPrice * quantity}`;

  return (
    <div className="plant-detail">
      <div className="container">
        <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24, color: "var(--primary)", fontWeight: 600 }}>
          <FiArrowLeft /> Back to Shop
        </Link>

        <div className="plant-detail-content">
          {/* Images */}
          <div className="plant-detail-images">
            <img
              src={images[selectedImage]}
              alt={plant.name}
              className="plant-detail-main-image"
            />
            {images.length > 1 && (
              <div className="plant-detail-thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${plant.name} ${idx + 1}`}
                    className={selectedImage === idx ? "active" : ""}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="plant-detail-info">
            <span className="category-tag">{plant.category}</span>
            <h1>{plant.name}</h1>

            <div className="price-section">
              <span className="price-big">Rs. {finalPrice}</span>
              {hasDiscount && (
                <>
                  <span className="price-old">Rs. {Math.round(plant.price * sizeMultiplier)}</span>
                  <span className="discount-label">-{plant.discount}% OFF</span>
                </>
              )}
            </div>

            {plant.description && (
              <p className="description">{plant.description}</p>
            )}

            {/* Size Selector */}
            <div className="size-selector">
              <label>Select Size:</label>
              <div className="size-options">
                {["Small", "Medium", "Large"].map((s) => (
                  <button
                    key={s}
                    className={`size-option ${selectedSize === s ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                    <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 2 }}>
                      {s === "Small" ? "(-20%)" : s === "Large" ? "(+30%)" : "(Standard)"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>
                Rs. {finalPrice * quantity}
              </span>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <a
                href={`https://wa.me/923000000000?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <FaWhatsapp /> Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
