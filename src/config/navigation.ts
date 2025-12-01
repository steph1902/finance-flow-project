import {
  Home,
  DollarSign,
  Wallet,
  Settings,
  MessageSquare,
  Repeat,
  Target,
  ArrowLeftRightIcon,
  Coins,
  FileText,
  Activity,
  GitBranch,
  ScrollText,
  MessageCircle,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transactions", icon: DollarSign },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/import-export", label: "Import/Export", icon: ArrowLeftRightIcon },
  { href: "/currency", label: "Currency", icon: Coins },
  { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },

  // New Admin Modules
  { href: "/dashboard/logs", label: "System Logs", icon: ScrollText },
  { href: "/dashboard/system-health", label: "System Health", icon: Activity },
  { href: "/dashboard/versioning", label: "Versioning", icon: GitBranch },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageCircle },

  { href: "/settings", label: "Settings", icon: Settings },
] as const;
