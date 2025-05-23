import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked'; 

const TextLessonForm = ({ moduleId, onCancel, onSave }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    estimatedTime: '',
    isPublished: true
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
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
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!lessonData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }
    
    if (!lessonData.content.trim()) {
      newErrors.content = 'Lesson content is required';
    }
    
    
    if (lessonData.estimatedTime && !/^\d+$/.test(lessonData.estimatedTime)) {
      newErrors.estimatedTime = 'Please enter a valid number of minutes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    
    if (!file.name.match(/\.(md|markdown)$/i)) {
      setErrors(prev => ({ ...prev, file: 'Only markdown (.md or .markdown) files are supported' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setLessonData(prev => ({ ...prev, content }));
      
      
      if (errors.content || errors.file) {
        setErrors(prev => ({ ...prev, content: null, file: null }));
      }
      
      
      setPreviewMode(true);
    };
    
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, file: 'Error reading file' }));
    };
    
    reader.readAsText(file);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      
      const formattedData = {
        ...lessonData,
        moduleId,
        type: 'text',
        estimatedTime: lessonData.estimatedTime ? parseInt(lessonData.estimatedTime) : null
      };
      
      onSave(formattedData);
    } catch (error) {
      console.error('Error creating lesson:', error);
      setErrors({ submit: 'Failed to create lesson. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const insertMarkdown = (template) => {
    const textArea = document.getElementById('content');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = lessonData.content;
    
    const beforeSelection = text.substring(0, start);
    const selection = text.substring(start, end);
    const afterSelection = text.substring(end);
    
    
    const newText = beforeSelection + 
      template.replace('$1', selection || '') + 
      afterSelection;
    
    setLessonData(prev => ({ ...prev, content: newText }));
    
    
    setTimeout(() => {
      textArea.focus();
      
      
      const newCursorPos = template.includes('$1') && selection
        ? start + template.indexOf('$1') + selection.length
        : start + template.length;
      
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
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
          Lesson Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={lessonData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          placeholder="e.g., Introduction to JavaScript Variables"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* Lesson Content - Markdown Editor */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lesson Content <span className="text-red-500">*</span>
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
        
        {/* Markdown Toolbar */}
        {!previewMode && (
          <div className="flex flex-wrap gap-1 mb-2 p-1 border border-gray-300 dark:border-gray-700 rounded-t-md bg-gray-50 dark:bg-gray-800">
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Bold" onClick={() => insertMarkdown('**$1**')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 13h8m-8 6h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Italic" onClick={() => insertMarkdown('*$1*')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6"></div>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Heading 2" onClick={() => insertMarkdown('\n## $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Heading 3" onClick={() => insertMarkdown('\n### $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6"></div>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Bullet List" onClick={() => insertMarkdown('\n- $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Numbered List" onClick={() => insertMarkdown('\n1. $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9h12M6 12h12M6 15h12M6 18h12" />
              </svg>
            </button>
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6"></div>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Link" onClick={() => insertMarkdown('[Link text]($1)')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 1 0-5.656-5.656l-1.102 1.101" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Code Block" onClick={() => insertMarkdown('\n```\n$1\n```\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Image" onClick={() => insertMarkdown('![Image description]($1)')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6"></div>
              <label className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center" title="Upload Markdown File">
                <input
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </label>
          </div>
        )}
        
        {/* Editor / Preview */}
        {previewMode ? (
          <div 
            className="w-full min-h-[300px] p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm overflow-auto prose prose-primary dark:prose-invert max-w-none bg-white dark:bg-dark-card"
            dangerouslySetInnerHTML={{ __html: marked(lessonData.content) }}
          />
        ) : (
          <textarea
            id="content"
            name="content"
            value={lessonData.content}
            onChange={handleChange}
            rows="12"
            className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 font-mono`}
            placeholder="Write your lesson content using Markdown..."
          />
        )}
        
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
        )}

        {errors.file && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
        )}
        
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use Markdown to format your content. <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank">Learn more</a>
        </p>
      </div>
      
      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimated Time */}
        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estimated Time (minutes)
          </label>
          <input
            type="text"
            id="estimatedTime"
            name="estimatedTime"
            value={lessonData.estimatedTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.estimatedTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
            placeholder="e.g., 15"
          />
          {errors.estimatedTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimatedTime}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Approximately how long it will take to read this lesson
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
            Make this lesson available to students immediately
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
            'Save Lesson'
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default TextLessonForm;