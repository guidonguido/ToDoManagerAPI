'use strict';

var utils = require('../utils/writer.js');
var Authentication = require('../service/AuthenticationService');

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  Authentication.authenticateUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser (req, res, next, body) {
  Authentication.logoutUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
