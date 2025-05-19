import React, { useState } from 'react';

const VideoLessonContent = ({ content, onComplete, onNext, isCompleted }) => {
  const [isWatched, setIsWatched] = useState(isCompleted);
  const videoId = "dQw4w9WgXcQ"; 
  
  const handleVideoEnd = () => {
    setIsWatched(true);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
        
        {/* Video Player */}
        <div className="relative pb-9/16 h-0 rounded-lg overflow-hidden bg-black mb-6">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Video Description */}
        <div className="prose prose-primary dark:prose-invert max-w-none">
          <h2>About this video</h2>
          <p>This is a sample description of the video content. It would typically include a summary of what's covered in the video and any important points that the learner should pay attention to.</p>
          
          <h3>Resources</h3>
          <ul>
            <li><a href="#" className="text-primary-600 dark:text-primary-400">Downloadable slides</a></li>
            <li><a href="#" className="text-primary-600 dark:text-primary-400">Example code</a></li>
            <li><a href="#" className="text-primary-600 dark:text-primary-400">Additional resources</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Video duration: {content.duration}
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

export default VideoLessonContent;