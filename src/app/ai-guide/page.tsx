import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sparkles,
    ArrowRight,
    Brain,
    Zap,
    Target,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Lightbulb,
    Play
} from "lucide-react";

export default function AIGuidePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
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
                            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Back to Home
                            </Link>
                            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft rounded-full px-6">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium border border-border mb-6">
                            <Brain className="w-4 h-4" />
                            <span>Beginner's Guide</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                            How AI Makes Your Finances <br />
                            <span className="text-primary italic">Effortless</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            You don't need to be a financial expert. Our AI does the heavy lifting, giving you simple,
                            actionable advice in plain English.
                        </p>
                    </div>

                    {/* What is AI? */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                What is AI in FinanceFlow?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-card-foreground/90">
                                Think of our AI as your personal financial advisor that works 24/7. It reads your transaction
                                data, understands your spending patterns, and gives you advice—just like a human financial expert
                                would, but instant and automatic.
                            </p>
                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                                <p className="text-sm font-semibold mb-2">No Technical Knowledge Required</p>
                                <p className="text-sm text-card-foreground/70">
                                    You never see code, algorithms, or complicated charts. Everything is explained in everyday language.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* The 3 Main AI Features */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-8 text-center">
                            3 Ways AI Helps You Save Money
                        </h2>

                        <div className="space-y-6">
                            {/* Feature 1 */}
                            <Card className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-blue-500" />
                                        1. Big 4 Insights (Your Financial Report Card)
                                    </CardTitle>
                                    <CardDescription>Get a complete financial check-up in seconds</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-card-foreground/90">
                                        Click one button and the AI analyzes all your transactions. In about 20 seconds, it gives you:
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Cashflow Diagnosis:</strong> Are you making more than you spend? Is it consistent?</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Risk Alerts:</strong> Will you run out of money in 30, 60, or 90 days? (Spoiler: probably not if you're doing okay!)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Weak Points:</strong> Where are you overspending? Do you have an emergency fund?</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Top 3 Actions:</strong> Specific steps to improve (like "reduce dining out by $200/month")</span>
                                        </li>
                                    </ul>
                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">How to Use It:</p>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Go to <strong>AI → Big 4 Insights</strong> in the sidebar and click <strong>Refresh Analysis</strong>.
                                            Wait 20 seconds. Read your report. That's it!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature 2 */}
                            <Card className="border-l-4 border-l-purple-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-purple-500" />
                                        2. Smart Categorization (No More Manual Tagging)
                                    </CardTitle>
                                    <CardDescription>AI automatically organizes your expenses</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-card-foreground/90">
                                        Every time you add a transaction, the AI looks at the description and amount, then automatically
                                        puts it in the right category (groceries, rent, entertainment, etc.).
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>95% Accuracy:</strong> It gets it right almost every time</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Learns Over Time:</strong> The more you use it, the smarter it gets</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>You Can Edit:</strong> If it's wrong, just change it. The AI remembers for next time.</span>
                                        </li>
                                    </ul>
                                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">How to Use It:</p>
                                        <p className="text-sm text-purple-800 dark:text-purple-200">
                                            Just add transactions normally. The AI does the rest in the background. Check the category,
                                            and if it's wrong, click to change it.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature 3 */}
                            <Card className="border-l-4 border-l-orange-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                        3. Risk Warnings (Your Financial Weather Forecast)
                                    </CardTitle>
                                    <CardDescription>See potential problems before they happen</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-card-foreground/90">
                                        The AI looks at your spending trends and predicts if you might run into trouble in the near future.
                                        It's like checking the weather before planning a picnic.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>30-Day Outlook:</strong> "You're spending $500/month more than you earn"</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>60-Day Outlook:</strong> "At this rate, your savings will drop below $1,000"</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>90-Day Outlook:</strong> "Large upcoming expenses detected (holiday season)"</span>
                                        </li>
                                    </ul>
                                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">How to Use It:</p>
                                        <p className="text-sm text-orange-800 dark:text-orange-200">
                                            The risk warnings appear automatically in your <strong>Big 4 Insights</strong> report.
                                            Green = you're safe, Yellow = watch out, Red = take action now.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-8 text-center">
                            Common Questions
                        </h2>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Is my data safe?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-card-foreground/80">
                                        Yes! The AI only reads your transaction data to give you advice. It never shares your information
                                        with anyone, and all data is encrypted and stored securely.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Do I need to understand how AI works?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-card-foreground/80">
                                        Not at all! You don't need to know how a car engine works to drive. Same here—just use the features,
                                        and the AI handles the technical stuff.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Can I turn off the AI?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-card-foreground/80">
                                        Yes. You can manually categorize transactions and skip the Big 4 Insights if you prefer to do things
                                        the old-fashioned way. The AI features are optional helpers, not requirements.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">What if the AI is wrong?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-card-foreground/80">
                                        The AI is usually accurate, but it's not perfect. Always review its suggestions before taking action.
                                        You can correct categories, ignore recommendations, and make your own decisions. You're in control!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* CTA */}
                    <Card className="bg-primary/5 border-primary">
                        <CardContent className="pt-6 text-center">
                            <h3 className="text-2xl font-serif font-bold mb-4">
                                Ready to Try It?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                Start your free trial and see how AI can simplify your financial life.
                                No credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild className="rounded-full px-8">
                                    <Link href="/signup">
                                        Start Free Trial
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="rounded-full px-8">
                                    <Link href="/login">View Demo</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-background border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
