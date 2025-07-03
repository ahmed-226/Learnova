const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');


const createQuiz = async (quizData, instructorId) => {
  try {
    
    const module = await prisma.module.findUnique({
      where: { id: Number(quizData.moduleId) },
      include: { course: true }
    });

    if (!module) {
      const error = new Error('Module not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to add quizzes to this module');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const result = await prisma.$transaction(async (tx) => {
      
      const quiz = await tx.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description || '',
          moduleId: Number(quizData.moduleId),
          timeLimit: quizData.timeLimit ? Number(quizData.timeLimit) : null,
          passingScore: quizData.passingScore ? Number(quizData.passingScore) : 70,
          shuffleQuestions: quizData.shuffleQuestions || false,
          showCorrectAnswers: quizData.showCorrectAnswers || true,
          isPublished: quizData.isPublished || false
        }
      });

      console.log('Quiz created:', quiz); 

      
      if (quizData.questions && Array.isArray(quizData.questions) && quizData.questions.length > 0) {
        console.log('Creating questions for quiz:', quiz.id);
        console.log('Questions data:', JSON.stringify(quizData.questions, null, 2));

        for (let i = 0; i < quizData.questions.length; i++) {
          const questionData = quizData.questions[i];
          
          
          let options = null;
          let correctAnswer = '';

          if (questionData.type === 'multiple_choice') {
            
            options = questionData.options.map(opt => opt.text);
            
            const correctIndex = questionData.options.findIndex(opt => opt.isCorrect);
            correctAnswer = correctIndex >= 0 ? correctIndex.toString() : '0';
          } else if (questionData.type === 'true_false') {
            options = [];
            correctAnswer = questionData.answer || 'true';
          } else if (questionData.type === 'short_answer') {
            options = [];
            correctAnswer = questionData.answer || '';
          }

          console.log(`Creating question ${i + 1}:`, {
            question: questionData.text || questionData.question,
            type: questionData.type === 'multiple_choice' ? 'MULTIPLE_CHOICE' : 
                  questionData.type === 'true_false' ? 'TRUE_FALSE' : 'SHORT_ANSWER',
            options: options,
            correctAnswer: correctAnswer,
            order: i + 1
          });

          const createdQuestion = await tx.question.create({
            data: {
              quizId: quiz.id,
              question: questionData.text || questionData.question,
              type: questionData.type === 'multiple_choice' ? 'MULTIPLE_CHOICE' : 
                    questionData.type === 'true_false' ? 'TRUE_FALSE' : 'SHORT_ANSWER',
              options: options,
              correctAnswer: correctAnswer,
              order: i + 1
            }
          });

          console.log('Question created:', createdQuestion);
        }
      } else {
        console.log('No questions provided or questions array is empty');
      }

      
      return await tx.quiz.findUnique({
        where: { id: quiz.id },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      });
    });

    console.log('Quiz created successfully with questions:', result);
    return result;
  } catch (error) {
    console.error('Error in createQuiz:', error);
    logger.error(`Error creating quiz: ${error.message}`);
    throw error;
  }
};

