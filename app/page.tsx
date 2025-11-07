import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        Welcome to FinanceFlow
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 text-center max-w-2xl">
        Your personal finance management solution. Track your income, expenses, and achieve your financial goals.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
