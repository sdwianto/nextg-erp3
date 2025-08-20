# Port Configuration Guide - NextGen ERP

## 🎯 Overview

Dokumen ini menjelaskan solusi untuk masalah ketidaksinkronan port antara frontend dan backend dalam NextGen ERP system. Solusi ini memastikan konsistensi port dan memudahkan development.

## 🔧 Masalah yang Dipecahkan

### **Sebelumnya:**
- Frontend dan backend menggunakan port yang tidak konsisten
- WebSocket connection error karena port mismatch
- Manual configuration yang prone to error
- Kesulitan dalam development dan debugging

### **Sekarang:**
- Port configuration yang terpusat dan konsisten
- Auto-calculated URLs untuk WebSocket dan API
- Script setup otomatis
- Development yang lebih mudah dan reliable

## 📋 Port Configuration

### **Default Ports**
```
Frontend (Next.js):    3002
Backend (Express):     3001
WebSocket:             3001 (same as backend)
Database (PostgreSQL): 5432
```

### **Environment Variables**
```bash
# Port Configuration
FRONTEND_PORT=3002
BACKEND_PORT=3001

# Auto-calculated URLs
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3002
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 🚀 Quick Setup

### **Option 1: Automated Setup (Recommended)**
```bash
# Linux/Mac
chmod +x scripts/setup-ports.sh
./scripts/setup-ports.sh

# Windows
scripts\setup-ports.bat
```

### **Option 2: Manual Setup**
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp env.local.template .env.local

# 3. Edit .env.local with your database credentials
# 4. Setup database
npm run db:generate
npm run db:seed

# 5. Start servers
npm run dev:all  # Start both servers
```

## 📁 File Structure

### **Configuration Files**
```
src/env.js                    # Central port configuration
env.local.template           # Environment template
scripts/setup-ports.sh       # Linux/Mac setup script
scripts/setup-ports.bat      # Windows setup script
```

### **Updated Files**
```
src/server/index.ts          # Backend port configuration
src/hooks/use-realtime.ts    # WebSocket URL configuration
package.json                 # Scripts and dependencies
README.md                    # Documentation
```

## 🔄 Available Scripts

### **Development Scripts**
```bash
npm run dev          # Start frontend only (port 3002)
npm run dev:server   # Start backend only (port 3001)
npm run dev:all      # Start both servers concurrently
```

### **Production Scripts**
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run start:server # Start production backend
```

## 🛠️ Implementation Details

### **1. Central Port Configuration (`src/env.js`)**
```typescript
// Helper functions for consistent port management
export const getPorts = () => {
  const frontendPort = parseInt(env.FRONTEND_PORT);
  const backendPort = parseInt(env.BACKEND_PORT);
  
  return {
    frontend: frontendPort,
    backend: backendPort,
    websocket: `ws://localhost:${backendPort}`,
    api: `http://localhost:${backendPort}`,
    frontendUrl: `http://localhost:${frontendPort}`,
  };
};
```

### **2. Backend Configuration (`src/server/index.ts`)**
```typescript
import { getPorts } from "../env";

const { backend: PORT } = getPorts();
```

### **3. WebSocket Configuration (`src/hooks/use-realtime.ts`)**
```typescript
import { getPorts } from '../env';

useEffect(() => {
  const { websocket } = getPorts();
  const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || websocket, {
    transports: ['websocket'],
    autoConnect: true,
  });
}, []);
```

## 🔍 Troubleshooting

### **Port Already in Use**
```bash
# Check port usage
wsl ss -tulpn | wsl grep :3001  # Backend
wsl ss -tulpn | wsl grep :3002  # Frontend

# Kill processes
wsl kill $(wsl lsof -ti:3001)  # Kill backend
wsl kill $(wsl lsof -ti:3002)  # Kill frontend
```

### **WebSocket Connection Issues**
```bash
# Test backend
wsl curl -s "http://localhost:3001/"

# Test frontend
wsl curl -s "http://localhost:3002/"

# Check WebSocket
wsl curl -s "http://localhost:3001/socket.io/"
```

### **Environment Issues**
```bash
# Verify environment file
cat .env.local

# Regenerate from template
cp env.local.template .env.local
```

## 📊 Benefits

### **For Developers**
- ✅ Consistent port configuration
- ✅ Automated setup process
- ✅ Easy troubleshooting
- ✅ Clear documentation

### **For Team**
- ✅ Standardized development environment
- ✅ Reduced configuration errors
- ✅ Faster onboarding
- ✅ Better collaboration

### **For Production**
- ✅ Predictable port allocation
- ✅ Easy deployment configuration
- ✅ Scalable architecture
- ✅ Maintainable codebase

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Docker Compose configuration
- [ ] Kubernetes deployment scripts
- [ ] CI/CD pipeline integration
- [ ] Environment-specific configurations
- [ ] Health check endpoints
- [ ] Load balancing support

### **Monitoring & Logging**
- [ ] Port usage monitoring
- [ ] Connection health checks
- [ ] Performance metrics
- [ ] Error tracking

## 📞 Support

Jika mengalami masalah dengan konfigurasi port:

1. **Check logs**: `npm run dev:all`
2. **Verify ports**: `wsl ss -tulpn | wsl grep -E ":3001|:3002"`
3. **Restart servers**: `npm run dev:all`
4. **Check environment**: `cat .env.local`

## 📝 Notes

- Frontend port (3002) digunakan sebagai patokan utama
- Backend port (3001) dihitung relatif terhadap frontend
- WebSocket menggunakan port yang sama dengan backend
- Semua URL dihitung otomatis berdasarkan konfigurasi port
- Script setup otomatis memeriksa dan mengatur environment
