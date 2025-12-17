"use client"

import { useState } from "react"
import { GoalCard } from "./GoalCard"
import { AddContributionDialog } from "./AddContributionDialog"
import { useGoals } from "@/hooks/useGoals"

interface Goal {
  id: string
  name: string
  description: string | null
  targetAmount: number
  currentAmount: number
  targetDate: Date | null
  category: string
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED"
  priority: number
  createdAt: Date
}

interface GoalListProps {
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED"
}

export function GoalList({ status }: GoalListProps) {
  const { goals, loading, updateGoal, deleteGoal } = useGoals(status)
  const [contributionDialog, setContributionDialog] = useState<{
    open: boolean
    goalId: string
    goalName: string
  }>({
    open: false,
    goalId: "",
    goalName: "",
  })

  const handleAddContribution = (goalId: string, goalName: string) => {
    setContributionDialog({
      open: true,
      goalId,
      goalName,
    })
  }

  const handlePause = async (goalId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED"
    await updateGoal(goalId, { status: newStatus })
  }

  const handleDelete = async (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(goalId)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="size-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first financial goal to start tracking your progress.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal: Goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onAddContribution={() =>
              handleAddContribution(goal.id, goal.name)
            }
            onPause={() => handlePause(goal.id, goal.status)}
            onDelete={() => handleDelete(goal.id)}
          />
        ))}
      </div>

      <AddContributionDialog
        goalId={contributionDialog.goalId}
        goalName={contributionDialog.goalName}
        open={contributionDialog.open}
        onOpenChange={(open) =>
          setContributionDialog({ ...contributionDialog, open })
        }
      />
    </>
  )
}
