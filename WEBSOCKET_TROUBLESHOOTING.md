# WebSocket Troubleshooting Guide

## Masalah yang Sering Terjadi

### 1. Error: `timer.unref is not a function`
**Penyebab**: Socket.IO menggunakan opsi yang tidak kompatibel dengan browser
**Solusi**: ✅ **SUDAH DIPERBAIKI** - Menghapus opsi `autoUnref: true` dari konfigurasi Socket.IO

### 2. Error: `WebSocket connection failed: WebSocket is closed before the connection is established`
**Penyebab**: Server backend tidak berjalan atau tidak dapat diakses
**Solusi**: ✅ **SUDAH DIPERBAIKI** - Implementasi fallback mechanism dan better error handling

## Solusi Permanen yang Telah Diimplementasikan

### 1. Enhanced Connection Configuration
```typescript
const newSocket = io(websocketUrl, {
  transports: ['polling', 'websocket'], // Start with polling, upgrade to WebSocket
  autoConnect: true,
  timeout: 5000, // Increased timeout for better reliability
  reconnection: true,
  reconnectionAttempts: 5, // More attempts
  reconnectionDelay: 1000, // Start with 1 second
  reconnectionDelayMax: 10000, // Max 10 seconds
  forceNew: true,
  withCredentials: true,
  upgrade: true,
  rememberUpgrade: true,
  extraHeaders: {
    'X-Client-Type': 'web'
  }
});
```

### 2. Comprehensive Error Handling
- Connection status tracking (`connecting`, `connected`, `disconnected`, `error`)
- Retry count monitoring
- Detailed error messages
- Automatic fallback to polling if WebSocket fails

### 3. Visual Status Indicator
- WebSocket status component di dashboard
- Real-time connection status display
- Error messages yang informatif
- Retry counter

## Cara Menjalankan Server dengan Benar

### Opsi 1: Menggunakan Script yang Sudah Ada
```bash
# Jalankan frontend dan backend secara bersamaan
npm run dev:clean

# Atau
npm run dev:all
```

### Opsi 2: Manual (Jika ada masalah)
```bash
# Terminal 1: Jalankan backend server
npm run dev:server

# Terminal 2: Jalankan frontend
npm run dev

# Terminal 3: Jalankan external server (opsional)
npm run dev:external
```

### Opsi 3: Check Port Status
```bash
# Cek status port
npm run ports:status

# Free port jika ada konflik
npm run ports:free
```

## Troubleshooting Steps

### Step 1: Pastikan Backend Server Berjalan
```bash
# Cek apakah server berjalan di port 3001
curl -s http://localhost:3001/health

# Atau cek dengan netstat
netstat -tlnp | grep :3001
```

### Step 2: Cek Environment Variables
```bash
# Pastikan .env file ada dan berisi:
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
DATABASE_URL=your_database_url
```

### Step 3: Restart Semua Server
```bash
# Matikan semua server
pkill -f "node.*3001"
pkill -f "next.*3002"

# Jalankan ulang
npm run dev:clean
```

## Status Koneksi WebSocket

### Connected (Hijau)
- ✅ WebSocket berjalan normal
- Real-time updates aktif
- Semua fitur berfungsi optimal

### Connecting (Biru)
- 🔄 Sedang mencoba koneksi
- Tunggu beberapa detik
- Normal saat startup

### Disconnected (Abu-abu)
- ⚠️ Koneksi terputus
- Aplikasi tetap berfungsi (tanpa real-time)
- Akan mencoba reconnect otomatis

### Error (Merah)
- ❌ Gagal koneksi setelah beberapa percobaan
- Cek server backend
- Lihat error message untuk detail

## Monitoring dan Debugging

### Console Logs
- Connection events ditampilkan di browser console
- Error messages detail untuk troubleshooting
- Retry attempts tracking

### Network Tab
- Cek WebSocket connection di DevTools
- Monitor reconnection attempts
- Verify server responses

## Best Practices

### 1. Selalu Gunakan `npm run dev:clean`
- Memastikan port bersih
- Menjalankan semua server yang diperlukan
- Mengatur environment dengan benar

### 2. Monitor Status Indicator
- Perhatikan status WebSocket di dashboard
- Jangan abaikan error messages
- Restart jika status stuck di "error"

### 3. Environment Setup
- Pastikan `.env` file lengkap
- Restart server setelah mengubah environment
- Gunakan `npm run ports:free` jika ada konflik port

## Fallback Mechanism

Jika WebSocket gagal:
1. **Automatic Fallback**: Socket.IO akan otomatis fallback ke polling
2. **Graceful Degradation**: Aplikasi tetap berfungsi tanpa real-time
3. **User Notification**: Status indicator memberitahu user tentang koneksi
4. **Auto Reconnect**: Mencoba koneksi ulang secara otomatis

## Performance Optimizations

### Connection Settings
- Timeout: 5 detik (balance antara reliability dan responsiveness)
- Reconnection attempts: 5x (cukup untuk recovery)
- Exponential backoff: 1s → 10s (mengurangi server load)

### Transport Strategy
- Start dengan polling (lebih reliable)
- Upgrade ke WebSocket jika tersedia
- Fallback otomatis jika WebSocket gagal

## Kesimpulan

Masalah WebSocket yang berulang sudah diselesaikan dengan:
1. ✅ **Enhanced Error Handling** - Better error detection dan reporting
2. ✅ **Fallback Mechanism** - Graceful degradation jika WebSocket gagal
3. ✅ **Visual Feedback** - Status indicator untuk user awareness
4. ✅ **Robust Configuration** - Optimized connection settings
5. ✅ **Comprehensive Monitoring** - Detailed logging dan debugging

Dengan solusi ini, aplikasi akan:
- Lebih reliable dalam menangani koneksi WebSocket
- Memberikan feedback yang jelas kepada user
- Tetap berfungsi optimal meskipun ada masalah koneksi
- Auto-recover dari connection issues
