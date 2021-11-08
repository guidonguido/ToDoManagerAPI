'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');

module.exports.getAllUsers = function getAllUsers (req, res, next) {
  Users.getAllUsers()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
