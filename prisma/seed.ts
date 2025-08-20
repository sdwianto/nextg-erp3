import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 ERP database seeding DISABLED - Database will remain empty');
  console.log('📝 To enable seeding, uncomment the code in prisma/seed.ts');
  
  // ========================================
  // SEEDING DISABLED - DATABASE WILL REMAIN EMPTY
  // ========================================
  
  // All seeding logic has been commented out to ensure database remains empty
  // Uncomment the code below if you want to seed the database with initial data
  
  /*
  // CORE SYSTEM SEEDING
  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      permissions: [
        'user:read', 'user:write', 'user:delete',
        'role:read', 'role:write', 'role:delete',
        'department:read', 'department:write', 'department:delete',
        'product:read', 'product:write', 'product:delete',
        'inventory:read', 'inventory:write', 'inventory:delete',
        'order:read', 'order:write', 'order:delete',
        'finance:read', 'finance:write', 'finance:delete',
        'hr:read', 'hr:write', 'hr:delete',
        'crm:read', 'crm:write', 'crm:delete',
        'equipment:read', 'equipment:write', 'equipment:delete',
        'maintenance:read', 'maintenance:write', 'maintenance:delete',
        'rental:read', 'rental:write', 'rental:delete',
        'report:read', 'report:write',
        'audit:read'
      ]
    }
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Department manager access',
      permissions: [
        'user:read',
        'product:read', 'product:write',
        'inventory:read', 'inventory:write',
        'order:read', 'order:write',
        'finance:read', 'finance:write',
        'hr:read', 'hr:write',
        'crm:read', 'crm:write',
        'equipment:read', 'equipment:write',
        'maintenance:read', 'maintenance:write',
        'rental:read', 'rental:write',
        'report:read'
      ]
    }
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: {
      name: 'Operator',
      description: 'Basic operational access',
      permissions: [
        'product:read',
        'inventory:read', 'inventory:write',
        'order:read', 'order:write',
        'equipment:read',
        'maintenance:read', 'maintenance:write'
      ]
    }
  });

  // Create Departments
  console.log('Creating departments...');
  const itDept = await prisma.department.upsert({
    where: { code: 'IT' },
    update: {},
    create: {
      name: 'Information Technology',
      code: 'IT',
      description: 'IT and System Administration'
    }
  });

  const financeDept = await prisma.department.upsert({
    where: { code: 'FIN' },
    update: {},
    create: {
      name: 'Finance & Accounting',
      code: 'FIN',
      description: 'Financial management and accounting'
    }
  });

  const hrDept = await prisma.department.upsert({
    where: { code: 'HR' },
    update: {},
    create: {
      name: 'Human Resources',
      code: 'HR',
      description: 'HR and payroll management'
    }
  });

  const operationsDept = await prisma.department.upsert({
    where: { code: 'OPS' },
    update: {},
    create: {
      name: 'Operations',
      code: 'OPS',
      description: 'Mining operations and production'
    }
  });

  const salesDept = await prisma.department.upsert({
    where: { code: 'SALES' },
    update: {},
    create: {
      name: 'Sales & Marketing',
      code: 'SALES',
      description: 'Sales and customer relations'
    }
  });

  // Create Admin User
  console.log('Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nextgen-erp.com' },
    update: {},
    create: {
      email: 'admin@nextgen-erp.com',
      name: 'System Administrator',
      roleId: adminRole.id,
      departmentId: itDept.id,
      isActive: true
    }
  });

  // INVENTORY & PROCUREMENT SEEDING
  console.log('Creating product categories...');
  const heavyEquipmentCategory = await prisma.category.upsert({
    where: { name: 'Heavy Equipment' },
    update: {},
    create: {
      name: 'Heavy Equipment',
      description: 'Mining and construction equipment'
    }
  });

  const sparePartsCategory = await prisma.category.upsert({
    where: { name: 'Spare Parts' },
    update: {},
    create: {
      name: 'Spare Parts',
      description: 'Equipment spare parts and components'
    }
  });

  const toolsCategory = await prisma.category.upsert({
    where: { name: 'Tools' },
    update: {},
    create: {
      name: 'Tools',
      description: 'Hand tools and equipment'
    }
  });

  const consumablesCategory = await prisma.category.upsert({
    where: { name: 'Consumables' },
    update: {},
    create: {
      name: 'Consumables',
      description: 'Consumable supplies and materials'
    }
  });

  console.log('Creating products...');
  const excavator = await prisma.product.upsert({
    where: { sku: 'EXC-001' },
    update: {},
    create: {
      name: 'Excavator XL-2000',
      sku: 'EXC-001',
      description: 'Heavy-duty mining excavator',
      categoryId: heavyEquipmentCategory.id,
      price: 250000,
      cost: 200000,
      currentStock: 2,
      minStock: 1,
      maxStock: 5,
      unit: 'unit',
      isActive: true
    }
  });

  const bulldozer = await prisma.product.upsert({
    where: { sku: 'BUL-002' },
    update: {},
    create: {
      name: 'Bulldozer BD-1500',
      sku: 'BUL-002',
      description: 'Heavy-duty bulldozer for mining',
      categoryId: heavyEquipmentCategory.id,
      price: 180000,
      cost: 150000,
      currentStock: 3,
      minStock: 1,
      maxStock: 4,
      unit: 'unit',
      isActive: true
    }
  });

  // Create more products
  await prisma.product.upsert({
    where: { sku: 'CRN-003' },
    update: {},
    create: {
      name: 'Crane Tower CT-300',
      sku: 'CRN-003',
      description: 'Tower crane for construction',
      categoryId: heavyEquipmentCategory.id,
      price: 320000,
      cost: 280000,
      currentStock: 1,
      minStock: 1,
      maxStock: 3,
      unit: 'unit',
      isActive: true
    }
  });

  console.log('Creating warehouses...');
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-MAIN' },
    update: {},
    create: {
      name: 'Main Warehouse',
      code: 'WH-MAIN',
      location: 'Port Moresby, PNG',
      description: 'Primary storage facility',
      isActive: true
    }
  });

  const siteWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-SITE' },
    update: {},
    create: {
      name: 'Mining Site Warehouse',
      code: 'WH-SITE',
      location: 'Mining Site A, PNG',
      description: 'On-site storage facility',
      isActive: true
    }
  });

  console.log('Creating inventory items...');
  await prisma.inventoryItem.upsert({
    where: { id: 'inv-exc-001' },
    update: {},
    create: {
      id: 'inv-exc-001',
      productId: excavator.id,
      warehouseId: mainWarehouse.id,
      quantity: 2,
      location: 'Zone A1',
      lastUpdated: new Date(),
      isActive: true
    }
  });

  await prisma.inventoryItem.upsert({
    where: { id: 'inv-bul-002' },
    update: {},
    create: {
      id: 'inv-bul-002',
      productId: bulldozer.id,
      warehouseId: siteWarehouse.id,
      quantity: 3,
      location: 'Zone B2',
      lastUpdated: new Date(),
      isActive: true
    }
  });

  // EQUIPMENT & MAINTENANCE SEEDING
  console.log('Creating suppliers...');
  const komatsuSupplier = await prisma.supplier.upsert({
    where: { code: 'KOMATSU' },
    update: {},
    create: {
      name: 'Komatsu Mining Corp',
      code: 'KOMATSU',
      contactPerson: 'John Smith',
      email: 'john.smith@komatsu.com',
      phone: '+675 7123 4567',
      address: 'Port Moresby, PNG',
      rating: 5,
      isActive: true
    }
  });

  const caterpillarSupplier = await prisma.supplier.upsert({
    where: { code: 'CAT' },
    update: {},
    create: {
      name: 'Caterpillar Inc',
      code: 'CAT',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@cat.com',
      phone: '+675 7123 4568',
      address: 'Port Moresby, PNG',
      rating: 5,
      isActive: true
    }
  });

  console.log('Creating equipment...');
  const excavatorEquipment = await prisma.equipment.upsert({
    where: { code: 'EXC-001' },
    update: {},
    create: {
      name: 'Excavator XL-2000',
      code: 'EXC-001',
      category: 'Excavator',
      model: 'XL-2000',
      manufacturer: 'Komatsu',
      year: 2023,
      purchaseDate: new Date('2023-01-15'),
      purchaseCost: 250000,
      currentValue: 200000,
      status: 'AVAILABLE',
      location: 'Mining Site A',
      totalOperatingHours: 1250,
      lastMaintenanceDate: new Date('2024-01-10'),
      nextMaintenanceDate: new Date('2024-02-10'),
      supplierId: komatsuSupplier.id,
      isActive: true
    }
  });

  const bulldozerEquipment = await prisma.equipment.upsert({
    where: { code: 'BUL-002' },
    update: {},
    create: {
      name: 'Bulldozer BD-1500',
      code: 'BUL-002',
      category: 'Bulldozer',
      model: 'BD-1500',
      manufacturer: 'Caterpillar',
      year: 2023,
      purchaseDate: new Date('2023-02-20'),
      purchaseCost: 180000,
      currentValue: 144000,
      status: 'MAINTENANCE',
      location: 'Mining Site B',
      totalOperatingHours: 890,
      lastMaintenanceDate: new Date('2024-01-25'),
      nextMaintenanceDate: new Date('2024-02-25'),
      supplierId: caterpillarSupplier.id,
      isActive: true
    }
  });

  // FINANCE & ACCOUNTING SEEDING
  console.log('Creating chart of accounts...');
  const cashAccount = await prisma.account.upsert({
    where: { code: '1000' },
    update: {},
    create: {
      name: 'Cash',
      code: '1000',
      type: 'ASSET',
      category: 'Current Assets',
      description: 'Cash and cash equivalents',
      isActive: true
    }
  });

  const accountsReceivable = await prisma.account.upsert({
    where: { code: '1100' },
    update: {},
    create: {
      name: 'Accounts Receivable',
      code: '1100',
      type: 'ASSET',
      category: 'Current Assets',
      description: 'Amounts owed by customers',
      isActive: true
    }
  });

  const inventoryAccount = await prisma.account.upsert({
    where: { code: '1200' },
    update: {},
    create: {
      name: 'Inventory',
      code: '1200',
      type: 'ASSET',
      category: 'Current Assets',
      description: 'Inventory assets',
      isActive: true
    }
  });

  const equipmentAccount = await prisma.account.upsert({
    where: { code: '1300' },
    update: {},
    create: {
      name: 'Equipment',
      code: '1300',
      type: 'ASSET',
      category: 'Fixed Assets',
      description: 'Equipment and machinery',
      isActive: true
    }
  });

  const accountsPayable = await prisma.account.upsert({
    where: { code: '2000' },
    update: {},
    create: {
      name: 'Accounts Payable',
      code: '2000',
      type: 'LIABILITY',
      category: 'Current Liabilities',
      description: 'Amounts owed to suppliers',
      isActive: true
    }
  });

  const revenueAccount = await prisma.account.upsert({
    where: { code: '4000' },
    update: {},
    create: {
      name: 'Revenue',
      code: '4000',
      type: 'REVENUE',
      category: 'Revenue',
      description: 'Sales revenue',
      isActive: true
    }
  });

  const rentalRevenueAccount = await prisma.account.upsert({
    where: { code: '4100' },
    update: {},
    create: {
      name: 'Rental Revenue',
      code: '4100',
      type: 'REVENUE',
      category: 'Revenue',
      description: 'Equipment rental revenue',
      isActive: true
    }
  });

  const costOfGoodsSold = await prisma.account.upsert({
    where: { code: '5000' },
    update: {},
    create: {
      name: 'Cost of Goods Sold',
      code: '5000',
      type: 'EXPENSE',
      category: 'Cost of Sales',
      description: 'Cost of goods sold',
      isActive: true
    }
  });

  const maintenanceExpense = await prisma.account.upsert({
    where: { code: '6000' },
    update: {},
    create: {
      name: 'Maintenance Expense',
      code: '6000',
      type: 'EXPENSE',
      category: 'Operating Expenses',
      description: 'Equipment maintenance costs',
      isActive: true
    }
  });

  // CRM SEEDING
  console.log('Creating customers...');
  const miningCorp = await prisma.customer.upsert({
    where: { code: 'CUST-001' },
    update: {},
    create: {
      name: 'Mining Corporation Ltd',
      code: 'CUST-001',
      type: 'CORPORATE',
      email: 'contact@miningcorp.com',
      phone: '+675 7123 4569',
      address: 'Port Moresby, PNG',
      creditLimit: 1000000,
      paymentTerms: 30,
      isActive: true
    }
  });

  const constructionLtd = await prisma.customer.upsert({
    where: { code: 'CUST-002' },
    update: {},
    create: {
      name: 'Construction Ltd',
      code: 'CUST-002',
      type: 'CORPORATE',
      email: 'info@constructionltd.com',
      phone: '+675 7123 4570',
      address: 'Lae, PNG',
      creditLimit: 500000,
      paymentTerms: 30,
      isActive: true
    }
  });

  // HRMS SEEDING
  console.log('Creating employees...');
  const hrManager = await prisma.employee.upsert({
    where: { employeeId: 'EMP-001' },
    update: {},
    create: {
      employeeId: 'EMP-001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@nextgen-erp.com',
      phone: '+675 7123 4571',
      position: 'HR Manager',
      departmentId: hrDept.id,
      hireDate: new Date('2023-01-15'),
      salary: 75000,
      status: 'ACTIVE',
      isActive: true
    }
  });

  // OPERATIONS SEEDING
  console.log('Creating operations...');
  const miningOperation = await prisma.operation.upsert({
    where: { code: 'OP-MINING-001' },
    update: {},
    create: {
      name: 'Mining Operation A',
      code: 'OP-MINING-001',
      type: 'MINING',
      location: 'Mining Site A',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      budget: 5000000,
      description: 'Primary mining operation',
      isActive: true
    }
  });

  const processingOperation = await prisma.operation.upsert({
    where: { code: 'OP-PROC-001' },
    update: {},
    create: {
      name: 'Processing Operation A',
      code: 'OP-PROC-001',
      type: 'PROCESSING',
      location: 'Processing Plant A',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      budget: 3000000,
      description: 'Ore processing operation',
      isActive: true
    }
  });

  const logisticsOperation = await prisma.operation.upsert({
    where: { code: 'OP-LOG-001' },
    update: {},
    create: {
      name: 'Logistics Operation A',
      code: 'OP-LOG-001',
      type: 'LOGISTICS',
      location: 'Port Facility A',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      budget: 2000000,
      description: 'Transportation and logistics',
      isActive: true
    }
  });

  console.log('Creating tasks...');
  const dailyInspectionTask = await prisma.task.upsert({
    where: { code: 'TASK-001' },
    update: {},
    create: {
      name: 'Daily Equipment Inspection',
      code: 'TASK-001',
      description: 'Daily safety inspection of all equipment',
      operationId: miningOperation.id,
      assignedTo: hrManager.id,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-01-15'),
      dueDate: new Date('2024-01-16'),
      estimatedHours: 4,
      actualHours: 0,
      isActive: true
    }
  });

  const maintenanceTask = await prisma.task.upsert({
    where: { code: 'TASK-002' },
    update: {},
    create: {
      name: 'Equipment Maintenance',
      code: 'TASK-002',
      description: 'Scheduled maintenance for excavator',
      operationId: miningOperation.id,
      assignedTo: hrManager.id,
      priority: 'MEDIUM',
      status: 'PENDING',
      startDate: new Date('2024-01-20'),
      dueDate: new Date('2024-01-22'),
      estimatedHours: 8,
      actualHours: 0,
      isActive: true
    }
  });

  const safetyTrainingTask = await prisma.task.upsert({
    where: { code: 'TASK-003' },
    update: {},
    create: {
      name: 'Safety Training',
      code: 'TASK-003',
      description: 'Monthly safety training for all employees',
      operationId: miningOperation.id,
      assignedTo: hrManager.id,
      priority: 'HIGH',
      status: 'PENDING',
      startDate: new Date('2024-01-25'),
      dueDate: new Date('2024-01-26'),
      estimatedHours: 6,
      actualHours: 0,
      isActive: true
    }
  });

  console.log('Creating performance metrics...');
  const productionMetric = await prisma.performanceMetric.upsert({
    where: { id: 'metric-001' },
    update: {},
    create: {
      operationId: miningOperation.id,
      metricType: 'PRODUCTION',
      value: 85.5,
      unit: 'tons',
      date: new Date('2024-01-15'),
      description: 'Daily production output'
    }
  });

  const efficiencyMetric = await prisma.performanceMetric.upsert({
    where: { id: 'metric-002' },
    update: {},
    create: {
      operationId: miningOperation.id,
      metricType: 'EFFICIENCY',
      value: 92.3,
      unit: 'percent',
      date: new Date('2024-01-15'),
      description: 'Equipment utilization rate'
    }
  });

  const safetyMetric = await prisma.performanceMetric.upsert({
    where: { id: 'metric-003' },
    update: {},
    create: {
      operationId: miningOperation.id,
      metricType: 'SAFETY',
      value: 100,
      unit: 'percent',
      date: new Date('2024-01-15'),
      description: 'Safety compliance rate'
    }
  });

  console.log('Creating incidents...');
  const equipmentIncident = await prisma.incident.upsert({
    where: { code: 'INC-001' },
    update: {},
    create: {
      title: 'Equipment Malfunction',
      code: 'INC-001',
      description: 'Excavator hydraulic system failure',
      type: 'EQUIPMENT',
      severity: 'MEDIUM',
      location: 'Mining Site A',
      reportedBy: hrManager.id,
      reportedDate: new Date('2024-01-10'),
      status: 'INVESTIGATING',
      isActive: true
    }
  });

  const weatherIncident = await prisma.incident.upsert({
    where: { code: 'INC-002' },
    update: {},
    create: {
      title: 'Weather Delay',
      code: 'INC-002',
      description: 'Heavy rain causing operational delays',
      type: 'WEATHER',
      severity: 'LOW',
      location: 'Mining Site A',
      reportedBy: hrManager.id,
      reportedDate: new Date('2024-01-12'),
      status: 'RESOLVED',
      isActive: true
    }
  });

  // SALES & ORDERS SEEDING
  console.log('Creating orders...');
  await prisma.order.upsert({
    where: { orderNumber: 'ORD-2024-001' },
    update: {},
    create: {
      orderNumber: 'ORD-2024-001',
      customerId: miningCorp.id,
      orderDate: new Date('2024-01-15'),
      status: 'CONFIRMED',
      subtotal: 250000,
      tax: 25000,
      grandTotal: 275000,
      notes: 'Equipment rental for mining operation',
      isActive: true
    }
  });

  // FINANCIAL TRANSACTIONS SEEDING
  console.log('Creating financial transactions...');
  await prisma.financialTransaction.upsert({
    where: { reference: 'TXN-2024-001' },
    update: {},
    create: {
      date: new Date('2024-01-15'),
      description: 'Equipment purchase - Excavator',
      amount: 250000,
      type: 'EXPENSE',
      accountId: equipmentAccount.id,
      reference: 'TXN-2024-001',
      isActive: true
    }
  });
  */

  console.log('✅ Database seeding disabled - Database remains empty');
  console.log('📝 To enable seeding, uncomment the code in prisma/seed.ts');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 