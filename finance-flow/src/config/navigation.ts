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

export interface NavSection {
  title?: string; // Optional - no title for first section
  items: readonly NavItem[];
}

// Main navigation sections (scrollable area)
export const NAV_SECTIONS: readonly NavSection[] = [
  // Overview - No header for first section
  {
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
    ]
  },
  // Finance Management
  {
    title: "FINANCE",
    items: [
      { href: "/transactions", label: "Transactions", icon: DollarSign },
      { href: "/budgets", label: "Budgets", icon: Wallet },
      { href: "/goals", label: "Goals", icon: Target },
      { href: "/recurring", label: "Recurring", icon: Repeat },
      { href: "/currency", label: "Currency", icon: Coins },
    ]
  },
  // Data & Insights
  {
    title: "INSIGHTS",
    items: [
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
      { href: "/import-export", label: "Import/Export", icon: ArrowLeftRightIcon },
    ]
  },
  // System & Maintenance
  {
    title: "SYSTEM",
    items: [
      { href: "/dashboard/logs", label: "System Logs", icon: ScrollText },
      { href: "/dashboard/system-health", label: "System Health", icon: Activity },
      { href: "/dashboard/versioning", label: "Versioning", icon: GitBranch },
    ]
  },
] as const;

// Footer navigation (sticky bottom)
export const NAV_FOOTER: readonly NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageCircle },
] as const;

// Legacy flat list for backwards compatibility (if needed)
export const NAV_ITEMS: readonly NavItem[] = [
  ...NAV_SECTIONS.flatMap(section => section.items),
  ...NAV_FOOTER,
] as const;
