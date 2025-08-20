import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('🗑️  Clearing all data from database (keeping structure)...');
  
  try {
    // Clear all data in the correct order using Prisma ORM
    console.log('🧹 Clearing all tables...');
    
    await prisma.$transaction([
      // Clear all dependent tables first
      prisma.orderItem.deleteMany(),
      prisma.rentalOrderItem.deleteMany(),
      prisma.purchaseOrderItem.deleteMany(),
      prisma.inventoryTransaction.deleteMany(),
      prisma.assetTransaction.deleteMany(),
      prisma.financialTransaction.deleteMany(),
      prisma.order.deleteMany(),
      prisma.rentalOrder.deleteMany(),
      prisma.purchaseOrder.deleteMany(),
      prisma.workOrder.deleteMany(),
      prisma.maintenanceRecord.deleteMany(),
      prisma.maintenanceSchedule.deleteMany(),
      prisma.task.deleteMany(),
      prisma.performanceMetric.deleteMany(),
      prisma.incident.deleteMany(),
      prisma.operation.deleteMany(),
      prisma.inventoryItem.deleteMany(),
      prisma.depreciationSchedule.deleteMany(),
      prisma.asset.deleteMany(),
      prisma.equipment.deleteMany(),
      prisma.product.deleteMany(),
      prisma.category.deleteMany(),
      prisma.warehouse.deleteMany(),
      prisma.supplierPerformance.deleteMany(),
      prisma.supplier.deleteMany(),
      prisma.customerContact.deleteMany(),
      prisma.customer.deleteMany(),
      prisma.attendanceRecord.deleteMany(),
      prisma.leaveRequest.deleteMany(),
      prisma.payrollRecord.deleteMany(),
      prisma.employee.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
      prisma.department.deleteMany(),
      prisma.syncLog.deleteMany(),
      prisma.post.deleteMany(),
      prisma.account.deleteMany(),
    ]);
    
    console.log('✅ All data cleared successfully!');
    console.log('📊 Database structure preserved, all data removed.');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void clearAllData();
