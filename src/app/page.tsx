import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";

import { TrendingUp, Repeat, Sparkles, Shield, Zap, ArrowRight, Check, BarChart3, Target, FileDown, Brain, Moon, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft transition-all duration-200 group-hover:scale-105">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-serif font-bold text-foreground tracking-tight">FinanceFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Docs
                </Link>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft rounded-full px-6">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-40 pb-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium border border-border">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Financial Clarity</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-foreground">
                Bringing Simplicity <br />
                <span className="text-primary italic">In The Financial Market</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                FinanceFlow simplifies the complex process of managing your wealth.
                Experience a new standard of financial clarity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button size="lg" asChild className="h-14 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all bg-primary text-primary-foreground">
                  <Link href="/signup">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary">
                  <Link href="/login">View Demo</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="mt-20 relative max-w-6xl mx-auto animate-fade-in delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                <NextImage
                  src="/assets/dashboard-preview.png"
                  alt="FinanceFlow Dashboard Preview"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Deep dive into your spending habits with intuitive charts and personalized insights.
                </p>
              </div>
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Budgets</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set smart budgets and get notified when you're close to your limits.
                </p>
              </div>
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">AI Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Let our AI agent analyze your finances and suggest ways to save more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">FinanceFlow</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} FinanceFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
