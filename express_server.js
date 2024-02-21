const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// User database
const users = {
  AtG8yF: {
    id: "4tG8yF",
    email: "user@example.com",
    password: "password1"
  },
  jY2p0C: {
    id: "jY2p0C",
    email: "user2@example.com",
    password: "password2"
  }
};

// creates random ID
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = [];
  while (result.length < 6) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return (result.join(''));
};


// main paige end point
app.get("/", (req, res) => {
  res.send("Hello!");
});

// returns url database as a JSON string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// tests html 'hello world'
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// renders urls_database
app.get("/urls", (req, res) => {
  const userProfile = users[req.cookies["user_id"]];
  const templateVars = {
    urls: urlDatabase,
    user: userProfile
  }
  res.render("urls_index", templateVars);
});

// endpoint for rendering new urls template
app.get("/urls/new", (req, res) => {
  templateVars = { users: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

// posts data provided in form above
app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// renders single url based on id request url
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

// redirects to long url
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// redirects to URL page when edit is clicekd 
app.post("/urls/:id", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
});

// Post route to replace longURL with new one provided
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// deletes URL from database 
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// sets cookie upon login
app.post("/login", (req, res) => {
  let userID;
  for (const user in users) {
    if (user.email === req.body.email) {
      userID = user.id;
    }
  }
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

// clears cookie upon logout 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Registers new user 
app.get("/register", (req, res) => {
  const templateVars = { 
    user: req.cookies["user_id"],
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password 
  };
  res.cookie("user_id", userID);
  res.redirect("/urls")
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
