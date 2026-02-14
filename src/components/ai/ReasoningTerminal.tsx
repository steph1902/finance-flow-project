"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Check, Loader2, Terminal, Sparkles } from "lucide-react";

interface ThoughtStep {
  id: string;
  text: string;
  status: "pending" | "processing" | "complete";
}

interface ReasoningTerminalProps {
  isActive: boolean;
  steps?: ThoughtStep[];
  onComplete?: () => void;
  className?: string;
}

export function ReasoningTerminal({
  isActive,
  steps: externalSteps,
  onComplete,
  className,
}: ReasoningTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [internalSteps, setInternalSteps] = useState<ThoughtStep[]>([]);

  // Demo steps if no external steps provided
  const demoSteps: ThoughtStep[] = [
    { id: "1", text: "Analyzing cash flow patterns...", status: "pending" },
    {
      id: "2",
      text: "Identifying anomalies in spending data...",
      status: "pending",
    },
    { id: "3", text: "Calculating sector benchmarks...", status: "pending" },
    { id: "4", text: "Evaluating risk indicators...", status: "pending" },
    {
      id: "5",
      text: "Generating personalized recommendations...",
      status: "pending",
    },
  ];

  const steps = externalSteps || internalSteps;

  // Auto-progress demo if no external steps
  useEffect(() => {
    if (!isActive || externalSteps) return;

    setInternalSteps([]);
    let stepIndex = 0;

    const addStep = () => {
      if (stepIndex >= demoSteps.length) {
        onComplete?.();
        return;
      }

      // Add new step as processing
      setInternalSteps((prev) => [
        ...prev.map((s) => ({ ...s, status: "complete" as const })),
        { ...demoSteps[stepIndex], status: "processing" as const },
      ]);

      stepIndex++;
      setTimeout(addStep, 1200 + Math.random() * 800);
    };

    setTimeout(addStep, 500);
  }, [isActive, externalSteps]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  if (!isActive && steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-[#2D2420]/95 backdrop-blur-xl
        border border-[#5D4538]/30
        shadow-2xl
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#5D4538]/20">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-[#A89F91] text-sm font-mono">
          <Terminal className="w-4 h-4" />
          <span>AI Analysis in Progress</span>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-4 h-4 text-[#8C705F] animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="p-5 max-h-[300px] overflow-y-auto font-mono text-sm space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {step.status === "complete" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-green-400" />
                  </motion.div>
                ) : step.status === "processing" ? (
                  <Loader2 className="w-4 h-4 text-[#8C705F] animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5D4538]/50" />
                )}
              </div>

              {/* Text */}
              <span
                className={`
                  transition-colors duration-300
                  ${
                    step.status === "complete"
                      ? "text-[#A89F91]"
                      : step.status === "processing"
                        ? "text-[#D6CFC7]"
                        : "text-[#6B5D54]"
                  }
                `}
              >
                ▸ {step.text}
              </span>

              {/* Pulse dot for processing */}
              {step.status === "processing" && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-2 h-2 rounded-full bg-[#8C705F] animate-pulse-dot"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2D2420] to-transparent pointer-events-none" />
    </motion.div>
  );
}

// Demo wrapper component
export function ReasoningTerminalDemo() {
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => {
    setIsActive(true);
    setShowResults(false);
  };

  const handleComplete = () => {
    setTimeout(() => {
      setIsActive(false);
      setShowResults(true);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleStart}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Start AI Analysis
      </button>

      <AnimatePresence mode="wait">
        {isActive && (
          <ReasoningTerminal isActive={isActive} onComplete={handleComplete} />
        )}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-lg font-semibold mb-2">
              ✨ Analysis Complete!
            </h3>
            <p className="text-muted-foreground">
              Your personalized insights are ready.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
