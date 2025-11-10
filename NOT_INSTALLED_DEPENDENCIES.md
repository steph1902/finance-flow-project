# Not Installed Dependencies

This document lists all dependencies that are currently not installed in the `finance-flow-project`.

**Status:** Dependencies have not been installed yet. Run `npm install` to install all dependencies.

---

## All Not Installed Dependencies (36 total)

### Production Dependencies (27)

1. `@auth/prisma-adapter@^2.11.1` - Prisma adapter for authentication
2. `@hookform/resolvers@^5.2.2` - Form validation resolvers for React Hook Form
3. `@prisma/client@^6.18.0` - Prisma Client for database operations
4. `@radix-ui/react-dialog@^1.1.15` - Accessible dialog component
5. `@radix-ui/react-dropdown-menu@^2.1.16` - Accessible dropdown menu component
6. `@radix-ui/react-label@^2.1.8` - Accessible label component
7. `@radix-ui/react-select@^2.2.6` - Accessible select component
8. `@radix-ui/react-slot@^1.2.4` - Component composition utility
9. `bcrypt@^6.0.0` - Password hashing library
10. `class-variance-authority@^0.7.1` - CSS class variance utility
11. `clsx@^2.1.1` - Utility for constructing className strings
12. `date-fns@^4.1.0` - Modern JavaScript date utility library
13. `dotenv@^17.2.3` - Environment variable management
14. `lucide-react@^0.552.0` - Icon library for React
15. `next@16.0.1` - React framework for production
16. `next-auth@^4.24.13` - Authentication for Next.js
17. `next-themes@^0.4.6` - Theme management for Next.js
18. `prisma@^6.18.0` - Next-generation ORM for Node.js and TypeScript
19. `react@19.2.0` - JavaScript library for building user interfaces
20. `react-dom@19.2.0` - React package for working with the DOM
21. `react-hook-form@^7.66.0` - Performant forms with easy validation
22. `recharts@^3.3.0` - Composable charting library for React
23. `sonner@^2.0.7` - Toast notification library
24. `swr@^2.3.6` - React Hooks for data fetching
25. `tailwind-merge@^3.3.1` - Utility for merging Tailwind CSS classes
26. `zod@^4.1.12` - TypeScript-first schema validation

### Development Dependencies (9)

1. `@tailwindcss/postcss@^4` - Tailwind CSS PostCSS plugin
2. `@types/node@^20` - TypeScript definitions for Node.js
3. `@types/react@^19` - TypeScript definitions for React
4. `@types/react-dom@^19` - TypeScript definitions for React DOM
5. `babel-plugin-react-compiler@1.0.0` - React compiler Babel plugin
6. `eslint@^9` - JavaScript and TypeScript linter
7. `eslint-config-next@16.0.1` - ESLint configuration for Next.js
8. `tailwindcss@^4` - Utility-first CSS framework
9. `tw-animate-css@^1.4.0` - Tailwind CSS animation utilities
10. `typescript@^5` - TypeScript language

---

## Installation Instructions

To install all dependencies, run:

```bash
npm install
```

This will install all 36 dependencies (27 production + 9 development dependencies) listed above.

---

## Dependency Categories

### UI Components & Styling
- Radix UI components (@radix-ui/*)
- Tailwind CSS and utilities (tailwindcss, tailwind-merge, tw-animate-css, @tailwindcss/postcss)
- Class utilities (clsx, class-variance-authority)
- Icons (lucide-react)

### Framework & Core
- Next.js (next, next-themes)
- React (react, react-dom)
- TypeScript (typescript, @types/*)

### Forms & Validation
- React Hook Form (react-hook-form, @hookform/resolvers)
- Zod (zod)

### Authentication & Database
- NextAuth (next-auth, @auth/prisma-adapter)
- Prisma (@prisma/client, prisma)
- Bcrypt (bcrypt)

### Data Fetching & Visualization
- SWR (swr)
- Recharts (recharts)

### Utilities
- Date manipulation (date-fns)
- Environment variables (dotenv)
- Toast notifications (sonner)

### Development Tools
- ESLint (eslint, eslint-config-next)
- Babel (babel-plugin-react-compiler)
