#!/usr/bin/env node

/**
 * Repository Image Validation and Optimization Tool
 * Scans the repository for images and validates/optimizes them
 */

const fs = require('fs');
const path = require('path');
const { validateImage, assessImageQuality, optimizeImage } = require('../utils/imageValidation');

const REPO_ROOT = path.join(__dirname, '..', '..');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'uploads'];

/**
 * Recursively find image files in a directory
 */
const findImageFiles = (dir, images = []) => {
  if (!fs.existsSync(dir)) return images;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip ignored directories
      if (!IGNORE_DIRS.includes(item)) {
        findImageFiles(fullPath, images);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }
  
  return images;
};

/**
 * Format file size for display
 */
const formatSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)}${units[unitIndex]}`;
};

/**
 * Main validation function
 */
const validateRepositoryImages = async () => {
  console.log('🔍 Scanning repository for images...\n');
  
  const imageFiles = findImageFiles(REPO_ROOT);
  
  if (imageFiles.length === 0) {
    console.log('✅ No images found in repository');
    return;
  }
  
  console.log(`📊 Found ${imageFiles.length} image(s) to validate:\n`);
  
  const results = {
    valid: 0,
    invalid: 0,
    optimizable: 0,
    totalSize: 0,
    issues: []
  };
  
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(REPO_ROOT, imagePath);
    const stats = fs.statSync(imagePath);
    results.totalSize += stats.size;
    
    console.log(`🖼️  ${relativePath} (${formatSize(stats.size)})`);
    
    try {
      // Determine max dimensions based on file location
      let maxDimensions = { width: 2048, height: 2048 };
      if (relativePath.includes('assets/') || relativePath.includes('screenshot')) {
        maxDimensions = { width: 2048, height: 5000 }; // Allow tall screenshots
      }
      
      // Validate image
      const validation = await validateImage(imagePath, { maxDimensions });
      
      if (validation.isValid) {
        results.valid++;
        console.log(`   ✅ Valid ${validation.metadata.format} - ${validation.metadata.width}x${validation.metadata.height}`);
        
        // Assess quality
        const quality = await assessImageQuality(imagePath);
        console.log(`   📊 Quality: ${quality.quality} (score: ${quality.score}/100)`);
        
        if (quality.score < 80) {
          results.optimizable++;
          results.issues.push({
            file: relativePath,
            type: 'optimization',
            message: `Quality score ${quality.score}/100 - ${quality.suggestions.join(', ')}`
          });
          console.log(`   ⚠️  ${quality.suggestions.join(', ')}`);
        }
        
        // Check for large files
        if (stats.size > 1024 * 1024) { // > 1MB
          results.issues.push({
            file: relativePath,
            type: 'size',
            message: `Large file size: ${formatSize(stats.size)}`
          });
          console.log(`   ⚠️  Large file size: ${formatSize(stats.size)}`);
        }
        
      } else {
        results.invalid++;
        results.issues.push({
          file: relativePath,
          type: 'validation',
          message: validation.error
        });
        console.log(`   ❌ Invalid: ${validation.error}`);
      }
      
    } catch (error) {
      results.invalid++;
      results.issues.push({
        file: relativePath,
        type: 'error',
        message: error.message
      });
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Summary
  console.log('📈 Summary:');
  console.log(`   Valid images: ${results.valid}`);
  console.log(`   Invalid images: ${results.invalid}`);
  console.log(`   Images needing optimization: ${results.optimizable}`);
  console.log(`   Total repository image size: ${formatSize(results.totalSize)}`);
  
  if (results.issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    results.issues.forEach(issue => {
      console.log(`   ${issue.file}: ${issue.message}`);
    });
    
    console.log('\n💡 Recommendations:');
    console.log('   • Use ImgBot to automatically optimize images');
    console.log('   • Consider resizing large images before upload');
    console.log('   • Use WebP format for better compression');
    console.log('   • Add .imgbotconfig file for automated optimization');
  } else {
    console.log('\n✅ All images are properly optimized!');
  }
};

// Run if called directly
if (require.main === module) {
  validateRepositoryImages().catch(console.error);
}

module.exports = { validateRepositoryImages, findImageFiles };