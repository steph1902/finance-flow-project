"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MousePointer,
  Globe,
  Activity,
  LogOut,
  TrendingUp,
  ArrowRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";

interface AnalyticsData {
  summary: {
    totalEvents: number;
    uniqueSessions: number;
    loginCount: number;
  };
  eventsByType: Array<{ type: string; count: number }>;
  eventsByCountry: Array<{ country: string; count: number }>;
  recentEvents: Array<{
    id: string;
    timestamp: string;
    eventType: string;
    eventName: string;
    page: string;
    country: string;
    city: string;
  }>;
  sessions: Array<{
    sessionId: string;
    timestamp: string;
    country: string;
    city: string;
    userAgent: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to load analytics");
      }

      const analytics = await res.json();
      setData(analytics);
    } catch (error) {
      toast.error("Failed to load analytics");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  };

  const handleSeedDatabase = async () => {
    const password = prompt(
      "Enter admin password to seed production database:",
    );
    if (!password) return;

    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Seeding failed");
      }

      toast.success(
        `Database seeded! ${result.stats.transactions} transactions added`,
      );
      // Reload analytics to show new data
      await loadAnalytics();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to seed database",
      );
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Analytics Data Yet</CardTitle>
            <CardDescription>
              Demo account hasn't been used yet. Login with the demo account to
              generate analytics data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p className="font-medium">Demo Account Credentials:</p>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-xs">Email: demo@financeflow.com</p>
                <p className="text-xs">Password: demo123</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/login")} className="flex-1">
                Go to Login
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demo Account Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track how visitors interact with your portfolio project
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={handleSeedDatabase}
              disabled={seeding}
            >
              {seeding ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-3xl">
                {data.summary.totalEvents}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity className="h-4 w-4 mr-2" />
                All tracked actions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Demo Logins</CardDescription>
              <CardTitle className="text-3xl">
                {data.summary.loginCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                Unique sessions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Sessions</CardDescription>
              <CardTitle className="text-3xl">
                {data.summary.uniqueSessions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <MousePointer className="h-4 w-4 mr-2" />
                Total sessions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Countries</CardDescription>
              <CardTitle className="text-3xl">
                {data.eventsByCountry?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                Geographic reach
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>
              Most popular actions in demo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!data.eventsByType || data.eventsByType.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events tracked yet
                </p>
              ) : (
                data.eventsByType.slice(0, 10).map((event) => (
                  <div
                    key={event.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium capitalize">
                        {event.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {event.count} times
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${(event.count / data.summary.totalEvents) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Where demo users are from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!data.eventsByCountry || data.eventsByCountry.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No location data yet
                  </p>
                ) : (
                  data.eventsByCountry.map((location) => (
                    <div key={location.country} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{location.country}</span>
                        <span className="text-muted-foreground">
                          {location.count} events
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{
                            width: `${(location.count / data.summary.totalEvents) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Latest demo account logins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!data.sessions || data.sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sessions yet
                  </p>
                ) : (
                  data.sessions.slice(0, 5).map((session) => (
                    <div
                      key={session.sessionId}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">
                            {session.city}, {session.country}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.userAgent}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest demo account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {!data.recentEvents || data.recentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet</p>
              ) : (
                data.recentEvents.slice(0, 15).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.eventName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.page} • {event.city}, {event.country}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
