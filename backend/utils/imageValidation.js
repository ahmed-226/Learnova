const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Image validation and optimization utilities
 */

const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
const MAX_DIMENSIONS = {
  avatar: { width: 1000, height: 1000 },
  courseImage: { width: 1920, height: 1080 },
  documentation: { width: 2048, height: 5000 }, // Allow tall screenshots
  general: { width: 2048, height: 2048 }
};

/**
 * Validate image file properties
 * @param {Buffer|string} input - Image buffer or file path
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} - Validation result with image metadata
 */
const validateImage = async (input, options = {}) => {
  try {
    const { maxFileSize = 10 * 1024 * 1024, allowedFormats = SUPPORTED_FORMATS, maxDimensions = MAX_DIMENSIONS.general } = options;
    
    // Get image metadata
    const metadata = await sharp(input).metadata();
    
    // Check format
    if (!allowedFormats.includes(metadata.format)) {
      throw new Error(`Unsupported image format: ${metadata.format}. Supported formats: ${allowedFormats.join(', ')}`);
    }
    
    // Check file size if input is a file path
    if (typeof input === 'string' && fs.existsSync(input)) {
      const stats = fs.statSync(input);
      if (stats.size > maxFileSize) {
        throw new Error(`File size ${Math.round(stats.size / 1024)}KB exceeds maximum allowed size ${Math.round(maxFileSize / 1024)}KB`);
      }
    }
    
    // Check dimensions
    if (metadata.width > maxDimensions.width || metadata.height > maxDimensions.height) {
      throw new Error(`Image dimensions ${metadata.width}x${metadata.height} exceed maximum allowed ${maxDimensions.width}x${maxDimensions.height}`);
    }
    
    return {
      isValid: true,
      metadata: {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels
      }
    };
  } catch (error) {
    logger.error(`Image validation error: ${error.message}`);
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Optimize image for web delivery
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} - Optimization result
 */
const optimizeImage = async (inputPath, outputPath, options = {}) => {
  try {
    const { 
      quality = 85, 
      format = 'auto', 
      resize = null,
      progressive = true 
    } = options;
    
    let pipeline = sharp(inputPath);
    
    // Apply resize if specified
    if (resize) {
      pipeline = pipeline.resize(resize.width, resize.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Apply format-specific optimizations
    if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality, progressive });
    } else if (format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 9, progressive });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    }
    
    const originalStats = fs.statSync(inputPath);
    await pipeline.toFile(outputPath);
    const optimizedStats = fs.statSync(outputPath);
    
    const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size) * 100;
    
    logger.info(`Image optimized: ${path.basename(inputPath)} - ${reduction.toFixed(2)}% size reduction`);
    
    return {
      success: true,
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      reduction: reduction.toFixed(2)
    };
  } catch (error) {
    logger.error(`Image optimization error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get image quality score based on file size and dimensions
 * @param {string} filePath - Image file path
 * @returns {Promise<Object>} - Quality assessment
 */
const assessImageQuality = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    const stats = fs.statSync(filePath);
    
    // Calculate compression ratio (bytes per pixel)
    const totalPixels = metadata.width * metadata.height;
    const bytesPerPixel = stats.size / totalPixels;
    
    let quality = 'excellent';
    let score = 100;
    
    // Assess quality based on compression ratio
    if (bytesPerPixel < 0.5) {
      quality = 'over-compressed';
      score = 30;
    } else if (bytesPerPixel < 1) {
      quality = 'good';
      score = 80;
    } else if (bytesPerPixel < 2) {
      quality = 'excellent';
      score = 100;
    } else {
      quality = 'under-compressed';
      score = 60;
    }
    
    return {
      quality,
      score,
      bytesPerPixel: bytesPerPixel.toFixed(2),
      fileSize: stats.size,
      dimensions: `${metadata.width}x${metadata.height}`,
      suggestions: score < 80 ? ['Consider re-optimizing this image for better web performance'] : []
    };
  } catch (error) {
    logger.error(`Image quality assessment error: ${error.message}`);
    return {
      quality: 'unknown',
      score: 0,
      error: error.message
    };
  }
};

module.exports = {
  validateImage,
  optimizeImage,
  assessImageQuality,
  SUPPORTED_FORMATS,
  MAX_DIMENSIONS
};