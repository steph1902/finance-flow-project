"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary-100 to-transparent dark:from-primary-900/20 rounded-bl-[100%] opacity-50" />

        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/30 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {value}
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive 
                  ? "text-success-600 dark:text-success-400" 
                  : "text-danger-600 dark:text-danger-400"
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
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

