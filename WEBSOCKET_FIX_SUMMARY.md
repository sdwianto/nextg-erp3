# 🔧 WebSocket & Code Hygiene Fix Summary

## 📋 **Implementasi Perbaikan Tiga Lapis**

### **A) Toolchain (Permanen) ✅**

**Masalah**: SWC minification memotong path `/api/websocket` di vendor chunk

**Solusi**: 
- Disable SWC minification dengan `swcMinify: false` di `next.config.js`
- Gunakan Terser sebagai minifier (lebih stabil untuk WebSocket)
- Tambahkan cache-busting headers untuk WebSocket route

**File yang diubah**:
```javascript
// next.config.js
const nextConfig = {
  swcMinify: false,         // ← Permanen: gunakan Terser
  // ... konfigurasi lainnya
};
```

**Dampak**: Bundle sedikit lebih besar, tapi stabil di production

### **B) Konfigurasi Socket.IO Eksplisit ✅**

**Masalah**: Client menebak path WebSocket, bisa terpotong bundler

**Solusi**:
1. **Server**: Gunakan `pages/api/websocket.ts` (Node runtime)
2. **Client**: Hardcode origin & path dari ENV publik
3. **Environment**: Konfigurasi eksplisit

**File yang diubah**:

**Client (`src/lib/socket.ts`)**:
```typescript
const ORIGIN = process.env.NEXT_PUBLIC_WS_ORIGIN ?? 
  (typeof window !== "undefined" ? window.location.origin : "");

const PATH = process.env.NEXT_PUBLIC_WS_PATH ?? "/api/websocket";

export const socket = io(ORIGIN, {
  path: PATH,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 20000,
});
```

**Server (`src/pages/api/websocket.ts`)**:
```typescript
const io = new IOServer(res.socket.server, {
  path: "/api/websocket",
  transports: ["websocket", "polling"],
  cors: { 
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://nextg-erp3.vercel.app', 'https://*.vercel.app']
      : ['http://localhost:3002', 'http://localhost:3000'],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  },
});
```

**Environment Variables**:
```bash
# Development
NEXT_PUBLIC_WS_ORIGIN="http://localhost:3002"
NEXT_PUBLIC_WS_PATH="/api/websocket"

# Production (Vercel)
NEXT_PUBLIC_WS_ORIGIN="https://nextg-erp3.vercel.app"
NEXT_PUBLIC_WS_PATH="/api/websocket"
```

### **C) Hygiene Kode (Mencegah Reconnect-Loop) ✅**

**Masalah**: Mismatch nama variabel memicu runtime error → reconnect-loop

**Solusi**: Standardisasi nama variabel tanpa underscore

**Perbaikan yang dilakukan**:

1. **Utils References**:
   ```typescript
   // ❌ Sebelum
   const _utils = api.useUtils();
   _utils.procurement.getDashboardData.invalidate();
   
   // ✅ Sesudah
   const utils = api.useUtils();
   utils.procurement.getDashboardData.invalidate();
   ```

2. **Status Color Functions**:
   ```typescript
   // ❌ Sebelum
   const _getStatusColor = (status: string) => { ... }
   <Badge className={_getStatusColor(pr.status)}>
   
   // ✅ Sesudah
   const getStatusColor = (status: string) => { ... }
   <Badge className={getStatusColor(pr.status)}>
   ```

3. **Priority Color Functions**:
   ```typescript
   // ❌ Sebelum
   const _getPriorityColor = (priority: string) => { ... }
   <Badge className={_getPriorityColor(pr.priority)}>
   
   // ✅ Sesudah
   const getPriorityColor = (priority: string) => { ... }
   <Badge className={getPriorityColor(pr.priority)}>
   ```

4. **Variable Names**:
   ```typescript
   // ❌ Sebelum
   const _validItems = items.filter(...);
   const _quantity = Number(item.quantity) || 0;
   const _unitPrice = Number(item.unitPrice) || 0;
   
   // ✅ Sesudah
   const validItems = items.filter(...);
   const quantity = Number(item.quantity) || 0;
   const unitPrice = Number(item.unitPrice) || 0;
   ```

