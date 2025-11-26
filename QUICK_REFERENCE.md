# FinanceFlow - Quick Reference Card

**Fast access to common commands and links for developers**

---

## 🚀 Quick Start (5 Minutes)

```bash
git clone https://github.com/steph1902/finance-flow-project.git
cd finance-flow-project/finance-flow
npm install
cp .env.example .env.local
# Edit .env.local with your values
npx prisma migrate dev
npm run db:seed  # Optional
npm run dev      # Visit http://localhost:3000
```

---

## 📝 Common Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check linting errors
npm run lint:fix     # Auto-fix linting issues
```

### Database
```bash
npx prisma studio            # Open Prisma Studio (http://localhost:5555)
npx prisma migrate dev       # Run migrations (dev)
npx prisma migrate deploy    # Run migrations (production)
npx prisma generate          # Regenerate Prisma Client
npm run db:seed              # Seed demo data
```

### Testing
```bash
npm run test                 # Run all tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage
npm run test:ci              # Run tests in CI mode
```

### Code Quality
```bash
npm run lint                 # Check for errors
npm run lint:fix             # Auto-fix errors
npm audit                    # Check for vulnerabilities
npm audit fix                # Fix vulnerabilities
```

---

## 🔑 Environment Variables (Required)

```bash
# .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financeflow"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="<get-from-https://aistudio.google.com/app/apikey>"
```

**Generate secret:**
```bash
openssl rand -base64 32
```

---

## 📁 Project Structure (Key Folders)

```
app/
├── (auth)/              # Login, Signup
├── (dashboard)/         # Protected dashboard pages
└── api/                 # API routes

src/
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/                # Utilities, API client
├── types/              # TypeScript types
└── constants/          # App constants

prisma/
└── schema.prisma       # Database schema
```

---

## 🌐 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Dev Server** | http://localhost:3000 | Main app |
| **Prisma Studio** | http://localhost:5555 | Database GUI |
| **Gemini API Keys** | https://aistudio.google.com/app/apikey | Get AI API key |
| **Google OAuth** | https://console.cloud.google.com/ | OAuth credentials |

---

## 🐛 Troubleshooting

### Database connection failed
```bash
brew services list | grep postgresql  # Check if running
psql $DATABASE_URL                    # Test connection
```

### TypeScript errors
```bash
rm -rf .next node_modules
npm install
npx prisma generate
```

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9  # Kill process
PORT=3001 npm run dev          # Use different port
```

---

## 📚 Documentation Links

- [Full README](README.md) - Complete documentation
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Security Policy](SECURITY.md) - Report vulnerabilities
- [Changelog](CHANGELOG.md) - Version history

---

## 🎯 Git Workflow

```bash
# Start new feature
git checkout -b feat/feature-name

# Commit with conventional commits
git commit -m "feat(scope): description"

# Push and create PR
git push origin feat/feature-name
```

**Commit types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 🧪 Test User (After Seed)

```
Email: demo@financeflow.com
Password: demo123
```

---

## 🔗 Quick Links

- [GitHub Repository](https://github.com/steph1902/finance-flow-project)
- [Issues](https://github.com/steph1902/finance-flow-project/issues)
- [Discussions](https://github.com/steph1902/finance-flow-project/discussions)

---

**Need help?** Check the [FAQ](README.md#-faq) or [open an issue](https://github.com/steph1902/finance-flow-project/issues/new)!
