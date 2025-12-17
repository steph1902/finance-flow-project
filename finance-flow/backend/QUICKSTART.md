# Finance Flow Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 14+ running
- Redis 7+ running (optional for development)
- Git

---

## Step 1: Navigate to Backend Directory

```bash
cd finance-flow-project/finance-flow/backend
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all NestJS dependencies, Prisma, and other required packages.

---

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/finance_flow"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Optional (for development)
REDIS_HOST=localhost
REDIS_PORT=6379

# Optional (for production features)
GOOGLE_AI_API_KEY=your-key-here
STRIPE_SECRET_KEY=your-key-here
PLAID_CLIENT_ID=your-id-here
RESEND_API_KEY=your-key-here
```

---

## Step 4: Setup Database

### Link to Existing Prisma Schema

```bash
# Create symlink to existing prisma directory
ln -s ../prisma ./prisma
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### (Optional) Seed Database

```bash
npm run db:seed
```

---

## Step 5: Start Development Server

```bash
npm run start:dev
```

You should see:
```
🚀 Finance Flow Backend running on: http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
🌍 Environment: development
```

---

## Step 6: Test the API

### Open Swagger Documentation

Visit: `http://localhost:3001/api/docs`

You'll see interactive API documentation for all endpoints.

### Test Authentication

#### Register a User

```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "1h",
    "tokenType": "Bearer"
  }
}
```

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

#### Get Profile (with token)

```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Transactions

#### Create a Transaction

```bash
curl -X POST http://localhost:3001/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "type": "EXPENSE",
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2024-11-25T12:00:00Z"
  }'
```

#### Get All Transactions

```bash
curl -X GET "http://localhost:3001/api/v1/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Transaction Statistics

```bash
curl -X GET "http://localhost:3001/api/v1/transactions/stats/summary" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎨 Development Commands

### Run Development Server
```bash
npm run start:dev
```

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run start:prod
```

### Run Tests
```bash
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
npm run test:e2e          # Integration tests
```

### Linting & Formatting
```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
```

### Database Commands
```bash
npx prisma studio         # Open Prisma Studio (DB GUI)
npx prisma generate       # Regenerate Prisma client
npx prisma migrate dev    # Create new migration
npx prisma migrate deploy # Apply migrations (production)
```

---

## 📁 Project Structure Quick Reference

```
backend/src/
├── main.ts                    # Entry point
├── app.module.ts              # Root module
├── database/                  # Prisma service
├── common/                    # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
└── modules/                   # Feature modules
    ├── auth/                  ✅ COMPLETE
    ├── users/                 ✅ COMPLETE
    ├── transactions/          ✅ COMPLETE
    ├── budgets/               📝 TO IMPLEMENT
    ├── recurring/             📝 TO IMPLEMENT
    ├── goals/                 📝 TO IMPLEMENT
    ├── investments/           📝 TO IMPLEMENT
    ├── analytics/             📝 TO IMPLEMENT
    ├── reports/               📝 TO IMPLEMENT
    ├── notifications/         📝 TO IMPLEMENT
    ├── ai/                    📝 TO IMPLEMENT
    ├── currency/              📝 TO IMPLEMENT
    ├── integrations/          📝 TO IMPLEMENT
    └── jobs/                  📝 TO IMPLEMENT
```

---

## 🛠️ How to Implement a New Module

Follow this template (using Transactions as reference):

### 1. Create Module Structure
```bash
mkdir -p src/modules/budgets/dto
touch src/modules/budgets/budgets.module.ts
touch src/modules/budgets/budgets.controller.ts
touch src/modules/budgets/budgets.service.ts
touch src/modules/budgets/budgets.repository.ts
touch src/modules/budgets/dto/create-budget.dto.ts
```

### 2. Define DTOs
```typescript
// src/modules/budgets/dto/create-budget.dto.ts
export class CreateBudgetDto {
  @IsString()
  category: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2000)
  year: number;
}
```

### 3. Create Repository
```typescript
// src/modules/budgets/budgets.repository.ts
@Injectable()
export class BudgetsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BudgetCreateInput) {
    return this.prisma.budget.create({ data });
  }

  // ... other methods
}
```

