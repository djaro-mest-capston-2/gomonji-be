-- CreateEnum
CREATE TYPE "UserTypeEnum" AS ENUM ('Person', 'Organization');

-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('User', 'Agency', 'Admin');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('Male', 'Female', 'Unknown');

-- CreateEnum
CREATE TYPE "AddressTypeEnum" AS ENUM ('Physical', 'Postal', 'Home', 'Office', 'Trip', 'Other');

-- CreateEnum
CREATE TYPE "CurrencyEnum" AS ENUM ('USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'Other');

-- CreateEnum
CREATE TYPE "TripCategoryEnum" AS ENUM ('Business', 'Vacation', 'Family', 'Honeymoon', 'Adventure', 'Conference', 'Group', 'Unknown');

-- CreateEnum
CREATE TYPE "PhotoTypeEnum" AS ENUM ('Avatar', 'Trip', 'Unknown');

-- CreateEnum
CREATE TYPE "AccountStatusEnum" AS ENUM ('Active', 'Suspended', 'Closed');

-- CreateEnum
CREATE TYPE "TransactionStatusEnum" AS ENUM ('Pending', 'Paid');

-- CreateEnum
CREATE TYPE "InvoiceStatusEnum" AS ENUM ('Draft', 'AwaitingApproval', 'AwaitingPayment', 'Paid', 'Void');

-- CreateEnum
CREATE TYPE "InvoiceDatePeriodEnum" AS ENUM ('Current', 'Following');

-- CreateTable
CREATE TABLE "country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "isoNumeric" VARCHAR(3) NOT NULL,
    "phoneCode" VARCHAR(50) NOT NULL,
    "continent" VARCHAR(20),
    "capital" VARCHAR(50) NOT NULL,
    "timeZone" VARCHAR(50) NOT NULL,
    "currency" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(5),
    "wholePart" VARCHAR(20),
    "fractionPart" VARCHAR(20),
    "languageCodes" VARCHAR(100),
    "perUserPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" VARCHAR(10) NOT NULL,
    "countryId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "roleId" UUID,
    "gender" "GenderEnum" NOT NULL DEFAULT 'Unknown',
    "type" "UserTypeEnum" NOT NULL DEFAULT 'Person',
    "lastLogin" TIMESTAMPTZ(6),
    "lastLoginIp" VARCHAR(50),
    "defaultPage" VARCHAR(50),
    "passwordUpdatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "passwordLockedAt" TIMESTAMPTZ(6),
    "passwordHistory" JSONB,
    "passwordAttempt" SMALLINT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "countryId" UUID,
    "stateId" UUID,
    "phoneNo" VARCHAR(15) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "code" VARCHAR(20),
    "type" "UserRoleEnum" NOT NULL DEFAULT 'User',
    "defaultPage" VARCHAR(50),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_menu_permission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permission" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "role_menu_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "agencyId" UUID,
    "destination" VARCHAR(150) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" VARCHAR(50) NOT NULL,
    "currency" "CurrencyEnum" NOT NULL DEFAULT 'USD',
    "category" "TripCategoryEnum" NOT NULL DEFAULT 'Unknown',
    "minimumAge" INTEGER,
    "maximumAge" INTEGER,
    "minimumGroupSize" INTEGER,
    "maximumGroupSize" INTEGER,
    "noOfPeople" INTEGER,
    "tripStarts" TIMESTAMPTZ(6) NOT NULL,
    "tripEnds" TIMESTAMPTZ(6) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_itenary" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "trip_itenary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tripId" UUID,
    "name" VARCHAR(50) NOT NULL,
    "street" VARCHAR(150) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_file" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "photoType" "PhotoTypeEnum" NOT NULL DEFAULT 'Unknown',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "photo_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "cardNumber" VARCHAR(16) NOT NULL,
    "cardType" VARCHAR(50) NOT NULL,
    "cardName" VARCHAR(50) NOT NULL,
    "cardExpiry" VARCHAR(5) NOT NULL,
    "cardCvv" VARCHAR(3) NOT NULL,
    "commission" VARCHAR(5),
    "discount" VARCHAR(5),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "tripId" UUID,
    "amount" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso2_key" ON "country"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso3_key" ON "country"("iso3");

-- CreateIndex
CREATE UNIQUE INDEX "state_name_key" ON "state"("name");

-- CreateIndex
CREATE UNIQUE INDEX "state_iso2_key" ON "state"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_code_key" ON "role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_menu_permission_roleId_key" ON "role_menu_permission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "trip_itenary_tripId_key" ON "trip_itenary"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "photo_file_tripId_key" ON "photo_file"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "photo_file_userId_key" ON "photo_file"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_userId_key" ON "billing"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_cardNumber_key" ON "billing"("cardNumber");

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_menu_permission" ADD CONSTRAINT "role_menu_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_itenary" ADD CONSTRAINT "trip_itenary_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "photo_file" ADD CONSTRAINT "photo_file_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "photo_file" ADD CONSTRAINT "photo_file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
