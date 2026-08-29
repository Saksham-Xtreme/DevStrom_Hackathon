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
        res.json({
            success: true,
            message: "Google authentication successful",
            user: req.user
        });
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