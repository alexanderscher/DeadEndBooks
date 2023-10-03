/*
  Warnings:

  - You are about to drop the column `daysLate` on the `Current` table. All the data in the column will be lost.
  - You are about to drop the column `isLate` on the `Current` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Current" DROP COLUMN "daysLate",
DROP COLUMN "isLate";
