import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ZenContainer } from "@/components/ui/zen-container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <ZenContainer size="2xl" className="py-8 lg:py-12">
        <ScrollReveal variant="fadeUp" threshold={0.1}>
          <DashboardOverview />
        </ScrollReveal>
      </ZenContainer>
    </div>
  );
}
