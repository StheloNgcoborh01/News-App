import { db } from "../config/db.js";

import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Checkpassword } from "../utilis/helpers.js";

import { generateCode, sendCode } from "../utilis/helpers.js";

// passport.use(
//   "local-signUp",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true, // allows you to access `req` inside verify
//     },
//     async function verify(req, email, password, cb) {
//       const CornfirmPassword = req.body.Confirmpassword;

//       if (!Checkpassword(password, CornfirmPassword)) {
//         return cb(null, false, { message: "password does not match" });
//       } else {
//         try {
//           //check if the email exist
//           const result = await db.query(
//             "SELECT * FROM userdetails WHERE email = $1",
//             [email]
//           );
//           if (result.rows.length > 0) {
//             //if the email is available

//             const user = result.rows[0];
//             if (user.password) {
//               return cb(null, false, {
//                 message: "the account exist try to login",
//               });
//             } else {
//               //if the password is null
//               const saltRounds = parseInt(process.env.SALT_ROUNDS);
//               const hash = await bcrypt.hash(password, saltRounds);
//               console.log(hash);
//               const newUser = await db.query(
//                 "UPDATE userdetails SET password = $1 WHERE email = $2 RETURNING *",
//                 [hash, email]
//               );

//            return cb(null, newUser.rows[0]);
//             }
//           } else {
//             //if it a new user
//             const saltRounds = parseInt(process.env.SALT_ROUNDS);
//             const hash = await bcrypt.hash(password, saltRounds);
//             console.log(hash);
//             const newUser = await db.query(
//               "INSERT INTO userdetails  (email , password) VALUES ($1, $2) RETURNING *",
//               [email, hash]
//             );

//               const code = generateCode();

//               //storing the code temporary in db
//              await db.query(
//               "UPDATE userdetails SET verification_code = $1 WHERE email = $2 RETURNING *",
//                [code, email]
//                );

//              await sendCode(email, code);
// req.session.tempEmail = email;
// req.session.save((err) => {
//   if (err) {
//     return cb(err);
//   }

// return cb(null, newUser.rows[0]);
// });
//           }
//         } catch (error) {
//           return cb(null, false, { message: "unable to create account" });
//         }
//       }
//     }
//   )
// );

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function verify(
    email,
    password,
    cb
  ) {
    try {
      const result = await db.query(
        "SELECT * FROM userdetails WHERE email = $1 ",
        [email]
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;

        if (!password || !storedHashedPassword) {
          console.error("Missing password or hash:", {
            hasPassword: !!password, //returns boolean..like iya checka if password is or not
            hasStoredHash: !!storedHashedPassword,
          });
          return cb(null, false, {
            message: "please try signing up. No Account found",
          });
        }

        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false, { message: "Passwords do not match." });
            }
          }
        });
      } else {
        return cb(null, false, { message: "User Email Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/index",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile.emails[0].value, profile.id);

        const result = await db.query(
          "SELECT * FROM userdetails WHERE email = $1",
          [profile.emails[0].value]
        );
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO userdetails (email, google_id) VALUES ($1, $2) RETURNING *",
            [profile.emails[0].value, profile.id]
          );
          return cb(null, newUser.rows[0]);
        } else {
          const newUser = await db.query(
            "UPDATE userdetails SET google_id = $1 WHERE email = $2 RETURNING * ",
            [profile.id, profile.emails[0].value]
          );
          return cb(null, newUser.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
