const multer = require('multer');

var storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('not an image'));
    }
  },
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    //cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
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
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
