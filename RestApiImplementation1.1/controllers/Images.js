'use strict';

var utils = require('../utils/writer.js');
var Images = require('../service/ImagesService');

module.exports.addImage = function addImage (req, res) {
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const file = req.file;


  Images.addImage(userId, taskId, file)
    .then(function (response) {
      utils.writeJson(res, response, 201);
    })
    .catch(function(response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the task' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Requested taskId does not exist' }], }, 404);
      }
      else if (response == 415){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Unsupported Media Type' }], }, 415);
      }
      else {
        console.log(response)
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
    }
  })
};

module.exports.getTaskImages = function getTaskImages (req, res, next, taskId, pageNumber, accept) {
  Images.getTaskImages(taskId, pageNumber, accept)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
