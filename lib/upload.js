const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },

  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

var fileFilter = function (req, file, cb) {
  if (file.mimetype.indexOf('image') == -1) {
    console.log('no es imagen');
    cb(new Error('Only images allowed in photo field'));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
