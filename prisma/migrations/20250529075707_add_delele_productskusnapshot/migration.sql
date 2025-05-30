-- DropForeignKey
ALTER TABLE "ProductSKUSnapshot" DROP CONSTRAINT "ProductSKUSnapshot_orderId_fkey";

-- AddForeignKey
ALTER TABLE "ProductSKUSnapshot" ADD CONSTRAINT "ProductSKUSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
