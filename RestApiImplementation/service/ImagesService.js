'use strict';

var Image = require('../components/image');
const db = require('../components/db');
var constants = require('../utils/constants.js');


/**
 * Associate an image to the task
 * Associate another image to the task identified by taskId
 *
 * taskId Long ID of the task
 * userId Long ID of the owner user
 * file metadata and content
 * returns Image
 **/
exports.addImage = function(userId, taskId, file) {
  return new Promise((resolve, reject) => {
    var imageName = file.filename;
    var imageExtension = imageName.substring(imageName.lastIndexOf(".")).replace('.', '').toLowerCase();
    if( imageExtension != 'png' && imageExtension != 'jpg' && imageExtension != 'gif'){
      reject(415);
      return;
    }  
    var imageBaseName = imageName.substring(0, imageName.lastIndexOf(".") );

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
          const sql2 = 'INSERT INTO images(name, task) VALUES(?,?)';
          db.run(sql2, [imageBaseName, taskId], function(err) {
            if (err) {
              reject(err);
            } else {
              var imageId = this.lastID;
              var addedImage = new Image(imageId, imageBaseName, taskId);
              resolve(addedImage);
            }
          });
        }
    });
  }) 
}


/**
 * Get task images list
 *
 * taskId Long ID of a task
 * pageNumber Integer Page number of images list (optional)
 * returns Images
 **/
exports.getTaskImages = function(userId, taskId, pageNumber) {
  return new Promise((resolve, reject) => {
    // taskId is valid
    const sql = "SELECT owner FROM tasks WHERE id = ?";
    db.all(sql, [taskId], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0){
        reject(404);
      }
      else {
        // userId is owner or assignee of requested task
        const sql2 =  ` SELECT count(*) as total
                        FROM assignments a, tasks t
                        WHERE a.task = t.id AND t.id = ? AND (
                              t.owner = ? OR a.user = ?) `
        db.get(sql2, [taskId, userId, userId], (err, size) => {
          if (err) {
            reject(err);
          } else if( rows[0].total == 0 ) {
            reject(403);
          } else{
            // find images
            var limits = getPagination(pageNumber);
            var sql3 = "SELECT i.id , i.name, i.task FROM images i WHERE i.task = ?";
            
            if (limits.length != 0) sql3 += " LIMIT ?,?";
            limits.unshift(taskId);
            db.all(sql3, limits, (err, rows) => {
              if (err) {
                reject(err);
              } else {
                var images = rows.map((row) => Image.createImage(row));
                resolve(images);
              }
            });
      }
  })
  }})
})}


/**
 * Retrieve the number of images associated to a specific task
 * 
 * Input: 
 * - userId
 * - taskId
 * Output:
 * - total number of requested images
 * 
 **/
 exports.getTaskImagesTotal = function(userId, taskId) {
  return new Promise((resolve, reject) => {
  // userId is owner of requested task
  const sql = "SELECT owner FROM tasks WHERE id = ?";
  db.all(sql, [taskId], (err, rows) => {
    if (err)
      reject(err);
    else if (rows.length === 0){
      reject(404);
    }
    else {
      const sql2 =  ` SELECT count(*) as total
                      FROM assignments a, tasks t
                      WHERE a.task = t.id AND t.id = ? AND (
                            t.owner = ? OR a.user = ?) `

      db.get(sql2, [taskId, userId, userId], (err, size) => {
        if (err) {
          reject(err);
        } else if( rows[0].total == 0 ) {
          reject(403);
        } else {
          const sql3 = `SELECT count(*) as total FROM images i WHERE i.task = ?`;
          db.get(sql3, [taskId], (err, size) => {
            if (err) {
              reject(err);
            } else {
              resolve(size.total);
            }
          });
        }
      });
    }
});
}
)}



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