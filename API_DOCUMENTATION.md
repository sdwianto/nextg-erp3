# NextGen ERP Hybrid API Documentation

## Overview

The NextGen ERP system provides a **hybrid API architecture** combining the best of both worlds:

- **Internal API (tRPC)**: Type-safe internal communication for frontend-backend interactions
- **External API (REST)**: Standard REST endpoints for external integrations and third-party systems

This hybrid approach ensures optimal performance, type safety, and seamless integration capabilities.

## Base URLs

### Internal API (tRPC)
```
Development: http://localhost:3000/api/trpc
Production: https://nextgen-erp.com/api/trpc
```

### External API (REST)
```
Development: http://localhost:3000/api/external
Production: https://nextgen-erp.com/api/external
```

## Authentication

### Internal API (tRPC)
Internal API calls use Clerk authentication with automatic session management. No additional headers required for authenticated users.

### External API (REST)
All external API endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Optional validation errors
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## API Architecture Overview

### Internal API (tRPC) - Type-safe Communication
```typescript
// Example: Internal tRPC router for inventory
export const inventoryRouter = router({
  getProducts: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional()
    }))
    .query(async ({ input }) => {
      // Type-safe database queries
      return await prisma.products.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        where: input.search ? {
          OR: [
            { name: { contains: input.search } },
            { sku: { contains: input.search } }
          ]
        } : undefined
      });
    }),

  createProduct: publicProcedure
    .input(z.object({
      name: z.string(),
      sku: z.string(),
      price: z.number(),
      categoryId: z.string()
    }))
    .mutation(async ({ input }) => {
      // Type-safe mutation
      return await prisma.products.create({
        data: input
      });
    })
});
```

### External API (REST) - Third-party Integrations
The following REST endpoints are available for external integrations:

## Inventory Management API

### Products

#### GET /api/external/inventory/products
Get all products with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `search` (string, optional) - Search in name, code, or SKU
- `categoryId` (string, optional) - Filter by category
- `isActive` (boolean, optional) - Filter by active status

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "code": "PROD001",
        "sku": "SKU001",
        "price": 10000, // in cents
        "costPrice": 8000, // in cents
        "minStockLevel": 10,
        "maxStockLevel": 100,
        "currentStock": 50,
        "unitOfMeasure": "PCS",
        "isActive": true,
        "category": {
          "id": "uuid",
          "name": "Category Name"
        },
        "inventoryItems": [
          {
            "id": "uuid",
            "quantity": 50,
            "warehouse": {
              "id": "uuid",
              "name": "Warehouse Name"
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### GET /api/external/inventory/products/:id
Get a single product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "code": "PROD001",
    "sku": "SKU001",
    "description": "Product description",
    "price": 10000,
    "costPrice": 8000,
    "minStockLevel": 10,
    "maxStockLevel": 100,
    "currentStock": 50,
    "unitOfMeasure": "PCS",
    "isActive": true,
    "category": {
      "id": "uuid",
      "name": "Category Name"
    },
    "inventoryItems": [...],
    "inventoryTransactions": [...]
  }
}
```

#### POST /api/external/inventory/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "code": "PROD001",
  "description": "Product description",
  "sku": "SKU001",
  "barcode": "123456789",
  "price": 100.00,
  "costPrice": 80.00,
  "imageUrl": "https://example.com/image.jpg",
  "minStockLevel": 10,
  "maxStockLevel": 100,
  "unitOfMeasure": "PCS",
  "categoryId": "uuid",
  "isService": false
}
```

#### PUT /api/external/inventory/products/:id
Update an existing product.

**Request Body:** (Same as POST, all fields optional)

#### DELETE /api/external/inventory/products/:id
Soft delete a product (sets isActive to false).

### Categories

#### GET /api/external/inventory/categories
Get all categories.

**Query Parameters:**
- `includeInactive` (boolean, default: false) - Include inactive categories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Category Name",
      "code": "CAT001",
      "description": "Category description",
      "isActive": true,
      "parent": null,
      "children": [...],
      "_count": {
        "products": 10
      }
    }
  ]
}
```

#### POST /api/external/inventory/categories
Create a new category.

**Request Body:**
```json
{
  "name": "Category Name",
  "code": "CAT001",
  "description": "Category description",
  "parentId": "uuid" // optional
}
```

### Warehouses

#### GET /api/external/inventory/warehouses
Get all active warehouses.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Warehouse Name",
      "code": "WH001",
      "address": "Warehouse address",
      "contactPerson": "Contact Person",
      "phone": "+1234567890",
      "email": "warehouse@example.com",
      "isActive": true,
      "_count": {
        "inventoryItems": 50
      }
    }
  ]
}
```

#### POST /api/external/inventory/warehouses
Create a new warehouse.

**Request Body:**
```json
{
  "name": "Warehouse Name",
  "code": "WH001",
  "address": "Warehouse address",
  "contactPerson": "Contact Person",
  "phone": "+1234567890",
  "email": "warehouse@example.com"
}
```

### Inventory Levels

#### GET /api/external/inventory/levels
Get inventory levels across warehouses.

