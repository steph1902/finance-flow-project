'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

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
        toast.error('Login Failed', {
          description: data.error || 'Invalid credentials',
        });
      } else {
        toast.success('Welcome back!', {
          description: 'Redirecting to dashboard...',
        }); router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('Login Failed', {
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@financeflow.com');
    setPassword('Demo1234');
    toast('✨ Demo credentials loaded!', {
      description: 'Click "Login" to access the demo account',
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Login Button */}


      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter Email / Phone No"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`h-14 rounded-2xl bg-[#F9F9F9] border-transparent focus:border-sumi/20 focus:bg-white transition-all duration-300 px-6 text-sumi placeholder:text-gray-400 ${errors.email ? 'border-destructive/50' : ''}`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className={`w-3 h-3 rounded-full border-2 ${email ? 'border-apricot bg-apricot' : 'border-gray-300'}`}></div>
            </div>
          </div>
          {errors.email && <p className="text-xs text-destructive pl-2">{errors.email}</p>}

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Passcode"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className={`h-14 rounded-2xl bg-[#F9F9F9] border-transparent focus:border-sumi/20 focus:bg-white transition-all duration-300 px-6 text-sumi placeholder:text-gray-400 ${errors.password ? 'border-destructive/50' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-sumi transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive pl-2">{errors.password}</p>}

          <div className="flex justify-between items-center px-1">
            <Label className="text-sm text-sumi-500 font-normal">Having trouble in sign in?</Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-apricot hover:bg-apricot-hover text-sumi font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Demo Credentials Link - Subtle */}
      <div className="text-center">
        <button
          onClick={fillDemoCredentials}
          className="text-xs text-gray-400 hover:text-apricot transition-colors underline decoration-dotted underline-offset-4"
        >
          Try Demo Account (auto-fill)
        </button>
      </div>
    </div>
  );
}