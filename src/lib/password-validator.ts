/**
 * Password Strength Validator
 * Calculates password strength based on multiple criteria
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3; // 0: weak, 1: medium, 2: strong, 3: very strong
  feedback: string[];
  requiredMet: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  percentage: number; // 0-100 for visual display
}

const MIN_LENGTH = 8;
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];

  // Check requirements
  const requiredMet = {
    minLength: password.length >= MIN_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: SPECIAL_CHARS.test(password),
  };

  // Generate feedback
  if (!requiredMet.minLength) {
    feedback.push(`At least ${MIN_LENGTH} characters`);
  }
  if (!requiredMet.hasUppercase) {
    feedback.push("Include uppercase letter");
  }
  if (!requiredMet.hasLowercase) {
    feedback.push("Include lowercase letter");
  }
  if (!requiredMet.hasNumber) {
    feedback.push("Include number");
  }
  if (!requiredMet.hasSpecial) {
    feedback.push("Include special character");
  }

  // Calculate score
  const metCount = Object.values(requiredMet).filter(Boolean).length;
  let score: 0 | 1 | 2 | 3;
  let percentage: number;

  if (metCount <= 2) {
    score = 0; // Weak
    percentage = 25;
  } else if (metCount === 3) {
    score = 1; // Medium
    percentage = 50;
  } else if (metCount === 4) {
    score = 2; // Strong
    percentage = 75;
  } else {
    score = 3; // Very Strong
    percentage = 100;
  }

  // Bonus scoring for length
  if (password.length >= 12 && score > 0) {
    percentage = Math.min(100, percentage + 10);
  }
  if (password.length >= 16 && score > 1) {
    score = 3;
    percentage = 100;
  }

  return {
    score,
    feedback,
    requiredMet,
    percentage,
  };
}

export function getStrengthLabel(score: 0 | 1 | 2 | 3): string {
  const labels = ["Weak", "Medium", "Strong", "Very Strong"] as const;
  return labels[score];
}

export function getStrengthColor(score: 0 | 1 | 2 | 3): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = [
    {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/30",
    },
    {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/30",
    },
    {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/30",
    },
    {
      bg: "bg-success/20",
      text: "text-success",
      border: "border-success/50",
    },
  ] as const;
  return colors[score];
}
