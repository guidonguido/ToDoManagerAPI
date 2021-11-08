'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.getUserById = function getUserById (req, res, next, userId) {
  User.getUserById(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
