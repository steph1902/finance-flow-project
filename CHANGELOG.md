# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

### Security - Critical Security Hardening (2025-11-15)

**Critical Fixes:**
- 🔴 **FIXED:** Authentication bypass vulnerability in `/api/recurring-transactions/:id`
  - Replaced insecure header-based auth (`x-user-id`) with `withApiAuth` wrapper
  - Prevented unauthorized access to user's recurring transactions
  - Now consistent with all other API routes
- 🔴 **ADDED:** Production-safe error logging utility (`src/lib/logger.ts`)
  - Sanitizes errors to prevent sensitive data exposure in logs
  - Automatically redacts passwords, tokens, API keys, secrets
  - Development: Full error details | Production: Generic messages only
  - Prevents stack trace leakage in production
- 🔴 **ADDED:** Security headers configuration in `next.config.ts`
  - X-Frame-Options: DENY (prevents clickjacking)
  - X-Content-Type-Options: nosniff (prevents MIME sniffing)
  - Content-Security-Policy (CSP) with Gemini API whitelisting
  - Strict-Transport-Security (HSTS) with preload
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: Disabled camera/microphone/geolocation

**High Priority Enhancements:**
- 🟠 **ADDED:** Rate limiting for AI endpoints (`src/lib/rate-limiter.ts`)
  - AI endpoints: 10 requests/minute per user
  - Chat endpoint: 5 requests/minute per user
  - Prevents API abuse and cost overruns (Gemini API protection)
  - Returns 429 status with X-RateLimit headers
  - In-memory implementation (upgrade to Redis for production scale)
- 🟠 **IMPROVED:** Session cookie configuration in `auth.ts`
  - Reduced session duration: 7 days → 1 day (better security)
  - Added session update interval: 1 hour
  - Secure cookie prefix: `__Secure-next-auth.session-token` (production)
  - httpOnly: true (prevents JavaScript access)
  - sameSite: 'lax' (CSRF protection)
  - secure: true in production (HTTPS only)

**Rate Limiting Applied To:**
- ✅ `/api/ai/categorize` - 10 req/min
- ✅ `/api/ai/chat` - 5 req/min
- ✅ `/api/ai/insights` - 10 req/min

**Secure Logging Applied To:**
- ✅ All AI endpoints (categorize, chat, insights)
- ✅ Error sanitization (no sensitive data in production logs)

**Security Score Improvement:**
- Before: 6.5/10 (3 critical vulnerabilities)
- After: 8.5/10 (all critical issues resolved)

**Documentation:**
- `SECURITY_AUDIT_REPORT.md` - Comprehensive 450-line security analysis
- Details all vulnerabilities, fixes, and recommendations
- Includes attack scenarios and cost impact analysis

**Files Changed:** 8 files
- Modified: 3 API routes (categorize, chat, insights)
- Modified: 2 config files (next.config.ts, auth.ts)
- Modified: 1 API route (recurring-transactions/[id])
- Created: 2 new utilities (logger.ts, rate-limiter.ts)
- Created: 1 report (SECURITY_AUDIT_REPORT.md)

### Added - Phase 4A: Recurring Transactions (2025-11-14)

**Backend:**
- RecurringTransaction model with 6 frequency types (DAILY/WEEKLY/BIWEEKLY/MONTHLY/QUARTERLY/YEARLY)
- Full CRUD API: `/api/recurring-transactions` (list, create) and `/api/recurring-transactions/:id` (get, update, delete)
- Automatic next-date calculation based on frequency
- Support for pausing/resuming and optional end dates
- User ownership validation on all operations

**Frontend:**
- `RecurringTransactionForm` - Comprehensive form with frequency selector and live next-occurrence preview
- `RecurringTransactionCard` - Rich display with status badges, relative dates, and quick actions (pause/resume/delete)
- `RecurringTransactionsPage` - Full management interface at `/recurring` with tabbed navigation
- `UpcomingRecurringWidget` - Dashboard widget showing next 5 upcoming transactions
- `useRecurringTransactions` hook - State management for recurring transactions

**Features:**
- Live preview: "Next occurrence: Friday, December 1, 2025"
- Status indicators: Active (green), Paused (gray), Due (orange), Ended (gray)
- Relative dates: "Today", "Tomorrow", "In 3 days", "Overdue"
- Monthly projections: Auto-calculate income/expenses from all active recurring
- Tabbed views: All, Active, Upcoming (next 7 days), Due (overdue), Paused
- Confirmation dialogs for destructive actions
- Empty states with helpful guidance

