'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ email?: boolean; password?: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: '❌ Login Failed',
          description: data.error || 'Invalid credentials',
          variant: 'destructive'
        });
      } else {
        toast({
          title: '✅ Welcome back!',
          description: 'Redirecting to your dashboard...',
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast({
        title: '❌ Login Failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@financeflow.com');
    setPassword('Demo1234');
    toast({
      title: '✨ Demo credentials loaded!',
      description: 'Click "Login" to access the demo account',
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Login Button */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Try the demo!
              </p>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Explore Phase 4 AI features with sample data
            </p>
          </div>
          <Button
            type="button"
            onClick={fillDemoCredentials}
            size="sm"
            variant="outline"
            className="border-blue-300 bg-white hover:bg-blue-50 dark:bg-blue-950 dark:border-blue-700 dark:hover:bg-blue-900"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Load Demo
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-2.5">
          <Label htmlFor="email" className="font-medium text-foreground text-sm">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@example.com"
            value={email}
            disabled={isLoading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                const { email: _, ...restErrors } = errors;
                setErrors(restErrors);
              }
            }}
            onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
            className={`${errors.email && touchedFields.email
                ? 'border-destructive focus-visible:ring-destructive/20'
                : 'focus-visible:ring-primary/20'
              } h-11 shadow-sm transition-all duration-200 hover:border-primary/50`}
          />
          {errors.email && touchedFields.email && (
            <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid gap-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-medium text-foreground text-sm">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline underline-offset-2 transition-colors duration-200 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  const { password: _, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
              className={`${errors.password && touchedFields.password
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : 'focus-visible:ring-primary/20'
                } h-11 shadow-sm pr-10 transition-all duration-200 hover:border-primary/50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && touchedFields.password && (
            <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login to Dashboard'
          )}
        </Button>
      </form>
    </div>
  );
}