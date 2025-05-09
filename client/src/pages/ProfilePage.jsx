import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/profile/CourseCard';
import {enrolledCourses} from "../data/main.js";


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "Student",
    joinedDate: "January 2023",
    bio: "Passionate learner interested in web development and data science. Currently working on building my skills in React and Python."
  });

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
       
        setUser({
          ...user,
          avatar: event.target.result
        });
        
       
        console.log("Image changed, would upload to server in real app");
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
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
              {/* ...existing name, email, etc. */}
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
              My Courses
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
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Learning Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Hours Spent</p>
                      <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">42</p>
                    </div>
                    <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Courses</p>
                      <p className="text-3xl font-bold text-secondary-700 dark:text-secondary-400">3</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Certificates</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-400">1</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg. Score</p>
                      <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">89%</p>
                    </div>
                  </div>
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
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
                
                <div className="card h-[240px] flex items-center justify-center p-10 border-dashed">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Discover New Courses</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Explore our catalog and expand your knowledge</p>
                    <button className="btn btn-outline">
                      Browse Courses
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No Achievements Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Continue your learning journey to unlock achievements and certificates.
                </p>
              </div>
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
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          defaultValue={user.name}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user.email}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          defaultValue={user.bio}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="card mb-6">
                    <h3 className="text-lg font-semibold mb-4">Password</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Change your password to keep your account secure.
                    </p>
                    <button className="btn btn-outline w-full">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-500">Danger Zone</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="btn bg-red-600 hover:bg-red-700 text-white w-full">
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
    </div>
  );
};

export default ProfilePage;