'use client';

import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
  MagneticButton,
  AnimatedHeroText,
  AnimatedImage,
} from '@/components/ui/MotionWrapper';
import { ReasoningTerminalDemo } from '@/components/ai/ReasoningTerminal';

import {
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Brain,
  Smartphone,
  Lock,
  FileDown,
  BarChart3,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <a href="#main-content" className="sr-only-focusable fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
        Skip to main content
      </a>

      {/* Sticky Header with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-serif font-bold text-foreground tracking-tight">
                FinanceFlow
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-8">
                <Link href="/ai-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {tNav('aiGuide')}
                </Link>
                <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {tNav('docs')}
                </Link>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {tNav('login')}
                </Link>
                <LanguageSwitcher />
                <MagneticButton>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full px-6 h-10">
                    <Link href="/signup">{tNav('getStarted')}</Link>
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-24 md:pb-32 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 md:px-8 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge */}
              <AnimatedHeroText delay={0}>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 text-primary text-sm font-medium border border-border/50 shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('tagline')}</span>
                </div>
              </AnimatedHeroText>

              {/* Headline */}
              <AnimatedHeroText delay={0.1}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] text-foreground tracking-tight">
                  {t('hero.title')} <br />
                  <span className="text-primary italic">{t('hero.titleHighlight')}</span>
                </h1>
              </AnimatedHeroText>

              {/* Subheadline */}
              <AnimatedHeroText delay={0.2}>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t('hero.description')}
                </p>
              </AnimatedHeroText>

              {/* CTAs */}
              <AnimatedHeroText delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <MagneticButton>
                    <Button size="lg" asChild className="h-14 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary text-primary-foreground">
                      <Link href="/signup">
                        {t('hero.ctaPrimary')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary/80 transition-all duration-300">
                      <Link href="/ai-guide">{t('hero.ctaSecondary')}</Link>
                    </Button>
                  </MagneticButton>
                </div>
              </AnimatedHeroText>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <AnimatedImage delay={0.5} className="mt-16 md:mt-24 relative max-w-6xl mx-auto">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card depth-3">
                <NextImage
                  src="/assets/dashboard-preview.png"
                  alt="FinanceFlow dashboard interface showing monthly expense chart with spending trends, budget overview with categories for groceries, transportation, and entertainment, and a list of recent transactions including amounts and dates"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              {/* Floating glow effect */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10 blur-2xl opacity-60" />
            </AnimatedImage>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background via-secondary/30 to-background">
          <div className="container mx-auto px-4 md:px-8">
            <MotionWrapper className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight">
                {t('features.sectionTitle')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No financial expertise required. Let AI handle the complexity.
              </p>
            </MotionWrapper>

            <StaggerContainer className="max-w-7xl mx-auto">
              <BentoGrid>
                {/* AI Analysis - Large Card */}
                <StaggerItem>
                  <BentoCard size="large" highlight>
                    <div className="h-full flex flex-col">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <Brain className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                        {t('features.big4.title')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                        {t('features.big4.description')}
                      </p>
                      {/* XAI Terminal Demo */}
                      <div className="mt-auto">
                        <ReasoningTerminalDemo />
                      </div>
                    </div>
                  </BentoCard>
                </StaggerItem>

                {/* Smart Categorization */}
                <StaggerItem>
                  <BentoCard>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                      <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-3">
                      {t('features.categorization.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('features.categorization.description')}
                    </p>
                  </BentoCard>
                </StaggerItem>

                {/* Risk Projection */}
                <StaggerItem>
                  <BentoCard>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                      <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-3">
                      {t('features.riskProjection.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('features.riskProjection.description')}
                    </p>
                  </BentoCard>
                </StaggerItem>

                {/* Mobile App - Wide Card */}
                <StaggerItem>
                  <BentoCard size="wide">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">
                          Mobile First Experience
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Native iOS and Android apps with real-time sync. Manage your finances anywhere, anytime.
                        </p>
                      </div>
                    </div>
                  </BentoCard>
                </StaggerItem>

                {/* Data Privacy */}
                <StaggerItem>
                  <BentoCard>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-3">
                      Bank-Level Security
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      256-bit encryption, SOC 2 compliance, and zero data selling. Your financial data stays yours.
                    </p>
                  </BentoCard>
                </StaggerItem>

                {/* Export & Reports */}
                <StaggerItem>
                  <BentoCard>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                      <FileDown className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-3">
                      Powerful Exports
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Export to PDF, CSV, or Excel. Generate tax-ready reports with a single click.
                    </p>
                  </BentoCard>
                </StaggerItem>
              </BentoGrid>
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-8">
            <MotionWrapper className="max-w-4xl mx-auto text-center">
              <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/50 to-primary/5 border border-border/50 depth-2">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                  Ready to take control?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands who have transformed their financial life with AI-powered insights.
                </p>
                <MagneticButton className="inline-block">
                  <Button size="lg" asChild className="h-14 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary text-primary-foreground">
                    <Link href="/signup">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </MotionWrapper>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 md:py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">FinanceFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
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
