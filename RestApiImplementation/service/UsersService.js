'use strict';

const User = require("../components/user");
const db = require('../components/db');
var constants = require('../utils/constants.js');

/**
 * Get information about the users
 * Retrieve the available information (passwords excluded) about all the users.
 *
 * returns Users
 **/
exports.getAllUsers = function(pageNumber) {
  return new Promise((resolve, reject) => {
    var limits = getPagination(pageNumber);
    var sql = "SELECT id, name, email FROM users";
    if (limits.length != 0) sql += " LIMIT ?,?";
    db.all(sql, limits, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let users = rows.map((row) => User.createUser(row));
        resolve(users);
      }
    });

  });
}

/**
 * Retrieve the number of users
 * 
 * Input: 
 * Output:
 * - total number of users
 * 
 **/
 exports.getAllUsersTotal = function() {
  return new Promise((resolve, reject) => {
    const sqlNumOfUsers = "SELECT count(*) as total FROM users "
    db.get(sqlNumOfUsers, [], (err, size) => {
        if (err) {
            reject(err);
        } else {
          resolve(size.total);
        }
    });
  });
}



const getPagination = function(pageNumber) {
  var size = constants.OFFSET;
  var limits = [];
  if (pageNumber == null) {
    pageNumber = 1;
  }
  limits.push(size * (pageNumber - 1));
  limits.push(size);
  return limits;
}