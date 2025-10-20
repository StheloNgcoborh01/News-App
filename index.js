import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import axios from "axios";
import pg from "pg";
import { Strategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pgSession from "connect-pg-simple";
import session from "express-session";
import env from "dotenv";
import passport from "passport";

const app = express();
const port = 3000;

dotenv.config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const db = new pg.Client({
  port: 5432,
  database: "News-app",
  user: "postgres",
  password: "asanda0411",
  host: "localhost",
});


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
    const result = await db.query("SELECT * FROM userdetails WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});


app.get("/", async (req, res) => {
  const  isLoggedin = req.isAuthenticated();
  const apiKey = process.env.API_KEY;


  try {
    const response = await axios.get("https://newsapi.org/v2/everything?", {
      params: {
        q: "business",
        apiKey: apiKey,
      },
    });

    const articles = response.data.articles; // Extract articles from the response


 let displayArticles ;
 if (!req.isAuthenticated()){
  displayArticles = articles.slice(0,  6);
 }
 else{
  displayArticles = articles;
 }

    res.render("index", { articles: displayArticles , user: req.user, isLoggedin });
  } catch (error) {
    res.status(500).send("Error fetching news");
  }
});

app.get("/sports", async (req, res) => {
        if (!req.isAuthenticated()){
  return res.render("login.ejs");
}
const  isLoggedin = req.isAuthenticated();
  const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "sports",
        apiKey: apiKey,
      },
    });
    const SportArticles = response.data.articles; // Extract articles from the response
    res.render("sports.ejs", { SportArticles: SportArticles ,  user: req.user, isLoggedin  });
  } catch (error) {
    res.send("cannot get sport news");
  }
});

app.get("/Entertainment", async (req, res) => {

  if (!req.isAuthenticated()){
  return res.render("login.ejs");
}

  const apiKey = process.env.API_KEY;
  const  isLoggedin = req.isAuthenticated();

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "Entertainment",
        apiKey: apiKey,
      },
    });
    const EntertainmentArticles = response.data.articles; // Extract articles from the response
    res.render("Entertainment.ejs", {
      EntertainmentArticles: EntertainmentArticles, user: req.user, isLoggedin
    });
  } catch (error) {
    res.send("cannot get Entertaiment news");
  }
});

app.get("/technology", async (req, res) => {
    if (!req.isAuthenticated()){
  return res.render("login.ejs");
}

  const apiKey = process.env.API_KEY;
  const  isLoggedin = req.isAuthenticated();

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "technology",
        apiKey: apiKey,
      },
    });
    const technologyArticles = response.data.articles; // Extract articles from the response
    res.render("Technology.ejs", { technologyArticles: technologyArticles , user: req.user, isLoggedin });
  } catch (error) {
    res.send("cannot get Entertaiment news");
  }
});

app.get("/Science", async (req, res) => {
    if (!req.isAuthenticated()){
  return res.render("login.ejs");
}

  const apiKey = process.env.API_KEY;
    const  isLoggedin = req.isAuthenticated();

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "science",
        apiKey: apiKey,
      },
    });
    const scienceArticles = response.data.articles; // Extract articles from the response
    res.render("Science.ejs", { scienceArticles: scienceArticles , user: req.user, isLoggedin });
  } catch (error) {
    res.send("cannot get Entertaiment news");
  }
});

app.get("/health", async (req, res) => {
    if (!req.isAuthenticated()){
  return res.render("login.ejs");
}

  const apiKey = process.env.API_KEY;
  const  isLoggedin = req.isAuthenticated();

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "health",
        apiKey: apiKey,
      },
    });
    const healthArticles = response.data.articles; // Extract articles from the response
    res.render("health.ejs", { healthArticles: healthArticles ,  user: req.user, isLoggedin});
  } catch (error) {
    res.send("cannot get Entertaiment news");
  }
});

app.get("/general", async (req, res) => {
    if (!req.isAuthenticated()){
  return res.render("login.ejs");
}

  const apiKey = process.env.API_KEY;
  const  isLoggedin = req.isAuthenticated();

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines?", {
      params: {
        category: "general",
        apiKey: apiKey,
      },
    });
    const generalArticles = response.data.articles; // Extract articles from the response
    res.render("general.ejs", { generalArticles: generalArticles , user: req.user, isLoggedin});
  } catch (error) {
    res.send("cannot get Entertaiment news");
  }
});

app.get("/signUp", (req, res) => {
  
  res.render("signUp.ejs");
});


function Checkpassword(password, CornfirmPassword) {
  return password === CornfirmPassword;
}

app.post(
  "/signUp",
  passport.authenticate("local-signUp", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })
);

app.get("/signUp", (req, res) => {
  if (req.isAuthenticated()){
  return res.redirect("/");
}
  res.render("signUp");
});

app.get("/login", (req, res) => {

  if (req.isAuthenticated()){
  return res.redirect("/");
}
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/index",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })
);

passport.use(
  "local-signUp",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows you to access `req` inside verify
    },
    async function verify(req, email, password, cb) {
      const CornfirmPassword = req.body.Confirmpassword;

      if (!Checkpassword(password, CornfirmPassword)) {
        return cb(null, false, { message: "password does not match" });
      } else {
        try {
          //check if the email exist
          const result = await db.query(
            "SELECT * FROM userdetails WHERE email = $1",
            [email]
          );
          if (result.rows.length > 0) {
            //if the email is available

            const user = result.rows[0];
            if (user.password) {
              return cb(null, false, {
                message: "the account exist try to login",
              });
            } else {
              //if the password is null
              const saltRounds = parseInt(process.env.SALT_ROUNDS);
              const hash = await bcrypt.hash(password, saltRounds);
              console.log(hash);
              const newUser = await db.query(
                "UPDATE userdetails SET password = $1 WHERE email = $2 RETURNING *",
                [hash, email]
              );
              return cb(null, newUser.rows[0]);
            }
          } else {
            //if it a new user
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const hash = await bcrypt.hash(password, saltRounds);
            console.log(hash);
            const newUser = await db.query(
              "INSERT INTO userdetails  (email , password) VALUES ($1, $2) RETURNING *",
              [email, hash]
            );
            return cb(null, newUser.rows[0]);
          }
        } catch (error) {
          return cb(null, false, { message: "unable to create account" });
        }
      }
    }
  )
);

passport.use(
  "local",
  new Strategy({ usernameField: "email" }, async function verify(
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
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
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

app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);

    // destroy the session in the DB
    req.session.destroy(function(err) {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // remove the cookie from browser
      res.redirect("/login");
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
