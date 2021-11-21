'use strict';

var fs = require("fs");
const db = require('../components/db');
var converterClient = require("../utils/converterClient")

/**
 * Retrieve the file of an image associated to the task
 * The image file to be retrieved is linked to the image having the ID specified in the path and it is associated to the task characterized by the ID specified in the path.
 *
 * taskId Long ID of the task
 * imageId Long ID of the image
 * returns byte[]
 **/
exports.getTaskImageFile = function(userId, taskId, imageId, format) {
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
                              t.owner = ? OR a.user = ?) `;
        db.get(sql2, [taskId, userId, userId], (err, size) => {
          if (err) {
            reject(err);
          } else if( rows[0].total == 0 ) {
            reject(403);
          } else{
            // find imageFile on uploaded files
            var pathFile = './uploads/' + imageName + '.' +format;
            if (fs.existsSync(pathFile)) {
              console.log("pathFile ", pathFile)
              resolve(pathFile);
            } else {
              // find imageFile format saved on uploaded files
              var pathFile1 = './uploads/' + imageName + '.jpg';
              var pathFile2 = './uploads/' + imageName + '.gif';
              var pathFile3 = './uploads/' + imageName + '.png';
              var file_path_origin = fs.existsSync(pathFile1) && pathFile1 || fs.existsSync(pathFile2) && pathFile2 || fs.existsSync(pathFile3) && pathFile3
              
              converterClient.convertImage(file_path_origin, file_path_origin.slice(-3), format)
                .then( (response) =>  resolve(response) )
                .catch( (err) => {console.log("conversionError: ", err); reject(err)})

            }
      }
  })
  }})
})
}

