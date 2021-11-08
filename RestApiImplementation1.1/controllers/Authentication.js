'use strict';

var utils = require('../utils/writer.js');
var Authentication = require('../service/AuthenticationService');



module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  Authentication.authenticateUser(body)
    .then(function (response) {
      if( response === "INV.EMAIL")
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }],}, 404);
      if( response === "WRONG.PSW")
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Wrong password' }],}, 401);
      else{
        const token = response.token;
        const expireTime = response.expireTime;
        const userId = response.userId;
        const userName = response.userName;
        
        res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
        res.json({ id: userId, name: userName });
      }
    })
    .catch(function (err) {
      new Promise((resolve) => { setTimeout(resolve, 1000) })
      .then(() => {
        res.status(401).json(authErrorObj)
      })
    });
};

module.exports.logoutUser = function logoutUser (req, res, next, body) {
  res.clearCookie('token').end();
  /*Authentication.logoutUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });*/
};
