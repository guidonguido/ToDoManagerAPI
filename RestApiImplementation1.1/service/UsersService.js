'use strict';


/**
 * Get information about the users
 * Retrieve the available information (passwords excluded) about all the users.
 *
 * returns Users
 **/
exports.getAllUsers = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "pageNumber" : 6,
  "totalPages" : 0,
  "pageItems" : [ {
    "password" : "password",
    "name" : "name",
    "self" : "http://example.com/aeiou",
    "id" : 1,
    "email" : "email"
  }, {
    "password" : "password",
    "name" : "name",
    "self" : "http://example.com/aeiou",
    "id" : 1,
    "email" : "email"
  } ],
  "self" : "http://example.com/aeiou"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

