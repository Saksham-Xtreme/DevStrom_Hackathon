require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("./src/config/passport");
const authRoutes = require("./src/modules/auth/auth.routes");
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL
    })
);

app.use(passport.initialize());

app.use(helmet());
app.use("/api/auth", authRoutes);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

module.exports = app;