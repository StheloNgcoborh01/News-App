import express from "express";
const app = express();
const port = 3000;

import axios from "axios"; 


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));    


app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything?', {
      params: {
        q: 'bitcoin',
        apiKey: '',
      }
    });

    const articles = response.data.articles; // Extract articles from the response

    // Render to EJS and pass the articles array

    res.render('index', { articles: articles });


  } catch (error) {
    res.status(500).send('Error fetching news');
  }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});







