import { Home, DollarSign, Wallet, Settings, MessageSquare, Repeat, Target, ArrowLeftRightIcon, Coins, type LucideIcon } from "lucide-react";

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
  { href: "/import-export", label: "Import/Export", icon: ArrowLeftRightIcon },
  { href: "/currency", label: "Currency", icon: Coins },
  { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
