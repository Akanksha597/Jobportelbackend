const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const recentViewRoutes = require("./routes/RecentviewRouter");
const contactRoutes = require("./routes/contactRoutes");
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/organizations", organizationRoutes);
app.use(
  "/api/Recentview",
  recentViewRoutes
);
app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀",
  });
});

// ERROR HANDLER (IMPORTANT)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5017;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});