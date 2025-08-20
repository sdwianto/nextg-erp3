# Port Management System

## Overview

Sistem manajemen port terpusat untuk mencegah konflik port dan memastikan konsistensi antara frontend, backend, dan WebSocket.

## Port Configuration

### Default Ports
- **Frontend**: 3002
- **Backend**: 3001  
- **WebSocket**: 3001 (sama dengan backend)

### Environment-based Configuration
Port akan otomatis menyesuaikan berdasarkan environment:
- **Development**: Menggunakan port custom (3002, 3001)
- **Production**: Menggunakan port default (3000, 3001)

## Centralized Configuration

### File: `src/env.ts`
Sistem konfigurasi terpusat yang menyediakan:

```typescript
// Port management
export const getPorts = () => {
  const isDev = process.env.NODE_ENV === "development";
  return {
    frontend: isDev ? 3002 : 3000,
    backend: 3001,
    websocket: 3001,
  };
};

// URL generators
export const getUrls = () => {
  const ports = getPorts();
  return {
    frontend: `http://localhost:${ports.frontend}`,
    backend: `http://localhost:${ports.backend}`,
    websocket: `ws://localhost:${ports.websocket}`,
    api: `http://localhost:${ports.backend}/api`,
  };
};

// CORS configuration
export const getCorsConfig = () => {
  const urls = getUrls();
  return {
    origin: [urls.frontend, "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  };
};

// WebSocket configuration
export const getWebSocketConfig = () => {
  return {
    cors: getCorsConfig(),
    transports: ['polling', 'websocket'],
    allowEIO3: true,
  };
};
```

## Usage

### 1. Server-side (Backend)
```typescript
import { getPorts, getCorsConfig, getWebSocketConfig } from '../env';

// Express app
app.use(cors(getCorsConfig()));

// WebSocket
const io = new SocketIOServer(httpServer, getWebSocketConfig());
```

### 2. Client-side (Frontend)
```typescript
import { getClientConfig } from '../env';

const config = getClientConfig();
// config.websocketUrl, config.apiUrl, config.frontendUrl
```

### 3. Port Management Script
```bash
# Check port availability
npm run ports:check

# Free all ports
npm run ports:free

# Show port status
npm run ports:status

# Start servers with clean ports
npm run dev:clean
```

## Benefits

### ✅ **Konsistensi**
- Semua komponen menggunakan konfigurasi port yang sama
- Tidak ada hardcoded port di berbagai file

### ✅ **Environment-aware**
- Otomatis menyesuaikan port berdasarkan environment
- Development vs Production configuration

### ✅ **CORS Management**
- Konfigurasi CORS terpusat dan konsisten
- Mendukung multiple origins untuk development

### ✅ **WebSocket Integration**
- Konfigurasi WebSocket yang robust
- Fallback transport (polling → websocket)

### ✅ **Port Conflict Prevention**
- Script untuk mengecek dan membebaskan port
- Otomatis kill process yang menggunakan port yang sama

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
npm run ports:check

# Free the port
npm run ports:free

# Start with clean ports
npm run dev:clean
```

### CORS Errors
1. Pastikan `getCorsConfig()` digunakan di semua server
2. Check bahwa origin frontend ada di CORS configuration
3. Restart server setelah perubahan CORS

### WebSocket Connection Issues
1. Pastikan WebSocket server menggunakan `getWebSocketConfig()`
2. Check bahwa transport fallback berfungsi
3. Verify CORS configuration untuk WebSocket

## Migration Guide

### Dari Hardcoded Ports
1. Replace hardcoded ports dengan `getPorts()`
2. Update CORS configuration dengan `getCorsConfig()`
3. Update WebSocket configuration dengan `getWebSocketConfig()`
4. Test di development dan production

### Contoh Migration
```typescript
// Before
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// After
import { getWebSocketConfig } from '../env';
const io = new SocketIOServer(httpServer, getWebSocketConfig());
```

## Best Practices

1. **Selalu gunakan centralized configuration**
2. **Test di multiple environments**
3. **Gunakan port management script sebelum development**
4. **Monitor port conflicts secara regular**
5. **Document port changes di team**

## Implementation Status

### ✅ **Completed**
- [x] Centralized port configuration (`src/env.ts`)
- [x] Port management script (`scripts/manage-ports.js`)
- [x] CORS configuration consolidation
- [x] WebSocket configuration consolidation
- [x] Client-side configuration utilities
- [x] Package.json scripts integration
- [x] WSL/Linux compatibility
- [x] ES modules support

### 🎯 **Tested & Working**
- [x] `npm run ports:check` - Port availability check
- [x] `npm run ports:status` - Port status display
- [x] `npm run dev:clean` - Clean port start
- [x] Frontend starts on port 3002
- [x] Backend configuration ready for port 3001

### 📋 **Next Steps**
- [ ] Environment variables setup for backend
- [ ] WebSocket connection testing
- [ ] Production deployment configuration
- [ ] Port health monitoring
- [ ] Automatic port conflict resolution

## Future Enhancements

- [ ] Dynamic port allocation
- [ ] Port health monitoring
- [ ] Automatic port conflict resolution
- [ ] Environment-specific port ranges
- [ ] Port usage analytics
