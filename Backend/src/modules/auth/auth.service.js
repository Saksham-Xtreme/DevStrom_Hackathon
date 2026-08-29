const User = require("../../models/User");

const findOrCreateGoogleUser = async (profile) => {
    const email = profile.emails?.[0]?.value;

    if (!email) {
        throw new Error("Google account has no email");
    }

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({
        googleId: profile.id,
    });

    if (!user) {
        user = await User.findOne({
            email: normalizedEmail,
        });
    }

    if (!user) {
        user = await User.create({
            email: normalizedEmail,
            name: profile.displayName,
            profileImage: profile.photos?.[0]?.value || null,
            authProvider: "google",
            googleId: profile.id,
            emailVerified: true,
            lastLoginAt: new Date(),
        });
    } else {
        user.googleId = profile.id;
        user.authProvider = "google";
        user.emailVerified = true;
        user.lastLoginAt = new Date();

        if (profile.displayName) {
            user.name = profile.displayName;
        }

        if (profile.photos?.[0]?.value) {
            user.profileImage = profile.photos[0].value;
        }

        await user.save();
    }

    return user;
};

const getUserById = async (userId) => {
    return User.findById(userId).select("-passwordHash");
};

module.exports = {
    findOrCreateGoogleUser,
    getUserById,
};
