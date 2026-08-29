const passport = require("passport");

const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"]
});

const googleCallback = passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/login-failed"
});

module.exports = {
    googleAuth,
    googleCallback
};