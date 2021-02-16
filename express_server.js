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

//Returns 6 random chars for shortURL code
const generateRandomString = function () {
  return Math.random().toString(16).substr(2, 6);
};

//Redirects base route to urls page
app.get('/', (req, res) => {
  res.redirect(`/urls/`)
});

//Presents the database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});






//READ
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

//Redirects the user to the actual longurl webpage based on the shorturl
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});





//CREATE
// generates new shorturl and redirects to a page showing the url
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});



//DELETE
//Performs a database deletion and redirects back to the url homepage
app.post("/urls/:shortURL/delete" , (req, res) => {
  //delete users["5315"] urlDatabase[shortURL]
  delete urlDatabase[req.params.shortURL];
  // delete req.body.shortURL
  res.redirect("/urls")
})


//UPDATE
//Updates the url by saving the new value from the form in place of the old longURL
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls")
})


app.post('/login', (req,res) => {

})





//Begins listening on the PORT variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});