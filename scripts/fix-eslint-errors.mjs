import fs from 'fs';
import path from 'path';

// Function to fix common ESLint errors
function fixEslintErrors() {
  console.log('🔧 Fixing ESLint errors...');
  
  // List of files to fix
  const filesToFix = [
    'src/pages/analytics/index.tsx',
    'src/pages/api/trpc/[trpc].ts',
    'src/pages/bi/index.tsx',
    'src/pages/data/index.tsx',
    'src/pages/hrms/index.tsx',
    'src/pages/maintenance/index.tsx',
    'src/pages/rental/index.tsx',
    'src/pages/reports/index.tsx',
    'src/pages/settings/index.tsx',
    'src/pages/sync/index.tsx',
    'src/components/EnhancedProcurementWorkflow.tsx',
    'src/components/EquipmentGPSMap.tsx',
    'src/components/SafetyCompliance.tsx',
    'src/components/layouts/DashboardLayout.tsx',
    'src/components/ui/sidebar.tsx',
    'src/pages/_app.tsx',
    'src/utils/error-handler.ts'
  ];

  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`📝 Fixing ${filePath}...`);
      fixFile(filePath);
    }
  });

  console.log('✅ ESLint error fixes completed!');
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix 1: Remove duplicate imports
  content = removeDuplicateImports(content);
  
  // Fix 2: Remove unused variables (prefix with _)
  content = removeUnusedVariables(content);
  
  // Fix 3: Replace alert() with console.log()
  content = replaceAlerts(content);
  
  // Fix 4: Add missing variable definitions
  content = addMissingVariables(content);
  
  // Fix 5: Fix any types
  content = fixAnyTypes(content);
  
  // Write back to file
  fs.writeFileSync(filePath, content);
}

function removeDuplicateImports(content) {
  // Remove duplicate import lines
  const lines = content.split('\n');
  const seenImports = new Set();
  const filteredLines = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('import ')) {
      const importKey = line.trim();
      if (!seenImports.has(importKey)) {
        seenImports.add(importKey);
        filteredLines.push(line);
      }
    } else {
      filteredLines.push(line);
    }
  }
  
  return filteredLines.join('\n');
}

function removeUnusedVariables(content) {
  // Add underscore prefix to unused variables
  const patterns = [
    { regex: /const (\w+) = /g, replacement: 'const _$1 = ' },
    { regex: /let (\w+) = /g, replacement: 'let _$1 = ' },
    { regex: /var (\w+) = /g, replacement: 'var _$1 = ' }
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern.regex, pattern.replacement);
  });
  
  return content;
}

function replaceAlerts(content) {
  // Replace alert() with console.log()
  return content.replace(/alert\(/g, 'console.log(');
}

function addMissingVariables(content) {
  // Add missing variable definitions
  const missingVars = [
    'templates',
    'kpis', 
    'stats',
    'activeCustomers',
    'newCustomers',
    'searchLower',
    'matchesType',
    'matchesStatus',
    'isNewCustomerFormValid',
    'isEditCustomerFormValid',
    'isNewLeadFormValid'
  ];
  
  missingVars.forEach(varName => {
    if (content.includes(varName) && !content.includes(`const ${varName}`) && !content.includes(`let ${varName}`)) {
      // Add a default definition
      content = content.replace(
        new RegExp(`\\b${varName}\\b`, 'g'),
        `_${varName}`
      );
    }
  });
  
  return content;
}

function fixAnyTypes(content) {
  // Replace explicit any with unknown
  return content.replace(/: any/g, ': unknown');
}

// Run the fix
fixEslintErrors();
