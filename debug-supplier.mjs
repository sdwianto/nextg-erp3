import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSupplierData() {
  try {
    console.log('=== DEBUGGING SUPPLIER AND PO DATA ===\n');

    // Get all suppliers
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            purchaseOrders: true
          }
        },
        purchaseOrders: {
          select: {
            id: true,
            poNumber: true,
            status: true,
            supplierId: true
          }
        }
      }
    });

    console.log('All Suppliers:');
    suppliers.forEach((supplier, index) => {
      console.log(`${index + 1}. ${supplier.name} (${supplier.code})`);
      console.log(`   - PO Count: ${supplier._count.purchaseOrders}`);
      console.log(`   - POs:`, supplier.purchaseOrders.map(po => ({
        id: po.id,
        poNumber: po.poNumber,
        status: po.status,
        supplierId: po.supplierId
      })));
      console.log('');
    });

    // Get all POs
    const allPOs = await prisma.purchaseOrder.findMany({
      select: {
        id: true,
        poNumber: true,
        status: true,
        supplierId: true,
        supplier: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });

    console.log('All Purchase Orders:');
    allPOs.forEach((po, index) => {
      console.log(`${index + 1}. ${po.poNumber} (${po.status})`);
      console.log(`   - Supplier: ${po.supplier?.name} (${po.supplier?.code})`);
      console.log(`   - Supplier ID: ${po.supplierId}`);
      console.log('');
    });

    // Check specific supplier
    const ptTahuTempe = await prisma.supplier.findFirst({
      where: { name: 'PT Tahu Tempe' },
      include: {
        _count: {
          select: {
            purchaseOrders: true
          }
        },
        purchaseOrders: {
          select: {
            id: true,
            poNumber: true,
            status: true
          }
        }
      }
    });

    console.log('PT Tahu Tempe Details:');
    if (ptTahuTempe) {
      console.log(`- Name: ${ptTahuTempe.name}`);
      console.log(`- Code: ${ptTahuTempe.code}`);
      console.log(`- PO Count: ${ptTahuTempe._count.purchaseOrders}`);
      console.log(`- POs:`, ptTahuTempe.purchaseOrders);
    } else {
      console.log('PT Tahu Tempe not found!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSupplierData();
