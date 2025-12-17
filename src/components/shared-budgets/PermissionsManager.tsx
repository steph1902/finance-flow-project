"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldIcon, CrownIcon, Edit2Icon, EyeIcon } from "lucide-react"
import { type BudgetPermission } from "@/hooks/useSharedBudgets"
import { updateMemberPermissions } from "@/hooks/useSharedBudgets"
import { toast } from "sonner"
import { mutate } from "swr"
import { useState } from "react"

interface PermissionsManagerProps {
  budgetId: string;
  members: BudgetPermission[];
  currentUserId: string;
  isOwner: boolean;
}

const ROLE_ICONS = {
  ADMIN: CrownIcon,
  CONTRIBUTOR: Edit2Icon,
  VIEWER: EyeIcon,
}

const ROLE_COLORS = {
  ADMIN: 'default',
  CONTRIBUTOR: 'secondary',
  VIEWER: 'outline',
} as const;

export function PermissionsManager({ budgetId, members, currentUserId, isOwner }: PermissionsManagerProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleRoleChange = async (memberId: string, newRole: 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER') => {
    setUpdating(memberId)
    try {
      await updateMemberPermissions(budgetId, memberId, newRole)
      toast.success("Permissions updated")
      mutate(`/api/shared-budgets/${budgetId}`)
      mutate('/api/shared-budgets')
    } catch (error) {
      console.error("Failed to update permissions:", error)
      toast.error("Failed to update permissions")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldIcon className="size-5" />
          Members & Permissions
        </CardTitle>
        <CardDescription>
          Manage who can access and edit this budget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => {
          const RoleIcon = ROLE_ICONS[member.role]
          const isCurrentUser = member.userId === currentUserId
          const canEdit = isOwner && !isCurrentUser

          return (
            <div
              key={member.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">
                    {member.user.name || member.user.email}
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground ml-2">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              {canEdit ? (
                <Select
                  value={member.role}
                  onValueChange={(value) => handleRoleChange(member.id, value as typeof member.role)}
                  disabled={updating === member.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={ROLE_COLORS[member.role]} className="flex items-center gap-1">
                  <RoleIcon className="size-3" />
                  {member.role}
                </Badge>
              )}
            </div>
          )
        })}

        {members.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No members yet. Invite someone to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
