# LearnSphere Backend

## Overview
Backend for the LearnSphere educational platform, built with Express.js, Prisma, and PostgreSQL.

## Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see `.env.example`)
3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run dev`

## Environment Variables
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Secret for JWT authentication
- PORT: Server port (default: 5000)

