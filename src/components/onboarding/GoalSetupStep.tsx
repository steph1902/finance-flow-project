"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TargetIcon } from "lucide-react"

interface GoalSetupStepProps {
  onNext: (data: GoalData | null) => void;
  onBack: () => void;
  initialData?: GoalData;
}

export interface GoalData {
  name: string;
  targetAmount: number;
  targetDate: string;
  description?: string;
}

export function GoalSetupStep({ onNext, onBack, initialData }: GoalSetupStepProps) {
  const [skipGoal, setSkipGoal] = useState(false);
  const [formData, setFormData] = useState<GoalData>(
    initialData || {
      name: '',
      targetAmount: 0,
      targetDate: '',
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skipGoal) {
      onNext(null);
    } else if (formData.name.trim() && formData.targetAmount > 0 && formData.targetDate) {
      onNext(formData);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TargetIcon className="size-6 text-primary" />
          </div>
          <div>
            <CardTitle>Set Your First Goal</CardTitle>
            <CardDescription>
              What financial goal would you like to achieve? (optional)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!skipGoal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name *</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!skipGoal}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="target-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="5000.00"
                    className="pl-7"
                    value={formData.targetAmount || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })
                    }
                    required={!skipGoal}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date *</Label>
                <Input
                  id="target-date"
                  type="date"
                  min={minDate}
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required={!skipGoal}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Why is this goal important to you?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">💡 Goal Examples</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Emergency fund: 6 months of expenses</li>
              <li>• Vacation: $3,000 by next summer</li>
              <li>• Down payment: $20,000 for a house</li>
              <li>• Debt payoff: Clear credit card in 12 months</li>
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="skip-goal"
              checked={skipGoal}
              onChange={(e) => setSkipGoal(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="skip-goal" className="text-sm font-normal cursor-pointer">
              Skip for now (I&apos;ll set goals later)
            </Label>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              {skipGoal ? 'Skip' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
