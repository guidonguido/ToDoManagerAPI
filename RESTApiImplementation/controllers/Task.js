'use strict';

var utils = require('../utils/writer.js');
var Task = require('../service/TaskService');

module.exports.deleteTask = function deleteTask (req, res, next, id) {
  Task.deleteTask(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTaskById = function getTaskById (req, res, next, id) {
  Task.getTaskById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateCompletedTask = function updateCompletedTask (req, res, next, id) {
  Task.updateCompletedTask(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateTask = function updateTask (req, res, next, body, id) {
  Task.updateTask(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
