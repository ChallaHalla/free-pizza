import passport from "passport";
import dotenv from 'dotenv'
import mongoose from "mongoose";
const RedditStrategy = require("passport-reddit").Strategy;
const User = mongoose.model("User");

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});


passport.use(new RedditStrategy({
  clientID: process.env.REDDIT_CONSUMER_KEY,
  clientSecret: process.env.REDDIT_CONSUMER_SECRET,
  callbackURL: "http://localhost:3001/auth/reddit/callback",
},
((accessToken, refreshToken, profile, done) => {
  let user;
  User.findOne({
    redditId: profile.id,
  }, (err, user1) => {
    if (!user1) {
      user = new User({
        redditId: profile.id,
        username: profile.name,
        accessToken,
        refreshToken,
      });
      user.save((err) => {
        if (err) console.log(err);
        return done(err, user);
      });
    } else {
      user = user1;
    }
    return done(err, user);
  });
})));


