"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BellIcon, MailIcon } from "lucide-react"

interface NotificationPreferences {
  budgetAlerts: boolean;
  budgetAlertsEmail: boolean;
  billReminders: boolean;
  billRemindersEmail: boolean;
  goalMilestones: boolean;
  goalMilestonesEmail: boolean;
  goalAchieved: boolean;
  goalAchievedEmail: boolean;
  sharedBudgetInvites: boolean;
  sharedBudgetInvitesEmail: boolean;
  systemAnnouncements: boolean;
  systemAnnouncementsEmail: boolean;
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    budgetAlerts: true,
    budgetAlertsEmail: true,
    billReminders: true,
    billRemindersEmail: true,
    goalMilestones: true,
    goalMilestonesEmail: false,
    goalAchieved: true,
    goalAchievedEmail: true,
    sharedBudgetInvites: true,
    sharedBudgetInvitesEmail: true,
    systemAnnouncements: true,
    systemAnnouncementsEmail: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/account/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="size-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how and when you want to be notified
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Alerts */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Budget Alerts</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="budget-alerts"
                checked={preferences.budgetAlerts}
                onCheckedChange={() => handleToggle('budgetAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="budget-alerts-email"
                checked={preferences.budgetAlertsEmail}
                onCheckedChange={() => handleToggle('budgetAlertsEmail')}
              />
            </div>
          </div>
        </div>

        {/* Bill Reminders */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Bill Reminders</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="bill-reminders" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="bill-reminders"
                checked={preferences.billReminders}
                onCheckedChange={() => handleToggle('billReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bill-reminders-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="bill-reminders-email"
                checked={preferences.billRemindersEmail}
                onCheckedChange={() => handleToggle('billRemindersEmail')}
              />
            </div>
          </div>
        </div>

        {/* Goal Milestones */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Goal Milestones</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="goal-milestones" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="goal-milestones"
                checked={preferences.goalMilestones}
                onCheckedChange={() => handleToggle('goalMilestones')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="goal-milestones-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="goal-milestones-email"
                checked={preferences.goalMilestonesEmail}
                onCheckedChange={() => handleToggle('goalMilestonesEmail')}
              />
            </div>
          </div>
        </div>

        {/* Goal Achieved */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Goal Achieved</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="goal-achieved" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="goal-achieved"
                checked={preferences.goalAchieved}
                onCheckedChange={() => handleToggle('goalAchieved')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="goal-achieved-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="goal-achieved-email"
                checked={preferences.goalAchievedEmail}
                onCheckedChange={() => handleToggle('goalAchievedEmail')}
              />
            </div>
          </div>
        </div>

        {/* Shared Budget Invites */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Shared Budget Invites</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="shared-budget-invites" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="shared-budget-invites"
                checked={preferences.sharedBudgetInvites}
                onCheckedChange={() => handleToggle('sharedBudgetInvites')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shared-budget-invites-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="shared-budget-invites-email"
                checked={preferences.sharedBudgetInvitesEmail}
                onCheckedChange={() => handleToggle('sharedBudgetInvitesEmail')}
              />
            </div>
          </div>
        </div>

        {/* System Announcements */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">System Announcements</h4>
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-announcements" className="flex items-center gap-2">
                <BellIcon className="size-4" />
                In-app notifications
              </Label>
              <Switch
                id="system-announcements"
                checked={preferences.systemAnnouncements}
                onCheckedChange={() => handleToggle('systemAnnouncements')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-announcements-email" className="flex items-center gap-2">
                <MailIcon className="size-4" />
                Email notifications
              </Label>
              <Switch
                id="system-announcements-email"
                checked={preferences.systemAnnouncementsEmail}
                onCheckedChange={() => handleToggle('systemAnnouncementsEmail')}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
