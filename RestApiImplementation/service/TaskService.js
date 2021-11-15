'use strict';
const db = require('../components/db');
const Task = require('../components/task');


/**
 * Deletes a task
 *
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.deleteTask = function(userId, taskId) {
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
            const sql2 = 'DELETE FROM assignments WHERE task = ?';
            db.run(sql2, [taskId], (err) => {
                if (err)
                    reject(err);
                else {
                    const sql3 = 'DELETE FROM tasks WHERE id = ?';
                    db.run(sql3, [taskId], (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(null);
                    })
                }
            })
        }
    });
});
}


/**
 * Find task by ID
 * Returns a single task
 *
 * id Long ID of a task
 * returns Task
 **/
exports.getTaskById = function(userId, taskId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) total FROM tasks WHERE id = ?";
    db.all(sql, [taskId], (err, rows) => {
        if (err)
            reject(err);
        else if (rows.total === 0){
            reject(404);
        } else{
            const sql2 = `SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline, t.completed, t.owner
                          FROM tasks t, assignments a 
                          WHERE t.id = a.task AND t.id = ? AND a.user = ? 
                            OR t.id IN ( SELECT id FROM tasks WHERE id = ? AND owner = ?)
                          LIMIT 1 `;
            db.all(sql2, [taskId, userId, taskId, userId], (err, rows2) => {
                if(rows2.length === 0){
                    reject(403);
                }
                else{     // userId is owner or assignee of requested task 
                  var task = Task.createTask(rows2[0]);
                  task.owner = rows2[0].owner;
                  const sql3 = "SELECT a.user FROM tasks as t, assignments as a WHERE t.id = a.task AND t.id = ?";
                  db.all(sql3, [taskId], (err, rows3) => {
                    if(rows3.length != 0){
                        task.assignedTo = rows3;
                    }
                    resolve(task);
                  })
                }
            });
        }
    });
});
}


/**
 * Updates \"completed\" field of a task
 *
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.updateCompletedTask = function(userId, taskId,completed) {
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
            
          var sql3 = 'UPDATE tasks SET completed = ?';
            
          sql3 = sql3.concat(' WHERE id = ?');
          db.run(sql3, [completed, taskId], function(err) {
              if (err) {
                  reject(err);
              } else {
                  resolve(null);
              }

          })
        }
    });
  })
}





/**
 * Updates a task
 *
 * body Task  (optional)
 * id Long ID of a task
 * no response value expected for this operation
 **/
exports.updateTask = function(userId, taskId,task) {
  return new Promise((resolve, reject) => {
    const important = task.important || false;
    const privateTask = task.private || true;
    const project = task.project || "Personal";
    const date = new Date();
    const deadline = task.deadline || new Date(date.setFullYear(date.getFullYear()+1));
    const completed = task.completed || false;

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
            const sql2 = 'DELETE FROM assignments WHERE task = ?';
            db.run(sql2, [taskId], (err) => {
                if (err)
                    reject(err);
                else {
                    var sql3 = 'UPDATE tasks SET description = ?';
                    var parameters = [task.description];
                    if(important != undefined){
                        sql3 = sql3.concat(', important = ?');
                        parameters.push(important);
                    } 
                    if(privateTask != undefined){
                        sql3 = sql3.concat(', private = ?');
                        parameters.push(privateTask);
                    } 
                    if(project != undefined){
                        sql3 = sql3.concat(', project = ?');
                        parameters.push(project);
                    } 
                    if(deadline != undefined){
                        sql3 = sql3.concat(', deadline = ?');
                        parameters.push(deadline);
                    }
                    if(completed != undefined){
                      sql3 = sql3.concat(', completed = ?');
                      parameters.push(completed);
                  }
                  sql3 = sql3.concat(' WHERE id = ?');
                  parameters.push(taskId);
                  console.log("sql3 = ", sql3)
                  console.log("parameters = ", parameters)
                  db.run(sql3, parameters, function(err) {
                      if (err) {
                          reject(err);
                      } else {
                          resolve(null);
                      }

                  })
                }
            })
        }
    });
});
}

