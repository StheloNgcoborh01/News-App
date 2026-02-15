
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import { db } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
// import checking from "./routes/checking.js";
import flash from "connect-flash";

import "./controllers/authController.js";


const app = express();
const port = process.env.PORT || 10000;


dotenv.config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.set("trust proxy", 1);
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


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.use("/auth", authRoutes);


app.use("/", newsRoutes);

app.listen(port, "0.0.0.0" , () => {
  console.log(`Server is running on http://localhost:${port}`);
});
