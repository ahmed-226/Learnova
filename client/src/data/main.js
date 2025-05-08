const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>,
    title: "Interactive Courses",
    description: "Learn with engaging content designed to enhance understanding and retention."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-700 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>,
    title: "Community Support",
    description: "Join a community of learners and instructors to enhance your educational journey."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed progress tracking and analytics."
  }
];

  // Popular courses data (placeholder)
const popularCourses = [
  {
    title: "Web Development Fundamentals",
    instructor: "John Smith",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Development"
  },
  {
    title: "Introduction to Data Science",
    instructor: "Emily Johnson",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Data Science"
  },
  {
    title: "UX/UI Design Principles",
    instructor: "Alex Rivera",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Design"
  }
];
  
  // TestimonialCards data
const TestimonialCards = [
  {
    quote: "Learnova has transformed how I approach learning new skills. The platform is intuitive and the courses are top-notch.",
    author: "Michael Brown",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "As an instructor, I've found Learnova to be the perfect place to share my knowledge and connect with passionate students.",
    author: "Sarah Wilson",
    role: "Design Instructor",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The interactive learning experience and community support make Learnova stand out from other platforms.",
    author: "David Chen",
    role: "Student",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];


export { features, popularCourses, TestimonialCards };