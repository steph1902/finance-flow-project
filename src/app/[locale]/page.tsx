'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  TrendingUp,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  FileText,
  CheckCircle,
  Smartphone,
} from "lucide-react";

// Feature card with zen styling
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="group"
    >
      <div className="bg-white rounded-2xl p-8 shadow-zen hover-lift h-full border border-border/50">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center mb-6 group-hover:bg-apricot/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-sumi" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-sumi mb-3">{title}</h3>
        <p className="text-sumi-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Tech stack badge
function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-cream text-sumi text-sm font-medium border border-border/50">
      {children}
    </span>
  );
}

export default function LandingPage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-screen bg-cream text-sumi font-sans selection:bg-apricot/30">
      {/* Skip link */}
      <a href="#main-content" className="sr-only-focusable fixed top-4 left-4 z-50 px-4 py-2 bg-apricot text-sumi rounded-lg shadow-lg">
        Skip to main content
      </a>

      {/* Zen Pattern Background */}
      <div className="fixed inset-0 zen-dots opacity-50 pointer-events-none" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-apricot flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md">
                <TrendingUp className="w-5 h-5 text-sumi" />
              </div>
              <span className="text-xl font-bold text-sumi tracking-tight">
                FinanceFlow
              </span>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/ai-guide" className="text-sm text-sumi-500 hover:text-sumi transition-colors">
                  {tNav('aiGuide')}
                </Link>
                <Link href="/docs" className="text-sm text-sumi-500 hover:text-sumi transition-colors">
                  {tNav('docs')}
                </Link>
                <Link href="/login" className="text-sm text-sumi-500 hover:text-sumi transition-colors">
                  {tNav('login')}
                </Link>
              </div>
              <LanguageSwitcher />
              <Button asChild className="bg-apricot hover:bg-apricot-hover text-sumi font-medium rounded-full px-5 h-9 shadow-sm">
                <Link href="/signup">{tNav('getStarted')}</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section - Clean and Minimal */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sumi-500 text-sm border border-border/50 shadow-sm">
                  <Brain className="w-4 h-4 text-apricot" />
                  {t('tagline')}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8"
              >
                <span className="text-sumi">{t('hero.title')}</span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="text-sumi">{t('hero.titleHighlight')}</span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-apricot/40 -skew-x-3 rounded-sm" />
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-sumi-500 max-w-2xl mx-auto leading-relaxed mb-10"
              >
                {t('hero.description')}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" asChild className="h-12 px-8 rounded-full bg-apricot hover:bg-apricot-hover text-sumi font-semibold shadow-md hover:shadow-lg transition-all">
                  <Link href="/signup">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full border-2 border-border hover:bg-white hover:border-apricot transition-all">
                  <Link href="/docs">{t('hero.ctaSecondary')}</Link>
                </Button>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex flex-wrap justify-center gap-3"
              >
                <TechBadge>Next.js 16</TechBadge>
                <TechBadge>NestJS</TechBadge>
                <TechBadge>Gemini AI</TechBadge>
                <TechBadge>PostgreSQL</TechBadge>
                <TechBadge>React Native</TechBadge>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What This Project Actually Is */}
        <section className="py-20 md:py-28 bg-white border-y border-border/50">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-sumi mb-6">
                What Is FinanceFlow?
              </h2>
              <p className="text-lg text-sumi-500 leading-relaxed">
                A <strong>complete, production-ready SaaS boilerplate</strong> for personal finance applications.
                Built with enterprise-grade architecture, AI-powered insights, and bilingual support (English/Japanese).
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: FileText,
                  title: "Full Source Code",
                  description: "Complete codebase for frontend, backend, and mobile. No hidden dependencies or vendor lock-in."
                },
                {
                  icon: Brain,
                  title: "AI Integration",
                  description: "Gemini 1.5 Flash integration for transaction categorization and financial insights."
                },
                {
                  icon: Smartphone,
                  title: "Cross-Platform",
                  description: "Web app (Next.js), REST API (NestJS), and mobile app (React Native/Expo)."
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4 border border-border/50">
                    <item.icon className="w-7 h-7 text-sumi" />
                  </div>
                  <h3 className="text-lg font-semibold text-sumi mb-2">{item.title}</h3>
                  <p className="text-sumi-500 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Features Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white text-sumi-500 text-sm border border-border/50 mb-6">
                Features
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-sumi mb-6">
                {t('features.sectionTitle')}
              </h2>
              <p className="text-lg text-sumi-500 max-w-2xl mx-auto">
                Production-ready features for building your own fintech product.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeatureCard
                icon={Brain}
                title={t('features.big4.title')}
                description={t('features.big4.description')}
                delay={0}
              />
              <FeatureCard
                icon={Zap}
                title={t('features.categorization.title')}
                description={t('features.categorization.description')}
                delay={0.1}
              />
              <FeatureCard
                icon={Shield}
                title={t('features.riskProjection.title')}
                description={t('features.riskProjection.description')}
                delay={0.2}
              />
              <FeatureCard
                icon={BarChart3}
                title="Dashboard & Reports"
                description="Interactive charts, spending trends, budget tracking, and exportable PDF/CSV reports."
                delay={0.3}
              />
              <FeatureCard
                icon={Smartphone}
                title="Mobile App Ready"
                description="React Native/Expo mobile app with shared API. Ready for iOS and Android deployment."
                delay={0.4}
              />
              <FeatureCard
                icon={FileText}
                title="Bilingual Support"
                description="Full internationalization with next-intl. English and Japanese translations included."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Technical Highlights */}
        <section className="py-20 md:py-28 bg-white border-y border-border/50">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-sumi mb-4">
                  Technical Excellence
                </h2>
                <p className="text-sumi-500">
                  Built with patterns used by senior engineers at top companies.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Type-safe full-stack (TypeScript everywhere)",
                  "Clean architecture with separation of concerns",
                  "Prisma ORM with PostgreSQL",
                  "NextAuth.js with Google OAuth",
                  "BullMQ for background job processing",
                  "Docker containerization ready",
                  "GCP Cloud Run deployment configured",
                  "WCAG 2.1 AA accessibility compliance",
                  "Comprehensive error handling",
                  "Responsive design (mobile-first)",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-cream/50"
                  >
                    <CheckCircle className="w-5 h-5 text-apricot flex-shrink-0 mt-0.5" />
                    <span className="text-sumi text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-sumi mb-6">
                Ready to Build?
              </h2>
              <p className="text-lg text-sumi-500 mb-8">
                Get the complete source code and start building your fintech product today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="h-12 px-8 rounded-full bg-apricot hover:bg-apricot-hover text-sumi font-semibold shadow-md">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full border-2 hover:bg-cream">
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-apricot flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sumi" />
              </div>
              <span className="font-bold text-sumi">FinanceFlow</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-sumi-500">
              <Link href="/docs" className="hover:text-sumi transition-colors">Docs</Link>
              <Link href="/ai-guide" className="hover:text-sumi transition-colors">AI Guide</Link>
              <Link href="/privacy" className="hover:text-sumi transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-sumi transition-colors">Terms</Link>
            </div>

            <p className="text-sm text-sumi-500">
              © {new Date().getFullYear()} FinanceFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
