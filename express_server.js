const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const urlVars = {urls: urlDatabase}
  res.render("urls_index", urlVars);
});

// endpoint for rendering new urls template
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// renders single url based on id request url
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
