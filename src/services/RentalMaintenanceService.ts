// src/services/RentalMaintenanceService.ts
import { prisma } from '@/server/db';

export interface EquipmentWithMaintenance {
  id: string;
  name: string;
  code: string;
  status: string;
  location: string;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
  totalOperatingHours: number;
  maintenanceRecords: MaintenanceRecord[];
  asset?: Asset;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceType: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  status: string;
  cost: number | null;
  partsUsed: any;
  assignedTechnician: string;
  priority: string;
}

export interface RentalOrder {
  id: string;
  rentalNumber: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  grandTotal: number;
  items: RentalOrderItem[];
}

export interface RentalOrderItem {
  id: string;
  equipmentId: string;
  dailyRate: number;
  quantity: number;
  totalAmount: number;
}

export class RentalMaintenanceService {
  
  // Equipment Management
  async getAllEquipment(): Promise<EquipmentWithMaintenance[]> {
    return await prisma.equipment.findMany({
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  async getEquipmentById(id: string): Promise<EquipmentWithMaintenance | null> {
    return await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  async createEquipment(data: {
    name: string;
    code: string;
    categoryId: string;
    status: string;
    location: string;
    purchasePrice?: number;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
  }): Promise<EquipmentWithMaintenance> {
    return await prisma.equipment.create({
      data: {
        ...data,
        status: data.status as any,
        totalOperatingHours: 0
      },
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  async updateEquipment(id: string, data: Partial<EquipmentWithMaintenance>): Promise<EquipmentWithMaintenance> {
    return await prisma.equipment.update({
      where: { id },
      data,
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  // Maintenance Management
  async createMaintenanceRecord(data: {
    equipmentId: string;
    maintenanceType: string;
    description: string;
    startDate: Date;
    assignedTechnician: string;
    priority: string;
    estimatedCost?: number;
    requiredParts?: any;
  }): Promise<MaintenanceRecord> {
    return await prisma.maintenanceRecord.create({
      data: {
        ...data,
        maintenanceType: data.maintenanceType as any,
        status: 'SCHEDULED',
        cost: data.estimatedCost || 0,
        partsUsed: data.requiredParts || null,
        userId: data.assignedTechnician // Assuming technician is a user
      }
    });
  }

  async updateMaintenanceStatus(id: string, status: string, endDate?: Date, actualCost?: number): Promise<MaintenanceRecord> {
    return await prisma.maintenanceRecord.update({
      where: { id },
      data: {
        status: status as any,
        endDate,
        cost: actualCost
      }
    });
  }

  async getMaintenanceSchedule(equipmentId: string): Promise<any> {
    return await prisma.maintenanceSchedule.findFirst({
      where: { equipmentId }
    });
  }

  async createMaintenanceSchedule(data: {
    equipmentId: string;
    maintenanceType: string;
    frequency: string;
    interval: number;
    nextMaintenance: Date;
    requiredParts?: any;
    estimatedCost?: number;
  }): Promise<any> {
    return await prisma.maintenanceSchedule.create({
      data: {
        ...data,
        maintenanceType: data.maintenanceType as any,
        frequency: data.frequency as any,
        isActive: true
      }
    });
  }

  // Rental Management
  async createRentalOrder(data: {
    customerId: string;
    startDate: Date;
    endDate: Date;
    items: Array<{
      equipmentId: string;
      dailyRate: number;
      quantity: number;
    }>;
    notes?: string;
  }): Promise<RentalOrder> {
    const rentalNumber = this.generateRentalNumber();
    const totalDays = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const items = data.items.map(item => ({
      ...item,
      totalAmount: item.dailyRate * item.quantity * totalDays
    }));

    const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const grandTotal = subtotal + tax;

    return await prisma.rentalOrder.create({
      data: {
        rentalNumber,
        customerId: data.customerId,
        startDate: data.startDate,
        endDate: data.endDate,
        dailyRate: items[0]?.dailyRate || 0,
        totalDays,
        subtotal,
        tax,
        grandTotal,
        status: 'DRAFT',
        notes: data.notes,
        items: {
          create: items.map(item => ({
            equipmentId: item.equipmentId,
            dailyRate: item.dailyRate,
            quantity: item.quantity,
            totalAmount: item.totalAmount
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    });
  }

  async updateRentalStatus(id: string, status: string): Promise<RentalOrder> {
    return await prisma.rentalOrder.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: true,
        customer: true
      }
    });
  }

  // Integration Methods
  async reserveEquipmentForMaintenance(equipmentId: string, maintenanceId: string): Promise<void> {
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { status: 'MAINTENANCE' }
    });

    // Update maintenance record
    await prisma.maintenanceRecord.update({
      where: { id: maintenanceId },
      data: { status: 'IN_PROGRESS' }
    });
  }

  async completeMaintenance(equipmentId: string, maintenanceId: string): Promise<void> {
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { 
        status: 'AVAILABLE',
        lastMaintenanceDate: new Date()
      }
    });

    await prisma.maintenanceRecord.update({
      where: { id: maintenanceId },
      data: { 
        status: 'COMPLETED',
        endDate: new Date()
      }
    });
  }

  async checkMaintenanceDue(): Promise<EquipmentWithMaintenance[]> {
    const today = new Date();
    return await prisma.equipment.findMany({
      where: {
        nextMaintenanceDate: {
          lte: today
        },
        status: {
          not: 'MAINTENANCE'
        }
      },
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  async getEquipmentUtilization(equipmentId: string, startDate: Date, endDate: Date): Promise<number> {
    const rentals = await prisma.rentalOrder.findMany({
      where: {
        items: {
          some: {
            equipmentId
          }
        },
        startDate: {
          gte: startDate
        },
        endDate: {
          lte: endDate
        },
        status: 'COMPLETED'
      },
      include: {
        items: true
      }
    });

    const totalDays = rentals.reduce((sum, rental) => {
      const item = rental.items.find(item => item.equipmentId === equipmentId);
      return sum + (item ? rental.totalDays : 0);
    }, 0);

    const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (totalDays / periodDays) * 100;
  }

  // Analytics Methods
  async getMaintenanceAnalytics(): Promise<{
    totalEquipment: number;
    scheduledMaintenance: number;
    overdueMaintenance: number;
    inProgressMaintenance: number;
    monthlyCost: number;
    completedThisMonth: number;
  }> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalEquipment,
      scheduledMaintenance,
      overdueMaintenance,
      inProgressMaintenance,
      completedThisMonth,
      monthlyCost
    ] = await Promise.all([
      prisma.equipment.count({ where: { status: { not: 'RETIRED' } } }),
      prisma.maintenanceRecord.count({ where: { status: 'SCHEDULED' } }),
      prisma.equipment.count({
        where: {
          nextMaintenanceDate: { lt: today },
          status: { not: 'MAINTENANCE' }
        }
      }),
      prisma.maintenanceRecord.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.maintenanceRecord.count({
        where: {
          status: 'COMPLETED',
          endDate: { gte: startOfMonth }
        }
      }),
      prisma.maintenanceRecord.aggregate({
        where: {
          status: 'COMPLETED',
          endDate: { gte: startOfMonth }
        },
        _sum: { cost: true }
      })
    ]);

    return {
      totalEquipment,
      scheduledMaintenance,
      overdueMaintenance,
      inProgressMaintenance,
      completedThisMonth,
      monthlyCost: monthlyCost._sum.cost || 0
    };
  }

  async getRentalAnalytics(): Promise<{
    totalRentals: number;
    activeRentals: number;
    monthlyRevenue: number;
    averageRentalDuration: number;
  }> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalRentals,
      activeRentals,
      monthlyRevenue,
      averageDuration
    ] = await Promise.all([
      prisma.rentalOrder.count(),
      prisma.rentalOrder.count({
        where: {
          startDate: { lte: today },
          endDate: { gte: today },
          status: 'ACTIVE'
        }
      }),
      prisma.rentalOrder.aggregate({
        where: {
          status: 'COMPLETED',
          endDate: { gte: startOfMonth }
        },
        _sum: { grandTotal: true }
      }),
      prisma.rentalOrder.aggregate({
        where: { status: 'COMPLETED' },
        _avg: { totalDays: true }
      })
    ]);

    return {
      totalRentals,
      activeRentals,
      monthlyRevenue: monthlyRevenue._sum.grandTotal || 0,
      averageRentalDuration: averageDuration._avg.totalDays || 0
    };
  }

  // Utility Methods
  private generateRentalNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RO-${timestamp}-${random}`;
  }

  async getEquipmentByStatus(status: string): Promise<EquipmentWithMaintenance[]> {
    return await prisma.equipment.findMany({
      where: { status: status as any },
      include: {
        maintenanceRecords: true,
        asset: true,
        category: true,
        maintenanceSchedule: true
      }
    });
  }

  async getMaintenanceByStatus(status: string): Promise<MaintenanceRecord[]> {
    return await prisma.maintenanceRecord.findMany({
      where: { status: status as any },
      include: {
        equipment: true,
        user: true
      }
    });
  }
}

export const rentalMaintenanceService = new RentalMaintenanceService();
