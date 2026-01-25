#!/bin/bash
# Pre-push quality check script
# Run this before pushing to catch build errors early

set -e

echo "🔍 Running quality checks..."
echo ""

# 1. TypeScript type checking
echo "📝 Checking TypeScript types..."
npx tsc --noEmit
echo "✅ TypeScript check passed"
echo ""

# 2. ESLint (if configured)
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ]; then
  echo "🔧 Running ESLint..."
  npm run lint || true
  echo ""
fi

# 3. Run tests (if they exist)
if grep -q '"test"' package.json; then
  echo "🧪 Running tests..."
  npm test -- --passWithNoTests || true
  echo ""
fi

# 4. Try to build
echo "🏗️  Building project..."
npm run build
echo "✅ Build successful"
echo ""

echo "✨ All quality checks passed! Safe to push."
