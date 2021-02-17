const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");



//Global Objects
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//
//Functions
//


//Returns 6 random chars
const generateRandomString = function () {
  return Math.random().toString(16).substr(2, 6);
};

//Returns true if email passed in exists in database
const emailLookup = function(email) {
  for (user in users){
    if (users[user].email === email) {
      return true
    } 
    return false;
  }
};





//
//ROUTING
//


//Redirects base route to main urls page
app.get('/', (req, res) => {
  res.redirect(`/urls/`)
});


//Presents the database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});

//Redirects the user to the actual longurl webpage based on the shorturl
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



//Renders the register and login pages upon GET requests for those pages
app.get('/register', (req,res) => {
  res.render("register")
})

app.get('/login', (req,res) => {
  res.render("login")
})





//READ
//Renders the URL page reading from the database to display urls
app.get('/urls', (req, res) => {
  const templateVars = 
  { urls: urlDatabase,
    user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});


//Renders the new url page to add a new url
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
});


//Renders the url_show page and pases in the short and long urls to show the user
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
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
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})


//UPDATE
//Updates the url by saving the new value from the form in place of the old longURL
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls")
})



//Clears cookies
app.post('/logout', (req,res) => {
  res.clearCookie("username")
  res.redirect("/urls")
})







app.post('/login', (req,res) => {
  const userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (!emailLookup(email)){
    res.status(403).send(`Email ${email} doesn't exist`)
  }

  //res.cookie("username", req.body.username)
  console.log(`${req.body.email} is trying to log in`)
  console.log(`email: ${email} pass: ${password}`)
  res.redirect("/urls")
})





//Saves user data from registration to users object
app.post('/register', (req,res) => {
  const userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") {//Error if empty strings as params
    res.status(400).send("Email or Password cannot be an empty string");
  } else if (emailLookup(email)) { //Error if email is already in users database
    res.status(400).send("Email already exists");
  } else { //Adds new user to database if no errors

      users[userID] = {
      id: userID,
      email: req.body.email,
      password: req.body.password
    }
  
    res.cookie("user_id", userID)
  }
  //console.log(req.body.email)
  //console.log(req.body.password)
  console.log(users)
  res.redirect("/urls")
})











//Begins listening on the PORT variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});