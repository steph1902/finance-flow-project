import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNavbar from "@/components/auth/AuthNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <AuthNavbar currentPage="login" />
      <AuthLayout
        title="Welcome back"
        description="Sign in to your account to access your financial dashboard and continue managing your money with confidence."
        showFeatures={true}
      >
        <Card className="bg-card/95 border-border/50 shadow-card hover:shadow-mist transition-shadow duration-medium">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Login</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline transition-colors duration-fast"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    </>
  );
}
