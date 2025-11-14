# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

### Added - AI Integration Phase 1 (2025-11-14)

#### Infrastructure
- Google Gemini AI integration with `@google/generative-ai` package
- AI configuration system with environment variables
- Database tables: `ai_suggestions` and `ai_chat_history`
- Row-level security policies for AI tables
- Indexes for optimal query performance

#### Services & API
- `POST /api/ai/categorize` - AI-powered transaction categorization
- `POST /api/ai/feedback` - User feedback collection
- Gemini API client with retry logic and exponential backoff
- Categorization service with AI and rule-based fallback
- 11 expense + 6 income categories with 42+ subcategories
- Confidence scoring and AI reasoning explanations

#### Documentation
- Complete PRD/FSD for AI features
- Phase 1 implementation summary
- Test scripts for API validation

## 0.1.0 (2025-11-08)


### Features

* add transactions, budgets, and dashboard UI with charts and filters ([c7d82d5](https://github.com/steph1902/finance-flow-project/commit/c7d82d5ca1457be0f3e3b195bacf5919541689ad))
* scaffold financeflow project ([ea849c4](https://github.com/steph1902/finance-flow-project/commit/ea849c485245a12483705d16219816d8ad1b0fe5))
