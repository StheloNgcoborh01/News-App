
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import { db } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

import { Strategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
const port = 3000;

dotenv.config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");


const PgSession = pgSession(session);

app.use(
  session({
    store: new PgSession({
      pool: db, // use existing pool
      createTableIfMissing: true,
      tableName: "user_sessions", // you can name the table anything
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

db.connect();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log("serializeUser:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM userdetails WHERE id = $1", [
      id,
    ]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});



app.use("/auth", authRoutes);
app.use("/", newsRoutes);





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
