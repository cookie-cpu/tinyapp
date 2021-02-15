const { request } = require("express");

const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

const generateRandomString = function () {
  //returns 6 random chars
  return Math.random().toString(16).substr(2, 6)
}


app.get('/', (req, res) => {
  res.send("Hello! Welcome to the homepage");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.post('/urls', (req, res) => {
  //users["5315"] = {first_name: "John", last_name: "Smith"}
  
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  //console.log(req.body);
  //console.log(req.params)
  res.redirect('/urls')
})


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});