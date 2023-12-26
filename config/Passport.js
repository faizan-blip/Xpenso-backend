const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Auth = require('../models/AuthSchema');

require('dotenv').config()

const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in your database
      const existingUser = await Auth.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        // If the user already exists, return the user
        return done(null, existingUser);
      }

      // If the user doesn't exist, create a new user in the database
      const newUser = await Auth.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        // Add any other necessary fields based on your schema
      });

      // Return the new user
      return done(null, newUser);
    } catch (error) {
      console.error('Error in Google authentication:', error);
      return done(error, null);
    }
  }
  ));

  passport.serializeUser((user, done) => {
    // Serialize user data, typically user.id
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // Deserialize user data, retrieve user from the database based on id
    try {
      const user = await Auth.findById(id);
      done(null, user);
    } catch (error) {
      console.error('Error in deserializing user:', error);
      done(error, null);
    }
  });
};

module.exports = configurePassport;
