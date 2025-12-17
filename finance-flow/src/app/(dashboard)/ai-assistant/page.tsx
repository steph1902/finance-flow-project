"use client";

import { AIChat } from "@/components/ai/AIChat";
import { Sparkles } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-purple-500/20 border border-primary/30 shadow-soft">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="type-h2">AI Financial Assistant</h1>
        </div>
        <p className="type-body text-muted-foreground max-w-2xl">
          Get personalized financial insights and advice powered by AI. Ask questions about your spending, budgets, or get smart recommendations.
        </p>
      </div>
      <AIChat />
    </div>
  );
}
