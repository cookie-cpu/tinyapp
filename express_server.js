const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');


const app = express();
app.use(cookieParser())
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");



//Global Objects
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

//Returns user ID if email passed in exists in database
const emailLookup = function(email) {
  for (let user in users){
    if (users[user].email === email) {
      return user
    } 
   
  }  return false;
};

//takes ID and database
// returns all urls where ID matches
const urlsForUser = function(urlDatabase, id){
  let output = {};
  for (let urlID in urlDatabase) {
    if (id === urlDatabase[urlID].userID) {
      output[shortURL] = urlDatabase[urlID].longURL
    }
  }
  return output
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
  const longURL = urlDatabase[req.params.shortURL].longURL;
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
  if (!req.cookies["user_id"]){ //no user cookie found
    res.redirect('/login')
  } 
  else {
    
  const userSpecificDB = urlsForUser(urlDatabase, req.cookies["user_id"]) //sorts database by user ID and only returns matching urls
  
  const templateVars = { 
    urls: userSpecificDB,
    user: users[req.cookies["user_id"]] 
  }

    res.render("urls_index", templateVars)
  }
});


//Renders the new url page to add a new url
app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {
    const templateVars = {
      user: users[req.cookies["user_id"]]
    }
    res.render("urls_new", templateVars);
  }
  res.redirect('/')
});


//Renders the url_show page and pases in the short and long urls to show the user
app.get("/urls/:shortURL", (req, res) => {
  if (!req.cookies["user_id"]){
    res.redirect('/login')
  } else if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.cookies["user_id"]] };
      //console.log(urlDatabase)
    res.render("urls_show", templateVars);
  } else {
    res.send("Not autorized to see this")
  }
  // const userSpecificDB = urlsForUser(urlDatabase, req.cookies["user_id"])
});







//CREATE
// generates new shorturl and redirects to a page showing the url
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"]}

  res.redirect(`/urls/${shortURL}`);
});



//DELETE
//Performs a database deletion and redirects back to the url homepage
app.post("/urls/:shortURL/delete" , (req, res) => {
  if (!req.cookies["user_id"]){
    res.send("Not autorized to delete this")
  } else if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID){
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls")
  } else {
    res.redirect("/urls")
  }
})


//UPDATE
//Updates the url by saving the new value from the form in place of the old longURL
app.post("/urls/:shortURL", (req, res) => {
  if (!req.cookies["user_id"]){
    res.redirect('/login')
  } else if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL] = req.body.newURL;
    res.redirect("/urls")
  } else {
    res.send("Not autorized to see this")
  }  
})




//Clears cookies
app.post('/logout', (req,res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})







app.post('/login', (req,res) => {
  const userID = generateRandomString();
  let email = req.body.email;
  let formPassword = req.body.password;
  const user = emailLookup(email)
  
  if (emailLookup(email)){
    if ((bcrypt.compareSync(formPassword, users[user].password))){
      console.log("Passwords match")
      res.cookie("user_id", user)
      res.redirect("/urls")
    } else {
      res.status(403).send("Password is incorrect")
      console.log("Passwords didnt match")
    }

  } else {
    res.status(403).send(`Email ${email} doesn't exist`)
  } 
})




//Saves user data from registration to users object
app.post('/register', (req,res) => {
  const userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") { //Error if empty strings as params
    res.status(400).send("Email or Password cannot be an empty string");

  } else if (emailLookup(email)) { //Error if email is already in users database
    res.status(400).send("Email already exists");

  } else { //Adds new user to database if no errors
     const hashed = bcrypt.hashSync(req.body.password, 10);
      users[userID] = {
        id: userID,
        email: req.body.email,
        password: hashed
      }
      res.cookie("user_id", userID)
      console.log(users)
      res.redirect("/urls");}
})











//Begins listening on the PORT variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});