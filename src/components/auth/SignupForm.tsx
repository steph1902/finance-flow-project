"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and a number";
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
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      toast.success("Signup Successful", {
        description: "Redirecting to your dashboard...",
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
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="name">
          Full Name <span className="text-danger-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          className={errors.name ? "border-danger-500" : ""}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
          autoComplete="name"
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-danger-600 dark:text-danger-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">
          Email <span className="text-danger-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          className={errors.email ? "border-danger-500" : ""}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-danger-600 dark:text-danger-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">
          Password <span className="text-danger-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          className={errors.password ? "border-danger-500" : ""}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error password-hint" : "password-hint"}
          required
          autoComplete="new-password"
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-danger-600 dark:text-danger-400" role="alert">
            {errors.password}
          </p>
        )}
        <p id="password-hint" className="text-xs text-neutral-600 dark:text-neutral-400">
          Must be at least 8 characters with uppercase, lowercase, and a number
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}