const getQuizWithAnswers = async (quizId, instructorId) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                instructorId: true
              }
            }
          }
        },
        questions: {
          orderBy: { id: 'asc' },
          include: {
            answers: {
              select: {
                id: true,
                answer: true,
                isCorrect: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                },
                createdAt: true
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to access this quiz data');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    return quiz;
  } catch (error) {
    logger.error(`Error getting quiz with answers: ${error.message}`);
    throw error;
  }
};


const updateQuiz = async (quizId, quizData, instructorId) => {
  try {
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        module: {
          select: {
            course: {
              select: { instructorId: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to update this quiz');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    return await prisma.quiz.update({
      where: { id: Number(quizId) },
      data: quizData
    });
  } catch (error) {
    logger.error(`Error updating quiz: ${error.message}`);
    throw error;
  }
};


const deleteQuiz = async (quizId, instructorId) => {
  try {
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        module: {
          select: {
            course: {
              select: { instructorId: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to delete this quiz');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    await prisma.quiz.delete({
      where: { id: Number(quizId) }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error deleting quiz: ${error.message}`);
    throw error;
  }
};


const addQuestion = async (quizId, questionData, instructorId) => {
  try {
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        module: {
          select: {
            course: {
              select: { instructorId: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to add questions to this quiz');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    let options = null;
    if (questionData.type === 'MULTIPLE_CHOICE' && Array.isArray(questionData.options)) {
      options = questionData.options;
    }

    
    const question = await prisma.question.create({
      data: {
        quizId: Number(quizId),
        question: questionData.question,
        type: questionData.type,
        options,
        correctAnswer: questionData.correctAnswer
      }
    });

    return question;
  } catch (error) {
    logger.error(`Error adding question: ${error.message}`);
    throw error;
  }
};


const updateQuestion = async (questionId, questionData, instructorId) => {
  try {
    
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      include: {
        quiz: {
          include: {
            module: {
              select: {
                course: {
                  select: { instructorId: true }
                }
              }
            }
          }
        }
      }
    });

    if (!question) {
      const error = new Error('Question not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (question.quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to update this question');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const updateData = { ...questionData };
    if (updateData.type === 'MULTIPLE_CHOICE' && Array.isArray(updateData.options)) {
      updateData.options = updateData.options;
    }

    
    return await prisma.question.update({
      where: { id: Number(questionId) },
      data: updateData
    });
  } catch (error) {
    logger.error(`Error updating question: ${error.message}`);
    throw error;
  }
};


const deleteQuestion = async (questionId, instructorId) => {
  try {
    
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      include: {
        quiz: {
          include: {
            module: {
              select: {
                course: {
                  select: { instructorId: true }
                }
              }
            }
          }
        }
      }
    });

    if (!question) {
      const error = new Error('Question not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (question.quiz.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to delete this question');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    await prisma.question.delete({
      where: { id: Number(questionId) }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error deleting question: ${error.message}`);
    throw error;
  }
};


const submitQuizAnswers = async (quizId, answerData, userId) => {
  try {
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        questions: true,
        module: {
          select: {
            courseId: true
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    const questionMap = new Map();
    quiz.questions.forEach(question => {
      questionMap.set(question.id, question);
    });

    
    for (const answer of answerData.answers) {
      if (!questionMap.has(Number(answer.questionId))) {
        const error = new Error(`Question ${answer.questionId} does not belong to this quiz`);
        error.status = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }
    }

    
    await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: quiz.module.courseId
        }
      },
      update: {},
      create: {
        userId: Number(userId),
        courseId: quiz.module.courseId,
        progress: 0
      }
    });

    
    const answersToCreate = [];
    let correctCount = 0;

    for (const answer of answerData.answers) {
      const question = questionMap.get(Number(answer.questionId));
      const isCorrect = question.correctAnswer === answer.answer;

      if (isCorrect) correctCount++;

      answersToCreate.push({
        questionId: Number(answer.questionId),
        userId: Number(userId),
        answer: answer.answer,
        isCorrect
      });
    }

    
    const answers = await prisma.$transaction(
      answersToCreate.map(answer => 
        prisma.answer.create({ data: answer })
      )
    );

    
    const totalQuestions = quiz.questions.length;
    const score = {
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100)
    };

    return {
      quizId: quiz.id,
      answers,
      score
    };
  } catch (error) {
    logger.error(`Error submitting quiz answers: ${error.message}`);
    throw error;
  }
};


const getUserQuizResults = async (quizId, userId) => {
  try {
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        questions: {
          include: {
            answers: {
              where: { userId: Number(userId) },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    let correctCount = 0;
    const questions = quiz.questions.map(q => {
      const latestAnswer = q.answers[0] || null;
      if (latestAnswer && latestAnswer.isCorrect) correctCount++;

      return {
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options,
        yourAnswer: latestAnswer ? latestAnswer.answer : null,
        isCorrect: latestAnswer ? latestAnswer.isCorrect : null,
        correctAnswer: q.correctAnswer 
      };
    });

    
    const totalQuestions = quiz.questions.length;
    const answeredQuestions = quiz.questions.filter(q => q.answers.length > 0).length;
    const score = {
      answered: answeredQuestions,
      correct: correctCount,
      total: totalQuestions,
      percentage: answeredQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0
    };

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title
      },
      questions,
      score,
      completed: answeredQuestions === totalQuestions
    };
  } catch (error) {
    logger.error(`Error getting user quiz results: ${error.message}`);
    throw error;
  }
};


const getQuizzesByModule = async (moduleId) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { moduleId: Number(moduleId) },
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return quizzes.map(quiz => ({
      ...quiz,
      questionCount: quiz._count.questions
    }));
  } catch (error) {
    logger.error(`Error getting quizzes by module: ${error.message}`);
    throw error;
  }
};

const getQuizById = async (quizId, includeQuestions = true) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
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
        },
        ...(includeQuestions && {
          questions: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              question: true,
              type: true,
              options: true,
              correctAnswer: true,
              order: true
            }
          }
        })
      }
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    console.log('Quiz fetched from database:', quiz);
    console.log('Questions count:', quiz.questions?.length || 0);

    return quiz;
  } catch (error) {
    logger.error(`Error getting quiz: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createQuiz,
  getQuizById,
  getQuizWithAnswers,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitQuizAnswers,
  getUserQuizResults,
  getQuizzesByModule
};