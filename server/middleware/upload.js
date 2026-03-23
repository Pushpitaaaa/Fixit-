const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const random = Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${random}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedExt = /\.(jpe?g|png|webp)$/i;
  const allowedMime = /^image\/(jpeg|jpg|png|webp)$/i;
  const isValid = allowedExt.test(file.originalname) && allowedMime.test(file.mimetype);

  if (isValid) {
    cb(null, true);
    return;
  }

  cb(new Error('Only jpeg, jpg, png, and webp files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
