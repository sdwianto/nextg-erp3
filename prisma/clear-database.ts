import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Clearing all data from database...');
  
  try {
    // Clear all data in the correct order (respecting foreign key constraints)
    // Start with the most dependent tables first
    await prisma.$transaction([
      // 1. Clear all transaction and item tables first
      prisma.orderItem.deleteMany(),
      prisma.rentalOrderItem.deleteMany(),
      prisma.purchaseOrderItem.deleteMany(),
      prisma.inventoryTransaction.deleteMany(),
      prisma.assetTransaction.deleteMany(),
      prisma.financialTransaction.deleteMany(),
      
      // 2. Clear order and rental tables
      prisma.order.deleteMany(),
      prisma.rentalOrder.deleteMany(),
      prisma.purchaseOrder.deleteMany(),
      
      // 3. Clear maintenance and work order related tables
      prisma.workOrder.deleteMany(),
      prisma.maintenanceRecord.deleteMany(),
      prisma.maintenanceSchedule.deleteMany(),
      
      // 4. Clear operation related tables
      prisma.task.deleteMany(),
      prisma.performanceMetric.deleteMany(),
      prisma.incident.deleteMany(),
      prisma.operation.deleteMany(),
      
      // 5. Clear inventory related tables
      prisma.inventoryItem.deleteMany(),
      
      // 6. Clear asset related tables
      prisma.depreciationSchedule.deleteMany(),
      prisma.asset.deleteMany(),
      
      // 7. Clear equipment
      prisma.equipment.deleteMany(),
      
      // 8. Clear product related tables
      prisma.product.deleteMany(),
      prisma.category.deleteMany(),
      
      // 9. Clear warehouse
      prisma.warehouse.deleteMany(),
      
      // 10. Clear supplier related tables
      prisma.supplierPerformance.deleteMany(),
      prisma.supplier.deleteMany(),
      
      // 11. Clear customer related tables
      prisma.customerContact.deleteMany(),
      prisma.customer.deleteMany(),
      
      // 12. Clear employee related tables
      prisma.attendanceRecord.deleteMany(),
      prisma.leaveRequest.deleteMany(),
      prisma.payrollRecord.deleteMany(),
      prisma.employee.deleteMany(),
      
      // 13. Clear user related tables
      prisma.auditLog.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
      prisma.department.deleteMany(),
      
      // 14. Clear sync and other tables
      prisma.syncLog.deleteMany(),
      prisma.post.deleteMany(),
    ]);

    console.log('✅ All data cleared successfully!');
    console.log('📊 Database is now clean and ready for fresh data.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
