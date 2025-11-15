"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe,
  Smartphone,
  Mail,
  Shield,
  Database,
  Download,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    recurringReminders: true,
  });

  const handleExportData = async () => {
    try {
      toast.info("Preparing your data export...");
      // TODO: Implement data export functionality
      setTimeout(() => {
        toast.success("Data export ready for download!");
      }, 2000);
    } catch {
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
    );
    
    if (confirmed) {
      toast.error("Account deletion is not yet implemented");
      // TODO: Implement account deletion
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">
              User Name
            </p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <p className="text-sm text-muted-foreground">
              user@example.com
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how FinanceFlow looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
                {theme === "light" && <Check className="h-4 w-4 text-primary" />}
              </button>
              
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
                {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
              </button>
              
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "system"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-sm font-medium">System</span>
                {theme === "system" && <Check className="h-4 w-4 text-primary" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {theme === "system" 
                ? "Automatically switches between light and dark mode based on your system preferences" 
                : theme === "dark"
                ? "Dark mode reduces eye strain in low-light environments"
                : "Light mode provides better readability in bright environments"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Button
              variant={notifications.email ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
            >
              {notifications.email ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device
              </p>
            </div>
            <Button
              variant={notifications.push ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
            >
              {notifications.push ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when approaching budget limits
              </p>
            </div>
            <Button
              variant={notifications.budgetAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, budgetAlerts: !prev.budgetAlerts }))}
            >
              {notifications.budgetAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recurring Transaction Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for upcoming recurring transactions
              </p>
            </div>
            <Button
              variant={notifications.recurringReminders ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, recurringReminders: !prev.recurringReminders }))}
            >
              {notifications.recurringReminders ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Password
            </Label>
            <p className="text-sm text-muted-foreground">
              Last changed: Never
            </p>
          </div>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      {/* Data & Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Your Data
            </Label>
            <p className="text-sm text-muted-foreground">
              Download all your transactions, budgets, and account data
            </p>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Customize language and regional preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <p className="text-sm text-muted-foreground">English (US)</p>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <p className="text-sm text-muted-foreground">USD ($)</p>
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <p className="text-sm text-muted-foreground">MM/DD/YYYY</p>
          </div>
          <Button variant="outline" disabled>
            Change Settings (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
