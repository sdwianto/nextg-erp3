# 🚀 Deployment Checklist - NextGen ERP

## 📋 **Pre-Deployment Verification**

### **1. Run Pre-Deployment Check**
```bash
npm run pre-deploy
```

Script ini akan memverifikasi:
- ✅ WebSocket configuration
- ✅ Environment variables
- ✅ Code hygiene (no underscore variables)
- ✅ Console logs (commented out)
- ✅ TypeScript errors
- ✅ ESLint errors

### **2. Manual Verification**

#### **A) WebSocket Configuration**
- [ ] `next.config.js` has `swcMinify: false`
- [ ] `src/lib/socket.ts` uses environment variables
- [ ] `src/pages/api/websocket.ts` exists and configured
- [ ] Environment variables template updated

#### **B) Code Hygiene**
- [ ] No `_getStatusColor` → `getStatusColor`
- [ ] No `_getPriorityColor` → `getPriorityColor`
- [ ] No `_utils` → `utils`
- [ ] No `_validItems` → `validItems`
- [ ] No `_data` → `data`
- [ ] No `_quantity` → `quantity`
- [ ] No `_unitPrice` → `unitPrice`

#### **C) Console Logs**
- [ ] All `console.log` statements commented out
- [ ] No active debugging logs in production

## 🛠️ **Environment Setup**

### **Development**
```bash
# Copy environment template
cp env.local.template .env.local

# Edit .env.local
NEXT_PUBLIC_WS_ORIGIN="http://localhost:3002"
NEXT_PUBLIC_WS_PATH="/api/websocket"
```

### **Production (Vercel)**
Set environment variables in Vercel Dashboard:
```
NEXT_PUBLIC_WS_ORIGIN=https://nextg-erp3.vercel.app
NEXT_PUBLIC_WS_PATH=/api/websocket
```

## 🚀 **Deployment Steps**

### **1. Vercel Dashboard**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the two WebSocket variables above

### **2. Deploy with Clear Cache**
1. Go to Deployments tab
2. Click "Redeploy"
3. **IMPORTANT**: Check "Clear build cache"
4. Deploy

### **3. Post-Deployment Verification**
```bash
# Test WebSocket connection
curl -I https://nextg-erp3.vercel.app/api/websocket
# Should return: Cache-Control: no-cache, no-store, must-revalidate
```

## 🔍 **Testing Checklist**

### **WebSocket Connection**
- [ ] Open browser console
- [ ] Check for "WS connected" message
- [ ] Verify no connection errors
- [ ] Test real-time updates

### **UI Functionality**
- [ ] Navigation between modules works
- [ ] No "connecting..." stuck states
- [ ] Forms submit without errors
- [ ] Data loads properly

### **Performance**
- [ ] Page loads quickly
- [ ] No infinite loading states
- [ ] Smooth transitions
- [ ] No memory leaks

## 🚨 **Troubleshooting**

### **If WebSocket Fails to Connect**
1. Check environment variables in Vercel
2. Verify `next.config.js` has `swcMinify: false`
3. Clear browser cache
4. Check browser console for errors

### **If UI is Stuck**
1. Check for runtime errors in console
2. Verify all variable names are correct
3. Check for infinite loops
4. Restart development server

### **If Build Fails**
1. Run `npm run pre-deploy` locally
2. Fix any TypeScript/ESLint errors
3. Check for missing dependencies
4. Clear node_modules and reinstall

## 📊 **Monitoring**

### **Client-Side Logs**
```typescript
// Check browser console for:
"WS connected" // ✅ Success
"WS connect_error" // ❌ Connection failed
```

### **Server-Side Logs**
```typescript
// Check Vercel logs for:
"WS incoming:" // ✅ Server receiving connections
```

### **Health Check**
```bash
# Test endpoint
curl -I https://nextg-erp3.vercel.app/api/websocket
```

## 🎯 **Success Criteria**

### **Before Deployment**
- [ ] All pre-deployment checks pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] WebSocket configuration correct

### **After Deployment**
- [ ] WebSocket connects successfully
- [ ] Real-time updates work
- [ ] No UI stuck states
- [ ] Performance is acceptable
- [ ] All modules function correctly

## 📝 **Notes**

- **Bundle Size**: Slightly larger due to Terser, but more stable
- **WebSocket**: Uses polling fallback for reliability
- **Environment**: Must be set in Vercel for production
- **Cache**: Clear build cache on redeploy

## 🔄 **Rollback Plan**

If issues occur:
1. Revert to previous deployment
2. Check environment variables
3. Verify WebSocket configuration
4. Test in development first
5. Redeploy with fixes

---

**Status**: ✅ Ready for deployment
**Last Check**: All pre-deployment checks pass
**Next Action**: Deploy to Vercel with clear cache
