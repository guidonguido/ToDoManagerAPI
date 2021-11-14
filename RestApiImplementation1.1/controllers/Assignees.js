'use strict';

var utils = require('../utils/writer.js');
var constants = require('../utils/constants.js');
var Assignees = require('../service/AssigneesService');

module.exports.addTaskAssignee = function addTaskAssignee (req, res, next) {
  const userId = req.user;
  const taskId = req.params.taskId;
  const assigneeId = req.body.id;

  Assignees.addTaskAssignee(assigneeId, taskId, userId)
    .then(function (response) {
      utils.writeJson(res, response, 204);
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the task' }], }, 403);
      }
      else if (response == 404){
          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The task does not exist.' }], }, 404);
      }
      else {
          utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });
};

module.exports.getTaskAssignees = function getTaskAssignees (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId

  const pageNumber = req.query.pageNumber == null ? 1 : req.query.pageNumber;
  var totalAssignees = 0;

  Assignees.getTaskAssigneesTotal(userId, taskId)
    .then( (response) => {
      totalAssignees = response;
      const totalPages = Math.ceil(totalAssignees / constants.OFFSET);

      if ( pageNumber > totalPages ) utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "The page does not exist." }], }, 404);

      Assignees.getTaskAssignees(userId, taskId, pageNumber)
        .then( (response) => {
          const nextPage = Number(pageNumber) + 1;

          if ( pageNumber == totalPages) utils.writeJson(res, { self: "/api/tasks/" + taskId + "/assignees?pageNumber=" + pageNumber,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalAssignees,
                                                                pageItems: response });
                                                            
          if ( pageNumber < totalPages) utils.writeJson(res, { self: "/api/tasks/" + taskId + "/assignees?pageNumber=" + pageNumber,
                                                                next: "/api/tasks/" + taskId + "/assignees?pageNumber=" + nextPage,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalAssignees,
                                                                pageItems: response });
        }).catch( (response) => {

          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        });
    })
    .catch(function(response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner or an assignee of the task' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId does not exist.' }], }, 404);
      }
      else {
        console.log(response)
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
      }
  });
};

module.exports.removeTaskAssignee = function removeTaskAssignee (req, res, next) {
  const userId = req.user;
  const taskId = req.params.taskId;
  const assigneeId = req.params.userId;

  Assignees.removeTaskAssignee(userId, taskId, assigneeId)
  .then(function (response) {
    utils.writeJson(res, response, 204);
  })
  .catch(function (response) {
    if(response == 403){
      utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the task' }], }, 403);
    }
    else if (response == 404){
      utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The task does not exist.' }], }, 404);
    }
    else {
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    }
  });
};