**Query Parameters:**
- `warehouseId` (string, optional) - Filter by warehouse
- `productId` (string, optional) - Filter by product
- `lowStock` (boolean, default: false) - Show only low stock items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "quantity": 50,
      "reservedQuantity": 5,
      "availableQuantity": 45,
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "code": "PROD001",
        "minStockLevel": 10,
        "category": {
          "id": "uuid",
          "name": "Category Name"
        }
      },
      "warehouse": {
        "id": "uuid",
        "name": "Warehouse Name"
      }
    }
  ]
}
```

### Inventory Transactions

#### GET /api/external/inventory/transactions
Get inventory transactions with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `productId` (string, optional) - Filter by product
- `warehouseId` (string, optional) - Filter by warehouse
- `transactionType` (string, optional) - IN, OUT, ADJUSTMENT, TRANSFER
- `startDate` (date, optional) - Start date for filtering
- `endDate` (date, optional) - End date for filtering

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "quantity": 10,
        "transactionType": "IN",
        "reference": "PO-001",
        "notes": "Purchase order receipt",
        "createdAt": "2024-01-01T00:00:00Z",
        "product": {
          "id": "uuid",
          "name": "Product Name",
          "code": "PROD001",
          "category": {
            "id": "uuid",
            "name": "Category Name"
          }
        },
        "warehouse": {
          "id": "uuid",
          "name": "Warehouse Name"
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### POST /api/external/inventory/transactions
Create a new inventory transaction.

**Request Body:**
```json
{
  "productId": "uuid",
  "warehouseId": "uuid",
  "quantity": 10,
  "transactionType": "IN", // IN, OUT, ADJUSTMENT, TRANSFER
  "reference": "PO-001", // optional
  "notes": "Purchase order receipt" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "quantity": 10,
      "transactionType": "IN",
      "reference": "PO-001",
      "notes": "Purchase order receipt",
      "createdAt": "2024-01-01T00:00:00Z",
      "product": {...},
      "warehouse": {...},
      "user": {...}
    },
    "updatedInventory": {
      "id": "uuid",
      "quantity": 60,
      "availableQuantity": 55
    }
  }
}
```

### Dashboard & Analytics

#### GET /api/external/inventory/dashboard
Get inventory dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 100,
    "totalCategories": 10,
    "totalWarehouses": 5,
    "lowStockItems": 15,
    "recentTransactions": [
      {
        "id": "uuid",
        "quantity": 10,
        "transactionType": "IN",
        "createdAt": "2024-01-01T00:00:00Z",
        "product": {
          "name": "Product Name",
          "code": "PROD001"
        },
        "warehouse": {
          "name": "Warehouse Name"
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "topProducts": [
      {
        "id": "uuid",
        "quantity": 100,
        "product": {
          "name": "Product Name",
          "code": "PROD001"
        },
        "warehouse": {
          "name": "Warehouse Name"
        }
      }
    ]
  }
}
```

#### GET /api/external/inventory/analytics/stock-movement
Get stock movement analytics.

**Query Parameters:**
- `days` (number, default: 30, max: 365) - Number of days to analyze
- `productId` (string, optional) - Filter by product
- `warehouseId` (string, optional) - Filter by warehouse

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyData": [
      {
        "date": "2024-01-01",
        "IN": 50,
        "OUT": 30,
        "ADJUSTMENT": 0,
        "TRANSFER": 10
      }
    ],
    "totalTransactions": 100
  }
}
```

---

## Health Check

#### GET /health
Check API server status.

**Response:**
```json
{
  "success": true,
  "message": "NextGen ERP API is running",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

---

## Error Handling

### Validation Errors
When request validation fails, the API returns a 400 status with validation details:

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_string",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 1 character(s)",
      "path": ["name"]
    }
  ]
}
```

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "error": "Product with this code or SKU already exists"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## CORS

The API supports CORS for cross-origin requests:
- Allowed origins: Configured via `FRONTEND_URL` environment variable
- Credentials: Supported
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roleId": "role-uuid",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Manager**: Read/write access to inventory and reports
- **Operator**: Read access to inventory, write access to transactions
- **Viewer**: Read-only access to inventory data

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextgen_erp"
DIRECT_URL="postgresql://user:password@localhost:5432/nextgen_erp"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"
```

---

## SDKs & Libraries

### JavaScript/TypeScript
```typescript
// Example API client
class NextGenERPClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token || '';
  }

  async getProducts(params?: any) {
    const response = await fetch(`${this.baseUrl}/api/inventory/products?${new URLSearchParams(params)}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async createProduct(product: any) {
    const response = await fetch(`${this.baseUrl}/api/inventory/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    return response.json();
  }
}
```

### cURL Examples

#### Get Products (External API)
```bash
curl -X GET "http://localhost:3000/api/external/inventory/products?page=1&limit=20" \
  -H "Authorization: Bearer your-token"
```

#### Create Product (External API)
```bash
curl -X POST "http://localhost:3000/api/external/inventory/products" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "code": "PROD002",
    "sku": "SKU002",
    "price": 150.00,
    "costPrice": 120.00,
    "minStockLevel": 10,
    "categoryId": "category-uuid"
  }'
```

#### Create Inventory Transaction (External API)
```bash
curl -X POST "http://localhost:3000/api/external/inventory/transactions" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-uuid",
    "warehouseId": "warehouse-uuid",
    "quantity": 10,
    "transactionType": "IN",
    "reference": "PO-002",
    "notes": "Purchase order receipt"
  }'
```

---

## Support

For API support and questions:
- Email: api-support@nextgen-erp.com
- Documentation: https://docs.nextgen-erp.com/api
- GitHub Issues: https://github.com/nextgen-erp/api/issues
