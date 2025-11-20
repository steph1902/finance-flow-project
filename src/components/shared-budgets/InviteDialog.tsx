"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MailIcon, UserPlusIcon } from "lucide-react"
import { inviteToSharedBudget } from "@/hooks/useSharedBudgets"
import { toast } from "sonner"
import { mutate } from "swr"

interface InviteDialogProps {
  budgetId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteDialog({ budgetId, isOpen, onClose }: InviteDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER')
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setIsInviting(true)
    try {
      await inviteToSharedBudget(budgetId, email, role)
      toast.success("User invited successfully!")
      mutate(`/api/shared-budgets/${budgetId}`)
      mutate('/api/shared-budgets')
      setEmail("")
      setRole('VIEWER')
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to invite user'
      toast.error(message)
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlusIcon className="size-5" />
            Invite to Budget
          </DialogTitle>
          <DialogDescription>
            Invite someone to collaborate on this budget
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="flex items-center gap-2">
              <MailIcon className="size-4" />
              Email Address
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'EDITOR' | 'VIEWER')}>
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer - Can only view</SelectItem>
                <SelectItem value="EDITOR">Editor - Can view and edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md bg-muted p-3 text-sm space-y-1">
            <p className="font-medium">Permissions:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Viewer:</strong> Can see budget and transactions</li>
              <li><strong>Editor:</strong> Can add transactions and edit budget</li>
              <li><strong>Owner:</strong> Full control including deleting</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isInviting || !email}>
            {isInviting ? "Inviting..." : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
