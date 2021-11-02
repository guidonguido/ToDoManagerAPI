'use strict';


/**
 * Assign task to an existing user
 *
 * body Long ID of an existing user
 * id Long ID of a task
 * returns Task
 **/
exports.addTaskAssignee = function(body,id) {
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
 * Get task assignees list
 *
 * id Long ID of a task
 * returns Users
 **/
exports.getTaskAssignees = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "pageNumber" : 6,
  "totalPages" : 0,
  "pageItems" : [ {
    "password" : "password",
    "name" : "name",
    "self" : "http://example.com/aeiou",
    "id" : 1,
    "email" : "email"
  }, {
    "password" : "password",
    "name" : "name",
    "self" : "http://example.com/aeiou",
    "id" : 1,
    "email" : "email"
  } ],
  "self" : "http://example.com/aeiou"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove task assignment from a user
 *
 * taskId Long ID of a task
 * userId Long ID of an user
 * no response value expected for this operation
 **/
exports.removeTaskAssignee = function(taskId,userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

