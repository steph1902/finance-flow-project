import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Card className="w-full shadow-xl border-neutral-200 dark:border-neutral-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
