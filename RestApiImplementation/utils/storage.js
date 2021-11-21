'use strict';

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads');
    },
  filename: function (req, file, cb) {
    const imageName = file.originalname;
    var imageExtension = imageName.substring(imageName.lastIndexOf(".")).replace('.', '').toLowerCase();
    var imageBaseName = imageName.substring(0, imageName.lastIndexOf(".") );
    cb(null, imageBaseName.concat(".", imageExtension));
  }
});

module.exports.uploadImg = multer({storage: storage}).single('image');

