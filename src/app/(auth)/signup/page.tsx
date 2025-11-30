import SignupForm from "@/components/auth/SignupForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNavbar from "@/components/auth/AuthNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <AuthNavbar currentPage="signup" />
      <AuthLayout
        title="Start your journey"
        description="Create your free account and take control of your finances with AI-powered insights and intelligent budgeting tools."
        showFeatures={true}
      >
        <Card className="bg-card/95 border-border/50 shadow-card hover:shadow-mist transition-shadow duration-medium">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Create Account</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your information to get started with FinanceFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline transition-colors duration-fast"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    </>
  );
}
