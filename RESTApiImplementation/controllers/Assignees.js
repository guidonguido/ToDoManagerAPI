'use strict';

var utils = require('../utils/writer.js');
var Assignees = require('../service/AssigneesService');

module.exports.addTaskAssignee = function addTaskAssignee (req, res, next, body, id) {
  Assignees.addTaskAssignee(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTaskAssignees = function getTaskAssignees (req, res, next, id) {
  Assignees.getTaskAssignees(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeTaskAssignee = function removeTaskAssignee (req, res, next, taskId, userId) {
  Assignees.removeTaskAssignee(taskId, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
