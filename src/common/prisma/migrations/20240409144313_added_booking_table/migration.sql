-- CreateEnum
CREATE TYPE "BookingStatusEnum" AS ENUM ('Pending', 'Confirmed', 'Cancelled');

-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "bookingId" UUID,
ADD COLUMN     "transactionId" UUID;

-- CreateTable
CREATE TABLE "booking" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "noOfPeople" INTEGER NOT NULL DEFAULT 1,
    "totalAmount" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,
    "bookingStatus" "BookingStatusEnum" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "amount" VARCHAR(50) NOT NULL,
    "status" "TransactionStatusEnum" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,
    "bookingId" UUID,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_userId_tripId_key" ON "booking"("userId", "tripId");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
