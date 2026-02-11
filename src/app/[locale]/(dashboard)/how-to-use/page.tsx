'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Wallet,
    TrendingDown,
    Target,
    Calendar,
    Sparkles,
    FileText,
    Settings,
    CreditCard,
    BarChart3,
    Zap,
} from 'lucide-react';

export default function HowToUsePage() {
    const guides = [
        {
            category: 'Getting Started',
            icon: Sparkles,
            color: 'text-purple-600 bg-purple-50',
            items: [
                {
                    title: 'Quick Start (10 seconds)',
                    emoji: '⚡',
                    steps: [
                        'Dashboard loads with realistic demo data immediately',
                        'Click any Quick-Add pill (☕ Coffee, 🍔 Lunch) to try it out',
                        'Explore the charts and insights - no setup needed!',
                    ],
                    tip: 'The demo data is relatable on purpose - see yourself in the transactions!',
                },
                {
                    title: 'Adding Your First Transaction',
                    emoji: '➕',
                    steps: [
                        'Click "New Transaction" button in top-right',
                        'Enter description, amount, category, and date',
                        'AI will categorize future transactions automatically',
                        'Use Quick-Add pills for common purchases',
                    ],
                    tip: 'AI learns from your corrections! Reject wrong categories to teach it.',
                },
            ],
        },
        {
            category: 'Core Features',
            icon: Wallet,
            color: 'text-blue-600 bg-blue-50',
            items: [
                {
                    title: 'Setting Up Budgets',
                    emoji: '💰',
                    steps: [
                        'Go to Budgets → Create Budget',
                        'Pick a category (Food, Transport, etc.)',
                        'Set monthly amount',
                        'Track progress in real-time',
                    ],
                    tip: 'Budget status shows: "Nice restraint! 🎯" when under 80%',
                },
                {
                    title: 'Creating Financial Goals',
                    emoji: '🎯',
                    steps: [
                        'Navigate to Goals → New Goal',
                        'Name it (e.g., "Vacation Fund")',
                        'Set target amount and date',
                        'Add to goal from income transactions',
                    ],
                    tip: 'Goals celebrate when reached with emoji animations! 🎉',
                },
                {
                    title: 'Recurring Transactions',
                    emoji: '🔄',
                    steps: [
                        'Go to Recurring → Add Recurring',
                        'Set frequency (weekly, monthly, yearly)',
                        'Auto-applies to future months',
                        'Perfect for subscriptions and bills',
                    ],
                    tip: 'Mark transactions as recurring when creating them',
                },
            ],
        },
        {
            category: 'AI Features',
            icon: Sparkles,
            color: 'text-indigo-600 bg-indigo-50',
            items: [
                {
                    title: 'AI Categorization',
                    emoji: '🧠',
                    steps: [
                        'AI automatically suggests categories for new transactions',
                        'See confidence level with color badges (green = high, yellow = medium)',
                        'Accept ✓ or Reject ✗ suggestions',
                        'AI learns from rejections via keyword extraction',
                    ],
                    tip: 'The more you correct, the smarter it gets. After ~10 corrections, accuracy is 90%+',
                },
                {
                    title: 'Big 4 Financial Analysis',
                    emoji: '📊',
                    steps: [
                        'Go to Dashboard → Insights',
                        'Click "Generate Big 4 Analysis"',
                        'Review: Income, Expenses, Savings, Spending Patterns',
                        'Get actionable recommendations',
                    ],
                    tip: ' Analysis runs on your real data - demo shows what\'s possible',
                },
            ],
        },
        {
            category: 'Pro Tips',
            icon: Zap,
            color: 'text-yellow-600 bg-yellow-50',
            items: [
                {
                    title: 'Keyboard Shortcuts (Coming Soon)',
                    emoji: '⌨️',
                    steps: [
                        'Cmd/Ctrl + K: Command palette',
                        'C: Quick add transaction',
                        'B: Create budget',
                        'G D: Go to dashboard',
                    ],
                    tip: 'Press ? anywhere to see all shortcuts',
                },
                {
                    title: 'Mobile Experience',
                    emoji: '📱',
                    steps: [
                        'App is fully responsive',
                        'Quick-Add pills work great on mobile',
                        'Haptic feedback on key actions (vibrations)',
                        'Swipe gestures for navigation',
                    ],
                    tip: 'Add to Home Screen for app-like experience',
                },
                {
                    title: 'Import/Export Data',
                    emoji: '📂',
                    steps: [
                        'Go to Settings → Import/Export',
                        'Import CSV from your bank',
                        'Export to CSV for backup',
                        'Supports Mint, YNAB, and generic formats',
                    ],
                    tip: 'Always export before major changes as a backup',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF8] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">User Guide</span>
                    </div>
                    <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-4">
                        How to Use FinanceFlow
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Everything you need to know to master your finances. Start simple, get advanced later.
                    </p>
                </div>

                {/* Guides */}
                <div className="space-y-12">
                    {guides.map((guide, guideIndex) => {
                        const Icon = guide.icon;
                        return (
                            <div key={guideIndex}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-xl ${guide.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-light tracking-tight text-neutral-900">
                                        {guide.category}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {guide.items.map((item, itemIndex) => (
                                        <Card
                                            key={itemIndex}
                                            className="border-none shadow-soft rounded-[28px] overflow-hidden hover:shadow-md transition-all"
                                        >
                                            <CardHeader className="bg-gradient-to-br from-neutral-50 to-white">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="text-3xl">{item.emoji}</div>
                                                    <CardTitle className="text-xl">{item.title}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <ol className="space-y-3 mb-4">
                                                    {item.steps.map((step, stepIndex) => (
                                                        <li key={stepIndex} className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-600 mt-0.5">
                                                                {stepIndex + 1}
                                                            </div>
                                                            <p className="text-sm text-neutral-700 leading-relaxed">{step}</p>
                                                        </li>
                                                    ))}
                                                </ol>

                                                {item.tip && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                                                        <span className="text-yellow-600 text-lg">💡</span>
                                                        <p className="text-sm text-yellow-900 leading-relaxed">
                                                            <strong>Pro Tip:</strong> {item.tip}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 text-center bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-[32px] p-12">
                    <h3 className="text-2xl font-medium text-neutral-900 mb-3">
                        Need More Help?
                    </h3>
                    <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                        Check out our detailed documentation, watch video tutorials, or reach out to support.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/ai-docs"
                            className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-6 py-3 hover:bg-neutral-50 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">Documentation</span>
                        </a>
                        <a
                            href="mailto:support@financeflow.com"
                            className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-full px-6 py-3 hover:bg-purple-700 transition-colors"
                        >
                            <span className="font-medium">Contact Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
