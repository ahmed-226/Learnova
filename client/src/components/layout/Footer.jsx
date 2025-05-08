import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-dark-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4 text-primary-700 dark:text-primary-400">Learnova</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Transforming online education with interactive learning experiences.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Courses</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Instructors</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">About</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Careers</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Terms</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Privacy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-dark-border mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Learnova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;