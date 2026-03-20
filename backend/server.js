const express = require("express");
const cors = require("cors");
const providerRoutes = require("./routes/providerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/providers", providerRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});