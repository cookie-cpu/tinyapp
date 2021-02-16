
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

//Redirects base route to urls page
app.get('/', (req, res) => {
  res.redirect(`/urls/`)
});

//Renders the URL page
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Renders the new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Renders the url_show page and pases in the database as an object for later use
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

//Presents the database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// generates new shorturl and redirects to a page showing the url
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

//Redirects the user to the actual longurl webpage based on the shorturl
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

app.get("/urls/:shortURL/update" , (req, res) => {
  
  //res.redirect("/urls")
})

app.post("/urls/:shortURL/update", (req, res) => {


  //res.redirect("/urls")
})


//Begins listening on the PORT variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});