import express from "express";
import passport from "passport";

const router = express.Router();


router.post(
  "/signUp",
  passport.authenticate("local-signUp", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);


router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/index",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })
);

router.get("/signUp", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signUp");
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login");
});


router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    // destroy the session in the DB
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.clearCookie("connect.sid"); // remove the cookie from browser
      res.redirect("/login");
    });
  });
});

export default router;

