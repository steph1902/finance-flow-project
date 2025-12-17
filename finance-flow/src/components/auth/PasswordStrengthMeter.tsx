"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { 
  validatePasswordStrength, 
  getStrengthLabel, 
  type PasswordStrength 
} from "@/lib/password-validator";

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export default function PasswordStrengthMeter({ 
  password, 
  showRequirements = true 
}: PasswordStrengthMeterProps) {
  const strength: PasswordStrength = useMemo(
    () => validatePasswordStrength(password),
    [password]
  );

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  const { score, percentage, requiredMet, feedback } = strength;
  const label = getStrengthLabel(score);

  // Color mapping based on score
  const colorClasses = {
    0: {
      bar: 'bg-destructive',
      text: 'text-destructive',
      badge: 'bg-destructive/10 text-destructive border-destructive/30',
    },
    1: {
      bar: 'bg-warning',
      text: 'text-warning',
      badge: 'bg-warning/10 text-warning border-warning/30',
    },
    2: {
      bar: 'bg-success',
      text: 'text-success',
      badge: 'bg-success/10 text-success border-success/30',
    },
    3: {
      bar: 'bg-success',
      text: 'text-success',
      badge: 'bg-success/20 text-success border-success/50',
    },
  };

  const colors = colorClasses[score];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Password Strength
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${colors.badge} transition-colors duration-medium`}>
            {label}
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${colors.bar} transition-all duration-slow ease-zen rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && feedback.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
          <ul className="space-y-1">
            <RequirementItem 
              met={requiredMet.minLength} 
              text="At least 8 characters" 
            />
            <RequirementItem 
              met={requiredMet.hasUppercase} 
              text="Include uppercase letter (A-Z)" 
            />
            <RequirementItem 
              met={requiredMet.hasLowercase} 
              text="Include lowercase letter (a-z)" 
            />
            <RequirementItem 
              met={requiredMet.hasNumber} 
              text="Include number (0-9)" 
            />
            <RequirementItem 
              met={requiredMet.hasSpecial} 
              text="Include special character (!@#$...)" 
            />
          </ul>
        </div>
      )}
    </div>
  );
}

// Requirement Item Component
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <li className="flex items-center space-x-2 text-xs">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={2.5} />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" strokeWidth={2.5} />
      )}
      <span className={met ? 'text-success' : 'text-muted-foreground'}>
        {text}
      </span>
    </li>
  );
}
