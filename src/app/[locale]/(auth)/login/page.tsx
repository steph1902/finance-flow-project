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
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-soft border border-[#F2EFE9]">
          <div className="space-y-4 pb-8 text-center">
            {/* Minimal Header */}
            <h2 className="text-2xl font-bold tracking-tight text-sumi">
              Agent Login
            </h2>
            <p className="text-sumi-500">
              Hey, Enter your details to get sign in to your account
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm text-sumi-500">
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Or Sign in with</span>
              </div>
            </div>
            {/* Placeholder for social login icons if needed, or just the link */}
            <p className="mt-4">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-sumi hover:text-apricot transition-colors duration-200"
              >
                Request Now
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
