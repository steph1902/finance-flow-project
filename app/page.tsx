import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { ZenContainer, ZenSection, ZenCard, ZenButton, ZenMotion } from "@/components/ui/zen-index";
import { TrendingUp, PieChart, Repeat, Sparkles, Shield, Zap, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
        {/* Hero Section */}
        <ZenSection spacing="xl" className="pt-32">
          <ZenContainer size="2xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <ZenMotion variant="fadeInUp" delay={0.1}>
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium shadow-soft">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Financial Clarity</span>
                  </div>
                  <h1 className="jp-display">
                    Master Your Finances with{" "}
                    <span className="bg-linear-to-r from-primary via-accent-indigo to-primary bg-clip-text text-transparent">
                      Zen Simplicity
                    </span>
                  </h1>
                  <p className="jp-lead">
                    Experience the art of mindful money management. FinanceFlow combines Japanese minimalism with AI intelligence to bring peace to your financial life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <ZenButton size="lg" variant="indigo" asChild className="group">
                      <Link href="/signup">
                        Start Your Journey
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </ZenButton>
                    <ZenButton size="lg" variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </ZenButton>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Bank-level security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>Real-time insights</span>
                    </div>
                  </div>
                </div>
              </ZenMotion>
              
              <ZenMotion variant="scaleIn" delay={0.3}>
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-accent-indigo/10 to-transparent rounded-2xl blur-3xl" />
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-floating border border-border/50">
                    <Image
                      src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2000"
                      alt="Zen garden representing financial harmony"
                      width={800}
                      height={600}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </ZenMotion>
            </div>
          </ZenContainer>
        </ZenSection>

        {/* Three Pillars Section */}
        <ZenSection spacing="lg" background="muted">
          <ZenContainer size="xl">
            <ZenMotion variant="fadeInUp">
              <div className="text-center mb-16 space-y-4">
                <h2 className="jp-h2">Three Pillars of Financial Wellness</h2>
                <p className="jp-lead max-w-2xl mx-auto">
                  Built on simplicity, clarity, and mindfulness
                </p>
              </div>
            </ZenMotion>
            
            <div className="grid md:grid-cols-3 gap-8">
              <ZenMotion variant="fadeInUp" delay={0.1}>
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
              </ZenMotion>
              
              <ZenMotion variant="fadeInUp" delay={0.2}>
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
              </ZenMotion>
              
              <ZenMotion variant="fadeInUp" delay={0.3}>
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
              </ZenMotion>
            </div>
          </ZenContainer>
        </ZenSection>

        {/* CTA Section */}
        <ZenSection spacing="lg">
          <ZenContainer size="lg">
            <ZenMotion variant="scaleIn">
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
            </ZenMotion>
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
