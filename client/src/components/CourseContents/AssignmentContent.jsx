import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AssignmentContent = ({ content, onComplete, onNext, isCompleted }) => {
  const { api } = useAuth();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(isCompleted);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!content?.id || !api) {
        console.log('Missing content ID or API:', { contentId: content?.id, hasApi: !!api });
        return;
      }

      
      if (content.type !== 'assignment') {
        console.error('Content type is not assignment:', content.type);
        setError(`This content is not an assignment. Content type: ${content.type}`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching assignment data for assignment:', content.id);
        console.log('Content details:', content);
        
        const response = await api.get(`/assignments/${content.id}`);
        console.log('Assignment API Response:', response.data);
        
        if (!response.data) {
          setError('Empty response from server');
          return;
        }
        
        setAssignmentData(response.data);
      } catch (error) {
        console.error('Error fetching assignment data:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 403) {
          setError('You do not have permission to access this assignment');
        } else if (error.response?.status === 404) {
          setError('Assignment not found');
        } else {
          setError(`Failed to load assignment: ${error.response?.data?.error || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [content?.id, api]);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submission.trim() === '' && files.length === 0) {
      alert('Please add a description or upload files before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      const formData = new FormData();
      formData.append('content', submission);
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      
      await api.post(`/assignments/${content.id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSubmitted(true);
      onComplete();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center text-red-500 p-8">
          <p>{error}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Debug info: Content ID: {content?.id}</p>
            <p>Content Type: {content?.type}</p>
            <p>Check console for API response details</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center text-gray-500 p-8">
          <p>No assignment content available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{assignmentData.title || content.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {assignmentData.description || "Complete this assignment to demonstrate your understanding."}
        </p>
        
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold">Assignment Instructions</h2>
            <div className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
              {assignmentData.dueDate ? (
                <>Deadline: {new Date(assignmentData.dueDate).toLocaleDateString()}</>
              ) : (
                'No deadline'
              )}
            </div>
          </div>
          
          <div 
            className="prose prose-primary dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: assignmentData.instructions || assignmentData.description || '<p>No instructions provided.</p>' 
            }}
          />
          
          {assignmentData.totalPoints && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <strong>Total Points:</strong> {assignmentData.totalPoints}
            </div>
          )}
        </div>
        
        {!submitted ? (
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Your Submission</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="submission-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description or Notes
                </label>
                <textarea
                  id="submission-text"
                  rows={6}
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Enter your submission notes or explanation here..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload Files
                </label>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center">
                  <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here, or click to select files</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload').click()}
                    className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Select Files
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm truncate max-w-xs">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onNext}
                  className="btn btn-outline"
                >
                  Save for Later
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Assignment Submitted</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your assignment has been submitted successfully. You'll receive feedback once it's reviewed.
            </p>
            
            <button
              onClick={onNext}
              className="btn btn-primary"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentContent;