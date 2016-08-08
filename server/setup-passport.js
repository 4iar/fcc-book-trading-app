const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const strategy = new Auth0Strategy({
    domain:        process.env.AUTH0_DOMAIN,
    clientID:      process.env.AUTH0_CLIENT_ID,
    clientSecret:  process.env.AUTH0_CLIENT_SECRET,
    callbackURL:   'http://127.0.0.1:5000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
