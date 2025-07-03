import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TextLessonContent = ({ content, onComplete, onNext, isCompleted }) => {
  const { api } = useAuth();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!content?.id || !api) {
        console.log('Missing content ID or API:', { contentId: content?.id, hasApi: !!api });
        return;
      }
      
      if (content.type !== 'lesson' && content.type !== 'text') {
        console.error('Content type is not a text lesson:', content.type);
        setError(`This content is not a text lesson. Content type: ${content.type}`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching lesson data for lesson:', content.id);
        console.log('Content details:', content);
        
        const response = await api.get(`/lessons/${content.id}`);
        console.log('Lesson API Response:', response.data);
        
        if (!response.data) {
          setError('Empty response from server');
          return;
        }
        
        setLessonData(response.data);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 403) {
          setError('You do not have permission to access this lesson');
        } else if (error.response?.status === 404) {
          setError('Lesson not found');
        } else {
          setError(`Failed to load lesson: ${error.response?.data?.error || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [content?.id, api]);

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

  if (!lessonData) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center text-gray-500 p-8">
          <p>No lesson content available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{lessonData.title || content.title}</h1>
        <div 
          className="prose prose-primary dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: lessonData.content || '<p>No content available for this lesson.</p>' 
          }}
        />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {lessonData.estimatedTime && (
            <span>Estimated reading time: {lessonData.estimatedTime} minutes</span>
          )}
          {!lessonData.estimatedTime && content.duration && (
            <span>Estimated reading time: {content.duration}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {!isCompleted ? (
            <button 
              onClick={onComplete}
              className="btn btn-primary"
            >
              Mark as Completed
            </button>
          ) : (
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
          
          <button 
            onClick={onNext}
            className="btn btn-outline"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextLessonContent;