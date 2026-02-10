'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QUICK_ADD_TEMPLATES } from '@/lib/demo-data';
import { haptics } from '@/lib/celebrations';
import { toast } from 'sonner';

interface QuickAddTransactionsProps {
    onAddTransaction?: (template: {
        emoji: string;
        label: string;
        amount: number;
        category: string;
    }) => Promise<void>;
}

export function QuickAddTransactions({ onAddTransaction }: QuickAddTransactionsProps) {
    const handleQuickAdd = async (template: typeof QUICK_ADD_TEMPLATES[number]) => {
        try {
            // Haptic feedback for tactile feel
            haptics.tap();

            if (onAddTransaction) {
                await onAddTransaction(template);
                toast.success(`Added ${template.emoji} ${template.label}`);
            } else {
                // Default: Navigate to transactions page with pre-filled data
                const params = new URLSearchParams({
                    amount: template.amount.toString(),
                    category: template.category,
                    description: template.label,
                });
                window.location.href = `/transactions?${params.toString()}`;
            }
        } catch (error) {
            toast.error('Failed to add transaction');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-neutral-600">Quick Add</h4>
                <span className="text-xs text-neutral-400">One-click transactions</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {QUICK_ADD_TEMPLATES.map((template, index) => (
                    <motion.button
                        key={template.label}
                        onClick={() => handleQuickAdd(template)}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="text-2xl group-hover:scale-110 transition-transform">
                            {template.emoji}
                        </div>
                        <div className="text-xs font-medium text-neutral-700 group-hover:text-neutral-900">
                            {template.label}
                        </div>
                        <div className="text-xs text-neutral-500">
                            {template.amount < 0 ? '-' : '+'}${Math.abs(template.amount)}
                        </div>
                    </motion.button>
                ))}
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="w-full text-neutral-500 hover:text-neutral-900"
                asChild
            >
                <a href="/transactions">
                    <Plus className="w-4 h-4 mr-2" />
                    Custom Transaction
                </a>
            </Button>
        </div>
    );
}
