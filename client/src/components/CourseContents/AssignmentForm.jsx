import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

const AssignmentForm = ({ moduleId, onCancel, onSave }) => {
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    instructions: '',
    submissionType: 'file', 
    allowedFileTypes: ['pdf', 'doc', 'docx'],
    maxFileSize: 10, 
    dueDate: '',
    dueTime: '',
    totalPoints: 100,
    passingGrade: 60,
    isGroupAssignment: false,
    isPublished: true
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setAssignmentData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setAssignmentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  
  const handleFileTypeChange = (fileType) => {
    setAssignmentData(prev => {
      
      const newFileTypes = prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter(t => t !== fileType)
        : [...prev.allowedFileTypes, fileType];
      
      return {
        ...prev,
        allowedFileTypes: newFileTypes
      };
    });
  };
  
  
  const insertMarkdown = (template) => {
    const textArea = document.getElementById('instructions');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = assignmentData.instructions;
    
    const beforeSelection = text.substring(0, start);
    const selection = text.substring(start, end);
    const afterSelection = text.substring(end);
    
    
    const newText = beforeSelection + 
      template.replace('$1', selection || '') + 
      afterSelection;
    
    setAssignmentData(prev => ({ ...prev, instructions: newText }));
    
    
    setTimeout(() => {
      textArea.focus();
      
      
      const newCursorPos = template.includes('$1') && selection
        ? start + template.indexOf('$1') + selection.length
        : start + template.length;
      
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!assignmentData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }
    
    if (!assignmentData.instructions.trim()) {
      newErrors.instructions = 'Assignment instructions are required';
    }
    
    if (assignmentData.submissionType === 'file' && assignmentData.allowedFileTypes.length === 0) {
      newErrors.allowedFileTypes = 'Select at least one allowed file type';
    }
    
    if (assignmentData.totalPoints <= 0) {
      newErrors.totalPoints = 'Total points must be greater than 0';
    }
    
    if (assignmentData.passingGrade < 0 || assignmentData.passingGrade > 100) {
      newErrors.passingGrade = 'Passing grade must be between 0 and 100';
    }
    
    
    if (assignmentData.dueDate) {
      const currentDate = new Date();
      const selectedDate = new Date(assignmentData.dueDate);
      
      
      if (selectedDate < new Date(currentDate.toDateString())) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
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
      
      let deadline = null;
      if (assignmentData.dueDate) {
        const dateObj = new Date(assignmentData.dueDate);
        
        if (assignmentData.dueTime) {
          const [hours, minutes] = assignmentData.dueTime.split(':');
          dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        } else {
          
          dateObj.setHours(23, 59, 59);
        }
        
        deadline = dateObj.toISOString();
      }
      
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const formattedData = {
        ...assignmentData,
        moduleId,
        type: 'assignment',
        deadline
      };
      
      onSave(formattedData);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setErrors({ submit: 'Failed to create assignment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const commonFileTypes = [
    { value: 'pdf', label: 'PDF', icon: 'file-pdf' },
    { value: 'doc', label: 'DOC', icon: 'file-word' },
    { value: 'docx', label: 'DOCX', icon: 'file-word' },
    { value: 'ppt', label: 'PPT', icon: 'file-powerpoint' },
    { value: 'pptx', label: 'PPTX', icon: 'file-powerpoint' },
    { value: 'xls', label: 'XLS', icon: 'file-excel' },
    { value: 'xlsx', label: 'XLSX', icon: 'file-excel' },
    { value: 'zip', label: 'ZIP', icon: 'file-archive' },
    { value: 'jpg', label: 'JPG', icon: 'file-image' },
    { value: 'png', label: 'PNG', icon: 'file-image' },
    { value: 'txt', label: 'TXT', icon: 'file-alt' },
    { value: 'mp3', label: 'MP3', icon: 'file-audio' },
    { value: 'mp4', label: 'MP4', icon: 'file-video' }
  ];
  
  
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'file-pdf':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'file-word':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'file-powerpoint':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'file-excel':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'file-archive':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'file-image':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'file-alt':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'file-audio':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        );
      case 'file-video':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
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
      
      {/* Assignment Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Assignment Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={assignmentData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          placeholder="e.g., Final Project: Build a Web Application"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* Assignment Instructions with Markdown */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions <span className="text-red-500">*</span>
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
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Task List" onClick={() => insertMarkdown('\n- [ ] $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Instructions Editor/Preview */}
        {previewMode ? (
          <div 
            className="w-full min-h-[300px] p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm overflow-auto prose prose-primary dark:prose-invert max-w-none bg-white dark:bg-dark-card"
            dangerouslySetInnerHTML={{ __html: marked(assignmentData.instructions) }}
          />
        ) : (
          <textarea
            id="instructions"
            name="instructions"
            value={assignmentData.instructions}
            onChange={handleChange}
            rows="10"
            className={`w-full px-3 py-2 border ${errors.instructions ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 font-mono`}
            placeholder="Provide detailed instructions for the assignment..."
          />
        )}
        
        {errors.instructions && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.instructions}</p>
        )}
        
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use Markdown to format your instructions. <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank">Learn more</a>
        </p>
      </div>
      
      {/* Submission Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Submission Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border ${
              assignmentData.submissionType === 'file'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleChange({ target: { name: 'submissionType', value: 'file' } })}
          >
            <svg className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm">File Upload</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border ${
              assignmentData.submissionType === 'text'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleChange({ target: { name: 'submissionType', value: 'text' } })}
          >
            <svg className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">Text Entry</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border ${
              assignmentData.submissionType === 'link'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleChange({ target: { name: 'submissionType', value: 'link' } })}
          >
            <svg className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
            </svg>
            <span className="text-sm">Website URL</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border ${
              assignmentData.submissionType === 'mixed'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handleChange({ target: { name: 'submissionType', value: 'mixed' } })}
          >
            <svg className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="text-sm">Multiple Types</span>
          </div>
        </div>
      </div>
      
      {/* File Upload Settings */}
      {(assignmentData.submissionType === 'file' || assignmentData.submissionType === 'mixed') && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            File Upload Settings
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Allowed File Types
            </label>
            <div className="flex flex-wrap gap-2">
              {commonFileTypes.map(fileType => (
                <button
                  key={fileType.value}
                  type="button"
                  onClick={() => handleFileTypeChange(fileType.value)}
                  className={`px-2 py-1 text-xs rounded-md border ${
                    assignmentData.allowedFileTypes.includes(fileType.value)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-800'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="flex items-center">
                    {getFileTypeIcon(fileType.icon)}
                    <span className="ml-1">{fileType.label}</span>
                  </span>
                </button>
              ))}
            </div>
            {errors.allowedFileTypes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.allowedFileTypes}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="maxFileSize" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              id="maxFileSize"
              name="maxFileSize"
              min="1"
              max="100"
              value={assignmentData.maxFileSize}
              onChange={handleChange}
              className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Maximum allowed file size in megabytes
            </p>
          </div>
        </div>
      )}
      
      {/* Due Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={assignmentData.dueDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave blank for no due date
          </p>
        </div>
        
        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Time
          </label>
          <input
            type="time"
            id="dueTime"
            name="dueTime"
            value={assignmentData.dueTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave blank for end of day (11:59 PM)
          </p>
        </div>
      </div>
      
      {/* Grading Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Points <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="totalPoints"
            name="totalPoints"
            min="1"
            max="1000"
            value={assignmentData.totalPoints}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.totalPoints ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          />
          {errors.totalPoints && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalPoints}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="passingGrade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Passing Grade (%)
          </label>
          <input
            type="number"
            id="passingGrade"
            name="passingGrade"
            min="0"
            max="100"
            value={assignmentData.passingGrade}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.passingGrade ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          />
          {errors.passingGrade && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passingGrade}</p>
          )}
        </div>
      </div>
      
      {/* Additional Options */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isGroupAssignment"
            name="isGroupAssignment"
            checked={assignmentData.isGroupAssignment}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isGroupAssignment" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            This is a group assignment
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={assignmentData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make this assignment available to students immediately
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
            'Save Assignment'
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AssignmentForm;