**UX Best Practices:**
- Progressive disclosure (modal forms)
- Contextual actions (pause/resume on card)
- Visual hierarchy (icons, colors, badges)
- Responsive design (2-col grid → 1-col on mobile)
- Accessibility (ARIA labels, keyboard navigation)

**Files:** 13 files, ~1,850 lines added

### Added - Phase 3: AI Insights Dashboard (2025-11-14)

#### Phase 1: Backend Foundation
**Infrastructure:**
- Google Gemini AI integration with `@google/generative-ai` package
- AI configuration system with environment variables
- Database tables: `ai_suggestions` and `ai_chat_history`
- Prisma schema updates with AI models
- Row-level security policies for AI tables
- Indexes for optimal query performance

**Services & API:**
- `POST /api/ai/categorize` - AI-powered transaction categorization
- `POST /api/ai/feedback` - User feedback collection
- Gemini API client with retry logic and exponential backoff
- Categorization service with AI and rule-based fallback
- 11 expense + 6 income categories with 42+ subcategories
- Confidence scoring and AI reasoning explanations

#### Phase 2A: UI Integration
**Components:**
- `CategorySuggestionCard` - Display AI suggestions with accept/reject
- `AILoading` - Loading spinner for AI processing
- `Badge` - UI component for confidence levels
- `useAICategorization` - React hook for AI state management

**Features:**
- Auto-trigger categorization on transaction description change
- 800ms debounce to prevent excessive API calls
- Accept/reject AI suggestions with one click
- Confidence color coding (>90% green, >70% blue, else yellow)
- Three-state UI (loading/success/error)
- Comprehensive error handling with network error messages

#### Phase 2B: Chat Assistant
**Components:**
- `AIChat` - Interactive chat interface with message history
- Chat message bubbles (user/assistant differentiation)
- ScrollArea component for conversation history
- Enter key and Send button support

**API & Services:**
- `POST /api/ai/chat` - Conversational AI endpoint
- `chat-service` - Gemini integration with financial context
- Conversation persistence to `ai_chat_history` table
- Financial context building (transactions, budgets, spending analysis)
- Natural language query processing

**Features:**
- Personalized AI responses based on actual financial data
- Conversation memory (last 5 messages for context)
- Example prompts to guide users
- Real-time loading states
- Error handling with graceful degradation
- `/ai-assistant` page with sidebar navigation

#### Phase 3: Insights Dashboard
**Components:**
- `InsightsCard` - Beautiful insight display with severity indicators
- `AIInsights` - Dashboard widget with period filtering
- Four insight types (alert/trend/recommendation/achievement)
- Three severity levels (info/warning/critical)
- Color-coded borders and icon indicators

**API & Services:**
- `GET /api/ai/insights?period={week|month|quarter}` - Insights generation
- `insights-service` - Comprehensive financial analysis engine
- Period-based comparison (current vs previous)
- Budget alert detection (90%+ usage warnings)
- Spending trend analysis with percentage changes
- AI-powered pattern detection with rule-based fallback

**Features:**
- Automatic insights generation on dashboard load
- Period selector (Week/Month/Quarter)
- Manual refresh capability
- Budget alerts (warning at 90%, critical at 100%)
- Spending trend detection (>10% increase/decrease)
- Top category identification
- Personalized recommendations
- Empty state and error handling

**Dashboard Integration:**
- AIInsights widget added to main dashboard
- Positioned between summary stats and charts
- Responsive design for all screen sizes
- Dark mode support throughout

#### Documentation
- `PHASE1_COMPLETE.md` - Backend implementation details
- `PHASE2A_COMPLETE.md` - UI integration documentation (252 lines)
- `PHASE2B_COMPLETE.md` - Chat assistant documentation (481 lines)
- `PHASE3_COMPLETE.md` - Insights dashboard documentation (420 lines)
- `AI_TESTING_REPORT.md` - Comprehensive testing results
- Updated README with AI features section
- Test scripts for API validation

#### Code Statistics
- **Total Commits:** 15 on dev branch
- **Total Lines Added:** 3,000+ lines of AI-powered features
- **Components Created:** 7 new React components
- **API Endpoints:** 4 new endpoints (/categorize, /chat, /insights, /feedback)
- **Services:** 4 new services (gemini-client, categorization, chat, insights)
- **Database Models:** 2 new models (AISuggestion, AIChatHistory)



## 0.1.0 (2025-11-08)


### Features

* add transactions, budgets, and dashboard UI with charts and filters ([c7d82d5](https://github.com/steph1902/finance-flow-project/commit/c7d82d5ca1457be0f3e3b195bacf5919541689ad))
* scaffold financeflow project ([ea849c4](https://github.com/steph1902/finance-flow-project/commit/ea849c485245a12483705d16219816d8ad1b0fe5))
