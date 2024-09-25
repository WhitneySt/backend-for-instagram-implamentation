const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const instagramRoutes = require("./routes/instagramRoutes");
const config = require("./config");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/instagram", instagramRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
