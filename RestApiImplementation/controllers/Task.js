'use strict';

var utils = require('../utils/writer.js');
var Task = require('../service/TaskService');

module.exports.deleteTask = function deleteTask (req, res) {
  const userId = req.user
  const taskId = req.params.taskId

  Task.deleteTask(userId, taskId)
        .then(function(response) {
            utils.writeJson(res, response, 204);
        })
        .catch(function(response) {
          if(response == 403){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the task' }], }, 403);
          }
          else if (response == 404){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId does not exist.' }], }, 404);
          }
          else {
            console.log(response)
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        }
      })
};

module.exports.getTaskById = function getTaskById (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId

  Task.getTaskById(userId, taskId)
    .then(function (response) {
      response.assignedTo = response.assignedTo.map( (it) => "/api/users/"+it.user)
      utils.writeJson(res, response);
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

module.exports.updateCompletedTask = function updateCompletedTask (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId
  const completed = req.body.completed
  
  if( completed === null ) utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "Completed field missing" }], }, 500);

  Task.updateCompletedTask(userId, taskId, completed)
        .then(function(response) {
            utils.writeJson(res, response, 204);
        })
        .catch(function(response) {
          if(response == 403){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner or an assignee of the task' }], }, 403);
          }
          else if (response == 404){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId does not exist.' }], }, 404);
          }
          else {
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        }
      })
};

module.exports.updateTask = function updateTask (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId

  Task.updateTask(userId, taskId, req.body)
        .then(function(response) {
            utils.writeJson(res, response, 204);
        })
        .catch(function(response) {
          if(response == 403){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the task' }], }, 403);
          }
          else if (response == 404){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId does not exist.' }], }, 404);
          }
          else {
            console.log(response)
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        }
      })
      
};
