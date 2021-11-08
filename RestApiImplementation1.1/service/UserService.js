'use strict';


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

