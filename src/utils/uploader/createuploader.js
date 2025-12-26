const multer = require('multer');
const path = require('path');

const createUploader = ({
  uploadPath,
  fieldName,
  maxCount = 1,
  allowedExt = ['.png', '.jpg', '.jpeg']
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path.basename(file.originalname, ext);
      const fileName = `${baseName}-${Date.now()}${ext}`;
      cb(null, fileName);
    }
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error('Only png, jpg, jpeg files are allowed'));
    }
    cb(null, true);
  };

  const upload = multer({ storage, fileFilter });

  // single vs multiple
  return maxCount === 1
    ? upload.single(fieldName)
    : upload.array(fieldName, maxCount);
};

module.exports = { createUploader };
