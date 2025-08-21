
export type EquipmentStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'PREDICTIVE';

export interface Asset {
  id: string;
  name: string;
  code: string;
  type: string;
  value: number;
  purchaseDate: Date;
  status: string;
}

export interface EquipmentWithMaintenance {
  id: string;
  name: string;
  code: string;
  status: EquipmentStatus;
  location: string | null;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
  totalOperatingHours: number;
  maintenanceRecords: MaintenanceRecord[];
  asset?: Asset | null;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceType: MaintenanceType;
  description: string;
  startDate: Date;
  endDate: Date | null;
  status: MaintenanceStatus;
  cost: number | null;
  partsUsed: Record<string, unknown>;
  assignedTechnician: string;
  priority: string;
  userId?: string;
  assetId?: string | null;
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
  
  // Equipment Management - Now using API data
  async getAllEquipment(): Promise<EquipmentWithMaintenance[]> {
    // This service is now deprecated - use tRPC API instead
    // api.rentalMaintenance.getEquipment.useQuery()
    throw new Error('Use tRPC API instead: api.rentalMaintenance.getEquipment.useQuery()');
  }

  async getEquipmentById(id: string): Promise<EquipmentWithMaintenance | null> {
    const equipment = await this.getAllEquipment();
    return equipment.find(eq => eq.id === id) ?? null;
  }

  async createEquipment(data: {
    name: string;
    code: string;
    status: EquipmentStatus;
    location: string;
  }): Promise<EquipmentWithMaintenance> {
    const newEquipment: EquipmentWithMaintenance = {
      id: Date.now().toString(),
      ...data,
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      totalOperatingHours: 0,
      maintenanceRecords: [],
      asset: null
    };
    return newEquipment;
  }

  async updateEquipment(id: string, data: Partial<EquipmentWithMaintenance>): Promise<EquipmentWithMaintenance | null> {
    const equipment = await this.getEquipmentById(id);
    if (!equipment) return null;
    
    return { ...equipment, ...data };
  }

  async deleteEquipment(): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Maintenance Management
  async createMaintenanceRecord(data: {
    equipmentId: string;
    maintenanceType: MaintenanceType;
    description: string;
    startDate: Date;
    assignedTechnician: string;
    priority: string;
  }): Promise<MaintenanceRecord> {
    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      ...data,
      endDate: null,
      status: 'SCHEDULED',
      cost: null,
      partsUsed: {},
      userId: 'user-1',
      assetId: null
    };
    return record;
  }

  async getMaintenanceRecordById(id: string): Promise<MaintenanceRecord | null> {
    // Mock implementation
    return {
      id,
      equipmentId: '1',
      maintenanceType: 'PREVENTIVE',
      description: 'Regular maintenance check',
      startDate: new Date(),
      endDate: null,
      status: 'SCHEDULED',
      cost: null,
      partsUsed: {},
      assignedTechnician: 'John Doe',
      priority: 'MEDIUM',
      userId: 'user-1',
      assetId: null
    };
  }

  async updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | null> {
    const record = await this.getMaintenanceRecordById(id);
    if (!record) return null;
    
    return { ...record, ...data };
  }

  async deleteMaintenanceRecord(): Promise<boolean> {
    // Mock implementation
    return true;
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
  }): Promise<RentalOrder> {
    const items = data.items.map(item => ({
      id: Date.now().toString(),
      ...item,
      totalAmount: item.dailyRate * item.quantity
    }));

    const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

    return {
      id: Date.now().toString(),
      rentalNumber: `RO-${Date.now()}`,
      customerId: data.customerId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'ACTIVE',
      grandTotal,
      items
    };
  }

  async getRentalOrderById(id: string): Promise<RentalOrder | null> {
    // Mock implementation
    return {
      id,
      rentalNumber: 'RO-12345',
      customerId: 'customer-1',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      grandTotal: 5000,
      items: [
        {
          id: 'item-1',
          equipmentId: '1',
          dailyRate: 500,
          quantity: 7,
          totalAmount: 3500
        }
      ]
    };
  }

  async updateRentalOrder(id: string, data: Partial<RentalOrder>): Promise<RentalOrder | null> {
    const order = await this.getRentalOrderById(id);
    if (!order) return null;
    
    return { ...order, ...data };
  }

  async deleteRentalOrder(): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Analytics and Reporting
  async getMaintenanceAnalytics(): Promise<{
    totalEquipment: number;
    underMaintenance: number;
    available: number;
  }> {
    const equipment = await this.getAllEquipment();
    const underMaintenance = equipment.filter(eq => eq.status === 'MAINTENANCE').length;
    const available = equipment.filter(eq => eq.status === 'AVAILABLE').length;

    return {
      totalEquipment: equipment.length,
      underMaintenance,
      available
    };
  }

  async getRentalAnalytics(): Promise<{
    totalRentals: number;
    activeRentals: number;
    revenue: number;
  }> {
    // Mock data
    return {
      totalRentals: 15,
      activeRentals: 8,
      revenue: 50000
    };
  }

  async getEquipmentUtilization(): Promise<{
    equipmentId: string;
    utilizationRate: number;
    totalHours: number;
    availableHours: number;
  }[]> {
    const equipment = await this.getAllEquipment();
    return equipment.map(eq => ({
      equipmentId: eq.id,
      utilizationRate: Math.random() * 100,
      totalHours: eq.totalOperatingHours,
      availableHours: 8760 // 24 hours * 365 days
    }));
  }

  // Predictive Maintenance
  async getPredictiveMaintenanceAlerts(): Promise<{
    equipmentId: string;
    alertType: string;
    severity: string;
    predictedDate: Date;
    confidence: number;
  }[]> {
    // Mock predictive maintenance alerts
    return [
      {
        equipmentId: '1',
        alertType: 'PREVENTIVE_MAINTENANCE',
        severity: 'MEDIUM',
        predictedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        confidence: 0.85
      }
    ];
  }

  // Asset Lifecycle Management
  async getAssetLifecycleData(): Promise<{
    assetId: string;
    currentValue: number;
    depreciationRate: number;
    remainingLife: number;
    replacementDate: Date;
  }[]> {
    const equipment = await this.getAllEquipment();
    return equipment
      .filter(eq => eq.asset)
      .map(eq => ({
        assetId: eq.asset!.id,
        currentValue: eq.asset!.value * 0.8, // 20% depreciation
        depreciationRate: 0.1, // 10% per year
        remainingLife: 8, // years
        replacementDate: new Date(Date.now() + 8 * 365 * 24 * 60 * 60 * 1000)
      }));
  }
}
