import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Development',
    level: 'Beginner',
    price: '',
    isFree: false,
    coverImage: null,
    previewVideo: null
  });
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  
  
  const categories = ['Development', 'Design', 'Business', 'Marketing', 'Data Science', 'Language', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    
    if (name === 'isFree' && checked) {
      setCourseData(prev => ({
        ...prev,
        price: ''
      }));
    }
  };
  
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCourseData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      
      if (name === 'coverImage') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
      
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!courseData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (courseData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!courseData.description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (courseData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!courseData.isFree && (!courseData.price || isNaN(parseFloat(courseData.price)))) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!courseData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
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
      
      
      
      
      
      
      
      
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      
      navigate('/dashboard', { 
        state: { 
          notification: {
            type: 'success',
            message: 'Course created successfully! Now add modules and content.'
          }
        }
      });
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create course. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your knowledge with the world by creating a comprehensive learning experience.
            </p>
          </div>
          
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
                    placeholder="e.g., Complete Web Development Bootcamp"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
                    placeholder="Provide a detailed description of your course..."
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {courseData.description.length}/1000 characters
                  </p>
                </div>
                
                {/* Category and Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={courseData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={courseData.level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Price */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={courseData.isFree}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      This is a free course
                    </label>
                  </div>
                  
                  {!courseData.isFree && (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">$</span>
                        </div>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={courseData.price}
                          onChange={handleChange}
                          className={`w-full pl-7 pr-3 py-2 border ${errors.price ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
                          placeholder="29.99"
                          disabled={courseData.isFree}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Course Media */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Course Media</h2>
              
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md 
                    ${errors.coverImage ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'}">
                    <div className="space-y-1 text-center">
                      {coverImagePreview ? (
                        <div>
                          <img 
                            src={coverImagePreview} 
                            alt="Cover preview" 
                            className="mx-auto h-32 object-cover rounded" 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              setCoverImagePreview(null);
                              setCourseData(prev => ({...prev, coverImage: null}));
                            }}
                            className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="coverImage" className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input 
                                id="coverImage" 
                                name="coverImage" 
                                type="file" 
                                className="sr-only"
                                accept="image/*" 
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.coverImage && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.coverImage}</p>
                  )}
                </div>
                
                {/* Preview Video (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preview Video (Optional)
                  </label>
                  <div className="mt-1 flex items-center">
                    <input 
                      type="file" 
                      id="previewVideo" 
                      name="previewVideo" 
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        dark:file:bg-primary-900/20 dark:file:text-primary-400
                        hover:file:bg-primary-100 dark:hover:file:bg-primary-900/30"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Short video to showcase your course (max 50MB)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
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
                    Creating Course...
                  </span>
                ) : 'Create Course'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateCoursePage;