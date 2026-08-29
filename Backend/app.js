require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const passport = require("./src/config/passport");
const authRoutes = require("./src/modules/auth/auth.routes");
const cronRoutes = require("./src/modules/cron/cron.routes");
const medicineRoutes = require("./src/modules/medicines/medicine.routes");

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5174",
    "https://dev-strom-hackathon.vercel.app",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
    })
);

app.use(helmet());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/medicines", medicineRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!",
    });
});

// 404 for unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Not found",
    });
});

// Global error handler — never leak internal details
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);

    const status = err.status || 500;

    res.status(status).json({
        success: false,
        message: "Something went wrong. Please try again later.",
    });
});

module.exports = app;
