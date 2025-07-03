/*
  Warnings:

  - You are about to drop the column `explanation` on the `Question` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Quiz_moduleId_idx";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "explanation";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passingScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "showCorrectAnswers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeLimit" INTEGER,
ALTER COLUMN "order" DROP NOT NULL;

-- CreateTable
CREATE TABLE "QuizSubmission" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizSubmission_quizId_userId_idx" ON "QuizSubmission"("quizId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizSubmission_quizId_userId_key" ON "QuizSubmission"("quizId", "userId");

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
