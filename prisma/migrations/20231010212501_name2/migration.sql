/*
  Warnings:

  - Added the required column `name` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderAddress" ADD COLUMN     "name" TEXT NOT NULL;
