// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Database Types
export interface DatabaseError {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}

// Procurement Types
export interface PurchaseRequest {
  id: string;
  prNumber: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  requiredDate: Date;
    estimatedBudget: number | null | { toNumber(): number }; // Prisma Decimal
  department: string | null;
    costCenter: string | null;
    items: PurchaseRequestItem[];
  purchaseOrders?: PurchaseOrder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseRequestItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number | null | { toNumber(): number }; // Prisma Decimal
  specifications: string | null;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';  
  product?: Product;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  grandTotal: number | null | { toNumber(): number }; // Prisma Decimal
  notes: string | null;
  purchaseRequestId: string | null;
  purchaseRequest: PurchaseRequest | null;
  paymentTerms: string | null;
  deliveryTerms: string | null;
  currency: string;
  exchangeRate: number | null | { toNumber(): number }; // Prisma Decimal  
  rejectionReason: string | null;
  items: PurchaseOrderItem[]; 
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications: string | null;
  isAsset: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxNumber: string | null;
  isActive: boolean;
  purchaseOrders?: PurchaseOrder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  sku: string;
  description: string | null;
  price: number;
  costPrice: number;
  unitOfMeasure: string;
  isService: boolean;
}

export interface DashboardStats {
  purchaseRequests: number;
  purchaseOrders: number;
  totalSpend: number;
  pendingApprovals: number;
  pendingPRApprovals: number;
  pendingPOApprovals: number;
  prChangePercent?: number;
  poChangePercent?: number;
  spendChangePercent?: number;
  rejectedPRs?: number;
  rejectedPOs?: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentPurchaseRequests: PurchaseRequest[];
  recentPurchaseOrders: PurchaseOrder[];
  supplierPerformance: Supplier[];
}

// External API Types
export interface ExternalApiResponse<T = unknown> {
  success: boolean;
  data: T;
  timestamp: string;
  source: string;
}

export interface ExchangeRateData {
  USD: number;
  EUR: number;
  JPY: number;
  GBP: number;
  CNY: number;
  lastUpdated: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  condition: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  precipitation: number;
}

export interface ShippingRequest {
  origin: string;
  destination: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  service?: string;
}

export interface ShippingData {
  rates: ShippingRate[];
  estimatedDelivery: string;
  trackingAvailable: boolean;
}

export interface ShippingRate {
  service: string;
  price: number;
  currency: string;
  deliveryTime: string;
  tracking: boolean;
}

// Finance Types
export interface AccountData {
  id: string;
  accountNumber: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
  isActive: boolean;
  parentAccountId?: string;
  parentAccount?: AccountData;
  childAccounts?: AccountData[];
}

export interface TransactionData {
  id: string;
  transactionNumber: string;
  userId: string;
  transactionType: 'SALE' | 'PURCHASE' | 'RENTAL_INCOME' | 'MAINTENANCE_EXPENSE' | 'SALARY_EXPENSE' | 'UTILITY_EXPENSE' | 'OTHER_INCOME' | 'OTHER_EXPENSE';
  amount: number;
  currency: string;
  debitAccount?: string;
  creditAccount?: string;
  description: string;
  transactionDate: Date;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  costValue: number;
  marketValue: number;
  product?: {
    id: string;
    name: string;
    sku: string;
    category: string;
  };
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface InventoryTransaction {
  id: string;
  inventoryId: string;
  transactionType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference: string;
  transactionDate: Date;
  notes?: string;
}

// Equipment Types
export interface EquipmentData {
  id: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
  location: string;
  operatingHours: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceRecord?: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY';
  description: string;
  cost: number;
  performedBy: string;
  performedDate: Date;
  nextMaintenanceDate?: Date;
}

// User Types
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

// Generic Types
export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams {
  search?: string;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: SortOrder;
}

// Utility Types
export type NonNullable<T> = T extends null | undefined ? never : T;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API Gateway Types
export interface ApiGatewayConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  cacheDuration: number;
}

export interface ApiGatewayResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
  userId?: string;
}

export interface RealTimeUpdate {
  entityType: 'inventory' | 'equipment' | 'maintenance' | 'alerts';
  action: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: string;
}
