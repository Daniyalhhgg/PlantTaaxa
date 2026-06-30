import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../utils/api";
import PlantCard from "../components/PlantCard";

const allCategories = [
  "All", "Indoor", "Outdoor", "Succulent", "Flowering", "Tropical",
  "Herb", "Pots", "Watering", "Sprays", "Tools", "Decor", "Other"
];

const sizes = ["All Sizes", "Small", "Medium", "Large"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A-Z" },
  { value: "discount", label: "Best Deals" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [size, setSize] = useState("All Sizes");
  const [sort, setSort] = useState("newest");

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

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  let filtered = [...plants];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }

  switch (sort) {
    case "price-low":
      filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
      break;
    case "price-high":
      filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
      break;
    case "name-az":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "discount":
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      break;
    default:
      break;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Our Plant Collection</h2>
          <p>Browse our full range of plants, pots, and accessories</p>
          <div className="underline"></div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <FiSearch style={{ fontSize: 18, color: "var(--text-light)" }} />
            <input
              type="text"
              className="search-input"
              placeholder="Search plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Size:</label>
            <select
              className="filter-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort:</label>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 20, fontSize: 14, color: "var(--text-light)" }}>
          Showing {filtered.length} {filtered.length === 1 ? "plant" : "plants"}
          {category !== "All" && ` in ${category}`}
          {size !== "All Sizes" && ` (${size})`}
        </div>

        {/* Plant Grid */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : filtered.length > 0 ? (
          <div className="plants-grid">
            {filtered.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No plants found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
