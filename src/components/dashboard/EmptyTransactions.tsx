"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function EmptyTransactions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-neutral-400" />
            </div>

            <h3 className="text-2xl font-medium text-neutral-900 mb-2">
                No transactions yet
            </h3>

            <p className="text-base text-neutral-500 text-center max-w-md mb-8">
                Start tracking your finances by adding your first transaction. It only takes a moment!
            </p>

            <Button asChild className="h-12 px-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 gap-2 shadow-lg shadow-neutral-900/20">
                <Link href="/transactions">
                    <Plus className="w-5 h-5" />
                    Add Your First Transaction
                </Link>
            </Button>
        </motion.div>
    );
}
