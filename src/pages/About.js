import React from "react";
import { FaWhatsapp, FaLeaf, FaTruck, FaHandshake, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="section-header">
          <h2>About PlantTaxa</h2>
          <p>Pattoki's leading online plant nursery</p>
          <div className="underline"></div>
        </div>

        <div className="about-content" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ background: "var(--primary-pale)", borderRadius: "var(--radius-lg)", padding: 32, marginBottom: 32 }}>
            <h3 style={{ color: "var(--primary)", fontSize: 22, marginBottom: 16 }}>Our Story</h3>
            <p style={{ color: "var(--text-medium)", lineHeight: 1.8, fontSize: 16 }}>
              PlantTaxa was born out of a deep love for plants and a desire to bring nature closer
              to every home. Based in Pattoki, Punjab, Pakistan, we are a family-run nursery with
              years of experience in cultivating beautiful, healthy plants.
            </p>
            <p style={{ color: "var(--text-medium)", lineHeight: 1.8, fontSize: 16, marginTop: 12 }}>
              We specialize in a wide variety of indoor and outdoor plants, succulents, flowering plants,
              tropical plants, herbs, and gardening accessories. Every plant is hand-picked and carefully
              nurtured before it reaches your doorstep.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 32 }}>
            {[
              { icon: <FaLeaf />, title: "500+ Plants", desc: "Wide variety of indoor & outdoor plants" },
              { icon: <FaTruck />, title: "Fast Delivery", desc: "Free delivery on orders above Rs. 2000" },
              { icon: <FaHandshake />, title: "Plant Guarantee", desc: "100% healthy plants guaranteed" },
              { icon: <FaStar />, title: "Best Quality", desc: "Hand-picked from our Pattoki nursery" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "var(--bg-white)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: 24, textAlign: "center"
              }}>
                <div style={{ fontSize: 32, color: "var(--primary)", marginBottom: 12 }}>{item.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: "var(--text-light)" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "var(--bg-white)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: 32, textAlign: "center", marginBottom: 32
          }}>
            <FaMapMarkerAlt style={{ fontSize: 32, color: "var(--primary)", marginBottom: 12 }} />
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Visit Us</h3>
            <p style={{ fontSize: 16, color: "var(--text-medium)", marginBottom: 4 }}>Pattoki, Punjab, Pakistan</p>
            <p style={{ fontSize: 14, color: "var(--text-light)" }}>Open Mon - Sat, 9:00 AM - 6:00 PM</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: 20, marginBottom: 16 }}>Get in Touch</h3>
            <a
              href="https://wa.me/923278140188?text=Hi%20PlantTaxa!%20I%20want%20to%20know%20more%20about%20your%20nursery."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn-large"
              style={{ display: "inline-flex" }}
            >
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
