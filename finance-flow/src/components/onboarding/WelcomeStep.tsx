"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon, TrendingUpIcon, TargetIcon, BellIcon } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to FinanceFlow! 🎉</h1>
        <p className="text-lg text-muted-foreground">
          Let&apos;s get you set up in just a few minutes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUpIcon className="size-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Track Expenses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Automatically categorize and track all your transactions with AI-powered insights
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TargetIcon className="size-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Set Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create financial goals and track your progress with visual milestones
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RocketIcon className="size-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Budget Smart</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Set budgets by category and get alerts when you&apos;re approaching limits
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BellIcon className="size-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Stay Informed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Receive smart notifications about spending patterns and upcoming bills
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button size="lg" onClick={onNext}>
          Get Started
        </Button>
      </div>
    </div>
  )
}
