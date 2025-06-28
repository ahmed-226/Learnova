import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreatePostForm from './CreatePostForm';
import { useAuth } from '../../contexts/AuthContext';

const PostItem = ({ post, isFirstPost = false, isReply = false, currentUser, onPostUpdated, onPostDeleted, courseId: propCourseId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { api } = useAuth();
  const navigate = useNavigate();
  const { courseId: paramCourseId } = useParams();
  
  
  const courseId = propCourseId || paramCourseId;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const isAuthor = currentUser?.id === post.user.id;
  const isInstructor = currentUser?.role === 'INSTRUCTOR';
  const isAdmin = currentUser?.role === 'ADMIN';
  
  const canEdit = isAuthor || isInstructor || isAdmin;
  const canDelete = isAuthor || isInstructor || isAdmin;
  
  const handleUpdatePost = async () => {
    if (!editedContent.trim()) {
      setError('Post content cannot be empty.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Updating post:', post.id, { content: editedContent });
      
      const response = await api.put(`/forums/posts/${post.id}`, {
        content: editedContent.trim()
      });
      
      console.log('Post update response:', response.data);
      
      
      post.content = editedContent.trim();
      post.updatedAt = new Date().toISOString();
      setIsEditing(false);
      
      
      if (onPostUpdated) {
        onPostUpdated(response.data);
      }
      
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.error || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      console.log('Deleting post:', post.id);
      
      const response = await api.delete(`/forums/posts/${post.id}`);
      
      console.log('Post deletion response:', response.data);
      
      
      if (response.data.threadDeleted) {
        
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = 'Thread deleted successfully! Redirecting to forum...';
        document.body.appendChild(toast);
        
        
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 3000);
        
        
        setTimeout(() => {
          navigate(`/courses/${courseId}/forum`);
        }, 1500);
        return;
      }
      
      
      if (onPostDeleted) {
        onPostDeleted(post.id);
      } else {
        
        window.location.reload();
      }
      
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.error || 'Failed to delete post. Please try again.');
    }
  };

  const handleReplyCreated = async (newReply) => {
    try {
      console.log('Creating reply with data:', newReply);
      
      
      const response = await api.post(`/forums/threads/${post.threadId}/posts`, {
        content: newReply.content,
        parentId: post.id
      });
      
      console.log('Reply creation response:', response.data);
      
      
      setShowReplyForm(false);
      
      
      if (onPostUpdated) {
        onPostUpdated(response.data);
      }
      
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      console.error('Error creating reply:', err);
      alert('Failed to create reply. Please try again.');
    }
  };
  
  return (
    <div className={`card ${isReply ? 'border-l-4 border-l-primary-300 dark:border-l-primary-700' : ''}`}>
      <div className="flex items-start">
        <div className="mr-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
            {post.user.firstName.charAt(0)}{post.user.lastName.charAt(0)}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap justify-between items-center mb-2">
            <div>
              <span className="font-medium">{post.user.firstName} {post.user.lastName}</span>
              {isFirstPost && (
                <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded">
                  Author
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatDate(post.createdAt)}
              {post.createdAt !== post.updatedAt && ' (edited)'}
            </span>
          </div>
          
          {isEditing ? (
            <div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 mb-2"
              ></textarea>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(post.content);
                    setError(null);
                  }}
                  className="btn btn-sm btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePost}
                  className="btn btn-sm btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {post.content}
              </div>
              
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <button 
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Reply
                </button>
                
                {canEdit && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
                
                {canDelete && (
                  <button 
                    onClick={handleDeletePost}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showReplyForm && (
        <div className="mt-4 ml-14">
          <CreatePostForm 
            threadId={post.threadId} 
            parentId={post.id}
            onPostCreated={handleReplyCreated}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PostItem;