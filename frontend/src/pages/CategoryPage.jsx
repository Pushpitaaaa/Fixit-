import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [keyword, setKeyword] = useState("");

  const loadCategoryProviders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/providers");
      const data = await res.json();

      const filtered = data.filter((provider) =>
        provider.category.toLowerCase().includes(categoryName.toLowerCase())
      );

      setProviders(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/providers/search?keyword=${keyword}`
      );
      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategoryProviders();
  }, [categoryName]);

  return (
    <div className="container">
      <h1 className="main-title">FIXIT</h1>
      <p className="tagline">All of your things in one place</p>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search service or provider"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={() => navigate("/")} className="back-btn">
          Back Home
        </button>
      </div>

      <h2>{categoryName} Providers</h2>

      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        providers.map((provider) => (
          <div key={provider.id} className="card">
            <p><strong>Name:</strong> {provider.name}</p>
            <p><strong>Category:</strong> {provider.category}</p>
            <p><strong>Rating:</strong> {provider.rating}</p>
            <p><strong>Service Fee:</strong> ৳{provider.serviceFee}</p>

            <button
              className="details-btn"
              onClick={() => navigate(`/provider/${provider.id}`)}
            >
              View Cost Breakdown
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CategoryPage;