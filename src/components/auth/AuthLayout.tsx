import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showFeatures?: boolean;
}

export default function AuthLayout({
  children,
  title,
  description,
  showFeatures = true
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-16">
      {/* Hero Section - Left Side */}
      <div className="hidden lg:flex relative overflow-hidden bg-linear-to-br from-[hsl(220,45%,62%)] via-[hsl(220,50%,55%)] to-[hsl(220,55%,48%)]">
        {/* Gradient Overlay - Enhanced for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          color: 'white'
        }} />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full text-white">
          {/* Logo & Brand */}
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-glass transition-all duration-medium group-hover:scale-105 group-hover:bg-white/15">
                <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight drop-shadow-sm">FinanceFlow</span>
            </Link>
          </div>

          {/* Value Proposition */}
          <div className="space-y-8 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-5xl xl:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
                {title}
              </h1>
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-sm">
                {description}
              </p>
            </div>

            {/* Feature Highlights */}
            {showFeatures && (
              <div className="space-y-4 pt-4">
                <FeatureItem
                  icon={<Shield className="w-5 h-5" />}
                  text="Bank-level security & encryption"
                />
                <FeatureItem
                  icon={<Zap className="w-5 h-5" />}
                  text="AI-powered financial insights"
                />
                <FeatureItem
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  text="Real-time budget tracking"
                />
              </div>
            )}

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-6 border-t border-white/25">
              <div>
                <div className="text-3xl font-bold drop-shadow-sm">1,000+</div>
                <div className="text-sm text-white/85">Active Users</div>
              </div>
              <div className="w-px h-12 bg-white/25" />
              <div>
                <div className="text-3xl font-bold drop-shadow-sm">4.9/5</div>
                <div className="text-sm text-white/85">User Rating</div>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white/85 hover:text-white transition-colors duration-fast group"
            >
              <span className="text-sm font-medium">Learn more about FinanceFlow</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-white/6 to-transparent rounded-tl-full pointer-events-none" />
        <div className="absolute top-1/4 right-12 w-2 h-2 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse" />
        <div className="absolute top-1/3 right-24 w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-16 w-1 h-1 rounded-full bg-white/30 shadow-[0_0_4px_rgba(255,255,255,0.3)] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Form Section - Right Side */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-medium group-hover:bg-primary/15 group-hover:scale-105">
                <TrendingUp className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-foreground">FinanceFlow</span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center space-x-3 group">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-glass transition-all duration-medium group-hover:bg-white/15 group-hover:border-white/30 group-hover:scale-105">
        {icon}
      </div>
      <span className="text-base text-white/95 font-medium drop-shadow-sm">{text}</span>
    </div>
  );
}
