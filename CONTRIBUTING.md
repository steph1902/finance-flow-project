# Contributing to FinanceFlow

First off, thank you for considering contributing to FinanceFlow! 🎉

FinanceFlow is built to demonstrate best practices in modern full-stack development, and your contributions help make it even better for the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)

---

## Code of Conduct

This project follows a simple code of conduct:

- **Be respectful** and considerate of others
- **Be collaborative** and open to feedback
- **Focus on what's best** for the community
- **Welcome newcomers** and help them learn

If you witness or experience any unacceptable behavior, please report it by opening an issue.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report:
1. Check the [FAQ](README.md#-faq) for common issues
2. Search [existing issues](https://github.com/steph1902/finance-flow-project/issues) to avoid duplicates
3. Try to reproduce the bug in the latest version

**Submit a bug report:**
- Use the bug report template
- Provide a clear, descriptive title
- Include steps to reproduce
- Describe expected vs. actual behavior
- Add screenshots if applicable
- Include environment details (OS, browser, Node version)

### 💡 Suggesting Features

Feature requests are welcome! Before submitting:
1. Check if the feature is already [planned in the roadmap](README.md#-project-roadmap)
2. Search existing feature requests
3. Consider if it fits the project's goals

**Submit a feature request:**
- Use the feature request template
- Explain the problem it solves
- Describe the proposed solution
- Provide examples or mockups
- Explain why it would benefit users

### 📖 Improving Documentation

Documentation improvements are highly valued:
- Fix typos or unclear explanations
- Add missing information
- Improve code examples
- Add tutorials or guides
- Translate documentation (future)

### 💻 Contributing Code

We welcome code contributions! Good first contributions:
- Bug fixes
- UI/UX improvements
- Test coverage improvements
- Performance optimizations
- Small feature implementations

**Before starting work:**
1. Check existing issues or create a new one
2. Comment on the issue to claim it
3. Wait for maintainer approval (avoid duplicate work)
4. Fork the repository and create a branch

---

## Development Setup

### Prerequisites

- **Node.js** 18.x or 20.x
- **pnpm** 8+ (recommended) or npm 9+
- **PostgreSQL** 15+
- **Git**

### Initial Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/finance-flow-project.git
cd finance-flow-project/finance-flow

# Add upstream remote
git remote add upstream https://github.com/steph1902/finance-flow-project.git

# Install dependencies
pnpm install  # or npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma migrate dev
pnpm run db:seed  # Optional: add demo data

# Start development server
pnpm dev
```

Visit http://localhost:3000

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your main branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feat/amazing-feature

# Branch naming conventions:
# feat/feature-name       - New features
# fix/bug-description     - Bug fixes
# docs/documentation-update - Documentation
# refactor/code-improvement - Code refactoring
# test/test-description   - Adding tests
# chore/maintenance-task  - Maintenance tasks
```

### 2. Make Changes

- Write clean, readable code
- Follow existing code patterns
- Add comments for complex logic
- Update documentation if needed
- Write/update tests

### 3. Test Your Changes

```bash
# Run linter
pnpm lint

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Test build
pnpm build
pnpm start
```

### 4. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(transactions): add bulk delete functionality"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feat/amazing-feature

# Go to GitHub and create a Pull Request
```

---

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Enable **strict mode** (already configured)
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Use type aliases for unions/intersections

**Example:**
```typescript
// ✅ Good
interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

// ❌ Avoid
const transaction: any = { ... };
```

### React Components

- Use **functional components** with hooks
- Use **Server Components** by default (unless client interactivity needed)
- Add `'use client'` directive only when necessary
- Keep components small and focused
- Extract reusable logic into custom hooks

**Example:**
```typescript
// ✅ Good - Server Component
export default function TransactionList({ transactions }: Props) {
  return <div>...</div>;
}

// ✅ Good - Client Component (when needed)
'use client';

export function TransactionForm() {
  const [amount, setAmount] = useState(0);
  return <form>...</form>;
}
```

### File Organization

- **Components**: `src/components/[feature]/ComponentName.tsx`
- **Hooks**: `src/hooks/useFeatureName.ts`
- **Utils**: `src/lib/featureName.ts`
- **Types**: `src/types/index.ts` or co-located
- **API Routes**: `app/api/[feature]/route.ts`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TransactionCard.tsx` |
| Hooks | camelCase with `use` | `useTransactions.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| Types/Interfaces | PascalCase | `Transaction`, `BudgetFilters` |
| Variables | camelCase | `totalAmount`, `isLoading` |

### Imports

Use absolute imports with `@/` prefix:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

// ❌ Avoid relative imports for shared code
import { Button } from '../../components/ui/button';
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, semantic commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(ai): add receipt scanning` |
| `fix` | Bug fix | `fix(transactions): resolve pagination issue` |
| `docs` | Documentation | `docs(readme): update installation steps` |
| `style` | Code style (no logic change) | `style(components): format with prettier` |
| `refactor` | Code refactoring | `refactor(api): simplify error handling` |
| `test` | Adding/updating tests | `test(budgets): add unit tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `perf` | Performance improvement | `perf(dashboard): optimize query` |
| `ci` | CI/CD changes | `ci(github): add automated tests` |
| `build` | Build system changes | `build(webpack): update config` |
| `revert` | Revert previous commit | `revert: feat(ai): add receipt scanning` |

### Scopes

Use feature/module names: `ai`, `transactions`, `budgets`, `auth`, `dashboard`, `ui`, etc.

### Examples

```bash
# New feature
git commit -m "feat(budgets): add budget sharing functionality"

# Bug fix
git commit -m "fix(transactions): correct total calculation for filtered view"

# Documentation
git commit -m "docs(api): add examples for transaction endpoints"

# Breaking change
git commit -m "feat(auth)!: migrate to NextAuth v5

BREAKING CHANGE: NextAuth v4 sessions are incompatible"
```

### Best Practices

- Use **present tense** ("add feature" not "added feature")
- Use **imperative mood** ("move cursor to..." not "moves cursor to...")
- Keep first line **under 72 characters**
- Capitalize first letter of description
- No period at the end of description
- Add body for complex changes
- Reference issues: `Closes #123`, `Fixes #456`

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Linter shows no errors
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with `main`

### Creating a Pull Request

1. **Title**: Use conventional commit format
   - `feat(scope): description`
   - `fix(scope): description`

2. **Description**: Use the PR template and include:
   - **What**: Summary of changes
   - **Why**: Motivation and context
   - **How**: Technical approach
   - **Testing**: How you tested
   - **Screenshots**: For UI changes
   - **Related Issues**: `Closes #123`

3. **Labels**: Add appropriate labels
   - `enhancement`, `bug`, `documentation`, etc.

4. **Reviewers**: Request review from maintainers

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainer reviews your code
3. **Feedback**: Address comments and requested changes
4. **Approval**: Once approved, maintainer will merge

### After Merge

- Delete your feature branch
- Update your fork
- Celebrate! 🎉

---

## Style Guide

### Code Formatting

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings (except JSX)
- **Semicolons**: Required
- **Line length**: Max 100 characters (recommended)
- **Trailing commas**: Always (ES5+)

**Use Prettier** (already configured):
```bash
# Format code
pnpm lint:fix
```

### JSX/TSX

```typescript
// ✅ Good
<Button
  variant="primary"
  onClick={handleClick}
  className="w-full"
>
  Submit
</Button>

// ❌ Avoid
<Button variant="primary" onClick={handleClick} className="w-full">Submit</Button>
```

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use bcrypt for password hashing to prevent rainbow table attacks
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ Avoid - Obvious comments
// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);
```

### Functions

```typescript
// ✅ Good - Clear, single responsibility
function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
}

// ❌ Avoid - Doing too much
function processTransactions(transactions: Transaction[]) {
  // Calculating, filtering, updating state, API calls...
}
```

---

## Testing Guidelines

### Test Coverage Targets

- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **API Routes**: 75%+ coverage
- **Hooks**: 85%+ coverage

### Writing Tests

**Component Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import { TransactionCard } from './TransactionCard';

describe('TransactionCard', () => {
  it('displays transaction details', () => {
    const transaction = {
      id: '1',
      amount: 50,
      type: 'EXPENSE',
      description: 'Groceries'
    };
    
    render(<TransactionCard transaction={transaction} />);
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
});
```

**Utility Tests:**
```typescript
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

### Test Best Practices

- **AAA Pattern**: Arrange, Act, Assert
- **Descriptive names**: Test behavior, not implementation
- **One assertion** per test (when possible)
- **Mock external dependencies** (API calls, auth)
- **Test edge cases** (null, undefined, empty, large numbers)

---

## Documentation Guidelines

### Code Documentation

**JSDoc for complex functions:**
```typescript
/**
 * Calculates the optimal budget allocation across categories
 * based on historical spending patterns.
 * 
 * @param transactions - User's transaction history (last 3 months)
 * @param currentBudgets - Current budget allocations
 * @returns Suggested budget adjustments with confidence scores
 */
export async function optimizeBudgets(
  transactions: Transaction[],
  currentBudgets: Budget[]
): Promise<BudgetSuggestion[]> {
  // ...
}
```

### README Updates

When adding features:
- Update feature list
- Add usage examples
- Update API documentation
- Add screenshots (if UI)

### Changelog

For significant changes, add entry to `CHANGELOG.md`:

```markdown
## [Unreleased]

### Added
- Receipt scanning with OCR via Google Cloud Vision API
```

---

## Questions?

- **General questions**: [GitHub Discussions](https://github.com/steph1902/finance-flow-project/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/steph1902/finance-flow-project/issues)
- **Feature requests**: [GitHub Issues](https://github.com/steph1902/finance-flow-project/issues)

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- README acknowledgments section

---

Thank you for contributing to FinanceFlow! 💰✨

Your efforts help create a better finance management tool for everyone.