**File yang diperbaiki**:
- `src/components/EnhancedProcurementWorkflow.tsx`
- `src/components/procurement/EnhancedProcurementWorkflowSplit.tsx`
- `src/components/procurement/ProcurementModals.tsx`
- `src/components/procurement/PurchaseOrdersTab.tsx`
- `src/components/procurement/PurchaseRequestsTab.tsx`
- `src/components/procurement/ProcurementOverview.tsx`

## 🛠️ **Script Otomatis**

**Script untuk memperbaiki masalah hygiene kode**:
```bash
npm run lint:fix-websocket
```

**Script ini akan**:
- Memperbaiki semua referensi `_getStatusColor` → `getStatusColor`
- Memperbaiki semua referensi `_getPriorityColor` → `getPriorityColor`
- Memperbaiki semua referensi `_utils` → `utils`
- Memperbaiki semua referensi `_validItems` → `validItems`
- Memperbaiki semua referensi `_quantity` → `quantity`
- Memperbaiki semua referensi `_unitPrice` → `unitPrice`
- Memeriksa konfigurasi WebSocket

## 🚀 **Langkah Deployment**

### **1. Development**
```bash
# Copy environment template
cp env.local.template .env.local

# Edit .env.local dengan konfigurasi lokal
NEXT_PUBLIC_WS_ORIGIN="http://localhost:3002"
NEXT_PUBLIC_WS_PATH="/api/websocket"

# Jalankan script perbaikan
npm run lint:fix-websocket

# Test aplikasi
npm run dev
```

### **2. Production (Vercel)**
```bash
# Set environment variables di Vercel
NEXT_PUBLIC_WS_ORIGIN="https://nextg-erp3.vercel.app"
NEXT_PUBLIC_WS_PATH="/api/websocket"

# Deploy dengan clear cache
# Vercel Dashboard → Project → Deployments → Redeploy → Clear build cache
```

## 📊 **Hasil yang Diharapkan**

### **Sebelum Perbaikan**:
- ❌ WebSocket path terpotong bundler
- ❌ Reconnect-loop karena runtime error
- ❌ UI stuck "connecting..."
- ❌ Bundle tidak stabil di production

### **Sesudah Perbaikan**:
- ✅ WebSocket path eksplisit & stabil
- ✅ Tidak ada runtime error dari mismatch variabel
- ✅ UI responsive & tidak stuck
- ✅ Bundle stabil di production dengan Terser

## 🔍 **Monitoring & Debugging**

### **Client Logs**:
```typescript
socket.on("connect", () => {
  console.log("WS connected", { ORIGIN, PATH, id: socket.id });
});

socket.on("connect_error", (err) => {
  console.error("WS connect_error", err?.message, { ORIGIN, PATH });
});
```

### **Server Logs**:
```typescript
io.engine.on("connection", (raw) => {
  console.log("WS incoming:", raw?.request?.url);
});
```

### **Health Check**:
```bash
# Test WebSocket connection
curl -I https://nextg-erp3.vercel.app/api/websocket
# Should return: Cache-Control: no-cache, no-store, must-revalidate
```

## 🎯 **Best Practices**

1. **Selalu gunakan environment variables untuk WebSocket config**
2. **Standardisasi nama variabel tanpa underscore**
3. **Test WebSocket di development & production**
4. **Monitor WebSocket logs untuk debugging**
5. **Clear cache saat deploy ke production**

## 📝 **Catatan Penting**

- **Versi Socket.IO**: 4.7.5 (sudah sesuai)
- **Versi Next.js**: 15.2.3 (sudah sesuai)
- **Minifier**: Terser (lebih stabil dari SWC untuk WebSocket)
- **Runtime**: Node.js (bukan Edge) untuk Socket.IO server

Perbaikan ini memastikan WebSocket berjalan stabil tanpa truncation atau reconnect-loop yang dapat mengganggu user experience.
