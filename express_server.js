const express = require('express');
const cookieSession = require('cookie-session');
const { Template } = require('ejs');
const bcrypt = require('bcryptjs');
const { getUserByEmail, urlsForUser} = require('./helpers');
const salt = bcrypt.genSaltSync(10);
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['this is my key', 'this is another key']
}));

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "AtG8yF"
  },
  Psm5xK: {
    longURL: "http://www.google.com",
    userID: "jY2p0C"
  }
};


// User database
const users = {};

// creates random ID
const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = [];
  while (result.length < 6) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return (result.join(''));
};


// main paige end point
app.get("/", (req, res) => {
  res.redirect(302, "/login");
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
  const userProfile = users[req.session.user_id];
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: userProfile
  };
  if (req.session.user_id) {
    res.render("urls_index", templateVars);
  } else {
    res.render("login_prompt", templateVars);
  }
});

// endpoint for rendering new urls template
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(302, "/login");
  } else {
    const templateVars = { user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
});

// posts data provided in form above
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${id}`);
  } else {
    res.send("User must be logged in to shorten URLs");
  }
});

// renders single url based on id request url
app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Page does not exist');
  } else if (urlDatabase[req.params.id].userID === req.session.user_id) {
      const dataBaseURL = urlDatabase[req.params.id].longURL;
      const templateVars = {
        id: req.params.id,
        longURL: dataBaseURL,
        user: users[req.session.user_id]
      };
      res.render("urls_show", templateVars);
    } else {
    res.status(403).send('You do not own this URL');
  }
});

// redirects to long url
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Page not found");
  }
});

// redirects to URL page when edit is clicekd
app.post("/urls/:id", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
});

// Post route to replace longURL with new one provided
app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id].userID === req.session.user_id) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session.user_id]};
    res.render("urls_not_owned", templateVars);
  }
});

// deletes URL from database
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id].userID === req.session.user_id) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session.user_id]};
    res.render("urls_not_owned", templateVars);
  }
});

// sets cookie upon login
app.post("/login", (req, res) => {
  let userProfile = getUserByEmail(users, req.body.email);
  userID = userProfile.id;
  if (userID && bcrypt.compareSync(req.body.password, users[userID].password)) {
    req.session.user_id = userID;
    res.redirect("/urls");
  } else {
    res.status(403).send("User email or password is incorrect");
  }
});

// clears cookie upon logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Registers new user
app.get("/register", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/register", (req, res) => {
  if (req.body.email.trim() && req.body.password.trim()) {
    if (!getUserByEmail(users, req.body.email)) {
      const userID = generateRandomString();
      users[userID] = {
        id: userID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
      };
      req.session.user_id = userID;
      res.redirect("/urls");
    } else {
      res.status(400).send("Account already exists");
    }
  } else {
    res.status(400).send("Please enter a valid email and password");
  }
});

app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("login", templateVars);
  } else {
    res.redirect("/urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
