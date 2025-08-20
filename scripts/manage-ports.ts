#!/usr/bin/env node

/**
 * Port Management Script for WSL/Linux
 * Prevents port conflicts and ensures consistent port usage
 */

import { execSync } from 'child_process';

// Port configuration
const PORTS = {
  FRONTEND: 3002,
  BACKEND: 3001,
  WEBSOCKET: 3001
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message: string, color: 'red' | 'green' | 'yellow' | 'blue' | 'reset' = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPort(port: number): boolean {
  try {
    // Use ss command which is more reliable in WSL
    execSync(`ss -tuln | grep ":${port} "`, { stdio: 'pipe' });
    return true; // Port is in use
  } catch (error) {
    return false; // Port is free
  }
}

function killProcessOnPort(port: number): boolean {
  try {
    log(`Killing process on port ${port}...`, 'yellow');
    
    // Try to kill processes by port using pkill (more reliable)
    if (port === 3002) {
      execSync(`pkill -f "next dev"`, { stdio: 'pipe' });
      log(`✓ Next.js process on port ${port} killed`, 'green');
      return true;
    } else if (port === 3001) {
      execSync(`pkill -f "tsx src/server/index.ts"`, { stdio: 'pipe' });
      log(`✓ Server process on port ${port} killed`, 'green');
      return true;
    } else {
      // Fallback to lsof method
      const pid = execSync(`lsof -ti :${port}`, { 
        stdio: 'pipe',
        encoding: 'utf8'
      }).trim();
      
      if (pid && pid !== '') {
        execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
        log(`✓ Process ${pid} on port ${port} killed`, 'green');
        return true;
      } else {
        log(`✗ No process found on port ${port}`, 'blue');
        return false;
      }
    }
  } catch (error: any) {
    log(`✗ Error killing process on port ${port}: ${error.message}`, 'red');
    return false;
  }
}

function checkAllPorts() {
  log('\n🔍 Checking port availability...', 'blue');
  
  const results: Record<string, { port: number; isInUse: boolean }> = {};
  
  for (const [name, port] of Object.entries(PORTS)) {
    const isInUse = checkPort(port);
    results[name] = { port, isInUse };
    
    if (isInUse) {
      log(`⚠️  ${name} (${port}) - IN USE`, 'yellow');
    } else {
      log(`✓ ${name} (${port}) - AVAILABLE`, 'green');
    }
  }
  
  return results;
}

function freeAllPorts() {
  log('\n🗑️  Freeing all ports...', 'blue');
  
  let freed = 0;
  
  for (const [name, port] of Object.entries(PORTS)) {
    if (checkPort(port)) {
      if (killProcessOnPort(port)) {
        freed++;
      }
    }
  }
  
  if (freed > 0) {
    log(`\n✓ Freed ${freed} port(s)`, 'green');
  } else {
    log('\n✓ All ports are already free', 'green');
  }
}

function startServers() {
  log('\n🚀 Preparing ports for server start...', 'blue');
  
  // Check if ports are free
  const portStatus = checkAllPorts();
  const portsInUse = Object.values(portStatus).filter(status => status.isInUse);
  
  if (portsInUse.length > 0) {
    log('\n⚠️  Some ports are in use. Freeing them first...', 'yellow');
    freeAllPorts();
    
    // Wait a moment for processes to fully terminate
    log('\n⏳ Waiting for processes to terminate...', 'blue');
    setTimeout(() => {
      log('✓ Ready to start servers', 'green');
    }, 2000);
  } else {
    log('\n✅ All ports are free. Ready to start servers.', 'green');
  }
  
  log('\n💡 Run: npm run dev:all', 'blue');
}

function showStatus() {
  log('\n📊 Current Port Status:', 'blue');
  checkAllPorts();
  
  log('\n📋 Port Configuration:', 'blue');
  for (const [name, port] of Object.entries(PORTS)) {
    log(`  ${name}: ${port}`, 'reset');
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'check':
    checkAllPorts();
    break;
    
  case 'free':
    freeAllPorts();
    break;
    
  case 'start':
    startServers();
    break;
    
  case 'status':
    showStatus();
    break;
    
  default:
    log('\n🔧 Port Management Script', 'blue');
    log('Usage:', 'yellow');
    log('  npm run ports:check   - Check port availability');
    log('  npm run ports:free    - Free all ports');
    log('  npm run dev:clean     - Prepare ports and start servers');
    log('  npm run ports:status  - Show current status');
    log('\nPort Configuration:', 'yellow');
    for (const [name, port] of Object.entries(PORTS)) {
      log(`  ${name}: ${port}`, 'reset');
    }
    break;
}
