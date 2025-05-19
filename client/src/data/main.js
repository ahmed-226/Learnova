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

const enrolledCourses = [
    { 
      id: 1, 
      title: "Web Development Bootcamp", 
      progress: 75, 
      instructor: "Sarah Wilson",
      lastAccessed: "2 days ago",
      color: "primary" 
    },
    { 
      id: 2, 
      title: "Data Science Fundamentals", 
      progress: 40, 
      instructor: "Michael Brown",
      lastAccessed: "Yesterday",
      color: "secondary" 
    },
    { 
      id: 3, 
      title: "UX Design Principles", 
      progress: 20, 
      instructor: "Emily Parker",
      lastAccessed: "1 week ago",
      color: "green" 
    }
  ];

const teamMembers = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Founder & CEO",
            bio: "With over 15 years of experience in education technology, Sarah founded Learnova with a mission to make quality education accessible to everyone.",
            avatar: "https://randomuser.me/api/portraits/women/33.jpg",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 2,
            name: "David Chen",
            role: "Chief Technology Officer",
            bio: "David leads our engineering team with a focus on creating intuitive, responsive learning platforms that adapt to each student's needs.",
            avatar: "https://randomuser.me/api/portraits/men/52.jpg",
            social: {
                linkedin: "#",
                github: "#"
            }
        },
        {
            id: 3,
            name: "Maya Patel",
            role: "Head of Content",
            bio: "Maya ensures that all Learnova courses maintain the highest educational standards while remaining engaging and practical.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 4,
            name: "James Wilson",
            role: "User Experience Director",
            bio: "James works to ensure that every student's journey through the platform is seamless, intuitive, and enjoyable.",
            avatar: "https://randomuser.me/api/portraits/men/46.jpg",
            social: {
                linkedin: "#",
                dribbble: "#"
            }
        }
    ];

const stories=[
                                        {
                                            year: "2020",
                                            title: "The Beginning",
                                            content: "Founded with a simple idea: create a learning platform that adapts to each student's unique needs and learning style."
                                        },
                                        {
                                            year: "2021",
                                            title: "Rapid Growth",
                                            content: "Expanded from a small collection of programming courses to 50+ courses across multiple disciplines."
                                        },
                                        {
                                            year: "2022",
                                            title: "Global Reach",
                                            content: "Reached students in over 120 countries, with courses available in 8 different languages."
                                        },
                                        {
                                            year: "2023",
                                            title: "Innovation Focus",
                                            content: "Launched AI-powered learning pathways and personalized recommendation engine."
                                        }
                                    ]

const courseContent={
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "John Doe",
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Introduction to Web Development",
        isCompleted: true,
        content: [
          { id: 101, type: "video", title: "Welcome to the Course", duration: "5:30", isCompleted: true },
          { id: 102, type: "text", title: "How the Web Works", duration: "10 min read", isCompleted: true },
          { id: 103, type: "quiz", title: "Introduction Quiz", questions: 5, isCompleted: false }
        ]
      },
      {
        id: 2,
        title: "HTML Fundamentals",
        isCompleted: false,
        content: [
          { id: 201, type: "video", title: "HTML Document Structure", duration: "12:45", isCompleted: true },
          { id: 202, type: "text", title: "HTML Elements and Attributes", duration: "15 min read", isCompleted: true },
          { id: 203, type: "video", title: "Working with Forms", duration: "18:20", isCompleted: false },
          { id: 204, type: "assignment", title: "Build a Basic HTML Page", deadline: "No deadline", isCompleted: false }
        ]
      },
      {
        id: 3,
        title: "CSS Styling",
        isCompleted: false,
        content: [
          { id: 301, type: "video", title: "CSS Selectors", duration: "14:50", isCompleted: false },
          { id: 302, type: "text", title: "The Box Model", duration: "8 min read", isCompleted: false },
          { id: 303, type: "video", title: "Flexbox and Grid", duration: "22:15", isCompleted: false },
          { id: 304, type: "quiz", title: "CSS Fundamentals Quiz", questions: 10, isCompleted: false }
        ]
      },
      {
        id: 4,
        title: "JavaScript Basics",
        isCompleted: false,
        content: [
          { id: 401, type: "video", title: "JavaScript Introduction", duration: "10:30", isCompleted: false },
          { id: 402, type: "text", title: "Variables and Data Types", duration: "12 min read", isCompleted: false },
          { id: 403, type: "video", title: "Functions and Events", duration: "16:40", isCompleted: false },
          { id: 404, type: "assignment", title: "Interactive Form Validation", deadline: "No deadline", isCompleted: false },
          { id: 405, type: "quiz", title: "JavaScript Basics Quiz", questions: 8, isCompleted: false }
        ]
      }
    ]
  }

