'use strict';

var utils = require('../utils/writer.js');
var ImageFile = require('../service/ImageFileService');

module.exports.getTaskImageFile = function getTaskImageFile (req, res, next) {
  const userId = req.user;
  const taskId = req.params.taskId;
  const imageId = req.params.imageId;
  var format = req.headers.accept;

  if( !format && format != 'image/png' && format != 'image/jpg' && format != 'image/gif' )
    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Unsupported media type.\nValid formats: [png, jpg, gif]' }], }, 414);

  format = format.slice(-3);
  ImageFile.getTaskImageFile(userId, taskId, imageId, format)
    .then(function (response) {
      res.sendFile(response, {root: "."});
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
