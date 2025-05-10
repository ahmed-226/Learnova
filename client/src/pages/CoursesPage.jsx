import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/ui/CourseCard';
import { popularCourses } from '../data/main.js';

const CoursesPage = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    price: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  // Categories and levels for filters
  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science', 'Language'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceOptions = ['All', 'Free', 'Paid'];

  // Fetch courses (in a real application, this would call your API)
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // This would be replaced with actual API call using filters and pagination
      // Example: fetchCourses(searchTerm, filters, pagination.page, pagination.limit)
      setCourses(popularCourses);
      setTrendingCourses(popularCourses.slice(0, 3));
      setPagination({
        page: 1,
        limit: 9,
        totalPages: Math.ceil(popularCourses.length / 9),
      });
      setIsLoading(false);
    }, 800);
  }, [searchTerm, filters, pagination.page]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on new search
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary-600 to-primary-700 dark:from-primary-900 dark:to-primary-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
              className="text-center text-white"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Courses</h1>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Discover a world of knowledge with our extensive collection of high-quality courses taught by industry experts.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for courses..."
                    className="w-full px-5 py-4 rounded-full border-none shadow-lg focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 text-gray-800 dark:text-gray-200 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm"
                  />
                  <button className="absolute right-3 top-3 p-1 rounded-full bg-primary-500 dark:bg-primary-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Trending Courses Section */}
        <section className="py-12 bg-white dark:bg-dark-card">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
                <a href="#all-courses" className="text-primary-600 dark:text-primary-400 hover:underline">View all courses</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCourses.map((course, index) => (
                  <CourseCard key={`trending-${index}`} {...course} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content with Sidebar */}
        <section id="all-courses" className="py-16 bg-primary-50 dark:bg-dark-bg">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with Filters */}
              <motion.div 
                className="w-full lg:w-64 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Filters</h3>
                  
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-2">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.toLowerCase()} className="flex items-center">
                          <input
                            type="radio"
                            id={`category-${category.toLowerCase()}`}
                            name="category"
                            checked={filters.category === category.toLowerCase()}
                            onChange={() => handleFilterChange('category', category.toLowerCase())}
                            className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500"
                          />
                          <label htmlFor={`category-${category.toLowerCase()}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Level Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-2">Level</h4>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <div key={level.toLowerCase()} className="flex items-center">
                          <input
                            type="radio"
                            id={`level-${level.toLowerCase()}`}
                            name="level"
                            checked={filters.level === level.toLowerCase()}
                            onChange={() => handleFilterChange('level', level.toLowerCase())}
                            className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500"
                          />
                          <label htmlFor={`level-${level.toLowerCase()}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-2">Price</h4>
                    <div className="space-y-2">
                      {priceOptions.map((price) => (
                        <div key={price.toLowerCase()} className="flex items-center">
                          <input
                            type="radio"
                            id={`price-${price.toLowerCase()}`}
                            name="price"
                            checked={filters.price === price.toLowerCase()}
                            onChange={() => handleFilterChange('price', price.toLowerCase())}
                            className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500"
                          />
                          <label htmlFor={`price-${price.toLowerCase()}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {price}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reset Filters Button */}
                  <button 
                    onClick={() => setFilters({ category: 'all', level: 'all', price: 'all' })}
                    className="w-full btn btn-outline py-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
              
              {/* Course Grid */}
              <motion.div 
                className="flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">All Courses</h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</span>
                    <select className="bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm">
                      <option>Most Popular</option>
                      <option>Newest</option>
                      <option>Highest Rated</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                      <CourseCard key={index} {...course} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No courses found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We couldn't find any courses matching your criteria. Try adjusting your filters or search term.
                    </p>
                  </div>
                )}
                
                {/* Pagination */}
                {courses.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`px-3 py-1 rounded-md ${
                          pagination.page === 1 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 rounded-md ${
                            pagination.page === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className={`px-3 py-1 rounded-md ${
                          pagination.page === pagination.totalPages 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Become an Instructor</h2>
                <p className="text-primary-100 max-w-lg">
                  Share your knowledge and expertise with our global community. Create engaging courses and help learners achieve their goals.
                </p>
              </div>
              <button className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg">
                Start Teaching
              </button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoursesPage;