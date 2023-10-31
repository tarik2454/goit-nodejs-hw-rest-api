const multer = require('multer');
const path = require('path');

const destination = path.join('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  // максимальный размер принятого файла 5Mb
  fileSize: 1024 * 1024 * 5,
};

const upload = multer({
  storage,
  limits,
});

module.exports = upload;
