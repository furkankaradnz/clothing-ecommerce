-- AlterTable
ALTER TABLE "products" ADD COLUMN     "discountPrice" DECIMAL(10,2),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
