#!/usr/bin/env node

/**
 * Script to replace console.log/error/warn with logger calls
 * Part of production deployment fix - removes console statements
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const files = [
  'app/api/account/onboarding/route.ts',
  'app/api/account/update/route.ts',
  'app/api/cron/daily-checks/route.ts',
  'app/api/cron/weekly-summary/route.ts',
  'app/api/currency/convert/route.ts',
  'app/api/currency/rates/route.ts',
  'app/api/currency/update-preference/route.ts',
  'app/api/goals/[id]/contributions/route.ts',
  'app/api/goals/[id]/route.ts',
  'app/api/goals/route.ts',
  'app/api/import-export/export-all/route.ts',
  'app/api/import-export/export/route.ts',
  'app/api/import-export/import/route.ts',
  'app/api/import-export/template/route.ts',
  'app/api/notifications/[id]/route.ts',
  'app/api/notifications/mark-all-read/route.ts',
  'app/api/notifications/route.ts',
  'app/api/notifications/unread-count/route.ts',
  'app/api/reports/[id]/download/route.ts',
  'app/api/reports/[id]/route.ts',
  'app/api/reports/route.ts',
  'app/api/shared-budgets/[id]/invite/route.ts',
  'app/api/shared-budgets/[id]/leave/route.ts',
  'app/api/shared-budgets/[id]/permissions/route.ts',
  'app/api/shared-budgets/[id]/route.ts',
  'app/api/shared-budgets/route.ts',
];

let totalReplacements = 0;
let filesModified = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipped (not found): ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Check if logger is already imported
  const hasLoggerImport = /import\s+{[^}]*logger[^}]*}\s+from\s+['"]@\/lib\/logger['"]/.test(content);

  // Add logger import if not present
  if (!hasLoggerImport && /console\.(error|warn|log|info)/.test(content)) {
    // Find the last import statement
    const imports = content.match(/^import\s+.*?;$/gm);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      content = content.replace(lastImport, `${lastImport}\nimport { logger } from '@/lib/logger';`);
    }
  }

  // Replace console.error with logger.error
  // Pattern: console.error('message:', error) → logger.error('message', error)
  content = content.replace(
    /console\.error\(\s*['"]([^'"]+):\s*['"],\s*([^)]+)\)/g,
    (match, message, errorVar) => {
      return `logger.error('${message}', ${errorVar.trim()})`;
    }
  );

  // Pattern: console.error('message', error) → logger.error('message', error)
  content = content.replace(
    /console\.error\(\s*['"]([^'"]+)['"],\s*([^)]+)\)/g,
    (match, message, errorVar) => {
      return `logger.error('${message}', ${errorVar.trim()})`;
    }
  );

  // Pattern: console.error('message') → logger.error('message')
  content = content.replace(
    /console\.error\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match, message) => {
      return `logger.error('${message}')`;
    }
  );

  // Replace console.log with logger.info
  content = content.replace(/console\.log\(/g, 'logger.info(');

  // Replace console.warn with logger.warn
  content = content.replace(/console\.warn\(/g, 'logger.warn(');

  // Replace console.info with logger.info
  content = content.replace(/console\.info\(/g, 'logger.info(');

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    filesModified++;
    const replacementCount = (originalContent.match(/console\./g) || []).length;
    totalReplacements += replacementCount;
    console.log(`✅ ${filePath} (${replacementCount} replacements)`);
  } else {
    console.log(`⏭️  ${filePath} (no changes needed)`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total console statements replaced: ${totalReplacements}`);
console.log(`\n✨ Logger migration complete!`);
