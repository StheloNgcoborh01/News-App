import express from "express";
import passport from "passport";
import { db } from "../config/db.js";
import { Checkpassword } from "../utilis/helpers.js";
import { generateCode, sendCode } from "../utilis/helpers.js";

import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signUp", async (req, res) => {
  const { email, password, Confirmpassword } = req.body;

  if (!Checkpassword(password, Confirmpassword)) {
    return res.render("signUp", { error: ["Password does not match"] });
  }

  try {
    // Check if verified user already exists
    const result = await db.query(
      "SELECT * FROM userdetails WHERE email = $1 AND is_verified = true",
      [email]
    );

    if (result.rows.length > 0) {
      return res.render("signup", {
        error: ["Account already exists. Please login."],
      });
    }

    const code = generateCode();
    await sendCode(email, code);

    // Store ALL signup data in session temporarily
    req.session.tempUser = {
      email: email,
      password: password, // You might want to hash this if storing in session
      verificationCode: code,
    };

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.render("signup", {
          error: ["Session error. Please try again."],
        });
      }
      res.redirect("/auth/verify");
    });
  } catch (error) {
    console.error(error);
    res.render("signup", {
      error: ["Unable to process signup. Please try again."],
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
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

router.get("/verify", (req, res) => {
  res.render("verify");
});

router.post("/verify", async (req, res) => {
  const { code } = req.body;
  const tempUser = req.session.tempUser;

  if (!tempUser) {
    return res.redirect("/signUp");
  }

  if (code.trim() === tempUser.verificationCode) {
    try {
      // Check if unverified user exists 
      const existingUser = await db.query(
        "SELECT * FROM userdetails WHERE email = $1 AND is_verified = false",
        [tempUser.email]
      );

      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hash = await bcrypt.hash(tempUser.password, saltRounds);

      if (existingUser.rows.length > 0) {
        // Update existing unverified user
        const result = await db.query(
          "UPDATE userdetails SET password = $1, is_verified = TRUE, verification_code = NULL WHERE email = $2 RETURNING *",
          [hash, tempUser.email]
        );

        // Clean up session
        delete req.session.tempUser;

        req.login(result.rows[0], (err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      } else {
        // Create new verified user
        const result = await db.query(
          "INSERT INTO userdetails (email, password, is_verified) VALUES ($1, $2, $3) RETURNING *",
          [tempUser.email, hash, true]
        );

        // Clean up session
        delete req.session.tempUser;

        //now we loginn the user 
        req.login(result.rows[0], (err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      }


    } catch (err) {
      console.error(err);
      res.render("verify", { error: ["Something went wrong. Try again."] });
    }
  } else {
    res.render("verify", { error: ["Invalid verification code. Try again."] });
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
