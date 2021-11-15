'use strict';


/**
 * Retrieve the file of an image associated to the task
 * The image file to be retrieved is linked to the image having the ID specified in the path and it is associated to the task characterized by the ID specified in the path.
 *
 * taskId Long ID of the task
 * imageId Long ID of the image
 * returns byte[]
 **/
exports.getTaskImageFile = function(taskId,imageId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

