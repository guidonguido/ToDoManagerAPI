'use strict';

var utils = require('../utils/writer.js');
var Image = require('../service/ImageService');

module.exports.deleteTaskImage = function deleteTaskImage (req, res, next, taskId, imageId) {
  Image.deleteTaskImage(taskId, imageId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTaskImage = function getTaskImage (req, res, next, taskId, imageId) {
  Image.getTaskImage(taskId, imageId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
