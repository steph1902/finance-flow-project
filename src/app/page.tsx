import Link from "next/link";
import { Button } from "@/components/ui/button";

import { TrendingUp, Repeat, Sparkles, Shield, Zap, ArrowRight, Check, BarChart3, Target, FileDown, Brain, Moon, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>

      {/* Header with glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">FinanceFlow</span>
            </Link>
            <div className="flex items-center gap-4">

              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild className="hover:bg-accent">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-40" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Financial Intelligence</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Master Your Finances with{" "}
                  <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Intelligence
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Track expenses, manage budgets, and achieve financial goals with intelligent insights.
                  Your complete personal finance platform.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="group shadow-lg hover:shadow-xl transition-all">
                    <Link href="/signup">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>

                {/* Trust signals */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span>Bank-level security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-warning" />
                      <span>Real-time insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>No credit card required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product preview */}
              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-primary/10 to-transparent rounded-2xl blur-2xl opacity-40" />
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <BarChart3 className="w-8 h-8 text-primary mb-2" />
                        <div className="text-sm font-medium">Analytics</div>
                      </div>
                      <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                        <Target className="w-8 h-8 text-success mb-2" />
                        <div className="text-sm font-medium">Budgets</div>
                      </div>
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                        <Brain className="w-8 h-8 text-warning mb-2" />
                        <div className="text-sm font-medium">AI Insights</div>
                      </div>
                      <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                        <FileDown className="w-8 h-8 text-info mb-2" />
                        <div className="text-sm font-medium">Export</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Complete financial management in one platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Succeed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to help you take control of your financial future
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Transaction Tracking</h3>
                <p className="text-muted-foreground">
                  Automatically categorize and track all your transactions with AI-powered intelligence.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-success/50">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Budget Management</h3>
                <p className="text-muted-foreground">
                  Create and manage budgets with real-time tracking and smart alerts to stay on target.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-warning/50">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations and insights powered by advanced AI analysis.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-info/50">
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Charts</h3>
                <p className="text-muted-foreground">
                  Visualize your financial data with beautiful, interactive charts and reports.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Repeat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recurring Transactions</h3>
                <p className="text-muted-foreground">
                  Automate recurring expenses and income tracking for effortless money management.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:border-success/50">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <FileDown className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Import & Export</h3>
                <p className="text-muted-foreground">
                  Easily import transactions from CSV and export your data anytime you need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Built for Modern Life</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access your finances anywhere, anytime, on any device
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Moon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful dark mode for comfortable viewing day or night
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold">Mobile Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Responsive design works perfectly on all devices
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-lg font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized performance for instant access to your data
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="p-12 rounded-2xl border border-border bg-card shadow-xl text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Take Control?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands who have transformed their financial lives with FinanceFlow.
                  Start your free trial today—no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="group shadow-lg">
                    <Link href="/signup">
                      Create Free Account
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold">FinanceFlow</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  AI-powered personal finance management for the modern age
                </p>
              </div>
              <div>
                <h6 className="font-semibold mb-4">Product</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/signup" className="hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-foreground transition-colors">
                      Get Started
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold mb-4">Company</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold mb-4">Legal</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} FinanceFlow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
