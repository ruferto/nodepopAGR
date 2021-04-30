const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
