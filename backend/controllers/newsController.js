import axios from "axios";

export const fetchNewsByCategory = async (category, apiKey) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines",
         { params:
             { category, apiKey }
             
            });
    return response.data.articles;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const SeachNewsByQ = async (q, apiKey) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines",
         { params:
             {q , apiKey }
             
            });
    return response.data.articles;
  } catch (err) {
    console.error(err);
    return [];
  }
};