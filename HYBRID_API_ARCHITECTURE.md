# 🚀 **NextGen ERP - Hybrid API Architecture**

## **Overview**

The NextGen ERP system implements a **hybrid API architecture** that combines the best of both worlds:

- **Internal API (tRPC)**: Type-safe, high-performance communication for frontend-backend interactions
- **External API (REST)**: Standard REST endpoints for external integrations and third-party systems

This architecture provides optimal performance, developer experience, and integration capabilities for enterprise applications.

---

## 🏗️ **Architecture Overview**

### **Three-Tier Architecture with Hybrid API Layer**

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│                 (Next.js Frontend)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Hybrid API Layer                          │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Internal API  │    │   External API  │                │
│  │     (tRPC)      │    │     (REST)      │                │
│  │                 │    │                 │                │
│  │ • Type-safe     │    │ • Standard      │                │
│  │ • High perf     │    │ • Compatible    │                │
│  │ • Auto-complete │    │ • Third-party   │                │
│  │ • Real-time     │    │ • Integration   │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                              │
│              (PostgreSQL + CouchDB)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Internal API (tRPC)**

### **Purpose**
- **Frontend-Backend Communication**: Primary interface for Next.js frontend
- **Type Safety**: End-to-end type safety with TypeScript
- **Performance**: Optimized for internal operations
- **Developer Experience**: Auto-completion and compile-time error checking

### **Key Features**

#### **1. Type-Safe Communication**
```typescript
// Frontend (TypeScript)
const products = await trpc.inventory.getProducts.query({
  page: 1,
  limit: 20,
  search: "mining equipment"
});

// Backend (TypeScript)
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
    })
});
```

#### **2. Real-time Operations**
```typescript
// Real-time inventory updates
export const realTimeRouter = router({
  subscribeToInventory: publicProcedure
    .input(z.object({
      warehouseId: z.string().optional()
    }))
    .subscription(async ({ input }) => {
      return new Observable((emit) => {
        const unsubscribe = io.on('inventory-update', (data) => {
          if (!input.warehouseId || data.warehouseId === input.warehouseId) {
            emit.next(data);
          }
        });
        
        return () => unsubscribe();
      });
    })
});
```

#### **3. Optimized Performance**
- **Batching**: Multiple queries in single request
- **Caching**: Automatic result caching
- **Pagination**: Efficient data loading
- **Real-time**: WebSocket integration

### **Base URL**
```
Development: http://localhost:3000/api/trpc
Production: https://nextgen-erp.com/api/trpc
```

---

## 🌐 **External API (REST)**

### **Purpose**
- **Third-party Integrations**: Standard REST endpoints for external systems
- **API Compatibility**: Familiar REST patterns for developers
- **Enterprise Integration**: Support for legacy systems
- **Webhook Support**: Real-time data synchronization

### **Key Features**

#### **1. Standard REST Endpoints**
```typescript
// External REST API endpoints
app.get('/api/external/inventory/products', async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  
  const products = await prisma.products.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    where: search ? {
      OR: [
        { name: { contains: String(search) } },
        { sku: { contains: String(search) } }
      ]
    } : undefined
  });
  
  res.json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: await prisma.products.count()
    }
  });
});
```

#### **2. Authentication & Security**
```typescript
// JWT-based authentication for external APIs
app.use('/api/external', authenticateToken);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
```

#### **3. Webhook Support**
```typescript
// Webhook endpoints for real-time updates
app.post('/api/external/webhooks/inventory-update', async (req, res) => {
  const { productId, warehouseId, quantity, action } = req.body;
  
  // Process webhook data
  await processInventoryWebhook({
    productId,
    warehouseId,
    quantity,
    action,
    timestamp: new Date()
  });
  
  res.json({ success: true, message: 'Webhook processed' });
});
```

### **Base URL**
```
Development: http://localhost:3000/api/external
Production: https://nextgen-erp.com/api/external
```

---

## 🔄 **Data Flow Scenarios**

### **1. Internal Operations (tRPC)**
```
Frontend (Next.js) → tRPC → Backend (Express.js) → Database
     ↑                    ↓
     └── Type-safe ←── Response
```

**Use Cases:**
- Dashboard data loading
- Form submissions
- Real-time updates
- User interactions
- Internal business logic

### **2. External Integrations (REST)**
```
External System → REST API → Backend (Express.js) → Database
     ↑                    ↓
     └── JSON Response ←── Processed Data
```

**Use Cases:**
- Third-party integrations
- Mobile applications
- Legacy system connections
- Webhook notifications
- API partnerships

### **3. Hybrid Operations**
```
Frontend (tRPC) → Backend → External System (REST)
     ↑                    ↓
     └── Combined ←── Response
```

**Use Cases:**
- Data synchronization
- Multi-system workflows
- Complex integrations
- Real-time synchronization

---

## 🛠️ **Implementation Examples**

### **1. Inventory Management**

#### **Internal API (tRPC)**
```typescript
// Frontend usage
const { data: products, isLoading } = trpc.inventory.getProducts.useQuery({
  page: 1,
  limit: 20,
  category: 'mining-equipment'
});

const createProduct = trpc.inventory.createProduct.useMutation();
```

