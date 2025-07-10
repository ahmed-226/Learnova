import React, { useState, useEffect } from 'react';

const VideoLessonContent = ({ content, onComplete, onNext, isCompleted }) => {
  console.log('VideoLessonContent received content:', content);
  console.log('Video URL:', content.videoUrl);
  
  const [isWatched, setIsWatched] = useState(isCompleted);
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCompleted, setLocalCompleted] = useState(isCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
      setLocalCompleted(true);
      setIsWatched(true); // Also update the watched state
      console.log('Video lesson marked as completed successfully');
    } catch (error) {
      console.error('Error completing video lesson:', error);
      // Revert local state if API call failed
      setLocalCompleted(false);
      setIsWatched(false);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!content.videoUrl) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }

    let processedUrl = content.videoUrl;
    
    if (content.videoUrl.includes('youtube.com/embed/')) {
      processedUrl = content.videoUrl;
    }
    else if (content.videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = content.videoUrl.split('watch?v=')[1].split('&')[0];
      processedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    else if (content.videoUrl.includes('youtu.be/')) {
      const videoId = content.videoUrl.split('youtu.be/')[1].split('?')[0];
      processedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    setVideoUrl(processedUrl);
    setIsLoading(false);
  }, [content.videoUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex justify-center items-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-center text-red-500 p-8">
          <p>{error}</p>
          <p className="text-sm mt-2">Debug: {content.videoUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Video Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {content.title}
        </h1>
      </div>
      
      {/* Video Player - Large and Responsive */}
      <div className="flex-1 mb-6">
        <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] xl:min-h-[800px]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            src={videoUrl}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      {/* Content Below Video */}
      <div className="flex-shrink-0 space-y-6">
        {/* Video Description */}
        {content.description && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About this video
            </h3>
            <div 
              className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content.description }} 
            />
          </div>
        )}
        
        {/* Video Info and Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          {content.duration && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {content.duration}
              </p>
            </div>
          )}
          
          {/* Video Link */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Link
            </h3>
            <a 
              href={content.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm break-all"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
        
        {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div></div>
        
        <div className="flex items-center space-x-4">
          {!localCompleted ? (
            <button 
              onClick={handleComplete}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </span>
              ) : (
                'Mark as Completed'
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-green-600 dark:text-green-400 flex items-center font-medium">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed!
              </span>
              <button 
                onClick={onNext}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Next Lesson
              </button>
            </div>
          )}
          
          {!localCompleted && (
            <button 
              onClick={onNext}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Skip for Now
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default VideoLessonContent;