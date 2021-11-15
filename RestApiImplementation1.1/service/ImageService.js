'use strict';


/**
 * Delete an image associated to the task
 *
 * taskId Long ID of the task
 * imageId Long ID of the image
 * no response value expected for this operation
 **/
exports.deleteTaskImage = function(taskId,imageId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Retrieve an image data structure associated to the task
 * Image resource, with uri pointing to image file
 *
 * taskId Long ID of a task
 * imageId Long ID of an image
 * returns Image
 **/
exports.getTaskImage = function(taskId,imageId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "$schema" : "$schema",
  "name" : "name",
  "fileURI" : "fileURI",
  "self" : "self",
  "id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

