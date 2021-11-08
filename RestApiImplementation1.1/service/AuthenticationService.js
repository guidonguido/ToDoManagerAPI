'use strict';

var utils = require('../utils/writer.js');

var jsonwebtoken = require('jsonwebtoken');
var jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 604800; //seconds
var authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };


var User = require("../service/UserService")


/**
 * Logs a user in
 * User must send email and password, according to User schema
 *
 * body User 
 * no response value expected for this operation
 **/
exports.authenticateUser = function(body) {
  return new Promise(function(resolve, reject) {
    const email = body.email
    const password = body.password

    User.getUserByEmail(email)
          .then((user) => {
              if (user === undefined) {
                  resolve("INV.EMAIL")
              } else {
                  if (!Users.checkPassword(user, password)) {
                    resolve("WRONG.PSW")
                  } else {
                      const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
                      const res = {
                        token: token, 
                        expireTime: expireTime, 
                        userId: user.id,
                        userName: user.name}
                      resolve(res)
                  }
              }
          }).catch(
              // Delay response when wrong user/pass is sent to avoid fast guessing attempts
              (err) => {
                  throw(err)
              }
          );
  });
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

