import express from "express";
import { fetchNewsByCategory , SeachNewsByQ } from "../controllers/newsController.js";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();
const apiKey = process.env.API_KEY;

// Home page
router.get("/", async (req, res) => {
  const isLoggedin = req.isAuthenticated();

  const articles = await fetchNewsByCategory("business", apiKey);
  res.render("index", { articles: isLoggedin ? articles : articles.slice(0, 6), user: req.user, isLoggedin });
});


// Categories
["Sports", "technology", "science", "health", "general", "Entertainment"].forEach(category => {
  router.get(`/${category}`, async (req, res) => {
    if (!req.isAuthenticated()) return res.render("login");
    const articles = await fetchNewsByCategory(category, apiKey);
    
    res.render(`${category}`, { [`${category}Articles`]: articles, user: req.user, isLoggedin: req.isAuthenticated() });
  });
});

// Search
router.get("/search", (req, res) => res.render("search",
  {
     searchedArticle: null, // or empty array []
    user: req.user, 
    isLoggedin: req.isAuthenticated() 
    }
));

router.post("/search", async (req, res) => {
  if (!req.isAuthenticated()) return res.render("login");

  const query = req.body.searchInput.toLowerCase().trim();
  const articles = await SeachNewsByQ(query, apiKey);
  res.render("search", { searchedArticle: articles, user: req.user, isLoggedin: req.isAuthenticated() });
});


export default router;
