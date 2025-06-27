import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const VideoLessonForm = ({ moduleId, onCancel, onSave }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    videoUrl: '',
    videoType: 'youtube', 
    description: '',
    duration: '',
    isPublished: true
  });
  
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  
  const validateYouTubeUrl = (url) => {
    if (!url) return false;
    
    
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11}).*$/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11}).*$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11}).*$/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1];
      return id.split('&')[0]; 
    }
    
    
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return id.split('?')[0]; 
    }
    
    
    if (url.includes('youtube.com/embed/')) {
      const id = url.split('embed/')[1];
      return id.split('?')[0]; 
    }
    
    return null;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setLessonData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleVideoTypeChange = (type) => {
    setLessonData(prev => ({ 
      ...prev, 
      videoType: type,
      videoUrl: '' 
    }));
    setVideoPreview(null);
    setUploadedFile(null);
  };
  
  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setLessonData(prev => ({ ...prev, videoUrl: url }));
    
    if (errors.videoUrl) {
      setErrors(prev => ({ ...prev, videoUrl: null }));
    }
    
    if (lessonData.videoType === 'youtube') {
      
      if (validateYouTubeUrl(url)) {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          setVideoPreview(`https://www.youtube.com/embed/${videoId}`);
          setErrors(prev => ({ ...prev, videoUrl: null }));
        } else {
          setVideoPreview(null);
          setErrors(prev => ({ ...prev, videoUrl: 'Could not extract YouTube video ID' }));
        }
      } else if (url) {
        setVideoPreview(null);
        setErrors(prev => ({ ...prev, videoUrl: 'Please enter a valid YouTube URL' }));
      } else {
        setVideoPreview(null);
      }
    } else if (lessonData.videoType === 'vimeo') {
      
      const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/|vimeo\.com\/channels\/\w+\/|vimeo\.com\/groups\/[^\/]+\/videos\/)(\d+)/;
      const match = url.match(vimeoRegex);
      
      if (match && match[1]) {
        setVideoPreview(`https://player.vimeo.com/video/${match[1]}`);
        setErrors(prev => ({ ...prev, videoUrl: null }));
      } else if (url) {
        setVideoPreview(null);
        setErrors(prev => ({ ...prev, videoUrl: 'Please enter a valid Vimeo URL' }));
      } else {
        setVideoPreview(null);
      }
    }
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setErrors(prev => ({ ...prev, file: 'Please select a valid video file' }));
      return;
    }
    
    if (file.size > 500 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size should not exceed 500MB' }));
      return;
    }
    
    setUploadedFile(file);
    setErrors(prev => ({ ...prev, file: null }));
    
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
    setLessonData(prev => ({ ...prev, videoUrl: file.name }));
  };
  
  const handleVideoDurationLoad = (e) => {
    const duration = Math.round(e.target.duration);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    setLessonData(prev => ({ 
      ...prev, 
      duration: `${minutes}:${seconds < 10 ? '0' + seconds : seconds}` 
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!lessonData.title.trim()) {
      newErrors.title = 'Video title is required';
    }
    
    if (lessonData.videoType === 'youtube' && !lessonData.videoUrl.trim()) {
      newErrors.videoUrl = 'Please enter a YouTube URL';
    } else if (lessonData.videoType === 'youtube' && !validateYouTubeUrl(lessonData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid YouTube URL';
    } else if (lessonData.videoType === 'vimeo' && !lessonData.videoUrl.trim()) {
      newErrors.videoUrl = 'Please enter a Vimeo URL';
    } else if (lessonData.videoType === 'upload' && !uploadedFile) {
      newErrors.file = 'Please upload a video file';
    }
    
    if (lessonData.duration && !/^\d+:\d{2}$|^\d+$/.test(lessonData.duration)) {
      newErrors.duration = 'Please enter a valid duration in minutes or MM:SS format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      let videoUrl = lessonData.videoUrl;
      
      if (lessonData.videoType === 'youtube' && validateYouTubeUrl(videoUrl)) {
        const videoId = getYouTubeVideoId(videoUrl);
        if (videoId) {
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      
      const formattedData = {
        title: lessonData.title,
        videoUrl: videoUrl,  
        description: lessonData.description || '',
        duration: lessonData.duration || 0,
        moduleId,
        isPublished: lessonData.isPublished
      };
      
      
      if (uploadedFile && lessonData.videoType === 'upload') {
        formattedData.videoUrl = `uploads/${uploadedFile.name}`;
      }
      
      
      onSave(formattedData);
    } catch (error) {
      console.error('Error creating video lesson:', error);
      setErrors({ submit: 'Failed to create video lesson. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {errors.submit}
        </div>
      )}
      
      {/* Lesson Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Video Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={lessonData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          placeholder="e.g., Introduction to React Components"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* Video Source Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Video Source
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleVideoTypeChange('youtube')}
            className={`px-4 py-2 rounded-md ${
              lessonData.videoType === 'youtube' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              YouTube
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleVideoTypeChange('vimeo')}
            className={`px-4 py-2 rounded-md ${
              lessonData.videoType === 'vimeo' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.396 7.164c-.093 2.026-1.507 4.799-4.245 8.32C15.322 19.161 12.928 21 10.97 21c-1.214 0-2.239-1.119-3.079-3.359l-1.68-6.159c-.623-2.239-1.29-3.36-2.005-3.36-.156 0-.701.328-1.634.98l-.978-1.255c1.027-.902 2.04-1.805 3.037-2.708C6.001 3.95 7.03 3.327 7.715 3.264c1.619-.156 2.616.951 2.99 3.321.404 2.557.685 4.147.841 4.769.467 2.121.981 3.181 1.542 3.181.435 0 1.09-.688 1.963-2.065.871-1.376 1.338-2.422 1.401-3.142.125-1.187-.343-1.782-1.401-1.782-.498 0-1.012.115-1.541.341 1.023-3.35 2.977-4.977 5.862-4.884 2.139.063 3.148 1.45 3.024 4.161z"/>
              </svg>
              Vimeo
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleVideoTypeChange('upload')}
            className={`px-4 py-2 rounded-md ${
              lessonData.videoType === 'upload' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Video
            </div>
          </button>
        </div>
      </div>
      
      {/* Video URL or Upload based on type */}
      <div>
        {lessonData.videoType === 'upload' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Video <span className="text-red-500">*</span>
            </label>
            
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center">
                <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag and drop a video file or click to select</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">MP4, WebM, or Ogg formats (max 500MB)</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('video-upload').click()}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800/60"
                >
                  Select Video
                </button>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium truncate max-w-xs">{uploadedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      setVideoPreview(null);
                      setLessonData(prev => ({ ...prev, videoUrl: '' }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {videoPreview && (
                  <div className="aspect-w-16 aspect-h-9 mt-2">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded"
                      onLoadedMetadata={handleVideoDurationLoad}
                    />
                  </div>
                )}
              </div>
            )}
            
            {errors.file && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {lessonData.videoType === 'youtube' ? 'YouTube URL' : 'Vimeo URL'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="videoUrl"
              name="videoUrl"
              value={lessonData.videoUrl}
              onChange={handleVideoUrlChange}
              className={`w-full px-3 py-2 border ${errors.videoUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
              placeholder={`e.g., ${lessonData.videoType === 'youtube' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 'https://vimeo.com/123456789'}`}
            />
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.videoUrl}</p>
            )}
            
            {videoPreview && (
              <div className="mt-4 aspect-w-16 aspect-h-9">
                <iframe
                  src={videoPreview}
                  className="w-full h-64 rounded"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Video Description with Markdown Support */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Video Description
            </label>
            <div className="flex space-x-2">
            <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`text-xs px-2 py-1 rounded ${!previewMode 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
                Edit
            </button>
            <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`text-xs px-2 py-1 rounded ${previewMode 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
                Preview
            </button>
            </div>
        </div>
        
        {previewMode ? (
            <div 
            className="w-full min-h-[200px] p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm overflow-auto prose prose-primary dark:prose-invert max-w-none bg-white dark:bg-dark-card"
            dangerouslySetInnerHTML={{ __html: marked(lessonData.description || '') }}
            />
        ) : (
            <textarea
            id="description"
            name="description"
            value={lessonData.description}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 font-mono"
            placeholder="Describe what students will learn in this video. You can use Markdown for formatting."
            ></textarea>
        )}
        
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Use Markdown to format your description. <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank">Learn more</a>
        </p>
      </div>

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={lessonData.duration}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
            placeholder="e.g., 10:30"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Duration in minutes or MM:SS format
          </p>
        </div>
        
        {/* Published Status */}
        <div className="flex items-center h-full pt-6">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={lessonData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make this video available to students immediately
          </label>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Video'
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default VideoLessonForm;