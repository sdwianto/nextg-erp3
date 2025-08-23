#!/usr/bin/env node

/**
 * WebSocket & Code Hygiene Fix Script
 * Memperbaiki masalah hygiene kode yang dapat memicu reconnect-loop
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FIXES = [
  {
    name: 'Fix remaining _getStatusColor references',
    pattern: /_getStatusColor/g,
    replacement: 'getStatusColor',
    files: [
      'src/pages/sync/index.tsx',
      'src/pages/maintenance/index.tsx', 
      'src/pages/rental/index.tsx'
    ]
  },
  {
    name: 'Fix remaining _getPriorityColor references',
    pattern: /_getPriorityColor/g,
    replacement: 'getPriorityColor',
    files: [
      'src/pages/sync/index.tsx',
      'src/pages/maintenance/index.tsx',
      'src/pages/rental/index.tsx'
    ]
  },
  {
    name: 'Fix remaining _utils references',
    pattern: /_utils\./g,
    replacement: 'utils.',
    files: [
      'src/components/**/*.tsx',
      'src/pages/**/*.tsx'
    ]
  },
  {
    name: 'Fix remaining _validItems references',
    pattern: /_validItems/g,
    replacement: 'validItems',
    files: [
      'src/components/**/*.tsx'
    ]
  },
  {
    name: 'Fix remaining _data references',
    pattern: /_data/g,
    replacement: 'data',
    files: [
      'src/components/**/*.tsx'
    ]
  },
  {
    name: 'Fix remaining _quantity and _unitPrice references',
    pattern: /_quantity|_unitPrice/g,
    replacement: (match) => match.replace('_', ''),
    files: [
      'src/components/**/*.tsx'
    ]
  }
];

function findFiles(pattern) {
  try {
    const result = execSync(`find . -path "${pattern}" -type f -name "*.tsx"`, { encoding: 'utf8' });
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function applyFix(fix) {
  console.log(`\n🔧 Applying: ${fix.name}`);
  
  let totalFixed = 0;
  
  for (const filePattern of fix.files) {
    const files = findFiles(filePattern);
    
    for (const file of files) {
      if (!existsSync(file)) continue;
      
      try {
        let content = readFileSync(file, 'utf8');
        const originalContent = content;
        
        if (typeof fix.replacement === 'function') {
          content = content.replace(fix.pattern, fix.replacement);
        } else {
          content = content.replace(fix.pattern, fix.replacement);
        }
        
        if (content !== originalContent) {
          writeFileSync(file, content, 'utf8');
          console.log(`  ✅ Fixed: ${file}`);
          totalFixed++;
        }
      } catch (error) {
        console.log(`  ❌ Error fixing ${file}:`, error.message);
      }
    }
  }
  
  return totalFixed;
}

function checkWebSocketConfig() {
  console.log('\n🔍 Checking WebSocket Configuration...');
  
  const files = [
    'src/lib/socket.ts',
    'src/pages/api/websocket.ts',
    'next.config.js'
  ];
  
  for (const file of files) {
    if (existsSync(file)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.log(`  ❌ ${file} missing`);
    }
  }
  
  // Check environment variables
  const envFile = '.env.local';
  if (existsSync(envFile)) {
    const content = readFileSync(envFile, 'utf8');
    const hasWsOrigin = content.includes('NEXT_PUBLIC_WS_ORIGIN');
    const hasWsPath = content.includes('NEXT_PUBLIC_WS_PATH');
    
    console.log(`  ${hasWsOrigin ? '✅' : '❌'} NEXT_PUBLIC_WS_ORIGIN configured`);
    console.log(`  ${hasWsPath ? '✅' : '❌'} NEXT_PUBLIC_WS_PATH configured`);
  } else {
    console.log(`  ⚠️  ${envFile} not found - please copy from env.local.template`);
  }
}

function main() {
  console.log('🚀 WebSocket & Code Hygiene Fix Script');
  console.log('=====================================');
  
  let totalFixes = 0;
  
  for (const fix of FIXES) {
    const fixed = applyFix(fix);
    totalFixes += fixed;
  }
  
  checkWebSocketConfig();
  
  console.log(`\n🎉 Summary:`);
  console.log(`  Total fixes applied: ${totalFixes}`);
  console.log(`\n📋 Next steps:`);
  console.log(`  1. Run: npm run lint:dev`);
  console.log(`  2. Test WebSocket connection`);
  console.log(`  3. Deploy with clear cache`);
  console.log(`\n💡 Remember:`);
  console.log(`  - Set NEXT_PUBLIC_WS_ORIGIN in Vercel environment`);
  console.log(`  - Set NEXT_PUBLIC_WS_PATH in Vercel environment`);
  console.log(`  - Clear build cache on redeploy`);
}

main();
