/*
  Warnings:

  - You are about to drop the column `fullName` on the `booking` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "fullName",
ADD COLUMN     "firstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(100),
ALTER COLUMN "phoneNo" DROP NOT NULL;
