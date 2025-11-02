# Telo News App 📰

Telo News is a dynamic web application that aggregates and displays news articles from multiple categories using the NewsAPI.
Users can browse the latest news in categories such as Sports, Technology, Science, Health, Entertainment, and more. 
The application also features secure user authentication, allowing users to sign up, log in, and access personalized content.

This project demonstrates integration of backend APIs, user authentication, and dynamic frontend rendering using modern web technologies.

---

## 🛠 Tech Stack

- Backend:  Node.js, Express.js
  
- *Frontend:*  EJS templating
  
- *Authentication:*  Passport.js, bcrypt , node mailer
  
- **Session Management:** Express-session  

- **API Integration:** NewsAPI

- **Other Tools:** dotenv for environment variables.


## ✨ Features

- User signup and login with email verification  
- Dynamic news categories rendered with a single EJS template  
- Fetches live news from NewsAPI based on category selection
- -user can acess more of the article on an external website
- Password hashing and secure session handling  
- Error handling and flash messages for user feedback
-user can reset password if forgot.

---

## 📸 Screenshots

![login form](screenShoots\signUp.png)
![Home Page](screenShoots\homeNavBar.png)

NB: OTHER screenshots are insde the Screenshots Folder on the repo

---

## ⚡ How to Run the App

1. Clone the repository:  
```on Node terminal
clone te repo
git clone https://github.com/<your-username>/Telo-News-App.git

install Depedencies
npm install

Create a .env file with your NewsAPI key:
API_KEY=your_newsapi_key_here.

open your Local Browser To Run it..eg:
http://localhost:3000

