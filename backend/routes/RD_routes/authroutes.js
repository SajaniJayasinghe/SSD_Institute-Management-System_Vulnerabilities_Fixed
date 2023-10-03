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

// AuthRouter.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );

// AuthRouter.get(
//   "/facebook/callback",
//   passport.authenticate("facebook"),
//   (req, res) => {
//     const token = helperUtil.createToken(req.user);
//     res.cookie("recruitment", token, { maxAge: 3600000 }); // Store JWT in a cookie
//     res.redirect("http://localhost:8070/coursesdisplay");
//   }
// );

module.exports = AuthRouter;
