import express from "express";
import passport from "passport";
import { db } from "../config/db.js";


const router = express.Router();

router.post(
  "/signUp",
  passport.authenticate("local-signUp", {
    successRedirect: "/auth/verify",
    failureRedirect: "/auth/signUp",
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "auth/login",
  })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/index",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "auth/signUp",
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

router.get("/verify", (req, res) =>{
     
   res.render("verify");

}
);


router.post("/verify", async (req, res) => {
  const code = req.body.code;
  const email = req.user.email;

  console.log(code);

  try {
    const result = await db.query(
      "SELECT * FROM userdetails WHERE email = $1 AND verification_code = $2",
      [email, code.trim()]
    );

    if (result.rows.length > 0) {
      await db.query(
        "UPDATE userdetails SET is_verified = TRUE, verification_code = NULL WHERE email = $1",
        [email]
      );
        if (req.session.tempEmail) {
        delete req.session.tempEmail;
      }

      return res.redirect("/");
    } else {
      res.send(" Invalid verification code. Try again.");
    }
  } catch (err) {
    console.error(err);
    res.send(" Something went wrong. Please try again.");
  }
});



router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    // destroy the session in the DB
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.clearCookie("connect.sid"); // remove the cookie from browser
      res.redirect("/auth/login");
    });
  });
});

export default router;
