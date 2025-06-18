const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * Creates a Cloudinary storage configuration for a specific resource type
 * @param {string} folder - The folder name in Cloudinary
 * @param {Object} options - Additional configuration options
 * @returns {CloudinaryStorage} - Configured storage instance
 */
const createCloudinaryStorage = (folder, options = {}) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `learnova/${folder}`,
      allowed_formats: options.allowedFormats || ['jpg', 'jpeg', 'png', 'gif'],
      transformation: options.transformation || [{ width: 500, height: 500, crop: 'limit' }],
      resource_type: options.resourceType || 'auto'
    }
  });
};

// Pre-configured multer instances for different upload types
const avatarUpload = multer({
  storage: createCloudinaryStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const courseImageUpload = multer({
  storage: createCloudinaryStorage('course-covers'),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const courseVideoUpload = multer({
  storage: createCloudinaryStorage('course-videos', { 
    allowedFormats: ['mp4', 'mov', 'avi', 'webm'],
    resourceType: 'video',
    transformation: [] // No transformation for videos
  }),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const courseFilesUpload = multer({
  storage: createCloudinaryStorage('course-files', {
    allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'],
    resourceType: 'raw'
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

/**
 * Upload files directly to Cloudinary without multer middleware
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise} - Cloudinary upload response
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }
    
    const folder = options.folder || 'learnova';
    const resourceType = options.resourceType || 'auto';
    
    console.log(`Uploading file to Cloudinary: ${filePath}`);
    console.log(`Options: ${JSON.stringify({ folder, resourceType, ...options })}`);
    
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      ...options
    });
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error(`Error cleaning up file ${filePath}:`, cleanupError);
    }
    
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      ...uploadResult
    };
  } catch (error) {
    console.error(`Error uploading to Cloudinary:`, error);
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

const courseContentUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp'); // Use temp directory to store uploads temporarily
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'previewVideo', maxCount: 1 }
]);

module.exports = {
  avatarUpload: avatarUpload.single('avatar'),
  courseImageUpload: courseImageUpload.single('coverImage'),
  courseVideoUpload: courseVideoUpload.single('previewVideo'),
  courseFilesUpload: courseFilesUpload.array('files', 5),
  courseContentUpload: courseContentUpload,
  uploadToCloudinary,
  cloudinary
};