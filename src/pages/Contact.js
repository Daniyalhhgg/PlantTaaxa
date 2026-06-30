import React, { useState } from "react";
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import api from "../utils/api";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      await api.post("/api/contact", form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Try WhatsApp instead!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Reach out anytime!</p>
          <div className="underline"></div>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact PlantTaxa</h2>
            <p>
              Have questions about our plants? Need care tips? Want to place a bulk order?
              We're here to help! Reach out through any of the channels below.
            </p>

            <div className="contact-detail">
              <div className="contact-icon"><FaMapMarkerAlt /></div>
              <div className="contact-text">
                <h4>Our Location</h4>
                <p>Pattoki, Punjab, Pakistan</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaPhone /></div>
              <div className="contact-text">
                <h4>Phone</h4>
                <p>+92 300 0000000</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaEnvelope /></div>
              <div className="contact-text">
                <h4>Email</h4>
                <p>info@planttaxa.store</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaClock /></div>
              <div className="contact-text">
                <h4>Working Hours</h4>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <a
              href="https://wa.me/923000000000?text=Hi%20PlantTaxa!%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn-large"
            >
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>

          <div className="contact-form-card">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