#### **External API (REST)**
```bash
# External system integration
curl -X GET "https://nextgen-erp.com/api/external/inventory/products" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

### **2. Real-time Updates**

#### **Internal API (tRPC)**
```typescript
// Real-time subscription
const { data: realTimeData } = trpc.inventory.subscribeToUpdates.useSubscription(
  { warehouseId: 'warehouse-1' },
  {
    onData: (data) => {
      console.log('Real-time update:', data);
    }
  }
);
```

#### **External API (REST)**
```typescript
// Webhook endpoint for external systems
app.post('/api/external/webhooks/real-time-update', async (req, res) => {
  const { event, data } = req.body;
  
  // Process real-time event
  await processRealTimeEvent(event, data);
  
  res.json({ success: true });
});
```

### **3. Authentication**

#### **Internal API (tRPC)**
```typescript
// Automatic authentication with Clerk
export const protectedRouter = router({
  getUserData: protectedProcedure
    .query(async ({ ctx }) => {
      // ctx.user is automatically available
      return await prisma.users.findUnique({
        where: { id: ctx.user.id }
      });
    })
});
```

#### **External API (REST)**
```typescript
// JWT-based authentication
app.get('/api/external/user/profile', authenticateToken, async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { id: req.user.id }
  });
  
  res.json({ success: true, data: user });
});
```

---

## 📊 **Performance Comparison**

| **Aspect** | **Internal API (tRPC)** | **External API (REST)** |
|------------|-------------------------|-------------------------|
| **Type Safety** | ✅ Full TypeScript support | ❌ Manual type checking |
| **Performance** | ✅ Optimized batching | ⚠️ Standard HTTP overhead |
| **Developer Experience** | ✅ Auto-completion | ⚠️ Manual documentation |
| **Compatibility** | ❌ tRPC client required | ✅ Universal compatibility |
| **Real-time** | ✅ Built-in subscriptions | ⚠️ Requires WebSocket setup |
| **Security** | ✅ Automatic with Clerk | ⚠️ Manual JWT handling |

---

## 🔐 **Security Considerations**

### **Internal API (tRPC)**
- **Clerk Authentication**: Automatic session management
- **Role-based Access**: Built-in permission system
- **CSRF Protection**: Automatic CSRF token handling
- **Rate Limiting**: Built-in rate limiting

### **External API (REST)**
- **JWT Authentication**: Bearer token validation
- **API Keys**: Optional API key authentication
- **Rate Limiting**: Per-client rate limiting
- **CORS**: Configurable cross-origin policies

---

## 🚀 **Deployment Configuration**

### **Development Environment**
```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/trpc/:path*',
        destination: '/api/trpc/:path*'
      },
      {
        source: '/api/external/:path*',
        destination: '/api/external/:path*'
      }
    ];
  }
};
```

### **Production Environment**
```typescript
// Production API configuration
const API_CONFIG = {
  internal: {
    baseUrl: 'https://nextgen-erp.com/api/trpc',
    timeout: 30000
  },
  external: {
    baseUrl: 'https://nextgen-erp.com/api/external',
    timeout: 60000
  }
};
```

---

## 📈 **Benefits of Hybrid Architecture**

### **1. Developer Experience**
- **Type Safety**: End-to-end TypeScript support for internal operations
- **Auto-completion**: Intelligent code completion and error detection
- **Documentation**: Automatic API documentation generation
- **Testing**: Simplified testing with type-safe mocks

### **2. Performance**
- **Optimized Communication**: Efficient data transfer for internal operations
- **Batching**: Multiple operations in single requests
- **Caching**: Automatic result caching and invalidation
- **Real-time**: Built-in real-time capabilities

### **3. Integration**
- **Universal Compatibility**: Standard REST for external systems
- **Legacy Support**: Easy integration with existing systems
- **Third-party**: Seamless third-party service integration
- **Webhooks**: Real-time data synchronization

### **4. Enterprise Features**
- **Scalability**: Horizontal scaling capabilities
- **Security**: Multi-layer security approach
- **Monitoring**: Comprehensive API monitoring
- **Compliance**: Enterprise-grade compliance features

---

## 🎯 **Best Practices**

### **1. API Design**
- Use tRPC for all internal frontend-backend communication
- Use REST for external integrations and third-party systems
- Maintain consistent data models across both APIs
- Implement proper error handling and validation

### **2. Performance**
- Implement caching strategies for both APIs
- Use pagination for large data sets
- Optimize database queries
- Monitor API performance metrics

### **3. Security**
- Implement proper authentication for both APIs
- Use HTTPS in production
- Validate all input data
- Implement rate limiting

### **4. Documentation**
- Maintain comprehensive API documentation
- Provide code examples for both APIs
- Document authentication methods
- Include error handling examples

---

## 🔮 **Future Enhancements**

### **1. GraphQL Integration**
- Consider GraphQL for complex data queries
- Implement GraphQL alongside existing APIs
- Provide GraphQL schema for external integrations

### **2. API Gateway**
- Implement API gateway for centralized management
- Add advanced routing and load balancing
- Implement API versioning strategy

### **3. Advanced Monitoring**
- Real-time API performance monitoring
- Advanced analytics and reporting
- Automated alerting and notifications

### **4. Enhanced Security**
- OAuth 2.0 implementation
- Advanced rate limiting strategies
- API key management system

---

This hybrid API architecture provides the NextGen ERP system with the best of both worlds: type-safe, high-performance internal communication and universal compatibility for external integrations.
