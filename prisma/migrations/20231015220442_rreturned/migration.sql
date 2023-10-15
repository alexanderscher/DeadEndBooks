/*
  Warnings:

  - You are about to drop the column `returned` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "returned";

-- CreateTable
CREATE TABLE "Returned" (
    "orderId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "returned" BOOLEAN NOT NULL,

    CONSTRAINT "Returned_pkey" PRIMARY KEY ("orderId","bookId")
);

-- AddForeignKey
ALTER TABLE "Returned" ADD CONSTRAINT "Returned_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Returned" ADD CONSTRAINT "Returned_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
