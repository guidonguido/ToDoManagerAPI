'use strict';

var utils = require('../utils/writer.js');
var constants = require('../utils/constants.js');
var Images = require('../service/ImagesService');

module.exports.addImage = function addImage (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId;
  const file = req.file;
  if (!file) return utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "file body param needed" }], }, 500);
  
  Images.addImage(userId, taskId, file)
    .then(function (response) {
      utils.writeJson(res, response, 201);
    })
    .catch(function(response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner nor assignee of the task' }], }, 403);
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

module.exports.getTaskImages = function getTaskImages (req, res, next) {
  const userId = req.user
  const taskId = req.params.taskId

  const pageNumber = req.query.pageNumber == null ? 1 : Number(req.query.pageNumber);
  var totalImages = 0;

  Images.getTaskImagesTotal(userId, taskId)
    .then( (response) => {
      totalImages = response;
      const totalPages = Math.ceil(totalImages / constants.OFFSET);

      if ( totalPages == 0 ) return utils.writeJson(res, { self: "/api/tasks/" + taskId + "/images?pageNumber=" + pageNumber,
                                                    totalPages: totalPages,
                                                    currentPage: Number(pageNumber),
                                                    totalItems: totalImages,
                                                    pageItems: [] });
      if ( pageNumber > totalPages ) utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': "The page does not exist." }], }, 404);

      Images.getTaskImages(userId, taskId, pageNumber)
        .then( (response) => {
          const nextPage = Number(pageNumber) + 1;

          if ( pageNumber == totalPages) utils.writeJson(res, { self: "/api/tasks/" + taskId + "/images?pageNumber=" + pageNumber,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalImages,
                                                                pageItems: response });
                                                            
          if ( pageNumber < totalPages) utils.writeJson(res, { self: "/api/tasks/" + taskId + "/images?pageNumber=" + pageNumber,
                                                                next: "/api/tasks/" + taskId + "/images?pageNumber=" + nextPage,
                                                                totalPages: totalPages,
                                                                currentPage: Number(pageNumber),
                                                                totalItems: totalImages,
                                                                pageItems: response });
        }).catch( (response) => {

          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
        });
    })
    .catch(function(response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner nor assignee of the task' }], }, 403);
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
