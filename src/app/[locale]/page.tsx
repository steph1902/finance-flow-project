'use client';

import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

import { TrendingUp, Repeat, Sparkles, Shield, Zap, ArrowRight, Check, BarChart3, Target, FileDown, Brain, Moon, Smartphone } from "lucide-react";

export default function LandingPage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <a href="#main-content" className="sr-only-focusable fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
        Skip to main content
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft transition-all duration-200 group-hover:scale-105">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-serif font-bold text-foreground tracking-tight">FinanceFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/ai-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('aiGuide')}
                </Link>
                <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('docs')}
                </Link>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('login')}
                </Link>
                <LanguageSwitcher />
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft rounded-full px-6">
                  <Link href="/signup">{tNav('getStarted')}</Link>
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
                <span>{t('tagline')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-foreground">
                {t('hero.title')} <br />
                <span className="text-primary italic">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button size="lg" asChild className="h-14 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all bg-primary text-primary-foreground">
                  <Link href="/signup">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary">
                  <Link href="/ai-guide">{t('hero.ctaSecondary')}</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="mt-20 relative max-w-6xl mx-auto animate-fade-in delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                <NextImage
                  src="/assets/dashboard-preview.png"
                  alt="FinanceFlow dashboard interface showing monthly expense chart with spending trends, budget overview with categories for groceries, transportation, and entertainment, and a list of recent transactions including amounts and dates"
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
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                {t('features.sectionTitle')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No financial expertise required. Let AI handle the complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">{t('features.big4.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.big4.description')}
                </p>
              </div>
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">{t('features.categorization.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.categorization.description')}
                </p>
              </div>
              <div className="space-y-4 p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold">{t('features.riskProjection.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.riskProjection.description')}
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
