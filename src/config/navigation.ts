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
  Sparkles,
  TestTube,
  Zap,
  Database,
  BookOpen,
  PartyPopper,
  Code,
  type LucideIcon,
  Rocket,
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
    items: [{ href: "/dashboard", label: "Dashboard", icon: Home }],
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
    ],
  },
  // Data & Insights
  {
    title: "INSIGHTS",
    items: [
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
      {
        href: "/import-export",
        label: "Import/Export",
        icon: ArrowLeftRightIcon,
      },
    ],
  },
  // Admin & System
  {
    title: "ADMIN",
    items: [
      { href: "/dashboard/insights", label: "Big 4 Insights", icon: Sparkles },
      { href: "/admin/experiments", label: "Experiments", icon: TestTube },
      { href: "/admin/ai-quality", label: "AI Quality", icon: Zap },
      { href: "/admin/demo-data", label: "Demo Data", icon: Database },
      { href: "/dashboard/logs", label: "System Logs", icon: ScrollText },
      {
        href: "/dashboard/system-health",
        label: "System Health",
        icon: Activity,
      },
      { href: "/dashboard/versioning", label: "Versioning", icon: GitBranch },
      { href: "/ai-docs", label: "Documentation", icon: FileText },
      { href: "/api-docs", label: "API Docs", icon: Code },
    ],
  },
] as const;

// Footer navigation (sticky bottom)
export const NAV_FOOTER: readonly NavItem[] = [
  { href: "/how-to-use", label: "How to Use", icon: BookOpen },
  { href: "/whats-new", label: "What's New", icon: Rocket },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageCircle },
] as const;

// Legacy flat list for backwards compatibility (if needed)
export const NAV_ITEMS: readonly NavItem[] = [
  ...NAV_SECTIONS.flatMap((section) => section.items),
  ...NAV_FOOTER,
] as const;
