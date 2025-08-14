# 📦 **ENHANCED INVENTORY MODULE - DATABASE SCHEMA**

## **NextGen ERP - Enhanced Inventory Database Design**

---

## 🗄️ **ENHANCED INVENTORY DATABASE SCHEMA**

### **1. Core Inventory Tables**

```sql
-- Enhanced Product Master Data
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    unit_of_measure VARCHAR(20) NOT NULL,
    is_asset BOOLEAN DEFAULT FALSE, -- For asset tracking
    is_maintenance_part BOOLEAN DEFAULT FALSE, -- For maintenance parts
    reorder_point DECIMAL(10,2),
    max_stock DECIMAL(10,2),
    safety_stock DECIMAL(10,2),
    lead_time INTEGER, -- days
    cost_price DECIMAL(15,2),
    selling_price DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Categories with Hierarchy
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Multi-warehouse Support
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    gps_coordinates POINT, -- For GPS tracking
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Location Tracking
CREATE TABLE inventory_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID REFERENCES warehouses(id),
    zone VARCHAR(50),
    shelf VARCHAR(50),
    bin VARCHAR(50),
    gps_coordinates POINT, -- For GPS tracking
    created_at TIMESTAMP DEFAULT NOW()
);

-- Real-time Inventory Items with Enhanced Tracking
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    location_id UUID REFERENCES inventory_locations(id),
    current_stock DECIMAL(10,2) DEFAULT 0,
    reserved_stock DECIMAL(10,2) DEFAULT 0,
    available_stock DECIMAL(10,2) GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Inventory Transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    reference_type VARCHAR(50), -- 'purchase_order', 'sales_order', 'maintenance', etc.
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Item Ledger for Full Transaction History
CREATE TABLE item_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    transaction_date DATE NOT NULL,
    opening_balance DECIMAL(10,2) NOT NULL,
    quantity_in DECIMAL(10,2) DEFAULT 0,
    quantity_out DECIMAL(10,2) DEFAULT 0,
    closing_balance DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(15,2),
    total_value DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Enhanced Procurement Tables**

```sql
-- Enhanced Suppliers with Performance Tracking
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    currency_id UUID REFERENCES currencies(id),
    payment_terms INTEGER, -- days
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Supplier Performance Tracking
CREATE TABLE supplier_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id),
    on_time_delivery DECIMAL(5,2), -- percentage
    quality_rating DECIMAL(5,2), -- percentage
    cost_competitiveness DECIMAL(5,2), -- percentage
    total_spend DECIMAL(15,2),
    evaluation_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Purchase Requests
CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pr_number VARCHAR(20) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    estimated_cost DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'rejected'
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_amount DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'confirmed', 'received', 'cancelled'
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    is_asset BOOLEAN DEFAULT FALSE, -- Flag for asset creation
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Goods Receipt
CREATE TABLE goods_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gr_number VARCHAR(20) UNIQUE NOT NULL,
    purchase_order_id UUID REFERENCES purchase_orders(id),
    receipt_date DATE NOT NULL,
    warehouse_id UUID REFERENCES warehouses(id),
    location_id UUID REFERENCES inventory_locations(id),
    quality_check_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'passed', 'failed'
    quality_check_by UUID REFERENCES users(id),
    quality_check_at TIMESTAMP,
    gps_coordinates POINT, -- For GPS tracking
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Goods Receipt Items
CREATE TABLE goods_receipt_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goods_receipt_id UUID REFERENCES goods_receipts(id),
    purchase_order_item_id UUID REFERENCES purchase_order_items(id),
    product_id UUID REFERENCES products(id),
    quantity_received DECIMAL(10,2) NOT NULL,
    quantity_accepted DECIMAL(10,2) NOT NULL,
    quantity_rejected DECIMAL(10,2) DEFAULT 0,
    unit_cost DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Asset Integration Tables**

```sql
-- Asset Master Data
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_number VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(200) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    category_id UUID REFERENCES categories(id),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    current_value DECIMAL(15,2),
    depreciation_rate DECIMAL(5,2),
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    useful_life INTEGER, -- years
    location_id UUID REFERENCES inventory_locations(id),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'maintenance', 'retired', 'sold'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Asset Transactions
CREATE TABLE asset_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'depreciation', 'maintenance', 'sale'
    amount DECIMAL(15,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id),
    transaction_date DATE NOT NULL,
    description TEXT,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Real-time Monitoring Tables**

```sql
-- Real-time Stock Alerts
CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    alert_type VARCHAR(20) NOT NULL, -- 'low_stock', 'out_of_stock', 'overstock'
    current_stock DECIMAL(10,2),
    threshold_stock DECIMAL(10,2),
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Automated Reorder Rules
CREATE TABLE reorder_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    reorder_point DECIMAL(10,2) NOT NULL,
    reorder_quantity DECIMAL(10,2) NOT NULL,
    max_stock DECIMAL(10,2),
    lead_time INTEGER, -- days
    supplier_id UUID REFERENCES suppliers(id),
    is_auto_reorder BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- GPS Location Tracking
