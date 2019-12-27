import passport from "passport";
import mongoose from "mongoose";
import * as converter from "./../services/conversions";

const { utf8ToBase64, base64ToUtf8 } = converter;
const User = mongoose.model("User");


//   Note that the 'state' option is a Reddit-specific requirement.
exports.redditLogin = (req, res, next) => {
  // set redirect info here
  req.session.state = req.query.state || utf8ToBase64("{}")
  passport.authenticate("reddit", {
    state: req.session.state,
    duration: 'permanent',
    grant_type: "refresh_token",
    scope: "identity edit history flair read submit vote",
  })(req, res, next);
}

// GET /auth/reddit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
exports.redditLoginCallback = (req, res, next) => {
  // Check for origin via state token
  const encodedState = req.query.state;
  const state = JSON.parse(base64ToUtf8(encodedState));

  if (req.query.state === req.session.state) {
    passport.authenticate("reddit", {
      successRedirect: state.returnTo || "/",
      failureRedirect: "/login",
    })(req, res, next);
  } else {
    next(new Error(403));
  }
}
