'use strict';

var Image = require('../components/image');
var fs = require("fs");
const db = require('../components/db');

/**
 * Delete an image associated to the task
 *
 * taskId Long ID of the task
 * imageId Long ID of the image
 * no response value expected for this operation
 **/
exports.deleteTaskImage = function(userId, taskId, imageId) {
  return new Promise((resolve, reject) => {
    // taskId and imageId is valid
    const sql = "SELECT name FROM images WHERE id = ? AND task = ?";
    db.all(sql, [imageId, taskId], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0){
        reject(404);
      }
      else {
        const imageName = rows[0].name;
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
            // delete Image
            const sql3 = 'DELETE FROM images WHERE id = ?';
            db.run(sql3, [imageId], (err) => {
                if (err)
                    reject(err);
                else{
                  var pathFile1 = './uploads/' + imageName + '.png';
                  var pathFile2 = './uploads/' + imageName + '.jpg';
                  var pathFile3 = './uploads/' + imageName + '.gif';
                  if (fs.existsSync(pathFile1)) {
                      fs.unlinkSync(pathFile1);
                  }  
                  if (fs.existsSync(pathFile2)) {
                      fs.unlinkSync(pathFile2);
                  }  
                  if (fs.existsSync(pathFile3)) {
                      fs.unlinkSync(pathFile3);
                  }      
                  resolve(null);
                }
            })
      }
  })
  }})
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
exports.getTaskImage = function(userId, taskId, imageId) {
  return new Promise((resolve, reject) => {
    // taskId and imageId is valid
    const sql = "SELECT * FROM images WHERE id = ? AND task = ?";
    db.all(sql, [imageId, taskId], (err, rows) => {
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
          console.log(size)
          if (err) {
            reject(err);
          } else if( rows[0].total == 0 ) {
            reject(403);
          } else{
            // find images
            var sql3 = "SELECT i.id , i.name, i.task FROM images i WHERE i.task = ? AND i.id = ?";
            db.all(sql3, [taskId, imageId], (err, rows) => {
              if (err) {
                reject(err);
              } else {
                var image = Image.createImage(rows[0]);
                resolve(image);
              }
            });
      }
  })
  }})
})
}

