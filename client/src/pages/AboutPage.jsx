import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TeamMemberCard from '../components/about/TeamMemberCard';
import {teamMembers,stories} from '../data/main.js'; 


const metionValues=[
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    ),
                                    color: "from-blue-400 to-primary-500",
                                    darkColor: "dark:from-blue-600 dark:to-primary-700",
                                    title: "Accessibility",
                                    description: "We believe quality education should be available to everyone, regardless of location or background."
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    ),
                                    color: "from-yellow-400 to-secondary-500",
                                    darkColor: "dark:from-yellow-600 dark:to-secondary-700",
                                    title: "Innovation",
                                    description: "We continuously explore new technologies and teaching methods to enhance the learning experience."
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                    ),
                                    color: "from-green-400 to-emerald-500",
                                    darkColor: "dark:from-green-600 dark:to-emerald-700",
                                    title: "Community",
                                    description: "We foster a supportive environment where students can collaborate, share ideas, and grow together."
                                },
                                {
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    ),
                                    color: "from-purple-400 to-indigo-500",
                                    darkColor: "dark:from-purple-600 dark:to-indigo-700",
                                    title: "Quality",
                                    description: "We maintain rigorous standards for our courses, ensuring students receive the best possible education."
                                }
                            ]

const AboutPage = () => {
    

    const stats = [
        { value: "50+", label: "Expert Instructors" },
        { value: "100+", label: "Courses Available" },
        { value: "15,000+", label: "Students Worldwide" },
        { value: "95%", label: "Student Satisfaction" }
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
            <Navbar />

            <div className="flex-grow">
                {/* Hero Section with Enhanced Visual Elements */}
                <section className="relative py-24 md:py-32 overflow-hidden">
                    {/* Background Design Elements */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-dark-bg"></div>

                        {/* Abstract Shapes */}
                        <motion.div
                            className="absolute top-16 right-16 w-64 h-64 rounded-full bg-primary-200 dark:bg-primary-800/30 blur-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ duration: 1.2 }}
                        ></motion.div>
                        <motion.div
                            className="absolute bottom-16 left-16 w-96 h-96 rounded-full bg-secondary-200 dark:bg-secondary-800/30 blur-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                        ></motion.div>
                        <motion.div
                            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-primary-300 dark:bg-primary-700/30 blur-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        ></motion.div>
                    </div>

                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block mb-6">
                                <motion.div
                                    className="relative inline-flex items-center justify-center"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-300 dark:border-primary-700 animate-slow-spin"></div>
                                    <div className="bg-white dark:bg-dark-card p-4 rounded-full relative z-10 shadow-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                About Learnova
                            </motion.h1>

                            <motion.p
                                className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                            >
                                We're on a mission to transform online education and make quality learning accessible to everyone around the world.
                            </motion.p>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            className="flex justify-center mt-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative h-12 w-full max-w-lg">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-primary-50 dark:bg-dark-bg px-6 text-sm text-gray-500 dark:text-gray-400">
                                        ESTABLISHED 2020
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Our Story Section with Timeline */}
                <section className="py-20 bg-white dark:bg-dark-card">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="inline-block mb-6 px-4 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium">
                                    OUR JOURNEY
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Story</h2>

                                {/* Timeline */}
                                <div className="space-y-8 relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

                                    {stories.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative pl-12"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
                                        >
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 border-4 border-white dark:border-dark-card flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                                            </div>
                                            <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-1">{item.year}</div>
                                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-2xl relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                                        alt="Team collaboration"
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-primary-600/10 dark:bg-primary-900/30"></div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24">
                                        <svg viewBox="0 0 100 100" className="text-primary-400 dark:text-primary-600 opacity-20">
                                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
                                            <circle cx="25" cy="25" r="15" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-6 -left-6 w-32 h-32 text-secondary-400 dark:text-secondary-600 opacity-20">
                                        <svg viewBox="0 0 100 100">
                                            <rect width="80" height="80" x="10" y="10" stroke="currentColor" strokeWidth="8" fill="none" rx="10" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="absolute -bottom-8 -right-8 bg-primary-600 text-white px-8 py-6 rounded-lg shadow-xl dark:bg-primary-700 transform rotate-3">
                                    <p className="font-bold text-xl">Est. 2020</p>
                                </div>

                                <motion.div
                                    className="absolute -left-12 top-1/3 bg-white dark:bg-dark-card p-4 rounded-lg shadow-xl w-24 h-24 flex items-center justify-center transform -translate-y-1/2"
                                    initial={{ rotate: -8 }}
                                    animate={{ rotate: 4 }}
                                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section with Animation */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/20"></div>

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-32 h-32 rounded-full bg-primary-200 dark:bg-primary-800/20"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    scale: Math.random() * 0.6 + 0.4
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>

                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                                OUR IMPACT
                            </div>
                            <h2 className="text-3xl font-bold">The Numbers Speak For Themselves</h2>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="card py-8 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border-b-4 border-primary-500 dark:border-primary-600"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <motion.h3
                                        className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                                    >
                                        {stat.value}
                                    </motion.h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Mission & Values Section with Interactive Cards */}
                <section className="py-20 bg-white dark:bg-dark-card">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                                OUR GUIDING PRINCIPLES
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
                            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                                We're driven by a set of core values that guide everything we do at Learnova.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {metionValues.map((value, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="absolute inset-0.5 bg-gradient-to-br rounded-2xl blur-sm group-hover:blur opacity-70 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} ${value.darkColor} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                                    <div className="card p-8 bg-white dark:bg-dark-card h-full backdrop-blur-sm z-10 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className={`h-20 w-20 mb-6 rounded-2xl bg-gradient-to-br ${value.color} ${value.darkColor} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-white`}>
                                            {value.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section with Creative Cards */}
                <section className="py-20 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-dark-bg">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                                THE PEOPLE BEHIND LEARNOVA
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                                The passionate individuals behind Learnova who work tirelessly to create the best learning experience for our students.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <TeamMemberCard key={member.id} member={member} index={index} />
                            ))}
                        </div>

                        {/* Join Our Team Section */}
                        <motion.div
                            className="mt-16 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="card p-8 border-dashed border-2 border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
                                <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    We're always looking for talented individuals who are passionate about education and technology.
                                </p>
                                <button className="btn btn-outline">
                                    View Open Positions
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <section className="py-20 relative overflow-hidden bg-white dark:bg-dark-card">
                    {/* Background Design Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <svg className="absolute right-0 top-0 h-full opacity-10 dark:opacity-5" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="pattern1" patternUnits="userSpaceOnUse" width="20" height="20">
                                    <circle cx="10" cy="10" r="2" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#pattern1)" className="text-primary-500 dark:text-primary-400" />
                        </svg>
                    </div>

                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <motion.div
                            className="text-center max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/30 dark:via-dark-card dark:to-secondary-900/30 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="inline-block mb-6"
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, type: "spring" }}
                            >
                                <div className="h-20 w-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Join thousands of students worldwide and begin your learning journey with Learnova today.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <motion.button
                                    className="btn btn-primary"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started
                                </motion.button>
                                <motion.button
                                    className="btn btn-outline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Browse Courses
                                </motion.button>
                            </div>

                            <motion.div
                                className="mt-10 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    No credit card required for free courses
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </div>

            <Footer />

            {/* Add custom styles for animations */}
            <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default AboutPage;