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
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  }
  res.render("urls_index", templateVars);
});

// endpoint for rendering new urls template
app.get("/urls/new", (req, res) => {
  templateVars = { username: req.cookies["username"]};
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
    username: req.cookies["username"] 
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
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// clears cookie upon logout 
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// Registers new user 
app.get("/register", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