const mockCourse = {
  id: 1,
  title: "Complete Web Development Bootcamp",
  description: "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js and more. You'll build real projects and gain practical skills needed to become a professional web developer.",
  category: "Development",
  level: "Beginner",
  price: 89.99,
  originalPrice: 129.99,
  coverImage: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  instructor: {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  _count: {
    lessons: 42,
    quizzes: 12,
    assignments: 8,
    progress: 1248
  },
  modules: [
    {
      id: 1,
      title: "Introduction to Web Development",
      order: 1,
      description: "Learn the basics of how the web works and set up your development environment.",
      lessons: [
        { id: 1, title: "How the Internet Works" },
        { id: 2, title: "Setting Up Your Dev Environment" },
        { id: 3, title: "Introduction to Web Browsers" }
      ]
    },
    {
      id: 2,
      title: "HTML Fundamentals",
      order: 2,
      description: "Learn the building blocks of web pages and structure content properly.",
      lessons: [
        { id: 4, title: "HTML Document Structure" },
        { id: 5, title: "Working with Text Elements" },
        { id: 6, title: "Links and Navigation" },
        { id: 7, title: "Images and Media" }
      ],
      quizzes: [
        { id: 1, title: "HTML Basics Quiz" }
      ]
    },
    {
      id: 3,
      title: "CSS Styling",
      order: 3,
      description: "Make your websites beautiful with CSS styling techniques.",
      lessons: [
        { id: 8, title: "CSS Selectors" },
        { id: 9, title: "Box Model" },
        { id: 10, title: "Layout and Positioning" },
        { id: 11, title: "Flexbox and Grid" }
      ],
      assignments: [
        { id: 1, title: "Build a Responsive Layout" }
      ]
    }
  ]
};

const relatedCourses = [
  {
    id: 2,
    title: "JavaScript Mastery",
    instructor: "Sarah Johnson",
    rating: 4.7,
    studentsCount: 842,
    price: 79.99,
    coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
    category: "Development"
  },
  {
    id: 3,
    title: "React Frontend Development",
    instructor: "Michael Chen",
    rating: 4.9,
    studentsCount: 1203,
    price: 94.99,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
    category: "Development"
  },
  {
    id: 4,
    title: "Node.js Backend Development",
    instructor: "Emily Wilson",
    rating: 4.8,
    studentsCount: 723,
    price: 84.99,
    coverImage: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
    category: "Development"
  }
];


const mockForum = {
  id: 1,
  courseId: 101,
  createdAt: "2025-01-15T12:00:00.000Z",
  updatedAt: "2025-05-01T14:30:00.000Z"
};

const mockThreads = [
  {
    id: 1,
    title: "Help with Module 2 Exercise",
    content: "I'm having trouble understanding how to implement the algorithm from the second lecture. Can someone explain it in simpler terms?",
    forumId: 1,
    userId: 5,
    createdAt: "2025-04-15T09:30:00.000Z",
    updatedAt: "2025-04-15T09:30:00.000Z",
    user: {
      id: 5,
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    postCount: 6
  },
  {
    id: 2,
    title: "Additional resources for SQL section?",
    content: "I'm looking for additional resources to deepen my understanding of SQL joins. Any recommendations?",
    forumId: 1,
    userId: 8,
    createdAt: "2025-04-10T16:42:00.000Z",
    updatedAt: "2025-04-14T08:20:00.000Z",
    user: {
      id: 8,
      firstName: "Sarah",
      lastName: "Williams",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    postCount: 3
  },
  {
    id: 3,
    title: "Project ideas for the final assignment",
    content: "I'm brainstorming ideas for the final project. Would love to hear what others are planning to build!",
    forumId: 1,
    userId: 12,
    createdAt: "2025-04-05T11:15:00.000Z",
    updatedAt: "2025-04-12T19:30:00.000Z",
    user: {
      id: 12,
      firstName: "Michael",
      lastName: "Brown",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    postCount: 8
  },
  {
    id: 4,
    title: "Bug in the starter code for assignment 3",
    content: "I think I found a bug in the starter code for assignment 3. The function calculateTotal seems to be returning incorrect values when given negative numbers.",
    forumId: 1,
    userId: 3,
    createdAt: "2025-04-02T14:22:00.000Z",
    updatedAt: "2025-04-10T09:15:00.000Z",
    user: {
      id: 3,
      firstName: "Emma",
      lastName: "Davis",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    },
    postCount: 5
  },
  {
    id: 5,
    title: "Interesting article related to Module 4",
    content: "I found this really interesting article that expands on the concepts we learned in Module 4. Thought I'd share it with everyone!",
    forumId: 1,
    userId: 15,
    createdAt: "2025-03-28T08:45:00.000Z",
    updatedAt: "2025-04-05T16:30:00.000Z",
    user: {
      id: 15,
      firstName: "David",
      lastName: "Wilson",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    postCount: 2
  }
];

const mockPosts = [
  {
    id: 1,
    content: "I'm having trouble understanding how to implement the algorithm from the second lecture. Can someone explain it in simpler terms?",
    threadId: 1,
    userId: 5,
    parentId: null,
    createdAt: "2025-04-15T09:30:00.000Z",
    updatedAt: "2025-04-15T09:30:00.000Z",
    user: {
      id: 5,
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "STUDENT"
    },
    replies: []
  },
  {
    id: 2,
    content: "The algorithm is essentially a divide-and-conquer approach. You split the problem into smaller parts, solve those parts, and then combine them. Let me know if you need a more specific explanation.",
    threadId: 1,
    userId: 2,
    parentId: null,
    createdAt: "2025-04-15T10:15:00.000Z",
    updatedAt: "2025-04-15T10:15:00.000Z",
    user: {
      id: 2,
      firstName: "Maya",
      lastName: "Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      role: "INSTRUCTOR"
    },
    replies: []
  },
  {
    id: 3,
    content: "Thanks for the response! I'm specifically confused about the recursive part. How do I ensure it doesn't go into an infinite loop?",
    threadId: 1,
    userId: 5,
    parentId: 2,
    createdAt: "2025-04-15T11:05:00.000Z",
    updatedAt: "2025-04-15T11:05:00.000Z",
    user: {
      id: 5,
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "STUDENT"
    },
    replies: []
  },
  {
    id: 4,
    content: "You need to make sure you have a base case that doesn't call the function recursively. For this algorithm, when your input size reaches 1 or 0, you should return directly without making more recursive calls.",
    threadId: 1,
    userId: 2,
    parentId: 3,
    createdAt: "2025-04-15T13:30:00.000Z",
    updatedAt: "2025-04-15T14:10:00.000Z",
    user: {
      id: 2,
      firstName: "Maya",
      lastName: "Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      role: "INSTRUCTOR"
    },
    replies: []
  },
  {
    id: 5,
    content: "I had the same question! This helped me understand it better. I also found this visualization helpful: [link to external resource]",
    threadId: 1,
    userId: 8,
    parentId: null,
    createdAt: "2025-04-16T09:45:00.000Z",
    updatedAt: "2025-04-16T09:45:00.000Z",
    user: {
      id: 8,
      firstName: "Sarah",
      lastName: "Williams",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "STUDENT"
    },
    replies: []
  }
];

const mockUser = {
  id: 5,
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  role: "STUDENT",
  createdAt: "2024-12-10T09:30:00.000Z"
};

const mockCourseForForum = {
  id: 101,
  title: "Advanced Data Structures and Algorithms",
  description: "Master the most important data structures and algorithms concepts.",
  instructorId: 2,
  createdAt: "2025-01-10T12:00:00.000Z",
  updatedAt: "2025-04-28T16:45:00.000Z",
  instructor: {
    id: 2,
    firstName: "Maya",
    lastName: "Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg"
  }
};

const instructorCourses = [
    {
      id: 1,
      title: "Web Development Masterclass",
      enrollmentCount: 128,
      moduleCount: 8,
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "JavaScript Algorithms & Data Structures",
      enrollmentCount: 94,
      moduleCount: 6,
      lastUpdated: "1 week ago"
    }
  ];
  
  const recentActivities = [
    { 
      id: 1, 
      type: 'course-progress', 
      courseName: 'Web Development Bootcamp', 
      progress: 75, 
      date: '2 hours ago',
      icon: 'book-open'
    },
    { 
      id: 2, 
      type: 'quiz-completed', 
      courseName: 'Data Science Fundamentals', 
      score: 92, 
      date: 'Yesterday',
      icon: 'check-circle'
    },
    { 
      id: 3, 
      type: 'assignment-submitted', 
      courseName: 'UX Design Principles', 
      date: '3 days ago',
      icon: 'clipboard'
    }
  ];
  
  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced CSS Layouts",
      courseName: "Web Development Bootcamp",
      date: "Tomorrow, 10:00 AM",
      duration: "45 min"
    },
    {
      id: 2,
      title: "Data Visualization with D3.js",
      courseName: "Data Science Fundamentals",
      date: "Thu, 2:00 PM",
      duration: "60 min"
    }
  ];

export { features, popularCourses, TestimonialCards, enrolledCourses, teamMembers, stories, courseContent, mockCourse, relatedCourses, mockForum, mockThreads, mockPosts, mockUser, mockCourseForForum, instructorCourses, recentActivities, upcomingLessons };