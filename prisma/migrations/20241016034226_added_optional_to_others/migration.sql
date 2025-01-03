/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_link_key" ON "File"("link");
