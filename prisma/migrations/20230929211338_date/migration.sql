/*
  Warnings:

  - You are about to drop the column `started_date` on the `Current` table. All the data in the column will be lost.
  - You are about to drop the column `started_date` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.
  - Changed the type of `date` on the `Cue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `start_date` to the `Current` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `return_date` on the `Current` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `start_date` to the `History` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `return_date` on the `History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User_addressId_key";

-- AlterTable
ALTER TABLE "Cue" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Current" DROP COLUMN "started_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "return_date",
ADD COLUMN     "return_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "History" DROP COLUMN "started_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "return_date",
ADD COLUMN     "return_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressId";
