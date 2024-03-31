/*
  Warnings:

  - Made the column `tripStarts` on table `trip` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "trip" ALTER COLUMN "tripStarts" SET NOT NULL,
ALTER COLUMN "tripStarts" SET DEFAULT CURRENT_TIMESTAMP;
