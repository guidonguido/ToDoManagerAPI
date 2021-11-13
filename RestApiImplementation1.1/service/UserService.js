'use strict';


const User = require('../components/user');
const db = require('../components/db');


/**
 * Get information about a user
 * Get user resource (password excluded) identified by userId
 *
 * userId Long ID of the user to get
 * returns User
 **/
exports.getUserById = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "password" : "password",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 1,
  "email" : "email"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

/**
 * Get information about a user
 * Get user resource (password excluded) identified by userId
 *
 * userId Long ID of the user to get
 * returns User
 **/
 exports.getUserByEmail = function(userEmail) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.all(sql, [userEmail], (err, rows) => {
        if (err) 
            reject(err);
        else if (rows.length === 0)
            resolve(undefined);
        else{
            const user = createUser(rows[0]);
            resolve(user);
        }
    });
  });
}

const createUser = function (row) {
  const id = row.id;
  const name = row.name;
  const email = row.email;
  const hashedPassword = row.hash;
  return new User(id, name, email, hashedPassword);
}
