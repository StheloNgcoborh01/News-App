import express from "express";
import dotenv from "dotenv";
const app = express();
const port = 3000;

import axios from "axios"; 

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));    


app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

  const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/everything?', {
      params: {
        q: 'business',
        apiKey: apiKey,
      }
    });

    const articles = response.data.articles; // Extract articles from the response

    res.render('index', { articles: articles });


  } catch (error) {
    res.status(500).send('Error fetching news');
  }
});

app.get("/sports", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'sports',
        apiKey: apiKey,
      }
    });
    const SportArticles = response.data.articles; // Extract articles from the response
    res.render("sports.ejs" , {SportArticles : SportArticles});
  }
  catch (error){
     res.send("cannot get sport news");
  }
});

app.get("/Entertainment", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'Entertainment',
        apiKey: apiKey,
      }
    });
    const EntertainmentArticles = response.data.articles; // Extract articles from the response
    res.render("Entertainment.ejs" , {EntertainmentArticles : EntertainmentArticles});
  }
  catch (error){
     res.send("cannot get Entertaiment news");
  }
});

app.get("/technology", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'technology',
        apiKey: apiKey,
      }
    });
    const technologyArticles = response.data.articles; // Extract articles from the response
    res.render("Technology.ejs" , {technologyArticles : technologyArticles});
  }
  catch (error){
     res.send("cannot get Entertaiment news");
  }
});

app.get("/Science", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'science',
        apiKey: apiKey,
      }
    });
    const scienceArticles = response.data.articles; // Extract articles from the response
    res.render("Science.ejs" , {scienceArticles :scienceArticles});
  }
  catch (error){
     res.send("cannot get Entertaiment news");
  }
});

app.get("/health", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'health',
        apiKey: apiKey,
      }
    });
    const healthArticles = response.data.articles; // Extract articles from the response
    res.render("health.ejs" , {healthArticles :healthArticles});
  }
  catch (error){
     res.send("cannot get Entertaiment news");
  }
});

app.get("/general", async (req, res) =>{

    const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
      params: {
        category : 'general',
        apiKey: apiKey,
      }
    });
    const generalArticles = response.data.articles; // Extract articles from the response
    res.render("general.ejs" , {generalArticles :generalArticles});
  }
  catch (error){
     res.send("cannot get Entertaiment news");
  }
});




  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});







