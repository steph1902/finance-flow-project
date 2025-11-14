import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-[1600px]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Welcome back! Here&apos;s an overview of your financial activity.
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
