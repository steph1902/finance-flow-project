import { Metadata } from "next"
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog"
import { GoalList } from "@/components/goals/GoalList"

export const metadata: Metadata = {
  title: "Goals | FinanceFlow",
  description: "Track your financial goals and progress",
}

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">
            Set and track your financial goals
          </p>
        </div>
        <CreateGoalDialog />
      </div>

      {/* Goals Grid */}
      <GoalList status="ACTIVE" />

      {/* Completed Goals Section (Optional) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
        <GoalList status="COMPLETED" />
      </div>
    </div>
  )
}
