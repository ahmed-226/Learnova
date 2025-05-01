

// User roles - matches the Prisma schema enum UserRole
const ROLES = {
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT'
};

// Permission levels (higher number = more permissions)
const PERMISSION_LEVELS = {
  [ROLES.STUDENT]: 1,
  [ROLES.INSTRUCTOR]: 2,
  [ROLES.ADMIN]: 3
};

// Content types for submissions - matches the Prisma schema enum ContentType
const CONTENT_TYPES = {
  TEXT: 'TEXT',
  URL: 'URL',
  JSON: 'JSON'
};

// Question types - matches the Prisma schema enum QuestionType
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  SHORT_ANSWER: 'SHORT_ANSWER'
};

// HTTP status codes with descriptive names
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  ROLES,
  PERMISSION_LEVELS,
  CONTENT_TYPES,
  QUESTION_TYPES,
  HTTP_STATUS,
  PAGINATION
};