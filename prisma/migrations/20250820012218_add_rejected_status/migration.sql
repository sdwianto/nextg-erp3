/*
  Warnings:

  - The values [REPLACEMENT] on the enum `AssetLifecycleStage` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `PurchaseOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[currentRentalId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "QualityCheckStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ProcurementSourceType" AS ENUM ('DIRECT', 'PROCUREMENT', 'TRANSFER', 'DONATION');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "RentalContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "RentalTransactionType" AS ENUM ('RENTAL_INCOME', 'DEPOSIT', 'REFUND', 'DAMAGE_CHARGE', 'EXTENSION_FEE', 'CANCELLATION_FEE');

-- CreateEnum
CREATE TYPE "ProcurementFlowStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PurchaseRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- AlterEnum
BEGIN;
CREATE TYPE "AssetLifecycleStage_new" AS ENUM ('ACQUISITION', 'COMMISSIONING', 'OPERATION', 'MAINTENANCE', 'UPGRADE', 'DECOMMISSIONING', 'DISPOSAL');
ALTER TABLE "Asset" ALTER COLUMN "lifecycleStage" DROP DEFAULT;
ALTER TABLE "Asset" ALTER COLUMN "lifecycleStage" TYPE "AssetLifecycleStage_new" USING ("lifecycleStage"::text::"AssetLifecycleStage_new");
ALTER TYPE "AssetLifecycleStage" RENAME TO "AssetLifecycleStage_old";
ALTER TYPE "AssetLifecycleStage_new" RENAME TO "AssetLifecycleStage";
DROP TYPE "AssetLifecycleStage_old";
ALTER TABLE "Asset" ALTER COLUMN "lifecycleStage" SET DEFAULT 'ACQUISITION';
COMMIT;

-- AlterEnum
ALTER TYPE "AssetStatus" ADD VALUE 'RENTED';

-- AlterEnum
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'REJECTED';

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "currentRentalId" TEXT,
ADD COLUMN     "goodsReceiptId" TEXT,
ADD COLUMN     "lastMaintenance" TIMESTAMP(3),
ADD COLUMN     "nextMaintenance" TIMESTAMP(3),
ADD COLUMN     "rentalRate" INTEGER,
ADD COLUMN     "rentalStatus" "RentalStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "sourceDocument" TEXT,
ADD COLUMN     "sourceType" "ProcurementSourceType" NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "budget" SET DATA TYPE BIGINT,
ALTER COLUMN "actualCost" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "specifications" TEXT;

-- DropTable
DROP TABLE "PurchaseOrder";

-- CreateTable
CREATE TABLE "purchase_requests" (
    "id" TEXT NOT NULL,
    "prNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "PurchaseRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiredDate" TIMESTAMP(3) NOT NULL,
    "estimatedBudget" DECIMAL(10,2) NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "department" TEXT,
    "costCenter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "purchase_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_request_items" (
    "id" TEXT NOT NULL,
    "purchaseRequestId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "specifications" TEXT,
    "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "purchase_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDelivery" TIMESTAMP(3) NOT NULL,
    "actualDelivery" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "grandTotal" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "purchaseRequestId" TEXT,
    "approvedBy" TEXT,
    "approvedDate" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "paymentTerms" TEXT,
    "deliveryTerms" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DECIMAL(10,4) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceipt" (
    "id" TEXT NOT NULL,
    "grNumber" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "qualityCheckStatus" "QualityCheckStatus" NOT NULL DEFAULT 'PENDING',
    "qualityCheckBy" TEXT,
    "qualityCheckAt" TIMESTAMP(3),
    "gpsCoordinates" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceiptItem" (
    "id" TEXT NOT NULL,
    "goodsReceiptId" TEXT NOT NULL,
    "purchaseOrderItemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityReceived" INTEGER NOT NULL,
    "quantityAccepted" INTEGER NOT NULL,
    "quantityRejected" INTEGER NOT NULL DEFAULT 0,
    "unitCost" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodsReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetRentalContract" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "actualReturnDate" TIMESTAMP(3),
    "dailyRate" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "deposit" INTEGER,
    "rentalLocation" TEXT,
    "terms" TEXT,
    "notes" TEXT,
    "status" "RentalContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "outstandingAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "approvedBy" TEXT,

    CONSTRAINT "AssetRentalContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetRentalTransaction" (
    "id" TEXT NOT NULL,
    "rentalContractId" TEXT NOT NULL,
    "transactionType" "RentalTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetRentalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementToAssetFlow" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "grNumber" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "purchaseCost" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL,
    "depreciationRate" DOUBLE PRECISION NOT NULL,
    "status" "ProcurementFlowStatus" NOT NULL DEFAULT 'COMPLETED',
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementToAssetFlow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_requests_prNumber_key" ON "purchase_requests"("prNumber");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_poNumber_key" ON "purchase_orders"("poNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceipt_grNumber_key" ON "GoodsReceipt"("grNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssetRentalContract_contractNumber_key" ON "AssetRentalContract"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_currentRentalId_key" ON "Asset"("currentRentalId");

-- AddForeignKey
ALTER TABLE "purchase_request_items" ADD CONSTRAINT "purchase_request_items_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "purchase_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_request_items" ADD CONSTRAINT "purchase_request_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "purchase_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "PurchaseOrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_currentRentalId_fkey" FOREIGN KEY ("currentRentalId") REFERENCES "AssetRentalContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRentalContract" ADD CONSTRAINT "AssetRentalContract_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRentalTransaction" ADD CONSTRAINT "AssetRentalTransaction_rentalContractId_fkey" FOREIGN KEY ("rentalContractId") REFERENCES "AssetRentalContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementToAssetFlow" ADD CONSTRAINT "ProcurementToAssetFlow_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
