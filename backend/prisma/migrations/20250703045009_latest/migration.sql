/*
  Warnings:

  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Question_quizId_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "order" INTEGER DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
