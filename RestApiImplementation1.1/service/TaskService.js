'use strict';


/**
 * Deletes a task
 *
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.deleteTask = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Find task by ID
 * Returns a single task
 *
 * id Long ID of a task
 * returns Task
 **/
exports.getTaskById = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "important" : false,
  "owner" : "http://example.com/aeiou",
  "private" : true,
  "description" : "description",
  "project" : "Personal",
  "self" : "http://example.com/aeiou",
  "id" : 1,
  "completed" : false,
  "deadline" : "2000-01-23T04:56:07.000+00:00",
  "assignedTo" : "http://example.com/aeiou"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Updates \"completed\" field of a task
 *
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.updateCompletedTask = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Updates a task
 *
 * body Task  (optional)
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.updateTask = function(body,id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

