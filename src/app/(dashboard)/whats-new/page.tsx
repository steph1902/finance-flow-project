'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Coffee, Zap, Heart, TrendingUp, MessageSquare } from 'lucide-react';

export default function WhatsNewPage() {
    const updates = [
        {
            version: '2.1.0',
            date: '2026-02-10',
            icon: Sparkles,
            color: 'text-purple-600 bg-purple-50',
            title: 'Saaspocalypse-Proof UX Overhaul',
            items: [
                {
                    label: 'Realistic Demo Data',
                    description: 'See relatable transactions from day 1 - "Starbucks (again 😅)"',
                    emoji: '☕',
                },
                {
                    label: 'Quick-Add Pills',
                    description: 'One-click common transactions (Coffee, Lunch, Ride, etc.)',
                    emoji: '⚡',
                },
                {
                    label: 'Humanized Copy',
                    description: '"Nice restraint! You\'re on track 🎯" instead of boring "Budget Usage: 78%"',
                    emoji: '💬',
                },
                {
                    label: 'Unique Empty States',
                    description: 'Animated sparkles and encouraging language everywhere',
                    emoji: '✨',
                },
                {
                    label: 'Haptic Feedback',
                    description: 'Tactile vibrations on key actions (mobile)',
                    emoji: '📳',
                },
            ],
        },
        {
            version: '2.0.0',
            date: '2026-02-08',
            icon: TrendingUp,
            color: 'text-blue-600 bg-blue-50',
            title: 'AI Categorization Enhancements',
            items: [
                {
                    label: 'Smart Keyword Learning',
                    description: 'AI learns from your corrections - gets smarter with every rejection',
                    emoji: '🧠',
                },
                {
                    label: 'User Feedback System',
                    description: 'Accept/reject AI suggestions and teach the system',
                    emoji: '👍',
                },
                {
                    label: 'Analytics Dashboard',
                    description: 'Track AI accuracy, confidence, and performance',
                    emoji: '📊',
                },
                {
                    label: 'Confidence Badges',
                    description: 'See how confident AI is about each categorization',
                    emoji: '🎯',
                },
            ],
        },
        {
            version: '1.9.0',
            date: '2026-01-25',
            icon: Heart,
            color: 'text-red-600 bg-red-50',
            title: 'WCAG 2.1 Level AA Compliance',
            items: [
                {
                    label: 'Accessible Color System',
                    description: 'All colors meet contrast requirements',
                    emoji: '🎨',
                },
                {
                    label: 'Keyboard Navigation',
                    description: 'Full app navigation without a mouse',
                    emoji: '⌨️',
                },
                {
                    label: 'Screen Reader Support',
                    description: 'ARIA labels and semantic HTML throughout',
                    emoji: '🔊',
                },
                {
                    label: 'Focus Indicators',
                    description: 'Clear visual focus for all interactive elements',
                    emoji: '👁️',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF8] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-4">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Latest Updates</span>
                    </div>
                    <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-4">
                        What's New in FinanceFlow
                    </h1>
                    <p className="text-lg text-neutral-600">
                        We're constantly improving FinanceFlow to make managing your finances delightful
                    </p>
                </div>

                {/* Updates */}
                <div className="space-y-8">
                    {updates.map((update, index) => {
                        const Icon = update.icon;
                        return (
                            <Card key={index} className="border-none shadow-soft rounded-[32px] overflow-hidden">
                                <CardHeader className="bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-100">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${update.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="text-2xl">{update.title}</CardTitle>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    v{update.version}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-base">
                                                Released on {new Date(update.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {update.items.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-colors"
                                            >
                                                <div className="text-3xl">{item.emoji}</div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-neutral-900 mb-1">{item.label}</h4>
                                                    <p className="text-sm text-neutral-600">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-neutral-500 text-sm">
                        Have feedback or suggestions?{' '}
                        <a href="mailto:support@financeflow.com" className="text-purple-600 hover:underline">
                            Let us know!
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
