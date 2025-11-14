"use client";

import { AIChat } from "@/components/ai/AIChat";

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Financial Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get personalized financial insights and advice powered by AI
        </p>
      </div>
      <AIChat />
    </div>
  );
}
