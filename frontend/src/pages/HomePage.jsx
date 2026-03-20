import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [topProviders, setTopProviders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "Plumbing", icon: "🔧" },
    { name: "AC Repair", icon: "❄️" },
    { name: "Home Cleaning", icon: "🧹" },
    { name: "Tutoring", icon: "📘" },
    { name: "Electrical", icon: "💡" }
  ];

  const loadTopProviders = async () => {
    const res = await fetch("http://localhost:5000/api/providers/top");
    const data = await res.json();
    setTopProviders(data);
  };

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      navigate(`/category/${keyword}`);
    }
  };

  useEffect(() => {
    loadTopProviders();
  }, []);

  return (
    <div className="container">
      <h1 className="main-title">FIXIT</h1>
      <p className="tagline">All of your things in one place</p>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search service or category"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <h2>Service Categories</h2>
      <div className="category-box">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(`/category/${category.name}`)}
          >
            <div className="category-icon">{category.icon}</div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>

      <h2>Top 5 Best Rated Providers</h2>
      <div className="top-grid">
        {topProviders.map((provider) => (
          <div key={provider.id} className="card">
            <p><strong>Name:</strong> {provider.name}</p>
            <p><strong>Category:</strong> {provider.category}</p>
            <p><strong>Rating:</strong> {provider.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;