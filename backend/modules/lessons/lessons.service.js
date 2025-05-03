const prisma = require('../../config/database');


const createLesson = async (lessonData, instructorId) => {

    const module = await prisma.module.findUnique({
        where: { id: Number(lessonData.moduleId) },
        include: { course: true }
    });

    if (!module) {
        throw new Error('Module not found');
    }

    if (module.course.instructorId !== Number(instructorId)) {
        throw new Error('Not authorized to add lessons to this module');
    }


    if (!lessonData.order) {
        const highestOrder = await prisma.lesson.findFirst({
            where: { moduleId: Number(lessonData.moduleId) },
            orderBy: { order: 'desc' }
        });

        lessonData.order = highestOrder ? highestOrder.order + 1 : 1;
    }


    const lesson = await prisma.lesson.create({
        data: {
            title: lessonData.title,
            content: lessonData.content || '',
            moduleId: Number(lessonData.moduleId),
            order: lessonData.order
        }
    });

    return lesson;
};


const getLessonById = async (lessonId, userId = null) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
        include: {
            module: {
                select: {
                    id: true,
                    title: true,
                    courseId: true,
                    course: {
                        select: {
                            id: true,
                            title: true,
                            instructorId: true
                        }
                    }
                }
            }
        }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }


    if (userId) {


        await prisma.progress.upsert({
            where: {
                userId_courseId: {
                    userId: Number(userId),
                    courseId: lesson.module.courseId
                }
            },
            update: {},
            create: {
                userId: Number(userId),
                courseId: lesson.module.courseId,
                progress: 0
            }
        });
    }

    return lesson;
};


const updateLesson = async (lessonId, lessonData, instructorId) => {

    const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            instructorId: true
                        }
                    }
                }
            }
        }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    if (lesson.module.course.instructorId !== Number(instructorId)) {
        throw new Error('Not authorized to update this lesson');
    }


    const updatedLesson = await prisma.lesson.update({
        where: { id: Number(lessonId) },
        data: lessonData
    });

    return updatedLesson;
};


const deleteLesson = async (lessonId, instructorId) => {

    const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            instructorId: true
                        }
                    }
                }
            }
        }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    if (lesson.module.course.instructorId !== Number(instructorId)) {
        throw new Error('Not authorized to delete this lesson');
    }


    await prisma.lesson.delete({
        where: { id: Number(lessonId) }
    });

    return { success: true };
};


const getLessonsByModule = async (moduleId) => {
    const lessons = await prisma.lesson.findMany({
        where: { moduleId: Number(moduleId) },
        orderBy: { order: 'asc' }
    });

    return lessons;
};

module.exports = {
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
    getLessonsByModule
};