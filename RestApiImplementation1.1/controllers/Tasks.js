'use strict';

var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');

module.exports.createTask = function createTask (req, res, next, body) {
  Tasks.createTask(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllPublicTasks = function getAllPublicTasks (req, res, next, pageNumber) {
  Tasks.getAllPublicTasks(pageNumber)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllTasks = function getAllTasks (req, res, next, pageNumber, type) {
  Tasks.getAllTasks(pageNumber, type)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
