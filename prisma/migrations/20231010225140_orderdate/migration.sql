/*
  Warnings:

  - Added the required column `order_date` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL;
