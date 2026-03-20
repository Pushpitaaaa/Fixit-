const providers = require("../models/providerModel");
const getAllProviders = (req, res) => {
  res.json(providers);
};
const searchProviders = (req, res) => {
  const keyword = req.query.keyword || "";

  const result = providers.filter((provider) =>
    provider.name.toLowerCase().includes(keyword.toLowerCase()) ||
    provider.category.toLowerCase().includes(keyword.toLowerCase())
  );

  res.json(result);
};
const getTopProviders = (req, res) => {
  const sorted = [...providers].sort((a, b) => b.rating - a.rating);
  const top5 = sorted.slice(0, 5);

  res.json(top5);
};
module.exports = {
  getAllProviders,
  searchProviders,
  getTopProviders
};