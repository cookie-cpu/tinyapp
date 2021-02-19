
//
//Functions
//

//Returns 6 random chars
const generateRandomString = function() {
  return Math.random().toString(16).substr(2, 6);
};

//Returns user ID if email passed in exists in database
const emailLookup = function(email ,database) {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
   
  }  return false;
};

//takes ID and database
// returns all urls where ID matches
const urlsForUser = function(urlDatabase, id) {
  let output = {};
  for (let urlID in urlDatabase) {
    if (id === urlDatabase[urlID].userID) {
      output[urlID] = urlDatabase[urlID].longURL;
    }
  }
  return output;
};

module.exports = {urlsForUser, generateRandomString, emailLookup};