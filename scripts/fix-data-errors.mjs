import fs from 'fs';

function fixDataErrors() {
  console.log('🔧 Fixing Data page errors...');
  
  const filePath = 'src/pages/data/index.tsx';
  if (!fs.existsSync(filePath)) {
    console.log('❌ File not found:', filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix variable references
  content = content.replace(/_dataStats/g, 'dataStats');
  content = content.replace(/_dataCategories/g, 'dataCategories');
  content = content.replace(/_getStatusColor/g, 'getStatusColor');
  content = content.replace(/_getStatusBadgeColor/g, 'getStatusBadgeColor');
  
  // Fix onClick handlers to use proper functions
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Opening data import\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Opening data import...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Exporting data\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Exporting data...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Syncing data now\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Syncing data now...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Viewing \$\{category\.name\} data\.\.\.'\)\}/g,
    'onClick={() => {\n                            // console.log(`Viewing ${category.name} data...`)\n                          }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Editing \$\{category\.name\} data\.\.\.'\)\}/g,
    'onClick={() => {\n                            // console.log(`Editing ${category.name} data...`)\n                          }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Archiving \$\{category\.name\} data\.\.\.'\)\}/g,
    'onClick={() => {\n                            // console.log(`Archiving ${category.name} data...`)\n                          }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Exporting all data\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Exporting all data...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Importing data\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Importing data...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Creating backup\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Creating backup...\')\n              }}'
  );
  
  content = content.replace(
    /onClick=\{\(\) => \/\/ console\.log\('Syncing all data\.\.\.'\)\}/g,
    'onClick={() => {\n                // console.log(\'Syncing all data...\')\n              }}'
  );
  
  // Fix backup and sync data access
  content = content.replace(
    /backup\.id/g,
    'backup?.id || index'
  );
  
  content = content.replace(
    /backup\.status/g,
    'backup?.status || \'Unknown\''
  );
  
  content = content.replace(
    /backup\.type/g,
    'backup?.type || \'Unknown\''
  );
  
  content = content.replace(
    /backup\.size/g,
    'backup?.size || \'0 MB\''
  );
  
  content = content.replace(
    /backup\.duration/g,
    'backup?.duration || \'0s\''
  );
  
  content = content.replace(
    /backup\.date/g,
    'backup?.date || \'Unknown\''
  );
  
  content = content.replace(
    /log\.id/g,
    'log?.id || index'
  );
  
  content = content.replace(
    /log\.status/g,
    'log?.status || \'Unknown\''
  );
  
  content = content.replace(
    /log\.operation/g,
    'log?.operation || \'Unknown\''
  );
  
  content = content.replace(
    /log\.details/g,
    'log?.details || \'No details\''
  );
  
  content = content.replace(
    /log\.timestamp/g,
    'log?.timestamp || \'Unknown\''
  );
  
  // Fix empty arrays mapping
  content = content.replace(
    /{backupHistory\.map\(\(backup\) => \(/g,
    '{backupHistory.length > 0 ? backupHistory.map((backup, index) => ('
  );
  
  content = content.replace(
    /{syncLogs\.map\(\(log\) => \(/g,
    '{syncLogs.length > 0 ? syncLogs.map((log, index) => ('
  );
  
  // Add empty state for backup history
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/CardContent>\s*<\/Card>/g,
    '</div>\n              ) : (\n                <div className="p-8 text-center text-gray-500">\n                  No backup history available.\n                </div>\n              )}\n            </div>\n          </CardContent>\n        </Card>'
  );
  
  // Add empty state for sync logs
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/CardContent>\s*<\/Card>\s*<\/div>/g,
    '</div>\n              ) : (\n                <div className="p-8 text-center text-gray-500">\n                  No sync logs available.\n                </div>\n              )}\n            </div>\n          </CardContent>\n        </Card>\n      </div>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Data page errors fixed!');
}

fixDataErrors();
