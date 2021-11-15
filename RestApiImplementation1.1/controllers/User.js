'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.getUserById = function getUserById (req, res, next) {
  const userId = req.params.userId

  User.getUserById(userId)
      .then(function (response) {
        if(!response){
          utils.writeJson(res, response, 404);
       } else {
         utils.writeJson(res, response);
      }
      })
      .catch(function (response) {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      });
};
