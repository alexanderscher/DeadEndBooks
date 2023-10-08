/*
  Warnings:

  - You are about to drop the column `stripe_current_period_end` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_stripe_customer_id_key";

-- DropIndex
DROP INDEX "User_stripe_subscription_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripe_current_period_end",
DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_price_id",
DROP COLUMN "stripe_subscription_id",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscriptionID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
