'use strict';

var utils = require('../utils/writer.js');
var ImageFile = require('../service/ImageFileService');

module.exports.getTaskImageFile = function getTaskImageFile (req, res, next, taskId, imageId) {
  ImageFile.getTaskImageFile(taskId, imageId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
