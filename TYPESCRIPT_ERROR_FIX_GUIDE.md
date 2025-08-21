# 🔧 TypeScript Error Fix Guide

## 📋 Overview

Dokumen ini menjelaskan cara mengatasi error-error TypeScript yang sering muncul di project NextGen ERP.

## 🚀 Quick Fix Commands

### 1. Auto-fix Script
```bash
# Jalankan script otomatis untuk memperbaiki error umum
npm run lint:fix-auto

# Atau jalankan manual
node scripts/fix-typescript-errors.js
```

### 2. Development Mode (Lebih Fleksibel)
```bash
# ESLint dengan mode development (warning instead of error)
npm run lint:dev
```

### 3. Production Mode (Stricter)
```bash
# ESLint dengan mode production (error untuk semua issues)
npm run lint:prod
```

## 🔍 Common Error Types & Solutions

### 1. **Unsafe Assignment (`@typescript-eslint/no-unsafe-assignment`)**

**Error:**
```typescript
const data: any = response.json(); // ❌ Unsafe assignment
```

**Solution:**
```typescript
// Option 1: Type assertion
const data = response.json() as ApiResponse;

// Option 2: Type guard
const data = isApiResponse(response.json()) ? response.json() : null;

// Option 3: Unknown type
const data: unknown = response.json();
```

### 2. **Unsafe Member Access (`@typescript-eslint/no-unsafe-member-access`)**

**Error:**
```typescript
const name = user.name; // ❌ Unsafe member access on any value
```

**Solution:**
```typescript
// Option 1: Safe property access
const name = safeGet(user, 'name');

// Option 2: Type guard
const name = isUser(user) ? user.name : undefined;

// Option 3: Optional chaining
const name = user?.name;
```

### 3. **Unused Variables (`@typescript-eslint/no-unused-vars`)**

**Error:**
```typescript
const unusedVar = 'something'; // ❌ Variable is assigned but never used
```

**Solution:**
```typescript
// Option 1: Prefix with underscore
const _unusedVar = 'something';

// Option 2: Remove if not needed
// const unusedVar = 'something'; // Commented out

// Option 3: Use the variable
console.log(unusedVar);
```

### 4. **Promise Handling (`@typescript-eslint/no-misused-promises`)**

**Error:**
```typescript
Promise.then(() => { // ❌ Promise returned in function argument
  // async operation
});
```

**Solution:**
```typescript
// Option 1: Add async
Promise.then(async () => {
  // async operation
});

// Option 2: Use void
Promise.then(() => {
  void asyncOperation();
});

// Option 3: Use .catch()
Promise.then(() => {
  // operation
}).catch(console.error);
```

### 5. **Nullish Coalescing (`@typescript-eslint/prefer-nullish-coalescing`)**

**Error:**
```typescript
const value = data || defaultValue; // ❌ Prefer nullish coalescing
```

**Solution:**
```typescript
// Use nullish coalescing
const value = data ?? defaultValue;
```

## 🛠️ Error Handling Best Practices

### 1. **Database Operations**
```typescript
// ❌ Bad
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Good
try {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
  }
  return user;
} catch (error) {
  handleDatabaseError(error);
}
```

### 2. **External API Calls**
```typescript
// ❌ Bad
const response = await fetch(url);
const data = await response.json();

// ✅ Good
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json() as ApiResponse;
  return data;
} catch (error) {
  handleExternalApiError(error);
}
```

### 3. **Type Guards**
```typescript
// ✅ Create type guards for runtime validation
export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj
  );
};

// Usage
const userData: unknown = await fetchUser();
if (isUser(userData)) {
  console.log(userData.name); // Safe access
}
```

## 📁 File Structure for Type Safety

### 1. **Types Directory**
```
src/
├── types/
│   ├── api.ts          # API response types
│   ├── database.ts     # Database model types
│   ├── external.ts     # External API types
│   └── index.ts        # Re-exports
```

### 2. **Utilities Directory**
```
src/
├── utils/
│   ├── error-handler.ts    # Error handling utilities
│   ├── type-guards.ts      # Type guard functions
│   ├── safe-access.ts      # Safe property access
│   └── validation.ts       # Validation utilities
```

## 🔧 Configuration Files

### 1. **ESLint Configuration**
```javascript
// eslint.config.js
const isDevelopment = process.env.NODE_ENV === 'development';

export default [
  {
    rules: {
      // Development-friendly rules
      ...(isDevelopment && {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
      }),
      
      // Production rules (stricter)
      ...(!isDevelopment && {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
      }),
    },
  },
];
```

### 2. **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 🎯 Migration Strategy

### Phase 1: Quick Fixes
1. Run auto-fix script: `npm run lint:fix-auto`
2. Fix remaining errors manually
3. Use development mode for flexibility

### Phase 2: Type Safety
1. Add proper type definitions
2. Implement type guards
3. Add error handling utilities

### Phase 3: Production Ready
1. Enable strict mode
2. Remove all `any` types
3. Add comprehensive error handling

## 📊 Error Categories

| Error Type | Severity | Auto-fix | Manual Required |
|------------|----------|----------|-----------------|
| `no-unsafe-assignment` | High | ✅ | Sometimes |
| `no-unsafe-member-access` | High | ✅ | Often |
| `no-unused-vars` | Low | ✅ | Rarely |
| `no-misused-promises` | Medium | ✅ | Sometimes |
| `prefer-nullish-coalescing` | Low | ✅ | Rarely |
| `no-explicit-any` | High | ❌ | Always |

## 🚨 Emergency Fixes

### 1. **Temporary Disable Rules**
```typescript
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const data: any = response.json();

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const name = user.name;
```

### 2. **Type Assertions (Use Sparingly)**
```typescript
// Only when you're certain about the type
const data = response.json() as ApiResponse;
```

### 3. **Unknown Type**
```typescript
// When you don't know the type
const data: unknown = response.json();
```

## 📈 Monitoring & Maintenance

### 1. **Regular Checks**
```bash
# Daily development
npm run lint:dev

# Before commits
npm run lint:prod

# CI/CD pipeline
npm run typecheck && npm run lint:prod
```

### 2. **Error Tracking**
- Monitor error patterns
- Update auto-fix script
- Improve type definitions
- Add new type guards

## 🎉 Success Metrics

- ✅ Zero `any` types in production
- ✅ All database operations have error handling
- ✅ All external API calls are type-safe
- ✅ No unsafe property access
- ✅ Proper promise handling

---

**💡 Tip:** Start with development mode to get familiar with the errors, then gradually move to production mode for stricter type safety.
