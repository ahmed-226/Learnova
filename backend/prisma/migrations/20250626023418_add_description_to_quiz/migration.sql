-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
