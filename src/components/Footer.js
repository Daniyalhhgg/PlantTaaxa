import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>PlantTaxa</h3>
            <p>
              Pattoki's leading online plant nursery. We deliver fresh, healthy plants
              right to your doorstep. Quality plants, expert care tips, and fast delivery
              across Pakistan.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
            <Link to="/my-orders">Track Order</Link>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/shop?category=Indoor">Indoor Plants</Link>
            <Link to="/shop?category=Outdoor">Outdoor Plants</Link>
            <Link to="/shop?category=Flowering">Flowering Plants</Link>
            <Link to="/shop?category=Succulent">Succulents</Link>
            <Link to="/shop?category=Tropical">Tropical Plants</Link>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <a href="https://maps.google.com/?q=Pattoki,Pakistan" target="_blank" rel="noopener noreferrer">
              <FaMapMarkerAlt style={{ marginRight: 8 }} /> Pattoki, Punjab, Pakistan
            </a>
            <a href="tel:+923278140188">
              <FaPhone style={{ marginRight: 8 }} /> +92 327 8140188
            </a>
            <a href="mailto:info@planttaxa.store">
              <FaEnvelope style={{ marginRight: 8 }} /> info@planttaxa.store
            </a>
            <a href="https://wa.me/923278140188" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp style={{ marginRight: 8 }} /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} PlantTaxa. All rights reserved. | Located in Pattoki, Pakistan
        </div>
      </div>
    </footer>
  );
};

export default Footer;
