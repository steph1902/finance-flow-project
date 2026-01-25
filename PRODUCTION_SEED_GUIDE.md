# Seeding Production Database - Guide

## Problem
The demo data from `seed.ts` only exists locally. Production Vercel deploymentneeds to be seeded separately.

## Solutions

### Option 1: Seed Production Database from Local Machine (Recommended)

1. **Get Production Database URL from Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Copy the `DATABASE_URL` value

2. **Create `.env.production` file locally**
   ```bash
   # .env.production
   DATABASE_URL="your-production-database-url-from-vercel"
   ```

3. **Run seed script against production**
   ```bash
   # Use the production DATABASE_URL
   DATABASE_URL="your-production-url" npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

4. **Verify on Vercel**
   - Visit https://finance-flow-pied-rho.vercel.app/dashboard
   - Login with: demo@financeflow.com / Demo1234

---

### Option 2: Create Seed API Endpoint (One-Time Use)

Create an admin-only API route to seed the database:

**File:** `src/app/api/admin/seed/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// IMPORTANT: Protect this endpoint!
const ADMIN_SECRET = process.env.ADMIN_SEED_SECRET;

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run seed logic here (copy from seed.ts)
    const hashedPassword = await bcrypt.hash('Demo1234', 10);
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@financeflow.com' },
      update: {},
      create: {
        email: 'demo@financeflow.com',
        name: 'Alex Johnson',
        password: hashedPassword,
      },
    });

    // Add transactions, budgets, etc...
    
    return NextResponse.json({ 
      success: true, 
      message: 'Production database seeded successfully' 
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
```

**Then:**
1. Add `ADMIN_SEED_SECRET=your-secret-key` to Vercel env vars
2. Deploy
3. Call: `POST https://finance-flow-pied-rho.vercel.app/api/admin/seed`
   ```bash
   curl -X POST https://finance-flow-pied-rho.vercel.app/api/admin/seed \
     -H "Content-Type: application/json" \
     -d '{"secret":"your-secret-key"}'
   ```
4. **DELETE the endpoint after use for security**

---

### Option 3: Vercel CLI Seed

```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run seed with production env
vercel env pull && npm run db:seed
```

---

### Option 4: Prisma Studio (Manual)

1. **Connect to production database**
   ```bash
   DATABASE_URL="your-production-url" npx prisma studio
   ```

2. **Manually create demo user in browser:**
   - Email: `demo@financeflow.com`
   - Password: (hash of `Demo1234`)
   - Name: `Alex Johnson`

3. **Add transactions, budgets, etc.** via Prisma Studio UI

---

## Recommended Approach

**Use Option 1** (seed from local machine) because:
- ✅ Most secure (no API endpoint to exploit)
- ✅ Fastest (direct database access)
- ✅ Uses existing seed scripts
- ✅ No code changes needed

**Steps:**
```bash
# 1. Get DATABASE_URL from Vercel dashboard

# 2. Run seed (replace with your actual URL)
DATABASE_URL="postgresql://user:pass@host:5432/db" \
  npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 3. Verify at https://finance-flow-pied-rho.vercel.app
```

---

## Package.json Scripts (Currently Incorrect)

Your `package.json` has:
```json
"db:seed": "ts-node... prisma/seed-demo.ts",  // ❌ File doesn't exist
"db:seed:natural": "ts-node... prisma/seed-natural.ts"  // ❌ File doesn't exist
```

**Actual files:**
- `prisma/seed.ts` (1000+ transactions)
- `prisma/seed-enhanced.ts` (enhanced version)

**Fix:**
```json
"db:seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
"db:seed:enhanced": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed-enhanced.ts"
```

---

## Security Notes

- **Never commit `.env.production`** with real credentials
- **Rotate admin secrets** after one-time operations
- **Use read-only database users** for Prisma Studio
- **Delete seed endpoints** after use

---

## Troubleshooting

**"Connection refused"**
- Check DATABASE_URL format: `postgresql://user:pass@host:port/db?sslmode=require`
- Verify database allows connections from your IP

**"Demo user already exists"**
- Seed script uses `upsert`, safe to run multiple times
- Or manually delete demo user first

**"Too many transactions at once"**
- Seed script uses batch inserts (100 at a time)
- Should complete in 30-60 seconds

---

**Quick Command:**
```bash
DATABASE_URL="paste-vercel-url-here" npm run db:seed
```
