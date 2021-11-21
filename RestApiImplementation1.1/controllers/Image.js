'use strict';

var utils = require('../utils/writer.js');
var Image = require('../service/ImageService');

module.exports.deleteTaskImage = function deleteTaskImage (req, res, next) {
  const userId = req.user;
  const taskId = req.params.taskId;
  const imageId = req.params.imageId;

  Image.deleteTaskImage(userId, taskId, imageId)
        .then(function(response) {
            utils.writeJson(res, response, 204);
        })
        .catch(function(response) {
          if(response == 403){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner nor assignee of the task' }], }, 403);
          }
          else if (response == 404){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId or imageId does not exist.' }], }, 404);
          }
          else {
            console.log(response)
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        }
      })
}

module.exports.getTaskImage = function getTaskImage (req, res, next) {
  const userId = req.user;
  const taskId = req.params.taskId;
  const imageId = req.params.imageId;

  Image.getTaskImage(userId, taskId, imageId)
    .then(function (response) {
        utils.writeJson(res, response);
    
    }).catch(function(response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner nor assignee of the task' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId or imageId does not exist.' }], }, 404);
      }
      else {
        console.log(response)
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
      }
  });
};
