"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DURATION, STAGGER_DELAY } from "@/config/animations";

type StatsCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index?: number;
};

export function StatsCard({ title, value, description, icon, trend, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, delay: index * STAGGER_DELAY.slow }}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
        {/* Background Gradient - Using project's custom gradient syntax */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Decorative Corner - Using project's custom gradient syntax */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-bl-[100%] opacity-50" />

        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {value}
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                trend.isPositive 
                  ? "text-success dark:text-success" 
                  : "text-destructive dark:text-destructive"
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

