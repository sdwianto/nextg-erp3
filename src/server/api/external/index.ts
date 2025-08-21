import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { prisma } from '@/server/db';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Authentication middleware
const authenticateAPI = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    // In real implementation, validate API key against database
    const isValidKey = await validateAPIKey(apiKey as string);
    if (!isValidKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    (req as unknown as Record<string, unknown>).apiKey = apiKey;
    next();
  } catch {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// API Routes
app.use('/api/v1', authenticateAPI);

// ========================================
// INVENTORY EXTERNAL APIs
// ========================================

// Get inventory levels
app.get('/inventory/levels', async (req, res) => {
  try {
    const { warehouse, product, category } = req.query;
    
    const where: Record<string, unknown> = {};
    if (warehouse) where.warehouseId = warehouse as string;
    if (product) where.productId = product as string;
    if (category) where.product = { categoryId: category as string };

    const inventory = await prisma.inventoryItem.findMany({
      where,
      include: {
        product: {
          select: {
            name: true,
            sku: true,
            barcode: true,
            category: { select: { name: true } },
          },
        },
        warehouse: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: inventory.map(item => ({
        id: item.id,
        productName: item.product.name,
        sku: item.product.sku,
        barcode: item.product.barcode,
        quantity: item.quantity,
        category: item.product.category.name,
        warehouse: item.warehouse.name,
        lastUpdated: item.updatedAt,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch inventory levels' });
  }
});

// Update inventory levels
app.post('/inventory/update', async (req, res) => {
  try {
    const { productId, warehouseId, quantity, transactionType, reference, notes } = req.body;

    if (!productId || !warehouseId || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.inventoryTransaction.create({
      data: {
        productId,
        warehouseId,
        quantity,
        transactionType: transactionType ?? 'ADJUSTMENT',
        referenceId: reference,
        notes,
        userId: 'external-api', // System user for external updates
      },
    });

    // Update inventory item
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: { productId, warehouseId },
    });

    if (inventoryItem) {
      await prisma.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: {
          quantity: inventoryItem.quantity + quantity,
        },
      });
    } else {
      await prisma.inventoryItem.create({
        data: {
          productId,
          warehouseId,
          quantity,
        },
      });
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        newQuantity: inventoryItem ? inventoryItem.quantity + quantity : quantity,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// ========================================
// SUPPLIER INTEGRATION APIs
// ========================================

// Get supplier catalog
app.get('/suppliers/:supplierId/catalog', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        description: true,
        price: true,
        costPrice: true,
        minStockLevel: true,
        maxStockLevel: true,
        unitOfMeasure: true,
        isActive: true,
      },
    });

    res.json({
      success: true,
      data: {
        supplierId: req.params.supplierId,
        products,
        totalProducts: products.length,
        lastUpdated: new Date(),
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch supplier catalog' });
  }
});

// Update supplier pricing
app.post('/suppliers/:supplierId/pricing', async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array required' });
    }

    const updates = await Promise.all(
      products.map(async (product: Record<string, unknown>) => {
        return prisma.product.updateMany({
          where: {
            id: product.id as string,
          },
          data: {
            price: product.price as number,
            costPrice: product.costPrice as number,
            updatedAt: new Date(),
          },
        });
      })
    );

    res.json({
      success: true,
      data: {
        updatedProducts: updates.length,
        lastUpdated: new Date(),
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to update supplier pricing' });
  }
});

// ========================================
// GPS TRACKING APIs
// ========================================

// Update delivery location
app.post('/delivery/location', async (req, res) => {
  try {
    const { grNumber, latitude, longitude, timestamp } = req.body;

    if (!grNumber || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Implement goods receipt location update
    // console.log('Updating delivery location:', { grNumber, latitude, longitude, timestamp });

    res.json({
      success: true,
      data: {
        grNumber,
        location: { latitude, longitude },
        timestamp: timestamp || new Date(),
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to update delivery location' });
  }
});

// Get delivery tracking
app.get('/delivery/tracking/:grNumber', async (req, res) => {
  try {
    const { grNumber } = req.params;

    // TODO: Implement goods receipt tracking
    // console.log('Fetching delivery tracking for:', grNumber);

    res.json({
      success: true,
      data: {
        grNumber,
        supplier: 'Unknown Supplier',
        destination: 'Unknown Warehouse',
        address: 'Unknown Address',
        currentLocation: null,
        status: 'IN_TRANSIT',
        lastUpdated: new Date(),
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch delivery tracking' });
  }
});

// ========================================
// QUALITY INSPECTION APIs
// ========================================

// Submit quality inspection results
app.post('/quality/inspection', async (req, res) => {
  try {
    const { grNumber, status, items, inspector } = req.body;

    if (!grNumber || !status || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Implement quality inspection
    // console.log('Submitting quality inspection:', { grNumber, status, items, inspector });

    res.json({
      success: true,
      data: {
        grNumber,
        status,
        inspector,
        inspectedAt: new Date(),
        itemsInspected: items.length,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to submit quality inspection' });
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function validateAPIKey(apiKey: string): Promise<boolean> {
  // In real implementation, validate against database
  // For now, accept any non-empty key
  return apiKey.length > 0;
}

// Error handling middleware
app.use((error: unknown, req: express.Request, res: express.Response) => {
  // console.error('External API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

export default app;
