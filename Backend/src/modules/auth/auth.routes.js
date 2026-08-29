const express = require("express");

const {
    googleAuth,
    googleCallback: passportGoogleCallback,
} = require("../../middleware/passport.middleware");

const {
    getCurrentUser,
    googleCallback,
} = require("./auth.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/google", (req, res, next) => {
    console.log("\n🚀 GOOGLE LOGIN STARTED");
    console.log("Request URL:", req.originalUrl);
    console.log("Client URL:", req.query.client_url);

    next();
}, googleAuth);


router.get("/google/callback", (req, res, next) => {
    console.log("\n🔄 GOOGLE CALLBACK HIT");
    console.log("Callback URL:", req.originalUrl);
    console.log("Query params:", req.query);

    next();
}, googleCallback);

// OAuth failure
router.get("/login-failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed",
    });
});

// Current authenticated user
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

module.exports = router;