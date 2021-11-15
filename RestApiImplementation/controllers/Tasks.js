'use strict';

var utils = require('../utils/writer.js');
var constants = require('../utils/constants.js');
var Tasks = require('../service/TasksService');

module.exports.createTask = function createTask (req, res, next) {
  var task = req.body;
  var ownerId = req.user;
  Tasks.createTask(task, ownerId)
      .then(function(response) {
          utils.writeJson(res, response, 201);
      })
      .catch(function(response) {
          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
      });
};

module.exports.getAllPublicTasks = function getAllPublicTasks (req, res, next) {
  var totalTasks = 0;
  var nextPage=0;
  Tasks.getPublicTasksTotal()
      .then(function(response) {
        totalTasks = response;

        Tasks.getAllPublicTasks(req.query.pageNumber)
          .then(function(response) {
            if (req.query.pageNumber == null) var pageNumber = 1;
            else var pageNumber = req.query.pageNumber;
            var totalPages =Math.ceil(totalTasks / constants.OFFSET);
            nextPage = Number(pageNumber) + 1;

            if (pageNumber>totalPages) {
                utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "The page does not exist." }], }, 404);
            } else if (pageNumber == totalPages) {
                utils.writeJson(res, {
                  self: "/api/tasks/public?pageNumber=" + pageNumber,
                  totalPages: totalPages,
                  currentPage: Number(pageNumber),
                  totalItems: totalTasks,
                  pageItems: response
                });
            } else {
                utils.writeJson(res, {
                  self: "/api/tasks/public?pageNumber=" + pageNumber,
                  nextPage: "/api/tasks/public?pageNumber=" + nextPage,
                  currentPage: Number(pageNumber),
                  totalPages: totalPages,
                  totalItems: totalTasks,
                  pageItems: response,
                });
            }
          })
          .catch(function(response) {
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
          });

      })
      .catch(function(response) {
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
      });
};

module.exports.getAllTasks = function getAllTasks (req, res, next) {
  const pageNumber = req.query.pageNumber == null ? 1 : req.query.pageNumber;
  const type = req.query.type == null ? 'all' : req.query.type.trim().toLowerCase();
  const userId = req.user
  var totalTasks = 0;

  Tasks.getAllTasksTotal(userId, type)
    .then( (response) => {
      totalTasks = response;
      const totalPages = Math.ceil(totalTasks / constants.OFFSET);

      if ( pageNumber > totalPages ) utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "The page does not exist." }], }, 404);

      Tasks.getAllTasks(userId, type, pageNumber)
        .then( (response) => {
          const nextPage = Number(pageNumber) + 1;

          console.log("response = ", response)


          if ( pageNumber == totalPages) utils.writeJson(res, { self: "/api/tasks?type=" + type + "&pageNumber=" + pageNumber,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalTasks,
                                                                pageItems: response });
                                                            
          if ( pageNumber < totalPages) utils.writeJson(res, { self: "/api/tasks?type=" + type + "&pageNumber=" + pageNumber,
                                                                nextPage: "/api/tasks?type=" + type + "&pageNumber=" + nextPage,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalTasks,
                                                                pageItems: response });
        }).catch( (response) => {
          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        });
    })
    .catch( (response) => {
      utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
    });
};
