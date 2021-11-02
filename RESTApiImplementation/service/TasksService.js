'use strict';


/**
 * Create a task
 *
 * body Task  (optional)
 * returns Task
 **/
exports.createTask = function(body) {
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
 * Get all public tasks
 *
 * pageNumber Integer Page number of tasks list (optional)
 * returns Tasks
 **/
exports.getAllPublicTasks = function(pageNumber) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "pageNumber" : 6,
  "totalPages" : 0,
  "pageItems" : [ {
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
  }, {
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
 * Get all tasks. Either owner's private tasks or public
 * Personalizing \"private\" and \"type\" query params, client decides to get all public tasks or only owned ones, providing identification
 *
 * pageNumber Integer Page number of tasks list (optional)
 * type List If authenticated, filter type of tasks willing to retrieve (optional)
 * returns Tasks
 **/
exports.getAllTasks = function(pageNumber,type) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "pageNumber" : 6,
  "totalPages" : 0,
  "pageItems" : [ {
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
  }, {
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

