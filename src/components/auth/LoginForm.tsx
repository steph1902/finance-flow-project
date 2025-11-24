"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ email?: boolean; password?: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Login Failed", {
          description: data.error || "Invalid credentials",
        });
      } else {
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Login Failed", {
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="email" className="font-medium text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          disabled={isLoading}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { email: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
          className={`${
            errors.email && touchedFields.email
              ? "border-destructive focus-visible:ring-destructive/20"
              : "focus-visible:ring-primary/20"
          } shadow-soft transition-all duration-medium`}
        />
        {errors.email && touchedFields.email && (
          <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
        )}
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-medium text-foreground">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline underline-offset-4 transition-colors duration-fast"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...restErrors } = errors;
                setErrors(restErrors);
              }
            }}
            onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
            className={`${
              errors.password && touchedFields.password
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus-visible:ring-primary/20"
            } shadow-soft pr-10 transition-all duration-medium`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-fast"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && touchedFields.password && (
          <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-medium group"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}