/*
  Warnings:

  - The values [Pending] on the enum `BookingStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `noOfPeople` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `trip_itenary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatusEnum_new" AS ENUM ('Requested', 'Confirmed', 'Cancelled');
ALTER TABLE "booking" ALTER COLUMN "bookingStatus" DROP DEFAULT;
ALTER TABLE "booking" ALTER COLUMN "bookingStatus" TYPE "BookingStatusEnum_new" USING ("bookingStatus"::text::"BookingStatusEnum_new");
ALTER TYPE "BookingStatusEnum" RENAME TO "BookingStatusEnum_old";
ALTER TYPE "BookingStatusEnum_new" RENAME TO "BookingStatusEnum";
DROP TYPE "BookingStatusEnum_old";
ALTER TABLE "booking" ALTER COLUMN "bookingStatus" SET DEFAULT 'Requested';
COMMIT;

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "trip_itenary" DROP CONSTRAINT "trip_itenary_tripId_fkey";

-- DropIndex
DROP INDEX "booking_userId_tripId_key";

-- AlterTable
ALTER TABLE "billing" ADD COLUMN     "paymentStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "noOfPeople",
DROP COLUMN "totalAmount",
DROP COLUMN "userId",
ADD COLUMN     "billId" UUID,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "invoiceId" UUID,
ADD COLUMN     "phoneNo" VARCHAR(15) NOT NULL,
ADD COLUMN     "transactionId" UUID,
ALTER COLUMN "bookingStatus" SET DEFAULT 'Requested';

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "bookingId";

-- DropTable
DROP TABLE "trip_itenary";

-- CreateTable
CREATE TABLE "trip_itinerary" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "trip_itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_itinerary_tripId_key" ON "trip_itinerary"("tripId");

-- AddForeignKey
ALTER TABLE "trip_itinerary" ADD CONSTRAINT "trip_itinerary_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_billId_fkey" FOREIGN KEY ("billId") REFERENCES "billing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
