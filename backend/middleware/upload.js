const { upload } = require('../utils/fileUpload');

module.exports = {
  avatarUpload: upload.single('avatar'),
  courseImage: upload.single('coverImage'),
  multipleFiles: upload.array('files', 5)
};