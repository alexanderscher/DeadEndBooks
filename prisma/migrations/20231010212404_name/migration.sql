/*
  Warnings:

  - You are about to drop the column `subscribed` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscribed";
