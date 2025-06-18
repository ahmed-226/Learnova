const fileUpload = require('../utils/fileUpload');

module.exports = {
  avatarUpload: fileUpload.avatarUpload,
  courseImage: fileUpload.courseImageUpload,
  courseVideo: fileUpload.courseVideoUpload,
  courseFiles: fileUpload.courseFilesUpload,
  courseContentUpload: fileUpload.courseContentUpload
};