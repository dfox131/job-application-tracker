-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "lastAnalyzedAt" TIMESTAMP(3),
ADD COLUMN     "matchScore" INTEGER,
ADD COLUMN     "matchSummary" TEXT,
ADD COLUMN     "matchingSkills" TEXT[],
ADD COLUMN     "missingSkills" TEXT[],
ADD COLUMN     "suggestions" TEXT[];
