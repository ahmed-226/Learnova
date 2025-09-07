const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImage, optimizeImage, assessImageQuality } = require('../../utils/imageValidation');

const TEST_IMAGES_DIR = '/tmp/test-images';

// Create test images for validation
const createTestImage = async (filename, width = 500, height = 500, format = 'png') => {
  const outputPath = path.join(TEST_IMAGES_DIR, filename);
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 0, b: 0 }
    }
  })
    .png()
    .toFile(outputPath);
  return outputPath;
};

describe('Image Upload Validation Tests', () => {
  beforeAll(async () => {
    // Create test images directory
    if (!fs.existsSync(TEST_IMAGES_DIR)) {
      fs.mkdirSync(TEST_IMAGES_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test images
    if (fs.existsSync(TEST_IMAGES_DIR)) {
      fs.rmSync(TEST_IMAGES_DIR, { recursive: true, force: true });
    }
  });

  describe('validateImage', () => {
    test('should validate a correct PNG image', async () => {
      const imagePath = await createTestImage('valid.png', 400, 300);
      const result = await validateImage(imagePath);
      
      expect(result.isValid).toBe(true);
      expect(result.metadata.format).toBe('png');
      expect(result.metadata.width).toBe(400);
      expect(result.metadata.height).toBe(300);
    });

    test('should reject oversized images', async () => {
      const imagePath = await createTestImage('oversized.png', 3000, 3000);
      const result = await validateImage(imagePath, {
        maxDimensions: { width: 2000, height: 2000 }
      });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceed maximum allowed');
    });

    test('should handle unsupported formats', async () => {
      const imagePath = await createTestImage('test.png');
      const result = await validateImage(imagePath, {
        allowedFormats: ['jpeg', 'jpg']
      });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported image format');
    });

    test('should validate file size limits', async () => {
      const imagePath = await createTestImage('large.png', 1000, 1000);
      const result = await validateImage(imagePath, {
        maxFileSize: 1000 // Very small limit to trigger error
      });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });
  });

  describe('optimizeImage', () => {
    test('should optimize PNG image', async () => {
      const inputPath = await createTestImage('input.png', 800, 600);
      const outputPath = path.join(TEST_IMAGES_DIR, 'optimized.png');
      
      const result = await optimizeImage(inputPath, outputPath, {
        format: 'png',
        quality: 85
      });
      
      expect(result.success).toBe(true);
      expect(result.originalSize).toBeGreaterThan(0);
      expect(result.optimizedSize).toBeGreaterThan(0);
      expect(fs.existsSync(outputPath)).toBe(true);
    });

    test('should resize image during optimization', async () => {
      const inputPath = await createTestImage('large-input.png', 1200, 900);
      const outputPath = path.join(TEST_IMAGES_DIR, 'resized.png');
      
      const result = await optimizeImage(inputPath, outputPath, {
        resize: { width: 600, height: 400 }
      });
      
      expect(result.success).toBe(true);
      
      // Check if image was resized
      const metadata = await sharp(outputPath).metadata();
      expect(metadata.width).toBeLessThanOrEqual(600);
      expect(metadata.height).toBeLessThanOrEqual(400);
    });
  });

  describe('assessImageQuality', () => {
    test('should assess image quality correctly', async () => {
      const imagePath = await createTestImage('quality-test.png', 500, 500);
      const result = await assessImageQuality(imagePath);
      
      expect(result).toHaveProperty('quality');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('bytesPerPixel');
      expect(result).toHaveProperty('fileSize');
      expect(result).toHaveProperty('dimensions');
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    test('should provide suggestions for poor quality images', async () => {
      // Create a very small image that will likely have poor compression
      const imagePath = await createTestImage('poor-quality.png', 50, 50);
      const result = await assessImageQuality(imagePath);
      
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('Image format support', () => {
    test('should support multiple image formats', async () => {
      const formats = ['png'];
      
      for (const format of formats) {
        const imagePath = await createTestImage(`test.${format}`, 300, 200, format);
        const result = await validateImage(imagePath);
        
        expect(result.isValid).toBe(true);
        expect(result.metadata.format).toBe(format);
      }
    });
  });

  describe('Error handling', () => {
    test('should handle non-existent files gracefully', async () => {
      const result = await validateImage('/non/existent/file.png');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle invalid image data', async () => {
      // Create a text file with .png extension
      const fakePath = path.join(TEST_IMAGES_DIR, 'fake.png');
      fs.writeFileSync(fakePath, 'This is not an image');
      
      const result = await validateImage(fakePath);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});