#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔍 Quick error check - ESLint only...\n');

try {
  // Run ESLint and capture output
  const output = execSync('npx eslint src --ext .ts,.tsx,.js,.jsx --format=compact', { 
    encoding: 'utf8', 
    stdio: 'pipe' 
  });
  
  // Extract unique file paths
  const filePattern = /src\/[^\s]+\.(tsx?|jsx?)/g;
  const files = new Set();
  
  const matches = output.match(filePattern);
  if (matches) {
    matches.forEach(match => files.add(match));
  }
  
  if (files.size > 0) {
    console.log(`❌ Found errors in ${files.size} files:`);
    Array.from(files).sort().forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log('✅ No ESLint errors found');
  }
  
} catch (error) {
  // If command fails, parse the error output
  const errorOutput = error.stdout || error.stderr || error.message || String(error);
  
  // Extract unique file paths from error output
  const filePattern = /src\/[^\s]+\.(tsx?|jsx?)/g;
  const files = new Set();
  
  const matches = errorOutput.match(filePattern);
  if (matches) {
    matches.forEach(match => files.add(match));
  }
  
  if (files.size > 0) {
    console.log(`❌ Found errors in ${files.size} files:`);
    Array.from(files).sort().forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log('❌ Build failed but no specific files identified');
  }
}