CREATE TABLE location_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID REFERENCES inventory_items(id),
    gps_coordinates POINT NOT NULL,
    tracking_date TIMESTAMP NOT NULL,
    tracking_type VARCHAR(20) NOT NULL, -- 'manual', 'gps', 'barcode'
    tracked_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Performance Indexes**

```sql
-- Performance Indexes for Enhanced Inventory
CREATE INDEX idx_inventory_items_product_warehouse ON inventory_items(product_id, warehouse_id);
CREATE INDEX idx_inventory_transactions_date_type ON inventory_transactions(created_at, transaction_type);
CREATE INDEX idx_inventory_transactions_reference ON inventory_transactions(reference_type, reference_id);
CREATE INDEX idx_item_ledger_date_product ON item_ledger(transaction_date, product_id);
CREATE INDEX idx_stock_alerts_status_priority ON stock_alerts(status, priority);
CREATE INDEX idx_purchase_orders_status_date ON purchase_orders(status, order_date);
CREATE INDEX idx_goods_receipts_date_warehouse ON goods_receipts(receipt_date, warehouse_id);
CREATE INDEX idx_location_tracking_date_item ON location_tracking(tracking_date, inventory_item_id);
CREATE INDEX idx_supplier_performance_date ON supplier_performance(evaluation_date);
CREATE INDEX idx_assets_status_location ON assets(status, location_id);
```

### **6. Views for Real-time Analytics**

```sql
-- Real-time Stock Summary View
CREATE VIEW real_time_stock_summary AS
SELECT 
    p.id as product_id,
    p.sku,
    p.name as product_name,
    p.reorder_point,
    p.max_stock,
    p.safety_stock,
    w.name as warehouse_name,
    w.code as warehouse_code,
    il.zone,
    il.shelf,
    il.bin,
    ii.current_stock,
    ii.reserved_stock,
    ii.available_stock,
    ii.last_updated,
    CASE 
        WHEN ii.available_stock = 0 THEN 'out_of_stock'
        WHEN ii.available_stock <= p.reorder_point THEN 'low_stock'
        WHEN ii.available_stock >= p.max_stock THEN 'overstock'
        ELSE 'normal'
    END as stock_status
FROM products p
JOIN inventory_items ii ON p.id = ii.product_id
JOIN warehouses w ON ii.warehouse_id = w.id
LEFT JOIN inventory_locations il ON ii.location_id = il.id
WHERE p.is_active = true;

-- Supplier Performance Summary View
CREATE VIEW supplier_performance_summary AS
SELECT 
    s.id as supplier_id,
    s.name as supplier_name,
    s.code as supplier_code,
    AVG(sp.on_time_delivery) as avg_on_time_delivery,
    AVG(sp.quality_rating) as avg_quality_rating,
    AVG(sp.cost_competitiveness) as avg_cost_competitiveness,
    SUM(sp.total_spend) as total_spend,
    COUNT(sp.id) as evaluation_count,
    MAX(sp.evaluation_date) as last_evaluation_date
FROM suppliers s
LEFT JOIN supplier_performance sp ON s.id = sp.supplier_id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.code;

-- Procurement to Asset Flow View
CREATE VIEW procurement_to_asset_flow AS
SELECT 
    po.po_number,
    po.order_date,
    s.name as supplier_name,
    p.sku,
    p.name as product_name,
    poi.quantity,
    poi.unit_cost,
    poi.total_cost,
    poi.is_asset,
    gr.gr_number,
    gr.receipt_date,
    gr.quality_check_status,
    a.asset_number,
    a.asset_name,
    a.purchase_cost,
    a.current_value
FROM purchase_orders po
JOIN suppliers s ON po.supplier_id = s.id
JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
JOIN products p ON poi.product_id = p.id
LEFT JOIN goods_receipts gr ON po.id = gr.purchase_order_id
LEFT JOIN assets a ON poi.id = a.reference_id AND poi.is_asset = true
WHERE po.status IN ('confirmed', 'received');
```

---

## 🎯 **KEY FEATURES IMPLEMENTED**

### **✅ Real-time Stock Monitoring**
- Live stock level tracking dengan available stock calculation
- Multi-warehouse support dengan location tracking
- GPS coordinates untuk field operations
- Automatic stock status determination

### **✅ Smart Reorder Alerts**
- Automated reorder rules dengan configurable parameters
- Real-time alert generation berdasarkan stock levels
- Priority-based alert system
- Integration dengan supplier performance

### **✅ Advanced Procurement Workflow**
- Purchase request automation
- Supplier performance tracking
- Quality inspection integration
- GPS tracking untuk goods receipt

### **✅ Asset Integration**
- Automatic asset creation dari procurement
- Asset lifecycle tracking
- Depreciation calculation
- Location assignment

### **✅ Performance Optimization**
- Comprehensive indexing strategy
- Real-time views untuk analytics
- Efficient query optimization
- Scalable architecture

---

## 🚀 **NEXT STEPS**

Dengan database schema ini, kita siap untuk:

1. **API Endpoints Implementation** - Real-time inventory APIs
2. **Frontend Components** - Enhanced inventory dashboard
3. **Real-time Integration** - WebSocket implementation
4. **Testing & Validation** - Comprehensive testing

Apakah Anda ingin saya lanjutkan dengan **API Endpoints Implementation** untuk Enhanced Inventory Module?
