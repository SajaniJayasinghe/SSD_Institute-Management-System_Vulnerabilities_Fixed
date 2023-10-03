const express = require("express");
const passport = require("passport");
const helperUtil = require("../../utils/helper.util");
const AuthRouter = express.Router();

AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = helperUtil.createToken(req.user);
    res.cookie("institute", token, { maxAge: 3600000 }); // Store JWT in a cookie
    res.redirect("http://localhost:1234/coursesdisplay");
  }
);

AuthRouter.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("institute");
  res.redirect("http://localhost:1234/");
});

module.exports = AuthRouter;
