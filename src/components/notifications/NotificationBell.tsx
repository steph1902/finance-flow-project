"use client"

import { useEffect, useRef } from "react"
import { BellIcon, CheckIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/useNotifications"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isMarking } = useNotifications()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play notification sound when new notification arrives
  useEffect(() => {
    if (unreadCount > 0 && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }, [unreadCount])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BUDGET_ALERT':
        return '💰'
      case 'BILL_REMINDER':
        return '🔔'
      case 'GOAL_MILESTONE':
        return '🎯'
      case 'GOAL_ACHIEVED':
        return '🏆'
      case 'SHARED_BUDGET_INVITE':
        return '👥'
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢'
      default:
        return '📬'
    }
  }

  return (
    <>
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-2">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={isMarking}
                className="text-xs"
              >
                <CheckIcon className="size-3" />
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BellIcon className="size-12 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification: NotificationData) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-2 p-3 cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-2xl shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm leading-tight">
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notification.read && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-6 -mr-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <XIcon className="size-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Link href="/notifications" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
