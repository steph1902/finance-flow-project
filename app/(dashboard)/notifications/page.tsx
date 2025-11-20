"use client"

import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, TrashIcon, SettingsIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { NotificationSettings } from "@/components/notifications/NotificationSettings"

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, isMarking } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');

  const unreadNotifications = notifications.filter((n: NotificationData) => !n.read);
  const displayedNotifications = activeTab === 'unread' ? unreadNotifications : notifications;

  type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BUDGET_ALERT':
        return '💰';
      case 'BILL_REMINDER':
        return '🔔';
      case 'GOAL_MILESTONE':
        return '🎯';
      case 'GOAL_ACHIEVED':
        return '🏆';
      case 'SHARED_BUDGET_INVITE':
        return '👥';
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢';
      default:
        return '📬';
    }
  };

  const getNotificationBadgeColor = (type: string): BadgeVariant => {
    switch (type) {
      case 'BUDGET_ALERT':
        return 'destructive';
      case 'BILL_REMINDER':
        return 'default';
      case 'GOAL_MILESTONE':
      case 'GOAL_ACHIEVED':
        return 'default';
      case 'SHARED_BUDGET_INVITE':
        return 'secondary';
      case 'SYSTEM_ANNOUNCEMENT':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your financial activities
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread' | 'settings')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="size-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {activeTab !== 'settings' && unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={isMarking}
            >
              <CheckIcon className="size-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        <TabsContent value="all" className="space-y-4">
          {displayedNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  When you receive notifications, they will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {displayedNotifications.map((notification: NotificationData) => (
                <Card
                  key={notification.id}
                  className={`transition-colors ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-3xl shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <CardTitle className="text-base leading-tight">
                              {notification.title}
                            </CardTitle>
                            {!notification.read && (
                              <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                            )}
                          </div>
                          <Badge
                            variant={getNotificationBadgeColor(notification.type)}
                            className="text-xs"
                          >
                            {notification.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            disabled={isMarking}
                          >
                            <CheckIcon className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">
                      {notification.message}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {notification.actionUrl && (
                        <Button asChild variant="link" size="sm" className="h-auto p-0">
                          <Link href={notification.actionUrl}>View Details →</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  You&apos;ve read all your notifications
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unreadNotifications.map((notification: NotificationData) => (
                <Card
                  key={notification.id}
                  className="bg-primary/5 border-primary/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-3xl shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <CardTitle className="text-base leading-tight">
                              {notification.title}
                            </CardTitle>
                            <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                          </div>
                          <Badge
                            variant={getNotificationBadgeColor(notification.type)}
                            className="text-xs"
                          >
                            {notification.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          disabled={isMarking}
                        >
                          <CheckIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">
                      {notification.message}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {notification.actionUrl && (
                        <Button asChild variant="link" size="sm" className="h-auto p-0">
                          <Link href={notification.actionUrl}>View Details →</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
