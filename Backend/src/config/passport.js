const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { findOrCreateGoogleUser } = require("../modules/auth/auth.service");

console.log("🔵 Loading passport configuration...");
console.log("🔵 GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("🔵 GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("🔵 GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
            console.log("\n================ GOOGLE STRATEGY ================");
            console.log("✅ Google strategy was reached");
            console.log("Google profile ID:", profile?.id);
            console.log("Google display name:", profile?.displayName);
            console.log(
                "Google email:",
                profile?.emails?.[0]?.value
            );

            try {
                const user = await findOrCreateGoogleUser(profile);

                console.log("✅ Passport authentication successful");
                console.log("User ID:", user._id);
                console.log("================================================\n");

                return done(null, user);
            } catch (error) {
                console.error("\n❌ GOOGLE STRATEGY ERROR");
                console.error(error.message);
                console.error("================================================\n");

                return done(error);
            }
        }
    )
);

module.exports = passport;
