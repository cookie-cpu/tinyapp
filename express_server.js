
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function () {
  //returns 6 random chars
  return Math.random().toString(16).substr(2, 6);
};


app.get('/', (req, res) => {
  res.redirect(`/urls/`)
  //res.send("Hello! Welcome to the homepage");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete" , (req, res) => {
  //delete users["5315"] urlDatabase[shortURL]
  delete urlDatabase[req.params.shortURL];
  // delete req.body.shortURL
  res.redirect("/urls")
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});