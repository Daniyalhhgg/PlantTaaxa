import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiPhone, FiStar } from "react-icons/fi";
import { FaLeaf, FaSeedling, FaSun, FaSpa, FaMountain, FaMortarPestle, FaTools } from "react-icons/fa";
import api from "../utils/api";
import PlantCard from "../components/PlantCard";

const categories = [
  { name: "Indoor", icon: <FaLeaf /> },
  { name: "Outdoor", icon: <FaSun /> },
  { name: "Succulent", icon: <FaSpa /> },
  { name: "Flowering", icon: <FaSeedling /> },
  { name: "Tropical", icon: <FaMountain /> },
  { name: "Herb", icon: <FaMortarPestle /> },
  { name: "Pots", icon: <FaTools /> },
];

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await api.get("/api/plants");
        setPlants(res.data);
      } catch (err) {
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const featuredPlants = plants.slice(0, 8);
  const discountedPlants = plants.filter((p) => p.discount > 0).slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Pattoki's #1 Online Nursery</span>
            <h1>
              Bring Nature <span>Home</span> with PlantTaxa
            </h1>
            <p>
              Discover our curated collection of premium indoor & outdoor plants.
              Fresh from our nursery in Pattoki, delivered with care to your doorstep.
            </p>
            <div className="hero-btns">
              <Link to="/shop" className="btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Plants Available</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Plant Species</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/logo512.png" alt="PlantTaxa - Premium Plants" />
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section style={{ background: "var(--bg-white)", padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[
            { icon: <FiTruck />, title: "Free Delivery", desc: "Orders above Rs. 2000" },
            { icon: <FiShield />, title: "Plant Guarantee", desc: "Healthy plants always" },
            { icon: <FiPhone />, title: "24/7 Support", desc: "WhatsApp available" },
            { icon: <FiStar />, title: "Best Quality", desc: "From Pattoki nursery" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28, color: "var(--primary)" }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-light)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: "var(--bg-light)" }}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Find the perfect plant for every corner of your home</p>
            <div className="underline"></div>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} className="category-card">
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Plants</h2>
            <p>Our most popular picks, fresh from the nursery</p>
            <div className="underline"></div>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : (
            <>
              <div className="plants-grid">
                {featuredPlants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
              {plants.length > 8 && (
                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <Link to="/shop" className="btn-primary">
                    View All Plants <FiArrowRight />
                  </Link>
                </div>
              )}
              {plants.length === 0 && !loading && (
                <div className="no-results">
                  <h3>Coming Soon!</h3>
                  <p>Our plant collection is being updated. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Deals Section */}
      {discountedPlants.length > 0 && (
        <section className="section" style={{ background: "var(--primary-pale)" }}>
          <div className="container">
            <div className="section-header">
              <h2>Special Deals</h2>
              <p>Save big on these amazing plants</p>
              <div className="underline"></div>
            </div>
            <div className="plants-grid">
              {discountedPlants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
