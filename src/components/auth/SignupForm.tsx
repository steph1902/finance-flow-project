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
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
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

      toast.success("Signup Successful", {
        description: "Redirecting to login...",
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
      <div className="grid gap-3">
        <Label htmlFor="name" className="font-medium">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { name: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          className={`${errors.name ? "border-destructive focus-visible:ring-destructive" : ""} shadow-soft`}
        />
        {errors.name && <p className="type-small text-destructive">{errors.name}</p>}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email" className="font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { email: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          className={`${errors.email ? "border-destructive focus-visible:ring-destructive" : ""} shadow-soft`}
        />
        {errors.email && <p className="type-small text-destructive">{errors.email}</p>}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="password" className="font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password: _, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          className={`${errors.password ? "border-destructive focus-visible:ring-destructive" : ""} shadow-soft`}
        />
        {errors.password && <p className="type-small text-destructive">{errors.password}</p>}
        <p className="type-small text-muted-foreground">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>
      <Button type="submit" className="w-full font-semibold shadow-md" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}