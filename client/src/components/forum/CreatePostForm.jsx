import React, { useState } from 'react';

const CreatePostForm = ({ threadId, parentId = null, onPostCreated, onCancel }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter content for your post.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const newPost = {
          content,
          parentId
        };
        
        onPostCreated(newPost);
        setContent('');
      } catch (err) {
        console.error('Error creating post:', err);
        setError('Failed to create post. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={parentId ? 3 : 5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 mb-3"
          placeholder={parentId ? "Write your reply..." : "Share your thoughts or questions..."}
          required
        ></textarea>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-sm btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : parentId ? 'Post Reply' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;