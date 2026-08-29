const express = require("express");

const {
    googleAuth,
    googleCallback
} = require("../../middleware/passport.middleware");

const router = express.Router();

// Start Google OAuth
router.get("/google", googleAuth);

// Google OAuth callback
router.get(
    "/google/callback",
    googleCallback,
    (req, res) => {
        const clientUrl = req.query.state || process.env.CLIENT_URL || "http://localhost:5174";
        const sanitizedClientUrl = clientUrl.replace(/\/$/, "");
        res.redirect(`${sanitizedClientUrl}/dashboard?oauth_success=true`);
    }
);

// OAuth failure
router.get("/login-failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed"
    });
});

module.exports = router;