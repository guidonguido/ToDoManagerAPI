'use strict';

var utils = require('../utils/writer.js');
var constants = require('../utils/constants.js');
var Users = require('../service/UsersService');

module.exports.getAllUsers = function getAllUsers (req, res, next) {
  const pageNumber = req.query.pageNumber == null ? 1 : req.query.pageNumber;
  var totalUsers = 0;

  Users.getAllUsersTotal()
    .then( (response) => {
      totalUsers = response;
      const totalPages = Math.ceil(totalUsers / constants.OFFSET);

      if ( pageNumber > totalPages ) utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "The page does not exist." }], }, 404);

      Users.getAllUsers(pageNumber)
        .then( (response) => {
          const nextPage = Number(pageNumber) + 1;

          if ( pageNumber == totalPages) utils.writeJson(res, { self: "/api/users?" + "pageNumber=" + pageNumber,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalUsers,
                                                                pageItems: response });
                                                            
          if ( pageNumber < totalPages) utils.writeJson(res, { self: "/api/users?" + "pageNumber=" + pageNumber,
                                                                next: "/api/users?" + "pageNumber=" + nextPage,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalUsers,
                                                                pageItems: response });
        }).catch( (response) => {

          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        });
    })
    .catch( (response) => {

      utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
    });
}
