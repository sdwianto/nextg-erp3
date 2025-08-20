import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSimpleQuery() {
  try {
    console.log('=== TESTING SIMPLE QUERY ===\n');

    // Test 1: Basic supplier query
    console.log('Test 1: Basic supplier query');
    const basicSuppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        code: true
      }
    });
    console.log('Basic suppliers:', basicSuppliers);
    console.log('');

    // Test 2: Supplier with _count
    console.log('Test 2: Supplier with _count');
    const suppliersWithCount = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            purchaseOrders: {
              where: {
                status: 'ORDERED'
              }
            }
          }
        }
      }
    });
    console.log('Suppliers with count:', JSON.stringify(suppliersWithCount, null, 2));
    console.log('');

    // Test 3: Supplier with purchaseOrders
    console.log('Test 3: Supplier with purchaseOrders');
    const suppliersWithPOs = await prisma.supplier.findMany({
      include: {
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
    console.log('Suppliers with POs:', JSON.stringify(suppliersWithPOs, null, 2));
    console.log('');

    // Test 4: Full query like in backend
    console.log('Test 4: Full query like in backend');
    const fullQuery = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
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
            orderDate: true,
            expectedDelivery: true,
            status: true,
            grandTotal: true,
            items: {
              select: {
                quantity: true,
                product: {
                  select: {
                    name: true,
                    code: true
                  }
                }
              }
            }
          },
          orderBy: {
            orderDate: 'desc'
          },
          take: 5
        }
      }
    });
    console.log('Full query result:', JSON.stringify(fullQuery, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleQuery();
