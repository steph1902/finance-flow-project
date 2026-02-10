#!/usr/bin/env node

/**
 * Bulk replace catch (error: any) with proper error handling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all API route files with error: any
const apiDir = path.join(__dirname, '../src/app/api');

function fixErrorHandling(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace catch (error: any) with catch (error: unknown)
    if (content.includes('catch (error: any)')) {
        content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
        modified = true;

        // Add error helper if not present
        if (!content.includes('function getErrorMessage')) {
            // Find last import and add helper after
            const helperCode = `
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
`;

            // Insert before first export or at end of imports
            const lines = content.split('\n');
            let insertIndex = 0;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('export ')) {
                    insertIndex = i;
                    break;
                }
            }

            if (insertIndex > 0) {
                lines.splice(insertIndex, 0, helperCode);
                content = lines.join('\n');
            }
        }

        // Replace error.message with getErrorMessage(error)
        content = content.replace(
            /(\s+)return NextResponse\.json\(\s*\{\s*error:\s*error\.message/g,
            '$1return NextResponse.json({ error: getErrorMessage(error)'
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
        return 1;
    }

    return 0;
}

function walkDir(dir) {
    let filesFixed = 0;

    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return 0;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            filesFixed += walkDir(filePath);
        } else if (file === 'route.ts' || file.endsWith('.ts')) {
            filesFixed += fixErrorHandling(filePath);
        }
    });

    return filesFixed;
}

console.log('🔧 Fixing error handling in API routes...\n');
const fixed = walkDir(apiDir);
console.log(`\n✅ Fixed ${fixed} files`);
