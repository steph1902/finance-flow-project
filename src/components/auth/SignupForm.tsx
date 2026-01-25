"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { validatePasswordStrength } from "@/lib/password-validator";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string } = {};

    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const strength = validatePasswordStrength(password);
      if (strength.score < 2) {
        newErrors.password = "Password is too weak";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSignupSuccess(true);

      toast.success("Account Created!", {
        description: "Welcome to FinanceFlow. Logging you in...",
      });

      // Auto-login after signup
      const loginResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      toast.error("Signup Failed", {
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Name Field */}
      <div className="grid gap-3">
        <Label htmlFor="name" className="font-medium text-foreground">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          disabled={isLoading}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { name: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          onBlur={() => setTouchedFields(prev => ({ ...prev, name: true }))}
          className={`${errors.name && touchedFields.name
              ? "border-destructive focus-visible:ring-destructive/20"
              : "focus-visible:ring-[var(--ring)]/20"
            } shadow-soft transition-all duration-medium`}
        />
        {errors.name && touchedFields.name && (
          <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
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
          className={`${errors.email && touchedFields.email
              ? "border-destructive focus-visible:ring-destructive/20"
              : "focus-visible:ring-[var(--ring)]/20"
            } shadow-soft transition-all duration-medium`}
        />
        {errors.email && touchedFields.email && (
          <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="grid gap-3">
        <Label htmlFor="password" className="font-medium text-foreground">
          Password
        </Label>
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
            className={`${errors.password && touchedFields.password
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus-visible:ring-[var(--ring)]/20"
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

        {/* Password Strength Meter */}
        <PasswordStrengthMeter password={password} showRequirements={true} />
      </div>

      {/* Confirm Password Field */}
      <div className="grid gap-3">
        <Label htmlFor="confirmPassword" className="font-medium text-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            disabled={isLoading}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirmPassword: _, ...restErrors } = errors;
                setErrors(restErrors);
              }
            }}
            onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))}
            className={`${errors.confirmPassword && touchedFields.confirmPassword
                ? "border-destructive focus-visible:ring-destructive/20"
                : confirmPassword && password === confirmPassword
                  ? "border-success focus-visible:ring-success/20"
                  : "focus-visible:ring-[var(--ring)]/20"
              } shadow-soft pr-10 transition-all duration-medium`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-fast"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && touchedFields.confirmPassword ? (
          <p className="text-sm text-destructive animate-fade-in">{errors.confirmPassword}</p>
        ) : confirmPassword && password === confirmPassword ? (
          <p className="text-sm text-success flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passwords match
          </p>
        ) : null}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => {
            setAgreeToTerms(checked === true);
            if (errors.terms) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { terms: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          className="mt-0.5"
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
        >
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline underline-offset-4">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.terms && (
        <p className="text-sm text-destructive animate-fade-in -mt-4">{errors.terms}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-medium group"
        disabled={isLoading || signupSuccess}
      >
        {signupSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Success! Redirecting...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}