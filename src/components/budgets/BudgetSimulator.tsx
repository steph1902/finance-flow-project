"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, TrendingDownIcon, TargetIcon, AlertCircleIcon } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface BudgetCategory {
  name: string;
  current: number;
  min: number;
  max: number;
}

const INITIAL_CATEGORIES: BudgetCategory[] = [
  { name: 'Food & Dining', current: 600, min: 200, max: 1200 },
  { name: 'Transportation', current: 300, min: 100, max: 800 },
  { name: 'Shopping', current: 400, min: 100, max: 1000 },
  { name: 'Entertainment', current: 200, min: 50, max: 500 },
  { name: 'Bills & Utilities', current: 500, min: 300, max: 800 },
]

export function BudgetSimulator() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [monthlyIncome] = useState(5000)

  const totalBudget = categories.reduce((sum, cat) => sum + cat.current, 0)
  const remaining = monthlyIncome - totalBudget
  const savingsRate = (remaining / monthlyIncome) * 100

  const updateCategory = (index: number, value: number) => {
    const newCategories = [...categories]
    newCategories[index].current = value
    setCategories(newCategories)
  }

  const chartData = categories.map(cat => ({
    name: cat.name.split(' ')[0],
    amount: cat.current,
  }))

  const getRecommendations = () => {
    const recommendations = []

    // High spending warning
    categories.forEach(cat => {
      if (cat.current > cat.max * 0.8) {
        recommendations.push({
          type: 'warning' as const,
          category: cat.name,
          message: `${cat.name} budget is near maximum limit`,
        })
      }
    })

    // Savings recommendation
    if (savingsRate < 20) {
      recommendations.push({
        type: 'warning' as const,
        category: 'Savings',
        message: 'Try to save at least 20% of your income',
      })
    } else if (savingsRate >= 30) {
      recommendations.push({
        type: 'success' as const,
        category: 'Savings',
        message: 'Great job! You\'re saving over 30% of your income',
      })
    }

    // Balanced budget
    if (remaining >= 0 && savingsRate >= 20) {
      recommendations.push({
        type: 'success' as const,
        category: 'Overall',
        message: 'Your budget is well-balanced',
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Simulator</CardTitle>
          <CardDescription>
            Adjust budget allocations to see the impact on your savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Monthly Income</div>
              <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Total Budget</div>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            </div>
            <div className={`p-4 rounded-lg border ${remaining < 0 ? 'border-destructive' : 'border-green-500'}`}>
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {formatCurrency(Math.abs(remaining))}
                {remaining >= 0 ? (
                  <TrendingUpIcon className="size-5 text-green-500" />
                ) : (
                  <TrendingDownIcon className="size-5 text-destructive" />
                )}
              </div>
            </div>
          </div>

          {/* Savings Rate */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TargetIcon className="size-5" />
                <span className="font-medium">Savings Rate</span>
              </div>
              <Badge variant={savingsRate >= 20 ? 'default' : 'destructive'}>
                {savingsRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  savingsRate >= 20 ? 'bg-green-500' : 'bg-destructive'
                }`}
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Category Sliders */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{category.name}</Label>
                  <span className="text-sm font-medium">
                    {formatCurrency(category.current)}
                  </span>
                </div>
                <Slider
                  value={[category.current]}
                  onValueChange={([value]) => updateCategory(index, value)}
                  min={category.min}
                  max={category.max}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(category.min)}</span>
                  <span>{formatCurrency(category.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircleIcon className="size-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                rec.type === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
              }`}
            >
              <div className="font-medium text-sm">{rec.category}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {rec.message}
              </div>
            </div>
          ))}
          {recommendations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Adjust your budget to see recommendations
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
