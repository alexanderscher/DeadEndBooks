/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Current` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Current` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Current" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Current_orderId_key" ON "Current"("orderId");

-- AddForeignKey
ALTER TABLE "Current" ADD CONSTRAINT "Current_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
