import SignupForm from '@/components/auth/SignupForm';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthNavbar from '@/components/auth/AuthNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function SignupPage() {
  return (
    <>
      <AuthNavbar currentPage="signup" />
      <AuthLayout>
        <Card className="bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-2">
              <Rocket className="h-7 w-7 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Get Started
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground">
              Create your account and unlock AI-powered financial insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    </>
  );
}
