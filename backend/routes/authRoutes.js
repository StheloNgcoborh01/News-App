import express from "express";
import passport from "passport";
import { db } from "../config/db.js";
import { Checkpassword } from "../utilis/helpers.js";
import { generateCode, sendCode } from "../utilis/helpers.js";

import dotenv from "dotenv";

import bcrypt from "bcrypt";

const router = express.Router();

dotenv.config();

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
  "https://news-app-l44t.onrender.com/auth/google/index",
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

router.get("/forgotverify",  (req, res) =>{

  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("forgotverify");
});

router.get("/forgotPassword", async (req, res) =>{
  
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("forgotPassword");

});


router.post("/forgotPassword", async (req, res) =>{

 const { email} = req.body;

 try {

      const result = await db.query(
      "SELECT * FROM userdetails WHERE email = $1 AND is_verified = true",
      [email]
    );

    if (!(result.rows.length > 0)){
   return res.render("forgotPassword", {
      error: ["Email Does Not Exist in Our databse please try again"],
    });
    }

    const code = generateCode();
    await sendCode(email, code);

    // Store ALL signup data in session temporarily
    req.session.ForgotTemp = {
      email: email,
      verificationCode: code,
    };

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.render("forgotverify", {
          error: ["Session error. Please try again."],
        });
      }
      res.redirect("/auth/forgotverify");
    });
  
 } catch (error) {
  return res.render("forgotPassword", {
      error: ["An error occurred. Please try again."],
    });
 }



});

router.post("/forgotverify", (req, res) =>{

const { code} = req.body;
 const tempUser = req.session.ForgotTemp;

  if (!tempUser) {
    return res.redirect("/auth/forgotverify");
  }

  if (code.trim() === tempUser.verificationCode){

      return res.redirect("/auth/newpassword");

  }

  else{
   return res.render("forgotverify", {
      error: ["password do not match"],
    });
  }
});

router.get("/newpassword", (req, res) =>{

  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("newpassword");

});

router.post("/newPassword", async (req, res) =>{
  const {password} = req.body;
  const tempUser = req.session.ForgotTemp;

    if (!tempUser) {
    return res.redirect("/auth/forgotPassword");
  }

  console.log(tempUser);

  try {

    const SaltRound = parseInt(process.env.SALT_ROUNDS)
    const hash = await bcrypt.hash(password, SaltRound);

      const result = await db.query("UPDATE userdetails SET password = $1, verification_code = NULL WHERE email = $2 RETURNING *", [hash, tempUser.email] );
       
          delete req.session.ForgotTemp;
         req.login(result.rows[0], (err) => {
          if (err) return next(err);
          res.redirect("/");
        });
  } catch (error) {

     return res.render("newPassword", {
      error: ["Cannot Update Password"],
    });
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
