# Deployment Guide - NextGen ERP to Vercel

## 🚀 Quick Deployment Steps

### 1. Local Environment Setup
Rename `env.local.template` to `.env.local`:
```bash
mv env.local.template .env.local
```

### 2. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set Environment Variables (copy from `env.production.template`):

```
NODE_ENV=production
DATABASE_URL=
DIRECT_URL=
SKIP_ENV_VALIDATION=true
NEXT_PUBLIC_COUCHDB_URL=
NEXT_PUBLIC_SOCKET_URL=
```

#### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

### 3. Environment Variables for Vercel

Copy these to Vercel Dashboard > Settings > Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production, Preview, Development |
| `DATABASE_URL` | (leave empty) | Production, Preview, Development |
| `DIRECT_URL` | (leave empty) | Production, Preview, Development |
| `SKIP_ENV_VALIDATION` | `true` | Production, Preview, Development |
| `NEXT_PUBLIC_COUCHDB_URL` | (leave empty) | Production, Preview, Development |
| `NEXT_PUBLIC_SOCKET_URL` | (leave empty) | Production, Preview, Development |

### 4. Build Configuration

The project is configured to:
- ✅ Use mock data (no database required)
- ✅ Skip environment validation
- ✅ Work with empty database URLs
- ✅ Support all ERP modules (Inventory, Finance, HRMS)

### 5. Post-Deployment

After successful deployment:
1. Test all modules:
   - Dashboard: `/dashboard`
   - Inventory: `/inventory`
   - Finance: `/finance`
   - HRMS: `/hrms`
   - Operations: `/operations`

2. Enhanced features are available in:
   - Inventory: "Enhanced Inventory" tab
   - Finance: "Enhanced Finance" tab
   - HRMS: "Enhanced HRMS" tab

## 🔧 Troubleshooting

### Build Errors
- Ensure all environment variables are set in Vercel
- Check that `SKIP_ENV_VALIDATION=true` is set
- Verify `NODE_ENV=production` is set

### Database Issues
- Project uses mock data, no database connection required
- If you want real database, add PostgreSQL connection strings

## 📝 Notes

- Project uses Next.js 15 with TypeScript
- All enhanced features are implemented with mock data
- Dual-tab system preserves existing RFP features
- Ready for production deployment
