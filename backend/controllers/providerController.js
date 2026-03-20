const providers = require("../models/providerModel");

// get all providers
const getAllProviders = (req, res) => {
  res.json(providers);
};

// search providers
const searchProviders = (req, res) => {
  const keyword = req.query.keyword || "";

  const result = providers.filter((provider) =>
    provider.name.toLowerCase().includes(keyword.toLowerCase()) ||
    provider.category.toLowerCase().includes(keyword.toLowerCase())
  );

  res.json(result);
};

// get top 5 providers
const getTopProviders = (req, res) => {
  const sorted = [...providers].sort((a, b) => b.rating - a.rating);
  const top5 = sorted.slice(0, 5);

  res.json(top5);
};

// get one provider by id
const getProviderById = (req, res) => {
  const id = Number(req.params.id);

  const provider = providers.find((item) => item.id === id);

  if (!provider) {
    return res.status(404).json({ message: "Provider not found" });
  }

  res.json(provider);
};

module.exports = {
  getAllProviders,
  searchProviders,
  getTopProviders,
  getProviderById
};