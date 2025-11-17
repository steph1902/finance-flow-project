import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { ZenContainer } from "@/components/ui/zen-container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <ZenContainer size="2xl" className="py-8 lg:py-12">
        <ScrollReveal variant="fadeUp" threshold={0.1}>
          <div className="mb-8 space-y-2">
            <h1 className="type-h1 text-foreground">
              Dashboard
            </h1>
            <p className="type-body text-muted-foreground max-w-2xl">
              Welcome back! Here&apos;s an overview of your financial activity.
            </p>
          </div>
        </ScrollReveal>
        <DashboardContent />
      </ZenContainer>
    </div>
  );
}
