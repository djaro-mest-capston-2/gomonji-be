/*
  Warnings:

  - The values [Other] on the enum `CurrencyEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agencyId` on the `trip` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SocialMediaEnum" AS ENUM ('Facebook', 'Instagram', 'Twitter', 'Linkedin', 'YouTube', 'Tiktok', 'Pinterest');

-- AlterEnum
BEGIN;
CREATE TYPE "CurrencyEnum_new" AS ENUM ('USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR');
ALTER TABLE "trip" ALTER COLUMN "currency" DROP DEFAULT;
ALTER TABLE "trip" ALTER COLUMN "currency" TYPE "CurrencyEnum_new" USING ("currency"::text::"CurrencyEnum_new");
ALTER TYPE "CurrencyEnum" RENAME TO "CurrencyEnum_old";
ALTER TYPE "CurrencyEnum_new" RENAME TO "CurrencyEnum";
DROP TYPE "CurrencyEnum_old";
ALTER TABLE "trip" ALTER COLUMN "currency" SET DEFAULT 'USD';
COMMIT;

-- AlterTable
ALTER TABLE "trip" DROP COLUMN "agencyId",
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "trip_itenary" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_profile" ADD COLUMN     "background" VARCHAR(100),
ADD COLUMN     "brandName" VARCHAR(100),
ADD COLUMN     "companyName" VARCHAR(100),
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "firstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(100) NOT NULL,
ADD COLUMN     "website" VARCHAR(100),
ALTER COLUMN "phoneNo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "social_media" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" "SocialMediaEnum" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_media_userId_key" ON "social_media"("userId");

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
