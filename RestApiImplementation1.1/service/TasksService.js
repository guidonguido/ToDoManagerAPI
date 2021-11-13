'use strict';

const Task = require('../components/task');
const db = require('../components/db');
var constants = require('../utils/constants.js');


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
  return new Promise((resolve, reject) => {
    var sql = "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline,t.completed FROM tasks t WHERE  t.private = 0 "
    var limits = getPagination(pageNumber);
    if (limits.length != 0) sql = sql + " LIMIT ?,?";
    console.log("query = ", sql)
    console.log("limits = ", limits)

    db.all(sql, limits, (err, rows) => {
        if (err) {
            reject(err);
        } else {
            let tasks = rows.map((row) => createTask(row));
            resolve(tasks);
        }
    });
  });
}

/**
 * Retrieve the number of public tasks
 * 
 * Input: 
 * - none
 * Output:
 * - total number of public tasks
 * 
 **/
 exports.getPublicTasksTotal = function() {
  return new Promise((resolve, reject) => {
      var sqlNumOfTasks = "SELECT count(*) total FROM tasks t WHERE  t.private = 0 ";
      db.get(sqlNumOfTasks, [], (err, size) => {
          if (err) {
              reject(err);
          } else {
              resolve(size.total);
          }
      });
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
exports.getAllTasks = function(userId, type, pageNumber) {
  return new Promise((resolve, reject) => {
    var limits = getPagination(pageNumber);

    var sql =
    (type == 'all') && "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline, t.completed FROM tasks t  WHERE t.id IN ( SELECT task FROM assignments a WHERE a.user = ? ) OR t.owner = ?"
    || (type == 'assigned') && "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline, t.completed FROM tasks t WHERE t.id IN ( SELECT task FROM assignments a WHERE a.user = ?)"
    || (type == 'owned') && "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline, t.completed FROM tasks t WHERE  t.owner = ? "
    
    if (limits.length != 0) sql += " LIMIT ?,?";

    if( type == 'all'){ 
      limits.unshift(userId);
      limits.unshift(userId);
    } else{
      limits.unshift(userId);
    }

    db.all(sql, limits, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let tasks = rows.map((row) => createTask(row));
        resolve(tasks);
      }
    });

  });
}

/**
 * Retrieve the number of public tasks
 * 
 * Input: 
 * - type = 
 *    oneOf:
 *      - assigned
 *      - owned
 *      - all
 * Output:
 * - total number of requested tasks
 * 
 **/
 exports.getAllTasksTotal = function(userId, type) {
  return new Promise((resolve, reject) => {
    const sqlNumOfTasks =
      (type == 'all') && "SELECT count(*) as total FROM tasks t  WHERE t.id IN ( SELECT task FROM assignments a WHERE a.user = ? ) OR t.owner = ?"
      || (type == 'assigned') && "SELECT count(*) as total FROM tasks t WHERE t.id IN ( SELECT task FROM assignments a WHERE a.user = ?)"
      || (type == 'owned') && "SELECT count(*) total FROM tasks t WHERE  t.owner = ? "

    const queryParams = (type == 'all') && [userId, userId] || [userId]
    db.get(sqlNumOfTasks, queryParams, (err, size) => {
        if (err) {
            reject(err);
        } else {
            resolve(size.total);
        }
    });
  });
}



const getPagination = function(pageNumber) {
  var size = constants.OFFSET;
  var limits = [];
  if (pageNumber == null) {
    pageNumber = 1;
  }
  limits.push(size * (pageNumber - 1));
  limits.push(size);
  return limits;
}

const createTask = function(row) {
  const important = (row.important === 1) ? true : false;
  const privateTask = (row.private === 1) ? true : false;
  const completed = (row.completed === 1) ? true : false;
  return new Task(row.tid, row.description, important, privateTask, row.deadline, row.project, completed);
}