"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Shield,
  Database,
  Download,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    recurringReminders: true,
  });

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect if not authenticated
  if (!session) {
    router.push('/login');
    return null;
  }

  const handleExportData = async () => {
    try {
      toast.info("Preparing your data export...");

      const response = await fetch("/api/export/data");

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financeflow-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch {
      toast.error("Failed to export data. Please try again later.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) return;

    // Second confirmation for extra safety
    const doubleConfirmed = confirm(
      "This is your last chance. Type 'DELETE' in the next prompt to confirm."
    );

    if (!doubleConfirmed) return;

    const userInput = prompt('Please type "DELETE" to confirm account deletion:');

    if (userInput !== "DELETE") {
      toast.error("Account deletion cancelled - confirmation text did not match");
      return;
    }

    try {
      toast.loading("Deleting account...");

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      toast.success("Account deleted successfully");

      // Redirect to home page after brief delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch {
      toast.error("Failed to delete account. Please contact support.");
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="type-h2">Settings</h1>
        <p className="type-body text-muted-foreground max-w-2xl">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="shadow-card border-border/30 rounded-xl transition-shadow hover:shadow-mist">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 type-h3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Profile
          </CardTitle>
          <CardDescription className="type-body">
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="font-medium">Name</Label>
            <p className="type-small text-muted-foreground">
              {session?.user?.name || "Not set"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <p className="type-small text-muted-foreground">
              {session?.user?.email || "Not set"}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/profile")} className="font-medium shadow-soft">
            Edit Profile
          </Button>
        </CardContent>
      </Card>



      {/* Notifications Section */}
      <Card className="shadow-card border-border/30 rounded-xl transition-shadow hover:shadow-mist">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 type-h3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            Notifications
          </CardTitle>
          <CardDescription className="type-body">
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="font-medium">Email Notifications</Label>
              <p className="type-small text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Button
              variant={notifications.email ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className="font-medium shadow-soft"
            >
              {notifications.email ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 font-medium">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="type-small text-muted-foreground">
                Receive push notifications on your device
              </p>
            </div>
            <Button
              variant={notifications.push ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
              className="font-medium shadow-soft"
            >
              {notifications.push ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="font-medium">Budget Alerts</Label>
              <p className="type-small text-muted-foreground">
                Get notified when approaching budget limits
              </p>
            </div>
            <Button
              variant={notifications.budgetAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, budgetAlerts: !prev.budgetAlerts }))}
              className="font-medium shadow-soft"
            >
              {notifications.budgetAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="font-medium">Recurring Transaction Reminders</Label>
              <p className="type-small text-muted-foreground">
                Reminders for upcoming recurring transactions
              </p>
            </div>
            <Button
              variant={notifications.recurringReminders ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(prev => ({ ...prev, recurringReminders: !prev.recurringReminders }))}
              className="font-medium shadow-soft"
            >
              {notifications.recurringReminders ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="shadow-card border-border/30 rounded-xl transition-shadow hover:shadow-mist">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 type-h3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            Security
          </CardTitle>
          <CardDescription className="type-body">
            Manage your password and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Shield className="h-4 w-4" />
              Password
            </Label>
            <p className="type-small text-muted-foreground">
              Last changed: Never
            </p>
          </div>
          <Button variant="outline" className="font-medium shadow-soft">Change Password</Button>
        </CardContent>
      </Card>

      {/* Data & Privacy Section */}
      <Card className="shadow-card border-border/30 rounded-xl transition-shadow hover:shadow-mist">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 type-h3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            Data & Privacy
          </CardTitle>
          <CardDescription className="type-body">
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium">
              <Download className="h-4 w-4" />
              Export Your Data
            </Label>
            <p className="type-small text-muted-foreground">
              Download all your transactions, budgets, and account data
            </p>
            <Button variant="outline" onClick={handleExportData} className="font-medium shadow-soft">
              Export Data
            </Button>
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Label>
            <p className="type-small text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} className="font-medium shadow-sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region Section */}
      <Card className="shadow-card border-border/30 rounded-xl transition-shadow hover:shadow-mist">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 type-h3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            Language & Region
          </CardTitle>
          <CardDescription className="type-body">
            Customize language and regional preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="font-medium">Language</Label>
            <p className="type-small text-muted-foreground">English (US)</p>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Currency</Label>
            <p className="type-small text-muted-foreground">USD ($)</p>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Date Format</Label>
            <p className="type-small text-muted-foreground">MM/DD/YYYY</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
