#!/bin/bash

# Finance Flow Backend - Quick Install Script
# This script sets up the NestJS backend environment

set -e

echo "🚀 Finance Flow Backend Installation"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"

# Install dependencies
echo ""
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}⚙️  Creating .env file...${NC}"
    cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financeflow"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=3001
NODE_ENV="development"

# Redis (for queues and caching)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Email (configure based on your provider)
EMAIL_FROM="noreply@financeflow.com"
EMAIL_SERVICE="sendgrid"
EMAIL_API_KEY="your-email-api-key"

# AI (optional)
OPENAI_API_KEY="your-openai-key"

# Plaid (optional)
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"

# Stripe (optional)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your actual values${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Generate Prisma client
echo ""
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env with your database credentials"
echo "  2. Run: npm run prisma:migrate"
echo "  3. Run: npm run start:dev"
echo ""
echo "API Documentation will be available at:"
echo "  http://localhost:3001/api/docs"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
