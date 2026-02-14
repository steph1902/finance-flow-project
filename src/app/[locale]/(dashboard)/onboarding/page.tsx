"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import {
  ProfileStep,
  type ProfileData,
} from "@/components/onboarding/ProfileStep";
import {
  BudgetSetupStep,
  type BudgetData,
} from "@/components/onboarding/BudgetSetupStep";
import {
  GoalSetupStep,
  type GoalData,
} from "@/components/onboarding/GoalSetupStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type OnboardingStep =
  | "welcome"
  | "profile"
  | "budgets"
  | "goals"
  | "completion";

interface OnboardingData {
  profile?: ProfileData;
  budgets: BudgetData[];
  goal?: GoalData | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    budgets: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: OnboardingStep[] = [
    "welcome",
    "profile",
    "budgets",
    "goals",
    "completion",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProfileNext = (data: ProfileData) => {
    setOnboardingData({ ...onboardingData, profile: data });
    setCurrentStep("budgets");
  };

  const handleBudgetsNext = (data: BudgetData[]) => {
    setOnboardingData({ ...onboardingData, budgets: data });
    setCurrentStep("goals");
  };

  const handleGoalsNext = (data: GoalData | null) => {
    setOnboardingData({ ...onboardingData, goal: data });
    setCurrentStep("completion");
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Update user profile
      if (onboardingData.profile) {
        await fetch("/api/account/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: onboardingData.profile.name,
            preferredCurrency: onboardingData.profile.currency,
            timezone: onboardingData.profile.timezone,
            language: onboardingData.profile.language,
          }),
        });
      }

      // Create budgets
      if (onboardingData.budgets.length > 0) {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        await Promise.all(
          onboardingData.budgets.map((budget) =>
            fetch("/api/budgets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                category: budget.category,
                amount: budget.amount,
                month,
                year,
              }),
            }),
          ),
        );
      }

      // Create goal
      if (onboardingData.goal) {
        await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: onboardingData.goal.name,
            targetAmount: onboardingData.goal.targetAmount,
            targetDate: new Date(onboardingData.goal.targetDate),
            description: onboardingData.goal.description,
          }),
        });
      }

      // Mark onboarding as complete
      await fetch("/api/account/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      toast.success("Welcome to FinanceFlow! 🎉");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {currentStep !== "welcome" && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        {currentStep === "welcome" && (
          <WelcomeStep onNext={() => setCurrentStep("profile")} />
        )}

        {currentStep === "profile" && onboardingData.profile !== undefined && (
          <ProfileStep
            onNext={handleProfileNext}
            onBack={() => setCurrentStep("welcome")}
            initialData={onboardingData.profile}
          />
        )}

        {currentStep === "profile" && onboardingData.profile === undefined && (
          <ProfileStep
            onNext={handleProfileNext}
            onBack={() => setCurrentStep("welcome")}
          />
        )}

        {currentStep === "budgets" && (
          <BudgetSetupStep
            onNext={handleBudgetsNext}
            onBack={() => setCurrentStep("profile")}
            initialData={onboardingData.budgets}
          />
        )}

        {currentStep === "goals" &&
          onboardingData.goal !== undefined &&
          onboardingData.goal !== null && (
            <GoalSetupStep
              onNext={handleGoalsNext}
              onBack={() => setCurrentStep("budgets")}
              initialData={onboardingData.goal}
            />
          )}

        {currentStep === "goals" &&
          (onboardingData.goal === undefined ||
            onboardingData.goal === null) && (
            <GoalSetupStep
              onNext={handleGoalsNext}
              onBack={() => setCurrentStep("budgets")}
            />
          )}

        {currentStep === "completion" && (
          <CompletionStep
            onComplete={handleComplete}
            summary={{
              budgetCount: onboardingData.budgets.length,
              hasGoal: !!onboardingData.goal,
              totalBudget: onboardingData.budgets.reduce(
                (sum, b) => sum + b.amount,
                0,
              ),
            }}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Setting up your account...</p>
          </div>
        </div>
      )}
    </div>
  );
}
