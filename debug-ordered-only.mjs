import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugOrderedPOsOnly() {
  try {
    console.log('=== DEBUGGING ORDERED POs ONLY ===\n');

    // Get suppliers with only ORDERED POs count
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            purchaseOrders: {
              where: {
                status: 'ORDERED'
              }
            }
          }
        },
        purchaseOrders: {
          where: {
            status: 'ORDERED'
          },
          select: {
            id: true,
            poNumber: true,
            status: true
          }
        }
      }
    });

    console.log('Suppliers with ORDERED POs only:');
    suppliers.forEach((supplier, index) => {
      console.log(`${index + 1}. ${supplier.name} (${supplier.code})`);
      console.log(`   - ORDERED PO Count: ${supplier._count.purchaseOrders}`);
      console.log(`   - ORDERED POs:`, supplier.purchaseOrders);
      console.log('');
    });

    // Check PT Tahu Tempe specifically
    const ptTahuTempe = await prisma.supplier.findFirst({
      where: { name: 'PT Tahu Tempe' },
      include: {
        _count: {
          select: {
            purchaseOrders: {
              where: {
                status: 'ORDERED'
              }
            }
          }
        },
        purchaseOrders: {
          where: {
            status: 'ORDERED'
          },
          select: {
            id: true,
            poNumber: true,
            status: true
          }
        }
      }
    });

    console.log('PT Tahu Tempe - ORDERED POs only:');
    if (ptTahuTempe) {
      console.log(`- Name: ${ptTahuTempe.name}`);
      console.log(`- Code: ${ptTahuTempe.code}`);
      console.log(`- ORDERED PO Count: ${ptTahuTempe._count.purchaseOrders}`);
      console.log(`- ORDERED POs:`, ptTahuTempe.purchaseOrders);
    } else {
      console.log('PT Tahu Tempe not found!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOrderedPOsOnly();
