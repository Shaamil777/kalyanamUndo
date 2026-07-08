/*
  Warnings:

  - You are about to drop the column `capacity` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `priceRange` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `coupleNames` on the `Wedding` table. All the data in the column will be lost.
  - You are about to drop the column `story` on the `Wedding` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brideName` to the `Wedding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groomName` to the `Wedding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Wedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "capacity",
DROP COLUMN "description",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "priceRange",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Wedding" DROP COLUMN "coupleNames",
DROP COLUMN "story",
ADD COLUMN     "brideName" TEXT NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "food" TEXT,
ADD COLUMN     "groomName" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
