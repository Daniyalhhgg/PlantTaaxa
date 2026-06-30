import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { isLoggedIn, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        Free Delivery on Orders Above Rs. 2000 | Pattoki, Pakistan
      </div>
      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="PlantTaxa Logo" />
          <span>PlantTaxa</span>
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          {isLoggedIn && <li><NavLink to="/my-orders">My Orders</NavLink></li>}
        </ul>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <button className="navbar-auth-btn btn-logout" onClick={logout}>
              <FiLogOut style={{ marginRight: 4 }} /> Logout
            </button>
          ) : (
            <Link to="/login" className="navbar-auth-btn btn-login">
              <FiUser style={{ marginRight: 4 }} /> Login
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
        <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
        <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
        {isLoggedIn && <NavLink to="/my-orders" onClick={closeMenu}>My Orders</NavLink>}
        <NavLink to="/cart" onClick={closeMenu}>Cart ({cartCount})</NavLink>
        {!isLoggedIn && <NavLink to="/login" onClick={closeMenu}>Login / Register</NavLink>}
      </div>
    </nav>
  );
};

export default Navbar;
