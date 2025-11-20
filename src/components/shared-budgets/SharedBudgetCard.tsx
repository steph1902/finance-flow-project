"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UsersIcon, SettingsIcon } from "lucide-react"
import { type SharedBudget } from "@/hooks/useSharedBudgets"
import { formatCurrency } from "@/lib/formatters"

interface SharedBudgetCardProps {
  budget: SharedBudget;
  onManage?: (budget: SharedBudget) => void;
}

const ROLE_COLORS = {
  OWNER: 'default',
  EDITOR: 'secondary',
  VIEWER: 'outline',
} as const;

export function SharedBudgetCard({ budget, onManage }: SharedBudgetCardProps) {
  const memberCount = budget._count?.members || budget.members.length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{budget.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{budget.category}</p>
          </div>
          <Badge variant="outline">{budget.period}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold">{formatCurrency(budget.limit)}</div>
          <p className="text-xs text-muted-foreground">Budget limit</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UsersIcon className="size-4" />
          <span>{memberCount} member{memberCount === 1 ? '' : 's'}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {budget.members.slice(0, 3).map((member) => (
            <div key={member.id} className="flex items-center gap-1">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {member.user.name?.charAt(0) || member.user.email.charAt(0)}
              </div>
              <Badge variant={ROLE_COLORS[member.role]} className="text-xs">
                {member.role}
              </Badge>
            </div>
          ))}
          {memberCount > 3 && (
            <span className="text-xs text-muted-foreground">
              +{memberCount - 3} more
            </span>
          )}
        </div>

        {onManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManage(budget)}
            className="w-full"
          >
            <SettingsIcon className="size-3 mr-1" />
            Manage
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
