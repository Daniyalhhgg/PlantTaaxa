import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const PlantCard = ({ plant }) => {
  const { addToCart } = useCart();

  const imageUrl = plant.imageUrl || (plant.images && plant.images[0]) || "/logo192.png";
  const hasDiscount = plant.discount > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(plant, "Medium", 1);
    toast.success(`${plant.name} added to cart!`);
  };

  return (
    <div className="plant-card">
      <Link to={`/plant/${plant._id}`}>
        <div className="plant-card-image">
          <img src={imageUrl} alt={plant.name} loading="lazy" />
          {hasDiscount && (
            <span className="discount-badge">-{plant.discount}%</span>
          )}
        </div>
      </Link>
      <div className="plant-card-body">
        <div className="plant-card-category">{plant.category}</div>
        <h3 className="plant-card-name">{plant.name}</h3>
        <div className="plant-card-price">
          <span className="price-current">
            Rs. {hasDiscount ? Math.round(plant.discountedPrice) : plant.price}
          </span>
          {hasDiscount && (
            <span className="price-original">Rs. {plant.price}</span>
          )}
        </div>
        <div className="plant-card-actions">
          <button className="btn-add-cart" onClick={handleAddToCart}>
            <FiShoppingCart /> Add to Cart
          </button>
          <Link to={`/plant/${plant._id}`} className="btn-view">
            <FiEye />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
