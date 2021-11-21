'use strict';

const User = require("../components/user");
const db = require('../components/db');
var constants = require('../utils/constants.js');


/**
 * Assign task to an existing user
 *
 * body Long ID of an existing user
 * id Long ID of a task
 * returns Task
 **/
exports.addTaskAssignee = function(assigneeId, taskId, userId) {
  return new Promise((resolve, reject) => {
    const sql1 = "SELECT owner FROM tasks t WHERE t.id = ?";
    db.all(sql1, [taskId], (err, rows) => {
        if (err)
            reject(err);
        else if (rows.length === 0)
            reject(404);
        else if(userId != rows[0].owner) {
            reject(403);
        }
        else {
            const sql2 = 'INSERT INTO assignments(task, user) VALUES(?,?)';
            db.run(sql2, [taskId, assigneeId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        }
    });
  });
}


/**
 * Get task assignees list
 * Input: 
 * - userId
 * - taskId
 * - pageNumber
 * id Long ID of a task
 * returns Users
 **/
exports.getTaskAssignees = function(userId, taskId, pageNumber) {
  return new Promise((resolve, reject) => {
    // userId is owner of requested task
    const sql = "SELECT owner FROM tasks WHERE id = ?";
    db.all(sql, [taskId], (err, rows) => {
        if (err)
          reject(err);
        else if (rows.length === 0){
          reject(404);
        }
        else if(userId != rows[0].owner) {
          reject(403);
        } else{
          var limits = getPagination(pageNumber);
          var sql2 = "SELECT u.id , u.name, u.email FROM assignments a, users u WHERE a.task=? and a.user = u.id";
          
          if (limits.length != 0) sql2 += " LIMIT ?,?";
          limits.unshift(taskId);
          db.all(sql2, limits, (err, rows) => {

            if (err) {
              reject(err);
            } else {
              const users = rows.map((row) => User.createUser(row));
              resolve(users);
            }
          });
        }
    })
  })
}

/**
 * Retrieve the number of public tasks
 * 
 * Input: 
 * - userId
 * - taskId
 * Output:
 * - total number of requested tasks
 * 
 **/
 exports.getTaskAssigneesTotal = function(userId, taskId) {
  return new Promise((resolve, reject) => {
  // userId is owner of requested task
  const sql = "SELECT owner FROM tasks WHERE id = ?";
  db.all(sql, [taskId], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0){
        reject(404);
      }
      else if(userId != rows[0].owner) {
        reject(403);
      } else{
        const sql2 = `SELECT count(*) as total FROM assignments a WHERE a.task = ?`;
        db.get(sql2, [taskId], (err, size) => {
          if (err) {
            reject(err);
          } else {
            resolve(size.total);
          }
        });
      }
  });
  }
)}


/**
 * Remove task assignment from a user
 *
 * taskId Long ID of a task
 * userId Long ID of an user
 * no response value expected for this operation
 **/
exports.removeTaskAssignee = function(userId, taskId, assigneeId) {
  return new Promise((resolve, reject) => {
    const sql1 = "SELECT owner FROM tasks t WHERE t.id = ?";
    db.all(sql1, [taskId], (err, rows) => {
        if (err)
            reject(err);
        else if (rows.length === 0)
            reject(404);
        else if(userId != rows[0].owner) {
            reject(403);
        }
        else {
            const sql2 = 'DELETE FROM assignments WHERE task = ? AND user = ?';
            db.run(sql2, [taskId, assigneeId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(null);
            })
        }
    });
})
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