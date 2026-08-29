const { generateToken } = require("../../utils/jwt");
const authService = require("./auth.service");
const { validateClientUrl } = require("./auth.validation");

const getCurrentUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    return res.json({
        success: true,
        user: req.user,
    });
};

const googleCallback = (req, res) => {
    if (!req.user) {
        console.error("❌ Google callback reached without an authenticated user");
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }

    const token = generateToken(req.user);

    // Prefer the configured frontend origin. The OAuth `state` value carries the
    // frontend origin that started the flow; only trust it if it is an allowed origin.
    const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5174",
        "https://dev-strom-hackathon.vercel.app",
    ].filter(Boolean);

    let clientUrl = process.env.CLIENT_URL || "http://localhost:5174";

    try {
        const requested = validateClientUrl(
            req.query.state || process.env.CLIENT_URL
        );

        if (allowedOrigins.includes(requested)) {
            clientUrl = requested;
        }
    } catch (error) {
        console.error("Invalid client URL in OAuth state, using default");
    }

    const sanitizedClientUrl = clientUrl.replace(/\/$/, "");

    const redirectUrl =
        `${sanitizedClientUrl}/dashboard` +
        `?oauth_success=true` +
        `&token=${encodeURIComponent(token)}`;

    res.redirect(redirectUrl);
};

module.exports = {
    getCurrentUser,
    googleCallback,
};
