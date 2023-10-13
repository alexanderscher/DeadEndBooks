/*
  Warnings:

  - A unique constraint covering the columns `[orderId,bookId]` on the table `Current` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Current_orderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Current_orderId_bookId_key" ON "Current"("orderId", "bookId");
