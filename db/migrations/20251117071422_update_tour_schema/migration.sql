/*
  Warnings:

  - You are about to drop the column `duration` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Tour` table. All the data in the column will be lost.
  - Added the required column `days` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceFrom` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "duration",
DROP COLUMN "price",
ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "includes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mainImage" TEXT,
ADD COLUMN     "mapEmbed" TEXT,
ADD COLUMN     "priceFrom" DOUBLE PRECISION NOT NULL;
