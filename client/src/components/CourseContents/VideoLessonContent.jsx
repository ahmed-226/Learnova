import React, { useState, useEffect, useRef } from 'react';

const VideoLessonContent = ({ content, onComplete, onNext, isCompleted }) => {
  const [isWatched, setIsWatched] = useState(isCompleted);
  const [videoType, setVideoType] = useState('youtube');
  const [videoId, setVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  
  
  useEffect(() => {
    setIsLoading(true);
    
    try {
      if (!content.videoUrl) {
        setError('No video URL provided');
        setIsLoading(false);
        return;
      }

      
      if (content.videoType) {
        setVideoType(content.videoType);
        
        if (content.videoType === 'upload') {
          
          setVideoId(content.videoUrl);
        } else if (content.videoType === 'youtube') {
          extractYoutubeId(content.videoUrl);
        } else if (content.videoType === 'vimeo') {
          extractVimeoId(content.videoUrl);
        }
      } else {
        
        if (content.videoUrl.includes('youtube.com') || content.videoUrl.includes('youtu.be')) {
          setVideoType('youtube');
          extractYoutubeId(content.videoUrl);
        } else if (content.videoUrl.includes('vimeo.com')) {
          setVideoType('vimeo');
          extractVimeoId(content.videoUrl);
        } else {
          
          setVideoType('upload');
          setVideoId(content.videoUrl);
        }
      }
    } catch (err) {
      console.error('Error parsing video URL:', err);
      setError('Could not load the video. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [content.videoUrl, content.videoType]);
  
  
  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[7].length === 11) ? match[7] : null;
    
    if (id) {
      setVideoId(id);
    } else {
      
      setError('Invalid YouTube URL');
      setVideoId('dQw4w9WgXcQ'); 
    }
  };
  
  
  const extractVimeoId = (url) => {
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/|vimeo\.com\/channels\/\w+\/|vimeo\.com\/groups\/[^\/]+\/videos\/)(\d+)/;
    const match = url.match(regExp);
    const id = match ? match[1] : null;
    
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid Vimeo URL');
    }
  };
  
  
  const handleVideoEnd = () => {
    setIsWatched(true);
    
  };
  
  
  const renderVideoPlayer = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center text-red-500">
            <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      );
    }
    
    switch (videoType) {
      case 'youtube':
        return (
          <div className="relative pb-9/16 h-0 rounded-lg overflow-hidden bg-black mb-6">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              title={content.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => console.log('YouTube video loaded')}
            ></iframe>
          </div>
        );
        
      case 'vimeo':
        return (
          <div className="relative pb-9/16 h-0 rounded-lg overflow-hidden bg-black mb-6">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://player.vimeo.com/video/${videoId}`}
              title={content.title}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => console.log('Vimeo video loaded')}
            ></iframe>
          </div>
        );
        
      case 'upload':
        return (
          <div className="rounded-lg overflow-hidden bg-black mb-6">
            <video
              ref={videoRef}
              className="w-full"
              controls
              onEnded={handleVideoEnd}
              poster={content.thumbnail || ''}
            >
              <source src={videoId} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
        
      default:
        return (
          <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center text-red-500">
              <p>Unsupported video type</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
        
        {/* Video Player */}
        {renderVideoPlayer()}
        
        {/* Video Description */}
        <div className="prose prose-primary dark:prose-invert max-w-none">
          {content.description ? (
            <div dangerouslySetInnerHTML={{ __html: content.description }} />
          ) : (
            <>
              <h2>About this video</h2>
              <p>This video helps you understand key concepts covered in this module. Watch it carefully to improve your understanding of the topic.</p>
            </>
          )}
          
          {content.resources && (
            <>
              <h3>Resources</h3>
              <ul>
                {content.resources.map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      className="text-primary-600 dark:text-primary-400"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {!content.resources && (
            <>
              <h3>Resources</h3>
              <ul>
                <li><a href="#" className="text-primary-600 dark:text-primary-400">Downloadable slides</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400">Example code</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400">Additional resources</a></li>
              </ul>
            </>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Video duration: {content.duration || 'Not specified'}
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