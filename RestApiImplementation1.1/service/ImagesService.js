'use strict';

import Image from "../components/image"
const db = require('../components/db');
var constants = require('../utils/constants.js');


/**
 * Associate an image to the task
 * Associate another image to the task identified by taskId
 *
 * taskId Long ID of the task
 * returns Image
 **/
exports.addImage = function(taskId) {
  return new Promise((resolve, reject) => {
    var imageName = file.filename;
    var imageExtension = imageName.substring(imageName.lastIndexOf(".")).replace('.', '');
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
          // Begin a transaction.
          db.beginTransaction(function(err, transaction) {
            if (err) {
              reject(err)
            } else {
            // Now we are inside a transaction.
            // Use transaction as normal sqlite3.Database object.
            const sql2 = 'INSERT INTO images(name) VALUES(?)';
            transaction.run(sql2, [imageBaseName], function(err) {
              if (err) {
                  reject(err);
              } else {
                var imageId = this.lastID;
                var addedImage = new Image(imageId, taskId, imageBaseName);
                // SQL query to associate the image to the task
                const sql3 = 'INSERT INTO taskImages(taskId, imageId) VALUES(?, ?)';
                transaction.run(sql3, [taskId, imageId], function(err) {
                    if (err) {
                      reject(err);
                    } 
                    else {
                      // Remember to .commit() or .rollback()
                      transaction.commit(function(err) {
                        if (err) reject(err);
                        else {
                          resolve(addedImage);
                        }
                      // or transaction.rollback()
                      });
                    }
                });
              }
            });

            
          }});
          
        }
    });
}) }


/**
 * Get task images list
 *
 * taskId Long ID of a task
 * pageNumber Integer Page number of images list (optional)
 * accept String  (optional)
 * returns Images
 **/
exports.getTaskImages = function(taskId,pageNumber,accept) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "pageNumber" : 6,
  "totalPages" : 0,
  "pageItems" : [ {
    "$schema" : "$schema",
    "name" : "name",
    "fileURI" : "fileURI",
    "self" : "self",
    "id" : 1
  }, {
    "$schema" : "$schema",
    "name" : "name",
    "fileURI" : "fileURI",
    "self" : "self",
    "id" : 1
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