### 4. Create Service
```typescript
// src/modules/budgets/budgets.service.ts
@Injectable()
export class BudgetsService {
  constructor(private repository: BudgetsRepository) {}

  async create(userId: string, dto: CreateBudgetDto) {
    // Business logic here
  }
}
```

### 5. Create Controller
```typescript
// src/modules/budgets/budgets.controller.ts
@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private service: BudgetsService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBudgetDto) {
    return this.service.create(userId, dto);
  }
}
```

### 6. Create Module
```typescript
// src/modules/budgets/budgets.module.ts
@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetsRepository],
  exports: [BudgetsService],
})
export class BudgetsModule {}
```

### 7. Register in App Module
```typescript
// src/app.module.ts
import { BudgetsModule } from './modules/budgets/budgets.module';

@Module({
  imports: [
    // ... other imports
    BudgetsModule,
  ],
})
export class AppModule {}
```

---

## 🧪 Testing Example

```typescript
// budgets.service.spec.ts
describe('BudgetsService', () => {
  let service: BudgetsService;
  let repository: BudgetsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: BudgetsRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(BudgetsService);
    repository = module.get(BudgetsRepository);
  });

  it('should create a budget', async () => {
    const dto = {
      category: 'Food',
      amount: 500,
      month: 11,
      year: 2024,
    };

    jest.spyOn(repository, 'create').mockResolvedValue({
      id: '1',
      ...dto,
      userId: 'user-1',
    } as any);

    const result = await service.create('user-1', dto);

    expect(result).toHaveProperty('id');
    expect(repository.create).toHaveBeenCalled();
  });
});
```

---

## 🔍 Debugging Tips

### Enable Debug Logging
```bash
# In .env
LOG_LEVEL=debug
```

### View Prisma Queries
Prisma queries are logged in development mode automatically.

### Use Prisma Studio
```bash
npx prisma studio
```
Opens a GUI at `http://localhost:5555` to browse your database.

### Check API Logs
All requests are logged by `LoggingInterceptor`:
```
→ POST /api/v1/transactions 127.0.0.1 PostmanRuntime/7.x
← POST /api/v1/transactions 201 +45ms
```

---

## 🚨 Common Issues & Solutions

### Issue: Port 3001 already in use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Issue: Prisma Client not generated
```bash
npx prisma generate
```

### Issue: Database connection failed
Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running:
```bash
psql -U postgres -h localhost
```

### Issue: TypeScript errors
```bash
# Clean build
rm -rf dist
npm run build
```

---

## 📦 Production Deployment

### 1. Build
```bash
npm run build
```

### 2. Set Environment
```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
```

### 3. Run Migrations
```bash
npx prisma migrate deploy
```

### 4. Start Server
```bash
npm run start:prod
```

### Docker (Optional)
```bash
docker build -t finance-flow-backend .
docker run -p 3001:3001 finance-flow-backend
```

---

## 📚 Next Steps

1. **Implement Remaining Modules**
   - Follow the Transactions module pattern
   - See `IMPLEMENTATION_GUIDE.md` for detailed specs

2. **Add Tests**
   - Unit tests for services
   - Integration tests for controllers
   - Aim for >80% coverage

3. **Setup CI/CD**
   - GitHub Actions or GitLab CI
   - Automated testing
   - Automated deployment

4. **Add Monitoring**
   - Sentry for error tracking
   - DataDog/NewRelic for metrics
   - Structured logging

5. **Performance Optimization**
   - Add Redis caching
   - Optimize database queries
   - Add database indexes

---

## 🎉 You're Ready!

You now have a fully functional NestJS backend with:
- ✅ JWT authentication
- ✅ User management
- ✅ Complete transaction system
- ✅ Swagger documentation
- ✅ Error handling
- ✅ Input validation
- ✅ Logging
- ✅ Security headers

**Start building the remaining modules and create something amazing! 🚀**

---

## 📞 Need Help?

- **Documentation**: Check `README.md` and `IMPLEMENTATION_GUIDE.md`
- **NestJS Docs**: https://docs.nestjs.com/
- **Prisma Docs**: https://www.prisma.io/docs/
- **API Playground**: http://localhost:3001/api/docs

Happy coding! 💻
