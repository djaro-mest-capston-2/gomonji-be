/*
  Warnings:

  - You are about to drop the column `background` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the `photo_file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "photo_file" DROP CONSTRAINT "photo_file_tripId_fkey";

-- DropForeignKey
ALTER TABLE "photo_file" DROP CONSTRAINT "photo_file_userId_fkey";

-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "background",
ADD COLUMN     "backgroundImage" VARCHAR(100);

-- DropTable
DROP TABLE "photo_file";

-- DropEnum
DROP TYPE "PhotoTypeEnum";

-- CreateTable
CREATE TABLE "trip_images" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "url" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "trip_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_images_url_key" ON "trip_images"("url");

-- AddForeignKey
ALTER TABLE "trip_images" ADD CONSTRAINT "trip_images_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
