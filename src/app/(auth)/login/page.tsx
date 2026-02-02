import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthNavbar from '@/components/auth/AuthNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <>
      <AuthNavbar currentPage="login" />
      <AuthLayout>
        <Card className="bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Welcome Back
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to access your AI-powered financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-primary underline-offset-4 hover:underline transition-colors duration-200"
              >
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    </>
  );
}
