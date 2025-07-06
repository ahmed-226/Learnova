import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/profile/CourseCard';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import DeleteAccountModal from '../components/profile/DeleteAccountModal';
import AchievementCard from '../components/profile/AchievementCard';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const { user: authUser, api, loading,logout } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userCourses, setUserCourses] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState({
    totalAchievements: 0,
    totalPoints: 0,
    rarityBreakdown: {}
  });


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });

  useEffect(() => {
    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [achievementsResponse, statsResponse] = await Promise.all([
          api.get('/achievements/user'),
          api.get('/achievements/user/stats')
        ]);
        
        setAchievements(achievementsResponse.data);
        setAchievementStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user, api]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const [profileResponse, dashboardResponse] = await Promise.all([
        api.get('/users/profile'),
        api.get('/users/dashboard')
      ]);

      const userData = profileResponse.data;
      const dashboardData = dashboardResponse.data;

      setUser({
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`,
        avatar: userData.avatar ? `http://localhost:5000${userData.avatar}` : "https://randomuser.me/api/portraits/men/44.jpg",
        joinedDate: new Date(userData.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }),
        bio: userData.bio || "No bio available yet."
      });
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        bio: userData.bio || ''
      });
      
      if (userData.role === 'STUDENT' && dashboardData.enrolledCourses) {
        const enrolledCourses = dashboardData.enrolledCourses;
        
        setUserStats({
          coursesCount: enrolledCourses.length,
          hoursSpent: enrolledCourses.reduce((total, courseProgress) => total + (courseProgress.hoursSpent || 0), 0),
          certificatesEarned: enrolledCourses.filter(courseProgress => courseProgress.isCompleted).length,
          averageScore: enrolledCourses.length > 0 
            ? Math.round(enrolledCourses.reduce((total, courseProgress) => total + (courseProgress.progress || 0), 0) / enrolledCourses.length)
            : 0
        });
        
        setUserCourses(enrolledCourses.map(courseProgress => ({
          id: courseProgress.course?.id || courseProgress.courseId,
          title: courseProgress.course?.title || 'Unknown Course',
          instructor: courseProgress.course?.instructor ? 
            `${courseProgress.course.instructor.firstName} ${courseProgress.course.instructor.lastName}` : 
            'Unknown Instructor',
          progress: Math.round(courseProgress.progress || 0),
          color: getProgressColor(courseProgress.progress || 0),
          lastAccessed: courseProgress.lastAccessed ? 
            new Date(courseProgress.lastAccessed).toLocaleDateString() : 
            'Never',
          isCompleted: courseProgress.isCompleted || false,
          coverImage: courseProgress.course?.coverImage || null
        })));
        
      } else if (userData.role === 'INSTRUCTOR' && dashboardData.instructorCourses) {
        const instructorCourses = dashboardData.instructorCourses;
        
        setUserStats({
          coursesCount: instructorCourses.length,
          studentsCount: instructorCourses.reduce((total, course) => total + (course._count?.progress || 0), 0),
          hoursSpent: instructorCourses.length * 10,
          rating: 4.8
        });
        
        setUserCourses(instructorCourses.map(course => ({
          id: course.id,
          title: course.title,
          instructor: 'You',
          progress: 100,
          color: 'primary',
          lastAccessed: course.updatedAt ? 
            new Date(course.updatedAt).toLocaleDateString() : 
            'Never',
          isCompleted: true,
          coverImage: course.coverImage || null,
          studentsEnrolled: course._count?.progress || 0,
          isInstructor: true
        })));

      } else {
        setUserStats({
          coursesCount: 0,
          hoursSpent: 0,
          certificatesEarned: 0,
          averageScore: 0
        });
        setUserCourses([]);
      }

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'blue';
    if (progress >= 25) return 'yellow';
    return 'red';
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        
        const response = await api.post('/users/upload-avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        
        setUser(prev => ({
          ...prev,
          avatar: response.data.avatar 
        }));
        
        setError(null); 
        
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const response = await api.put('/users/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio
      });

      
      const updatedUser = response.data;
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        bio: updatedUser.bio || prev.bio
      }));

      
      setError(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      
      alert('Password changed successfully! You will receive a confirmation email.');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error; 
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      
      console.log("Attempting to delete account with password:", password ? "Password provided" : "No password!");
      
      await api.post('/users/delete-account', { password });
      
      await logout();
      
      navigate('/', {
        state: { message: 'Your account has been deleted successfully.' } 
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  
  if (loading || isLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  
  if (error && !user) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={fetchUserProfile}
              className="btn btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 dark:border-primary-900 shadow-md">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Edit image overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                onClick={handleProfileImageClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400 text-xs px-2 py-1 rounded-md">
                  {user.role}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
                  Joined {user.joinedDate}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl">{user.bio}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-dark-border">
          <nav className="-mb-px flex space-x-8">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {user.role === 'INSTRUCTOR' ? 'My Courses' : 'Enrolled Courses'}
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'achievements' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Achievements
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <p className="text-gray-900 dark:text-gray-100">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <p className="text-gray-900 dark:text-gray-100">{user.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Member Since</label>
                      <p className="text-gray-900 dark:text-gray-100">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">
                    {user.role === 'INSTRUCTOR' ? 'Teaching Stats' : 'Learning Stats'}
                  </h3>
                  {userStats ? (
                    <div className="grid grid-cols-2 gap-4">
                      {user.role === 'STUDENT' ? (
                        <>
                          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Hours Spent</p>
                            <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{userStats.hoursSpent}</p>
                          </div>
                          <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Courses</p>
                            <p className="text-3xl font-bold text-secondary-700 dark:text-secondary-400">{userStats.coursesCount}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Certificates</p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{userStats.certificatesEarned}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg. Progress</p>
                            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{userStats.averageScore}%</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Courses Created</p>
                            <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{userStats.coursesCount}</p>
                          </div>
                          <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Students</p>
                            <p className="text-3xl font-bold text-secondary-700 dark:text-secondary-400">{userStats.studentsCount}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Hours Teaching</p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{userStats.hoursSpent}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Rating</p>
                            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{userStats.rating}★</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userCourses.length > 0 ? (
                  userCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="lg:col-span-2 card h-[240px] flex items-center justify-center p-10 border-dashed">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {user.role === 'INSTRUCTOR' ? 'No Courses Created Yet' : 'No Courses Enrolled Yet'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {user.role === 'INSTRUCTOR' 
                          ? 'Start creating courses to share your knowledge with students.'
                          : 'Explore our catalog and start your learning journey.'}
                      </p>
                      <button className="btn btn-outline" onClick={() => window.location.href = user.role === 'INSTRUCTOR' ? '/create-course' : '/courses'}>
                        {user.role === 'INSTRUCTOR' ? 'Create Course' : 'Browse Courses'}
                      </button>
                    </div>
                  </div>
                )}
                
                {userCourses.length > 0 && (
                  <div className="card h-[240px] flex items-center justify-center p-10 border-dashed">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {user.role === 'INSTRUCTOR' ? 'Create New Course' : 'Discover New Courses'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {user.role === 'INSTRUCTOR' 
                          ? 'Share your expertise with more students.'
                          : 'Explore our catalog and expand your knowledge.'}
                      </p>
                      <button className="btn btn-outline" onClick={() => window.location.href = user.role === 'INSTRUCTOR' ? '/create-course' : '/courses'}>
                        {user.role === 'INSTRUCTOR' ? 'Create Course' : 'Browse Courses'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {achievements.length > 0 ? (
                <div className="space-y-6">
                  {/* Achievement Stats */}
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4">Achievement Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {achievementStats.totalAchievements}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Badges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {achievementStats.totalPoints}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {achievementStats.rarityBreakdown.RARE || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Rare Badges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {achievementStats.rarityBreakdown.LEGENDARY || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Legendary</div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Gallery */}
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
                    <div className="flex flex-wrap justify-start gap-8 py-4">
                      {achievements.map((userAchievement) => (
                        <div key={userAchievement.id} className="flex flex-col items-center">
                          <AchievementCard
                            achievement={userAchievement.achievement}
                            userAchievement={userAchievement}
                            size="large"
                          />
                          <span className="mt-2 text-sm text-gray-700 dark:text-gray-200 font-medium text-center max-w-[120px] truncate">
                            {userAchievement.achievement.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Achievements Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Complete courses to unlock achievements and certificates. Start your learning journey today!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user.email}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          className="btn btn-primary"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                
                <div>
                  <div className="card mb-6">
                    <h3 className="text-lg font-semibold mb-4">Password</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Change your password to keep your account secure.
                    </p>
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="btn btn-outline w-full">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-500">Danger Zone</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="btn bg-red-600 hover:bg-red-700 text-white w-full">
                        Delete Account
                      </button>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
        <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfilePage;