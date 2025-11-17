import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { ZenContainer, ZenSection, ZenCard, ZenButton, ZenMotion } from "@/components/ui/zen-index";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TrendingUp, PieChart, Repeat, Sparkles, Shield, Zap, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress bar */}
      <ScrollProgress />
      
      <a href="#main-content" className="skip-to-main">Skip to main content</a>

      {/* Header with glass morphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-zen border-b border-border/50">
        <ZenContainer size="2xl">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-soft transition-all duration-smooth group-hover:shadow-card group-hover:scale-105">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">FinanceFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <ZenButton variant="indigo" asChild>
                  <Link href="/signup">Get Started</Link>
                </ZenButton>
              </div>
            </div>
          </nav>
        </ZenContainer>
      </header>

      <main id="main-content">
        {/* Hero Section — Premium 2025 Design */}
        <ZenSection spacing="epic" className="pt-32 relative overflow-hidden">
          {/* Background gradient orb */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-linear-to-br from-primary/20 via-accent-indigo/10 to-transparent blur-3xl opacity-60" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-linear-to-tr from-accent-gold/10 to-transparent blur-3xl opacity-40" />
          </div>
          
          <ZenContainer size="2xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ZenMotion variant="fadeInUp" delay={0.1} easing="apple">
                <div className="space-y-8">
                  {/* Premium badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-accent-indigo/10 border border-primary/20 text-primary text-sm font-medium shadow-soft backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Financial Intelligence</span>
                  </div>
                  
                  {/* Hero headline — compelling value prop */}
                  <h1 className="jp-display">
                    See AI{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-linear-to-r from-primary via-accent-indigo to-primary bg-clip-text text-transparent">
                        Categorize
                      </span>
                      <span className="absolute -bottom-2 left-0 right-0 h-3 bg-accent-gold/20 z-0 rounded-sm" />
                    </span>
                    {" "}Your First Transaction in 30 Seconds
                  </h1>
                  
                  {/* Premium subheadline */}
                  <p className="jp-lead max-w-xl">
                    Experience the art of mindful money management. AI categorization, 
                    real-time insights, and Japanese minimalism — your path to financial clarity starts now.
                  </p>
                  
                  {/* CTA buttons with urgency */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <ZenButton size="lg" variant="indigo" asChild className="group shadow-lg hover:shadow-xl transition-shadow">
                      <Link href="/signup">
                        Try Free for 14 Days
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </ZenButton>
                    <ZenButton size="lg" variant="outline" asChild>
                      <Link href="#demo">Watch 30s Demo</Link>
                    </ZenButton>
                  </div>
                  
                  {/* Trust signals above fold */}
                  <div className="flex flex-col gap-4 pt-8">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4 text-success" />
                        <span>Bank-level encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="w-4 h-4 text-warning" />
                        <span>Real-time AI insights</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-success" />
                        <span>No credit card required</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="font-semibold text-foreground">12,487 users</strong> already mastering their finances with FinanceFlow
                    </p>
                  </div>
                </div>
              </ZenMotion>
              
              {/* Product demo/screenshot instead of stock photo */}
              <ZenMotion variant="scaleIn" delay={0.3} easing="luxury">
                <div className="relative" id="demo">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-accent-indigo/20 to-transparent rounded-2xl blur-3xl opacity-50" />
                  
                  {/* Placeholder for product screenshot */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-floating border border-border/50 bg-card">
                    {/* Mockup of dashboard — replace with actual screenshot */}
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-background p-8">
                      <div className="text-center space-y-4">
                        <PieChart className="w-16 h-16 text-primary mx-auto opacity-60" />
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Product demo screenshot showing AI categorization in action
                          <br />
                          <span className="text-xs">(Replace with actual dashboard screenshot)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Scroll indicator */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-sm text-muted-foreground animate-bounce">
                    <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
                      <div className="w-1 h-3 rounded-full bg-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              </ZenMotion>
            </div>
          </ZenContainer>
        </ZenSection>

        {/* Three Pillars Section — Progressive Disclosure */}
        <ZenSection spacing="lg" background="muted">
          <ZenContainer size="xl">
            <ScrollReveal threshold={0.2}>
              <div className="text-center mb-16 space-y-4">
                <h2 className="jp-h2">Three Pillars of Financial Wellness</h2>
                <p className="jp-lead max-w-2xl mx-auto">
                  Built on simplicity, clarity, and mindfulness
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-3 gap-8">
              <ScrollReveal threshold={0.3} delay={0.1} variant="fadeUp">
                <ZenCard variant="glass" hoverable className="h-full">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="jp-h3">Smart Tracking</h3>
                    <p className="jp-body text-muted-foreground">
                      Effortlessly categorize transactions with AI-powered intelligence that learns your spending patterns.
                    </p>
                  </div>
                </ZenCard>
              </ScrollReveal>
              
              <ScrollReveal threshold={0.3} delay={0.2} variant="fadeUp">
                <ZenCard variant="glass" hoverable className="h-full">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                      <PieChart className="w-7 h-7 text-success" />
                    </div>
                    <h3 className="jp-h3">Mindful Budgets</h3>
                    <p className="jp-body text-muted-foreground">
                      Set intentions, not restrictions. Build budgets that align with your values and goals.
                    </p>
                  </div>
                </ZenCard>
              </ScrollReveal>
              
              <ScrollReveal threshold={0.3} delay={0.3} variant="fadeUp">
                <ZenCard variant="glass" hoverable className="h-full">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                      <Repeat className="w-7 h-7 text-accent-gold" />
                    </div>
                    <h3 className="jp-h3">Automated Flow</h3>
                    <p className="jp-body text-muted-foreground">
                      Build healthy financial habits through intelligent automation and gentle reminders.
                    </p>
                  </div>
                </ZenCard>
              </ScrollReveal>
            </div>
          </ZenContainer>
        </ZenSection>

        {/* CTA Section — Progressive Disclosure */}
        <ZenSection spacing="lg">
          <ZenContainer size="lg">
            <ScrollReveal threshold={0.4} variant="scale">
              <ZenCard variant="elevated" padding="lg" className="text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                  <h2 className="jp-h2">Begin Your Financial Transformation</h2>
                  <p className="jp-lead">
                    Join thousands who have found peace through mindful money management. Start your journey to financial clarity today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <ZenButton size="xl" variant="indigo" asChild className="group">
                      <Link href="/signup">
                        Create Free Account
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </ZenButton>
                    <ZenButton size="xl" variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </ZenButton>
                  </div>
                  <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Free forever</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </ZenCard>
            </ScrollReveal>
          </ZenContainer>
        </ZenSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <ZenContainer size="2xl">
          <div className="py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-soft">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-serif text-lg font-semibold">FinanceFlow</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Mindful money management with Japanese zen principles
                </p>
              </div>
              <div>
                <h6 className="jp-h6 mb-4">Product</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/signup" className="hover:text-foreground transition-colors duration-fast">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-foreground transition-colors duration-fast">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="jp-h6 mb-4">Company</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="jp-h6 mb-4">Legal</h6>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center text-xs text-muted-foreground">
              <p>
                © {new Date().getFullYear()} FinanceFlow. Images: Unsplash (Free License) · Icons: Lucide (MIT)
              </p>
            </div>
          </div>
        </ZenContainer>
      </footer>
    </div>
  );
}
