"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, NAV_FOOTER, type NavItem } from "@/config/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function NavigationSections({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
  return (
    <>
      {NAV_SECTIONS.map((section, sectionIndex) => (
        <div key={sectionIndex} className={section.title ? "mt-6" : ""}>
          {section.title && (
            <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </h3>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function NavigationFooter({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
  return (
    <div className="border-t border-border bg-card pt-4">
      <div className="space-y-1 px-4">
        {NAV_FOOTER.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-20 flex h-[60px] items-center justify-between border-b border-border bg-card px-4 lg:hidden shadow-sm transition-colors duration-300">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold group transition-colors">
          <Package2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-foreground font-serif">FinanceFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="lg:hidden transition-all hover:bg-accent active:scale-95"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full"
        )}
      >
        <div className="flex h-[60px] items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold group transition-colors">
            <Package2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-foreground font-serif">FinanceFlow</span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="px-4 text-sm font-medium" aria-label="Main navigation">
            <NavigationSections pathname={pathname} onItemClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </div>

        {/* Sticky Footer */}
        <NavigationFooter pathname={pathname} onItemClick={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border bg-card lg:flex shadow-sm transition-colors duration-300">
        <div className="flex h-[60px] items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold group transition-colors">
            <Package2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-foreground font-serif">FinanceFlow</span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="px-4 text-sm font-medium" aria-label="Main navigation">
            <NavigationSections pathname={pathname} />
          </nav>
        </div>

        {/* Sticky Footer */}
        <NavigationFooter pathname={pathname} />
      </div>
    </>
  );
}
