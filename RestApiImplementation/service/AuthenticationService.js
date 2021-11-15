'use strict';


/**
 * Logs a user in
 * User must send email and password, according to User schema
 *
 * body User 
 * no response value expected for this operation
 **/
exports.authenticateUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  })
}


/**
 * Logs a user in
 * User must send userId
 *
 * body User 
 * no response value expected for this operation
 **/
exports.logoutUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

