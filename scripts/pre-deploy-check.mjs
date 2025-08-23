#!/usr/bin/env node

/**
 * Pre-Deployment Check Script
 * Memverifikasi semua perbaikan WebSocket dan hygiene kode sebelum deploy ke Vercel
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

function checkWebSocketConfig() {
  console.log('\n🔍 Checking WebSocket Configuration...');
  
  const files = [
    'src/lib/socket.ts',
    'src/pages/api/websocket.ts',
    'next.config.js'
  ];
  
  let allFilesExist = true;
  
  for (const file of files) {
    if (existsSync(file)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.log(`  ❌ ${file} missing`);
      allFilesExist = false;
    }
  }
  
  // Check next.config.js for swcMinify: false
  if (existsSync('next.config.js')) {
    const content = readFileSync('next.config.js', 'utf8');
    if (content.includes('swcMinify: false')) {
      console.log(`  ✅ SWC minification disabled (Terser enabled)`);
    } else {
      console.log(`  ❌ SWC minification not disabled`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...');
  
  const envFile = '.env.local';
  if (existsSync(envFile)) {
    const content = readFileSync(envFile, 'utf8');
    const hasWsOrigin = content.includes('NEXT_PUBLIC_WS_ORIGIN');
    const hasWsPath = content.includes('NEXT_PUBLIC_WS_PATH');
    
    console.log(`  ${hasWsOrigin ? '✅' : '❌'} NEXT_PUBLIC_WS_ORIGIN configured`);
    console.log(`  ${hasWsPath ? '✅' : '❌'} NEXT_PUBLIC_WS_PATH configured`);
    
    return hasWsOrigin && hasWsPath;
  } else {
    console.log(`  ⚠️  ${envFile} not found - please copy from env.local.template`);
    return false;
  }
}

function checkCodeHygiene() {
  console.log('\n🔍 Checking Code Hygiene...');
  
  const patterns = [
    '_getStatusColor',
    '_getPriorityColor', 
    '_utils.',
    '_validItems',
    '_data',
    '_quantity',
    '_unitPrice'
  ];
  
  let hasIssues = false;
  
  for (const pattern of patterns) {
    try {
      const result = execSync(`grep -r "${pattern}" src/ --include="*.tsx" --include="*.ts"`, { encoding: 'utf8' });
      if (result.trim()) {
        console.log(`  ❌ Found ${pattern} in:`);
        result.trim().split('\n').forEach(line => {
          if (line) console.log(`    ${line}`);
        });
        hasIssues = true;
      } else {
        console.log(`  ✅ No ${pattern} found`);
      }
    } catch (error) {
      // grep returns non-zero exit code when no matches found
      console.log(`  ✅ No ${pattern} found`);
    }
  }
  
  return !hasIssues;
}

function checkConsoleLogs() {
  console.log('\n🔍 Checking Console Logs...');
  
  try {
    const result = execSync(`grep -r "console\\.log" src/ --include="*.tsx" --include="*.ts" | grep -v "// console.log"`, { encoding: 'utf8' });
    if (result.trim()) {
      console.log(`  ⚠️  Found active console.log statements:`);
      result.trim().split('\n').forEach(line => {
        if (line) console.log(`    ${line}`);
      });
      return false;
    } else {
      console.log(`  ✅ No active console.log statements found`);
      return true;
    }
  } catch (error) {
    console.log(`  ✅ No active console.log statements found`);
    return true;
  }
}

function checkTypeScriptErrors() {
  console.log('\n🔍 Checking TypeScript Errors...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log(`  ✅ No TypeScript errors found`);
    return true;
  } catch (error) {
    console.log(`  ❌ TypeScript errors found:`);
    console.log(error.stdout?.toString() || error.stderr?.toString());
    return false;
  }
}

function checkLintingErrors() {
  console.log('\n🔍 Checking ESLint Errors...');
  
  try {
    execSync('npm run lint:dev', { stdio: 'pipe' });
    console.log(`  ✅ No ESLint errors found`);
    return true;
  } catch (error) {
    console.log(`  ❌ ESLint errors found:`);
    console.log(error.stdout?.toString() || error.stderr?.toString());
    return false;
  }
}

function main() {
  console.log('🚀 Pre-Deployment Check Script');
  console.log('==============================');
  
  const checks = [
    { name: 'WebSocket Configuration', fn: checkWebSocketConfig },
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'Code Hygiene', fn: checkCodeHygiene },
    { name: 'Console Logs', fn: checkConsoleLogs },
    { name: 'TypeScript Errors', fn: checkTypeScriptErrors },
    { name: 'ESLint Errors', fn: checkLintingErrors }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const result = check.fn();
      results.push({ name: check.name, passed: result });
    } catch (error) {
      console.log(`  ❌ Error in ${check.name}:`, error.message);
      results.push({ name: check.name, passed: false });
    }
  }
  
  console.log('\n📊 Summary:');
  console.log('===========');
  
  let allPassed = true;
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${status} ${result.name}`);
    if (!result.passed) allPassed = false;
  }
  
  console.log('\n🎯 Deployment Status:');
  if (allPassed) {
    console.log('  ✅ READY FOR DEPLOYMENT');
    console.log('\n📋 Next Steps:');
    console.log('  1. Set environment variables in Vercel:');
    console.log('     NEXT_PUBLIC_WS_ORIGIN=https://nextg-erp3.vercel.app');
    console.log('     NEXT_PUBLIC_WS_PATH=/api/websocket');
    console.log('  2. Deploy with clear build cache');
    console.log('  3. Test WebSocket connection after deployment');
  } else {
    console.log('  ❌ NOT READY - Please fix issues above');
    console.log('\n🔧 Quick Fix Commands:');
    console.log('  npm run lint:fix-websocket');
    console.log('  npm run lint:fix-auto');
    console.log('  cp env.local.template .env.local');
  }
}

main();
