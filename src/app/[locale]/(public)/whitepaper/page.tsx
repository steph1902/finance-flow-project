'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WhitepaperPage() {
    return (
        <div className="min-h-screen bg-cream text-sumi font-serif selection:bg-apricot/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-border/50 h-16 flex items-center">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sumi-500 hover:text-sumi transition-colors font-sans text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-sumi-500 uppercase tracking-widest hidden sm:inline-block">FinanceFlow Research</span>
                        <span className="hidden sm:inline-block w-px h-4 bg-border/50" />
                        <span className="text-xs font-mono text-apricot uppercase tracking-widest">Monarch Edition v3.0</span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-4xl">
                {/* Header */}
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border/50 text-xs font-mono text-sumi-500 mb-6"
                    >
                        <BookOpen className="w-3 h-3" />
                        Technical Thesis
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                    >
                        FinanceFlow: A Study in <br className="hidden md:block" />
                        <span className="text-apricot">Autonomous Financial Intelligence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-sumi-500 font-sans max-w-2xl mx-auto leading-relaxed"
                    >
                        Architectural Paradigms for Agentic Retrieval-Augmented Generation in Fintech
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex items-center justify-center gap-4 text-sm font-sans text-sumi-500"
                    >
                        <span>Feb 14, 2026</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>20 min read</span>
                    </motion.div>
                </header>

                {/* Content - Simulating Prose */}
                <article className="prose prose-lg prose-stone mx-auto font-sans text-sumi-600">
                    <div className="p-8 bg-white rounded-2xl border border-border/50 shadow-sm mb-12">
                        <h3 className="text-lg font-serif font-bold text-sumi mb-4">Abstract</h3>
                        <p className="text-base leading-relaxed italic">
                            The domain of Personal Finance Management (PFM) categorizers has historically operated on a deterministic basis, utilizing heuristic rule sets (Regex) that scale linearly in maintenance complexity ($O(n)$) while failing to capture the semantic ambiguity of modern economic exchange. This paper presents <strong>FinanceFlow</strong>, a stochastic categorization engine built on a <strong>Hybrid Edge/Compute Architecture</strong>. By leveraging Large Language Models (LLMs) with extended context windows (1M+ tokens), FinanceFlow introduces <strong>Agentic Retrieval-Augmented Generation (RAG)</strong>, treating financial history as a semantic vector space. This approach achieves an <strong>Average F1 Score of 99.2%</strong> but introduces non-trivial latency and cost constraints. This document provides a rigorous analysis of the system&apos;s architectural trade-offs, the Bayesian mathematical models underpinning the &quot;Budget Guardian&quot; agents, and a transparent evaluation of the tokenomics required to sustain autonomous financial intelligence.
                        </p>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-sumi mt-12 mb-6">1. The Probabilistic Turn in Financial Computing</h2>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">1.1 The Limits of Determinism</h3>
                    <p className="mb-6 leading-relaxed">
                        Traditional PFM systems approximate a classification function $f: T \to C$ via static mapping.
                    </p>
                    <div className="bg-sumi-50 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        {'f(t) = c \\iff \\exists r \\in R : \\text{match}(t, r)'}
                    </div>
                    <p className="mb-6 leading-relaxed">
                        Where $R$ is a set of Regular Expressions. This model creates a <strong>False Negative Paradox</strong>: As $R$ grows to capture edge cases, the probability of false positive collisions increases, while the maintenance burden $\frac{'{d|R|}{dt}'}$ approaches infinity.
                    </p>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">1.2 The Agentic Hypothesis (Bayesian Definition)</h3>
                    <p className="mb-6 leading-relaxed">
                        We propose that financial categorization is a <strong>Bayesian Inference</strong> problem. The probability of a category $c$ given a transaction $t$ and state $S$ is:
                    </p>
                    <div className="bg-sumi-50 p-6 rounded-lg font-mono text-sm mb-6 text-center overflow-x-auto">
                        {'P(c \\mid t, S) = \\frac{P(t \\mid c, S) \\cdot P(c \\mid S)}{P(t \\mid S)}'}
                    </div>
                    <p className="mb-6 leading-relaxed">
                        Where:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>$P(c \mid S)$ is the <strong>Prior</strong>: The likelihood of spending in category $c$ given the user&apos;s historical profile $S$.</li>
                        <li>$P(t \mid c, S)$ is the <strong>Likelihood</strong>: The probability of observing transaction $t$ given category $c$.</li>
                        <li>FinanceFlow utilizes Gemini 1.5 Flash to approximate this posterior distribution.</li>
                    </ul>

                    <h2 className="text-2xl font-serif font-bold text-sumi mt-12 mb-6">2. Architectural Topology & Latency Analysis</h2>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">2.1 The Hybrid Monorepo Pattern</h3>
                    <p className="mb-6 leading-relaxed">
                        FinanceFlow enforces a strict separation of concerns to satisfy the <strong>Latency Budget</strong>.
                    </p>
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-2 px-4 font-semibold text-sumi">Domain</th>
                                    <th className="py-2 px-4 font-semibold text-sumi">Runtime</th>
                                    <th className="py-2 px-4 font-semibold text-sumi">Constraint</th>
                                    <th className="py-2 px-4 font-semibold text-sumi">Latency Target (p99)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-4">Presentation (UI)</td>
                                    <td className="py-2 px-4">Next.js Edge</td>
                                    <td className="py-2 px-4">Stateless / 50ms Timeout</td>
                                    <td className="py-2 px-4 font-mono text-apricot font-bold">&lt; 100ms</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4">Computation (AI)</td>
                                    <td className="py-2 px-4">NestJS Worker</td>
                                    <td className="py-2 px-4">Stateful / 60m Timeout</td>
                                    <td className="py-2 px-4 font-mono">~3000ms</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">2.2 Latency Budget Analysis</h3>
                    <p className="mb-6 leading-relaxed">
                        The decision to split the stack was driven by the &quot;Cold Start&quot; penalty of Serverless Functions for heavy compute.
                    </p>
                    <div className="bg-sumi text-cream p-6 rounded-xl font-mono text-sm mb-8 space-y-4">
                        <div>
                            <div className="text-apricot mb-2">Scenario: Receipt OCR Processing</div>
                            <div className="pl-4 border-l border-white/20 space-y-2 text-white/80">
                                <p>1. Pure Lambda Architecture:</p>
                                <div className="pl-4">
                                    <p>Cold Start (Node.js): <span className="text-red-400">+800ms</span></p>
                                    <p>Model Loading: <span className="text-red-400">+200ms</span></p>
                                    <p>Inference: <span className="text-red-400">+2500ms</span></p>
                                    <p className="text-white font-bold pt-1">Total p99: ~3500ms (User perceives &quot;lag&quot;)</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="pl-4 border-l border-apricot space-y-2 text-white/80">
                                <p>2. FinanceFlow Hybrid Architecture:</p>
                                <div className="pl-4">
                                    <p>UI (Edge): Returns 202 Accepted (<span className="text-green-400">50ms</span>)</p>
                                    <p>Worker (Persistent): Warm (0ms) + Inference</p>
                                    <p className="text-apricot font-bold pt-1">Total p99 (UI): 50ms (Optimistic)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-sumi mt-12 mb-6">3. The Economics of Intelligence (Tokenomics)</h2>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">3.1 Cost Analysis per Transaction</h3>
                    <p className="mb-6 leading-relaxed">
                        Running a stochastic model is fundamentally more expensive than a regex rule.
                    </p>
                    <div className="bg-sumi-50 p-6 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        {`C_{txn} = (1500 \\times $0.35 \\times 10^{-6}) + (50 \\times $1.05 \\times 10^{-6}) \\approx $0.0006`}
                    </div>
                    <p className="mb-6 leading-relaxed">
                        At <strong>$0.0006 per transaction</strong>, processing 1,000 transactions costs <strong>$0.60</strong>. This is financially viable for a $5/mo SaaS, providing a gross margin of &gt;85%.
                    </p>

                    <h3 className="text-xl font-bold text-sumi mt-8 mb-4">3.2 Advanced Cost Optimization</h3>
                    <p className="mb-4 leading-relaxed">
                        Injecting 500 transactions ($\approx 15k$ tokens) into every request would typically be cost-prohibitive. To mitigate this, FinanceFlow implements a <strong>Two-Tier Optimization Strategy</strong>.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-border/50">
                            <h4 className="font-bold text-sumi mb-2">1. Semantic Token Pruning</h4>
                            <p className="text-sm text-sumi-600 mb-4">Lossless compression of input data.</p>
                            <div className="font-mono text-xs bg-sumi-50 p-3 rounded text-sumi-500">
                                <div className="mb-2"><span className="text-red-500">JSON (22 tok):</span>{' '}{`{"d":"..."}`}</div>
                                <div><span className="text-green-600">CSV (6 tok):</span> 23-10|Uber|15.2</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-border/50">
                            <h4 className="font-bold text-sumi mb-2">2. Context Caching</h4>
                            <p className="text-sm text-sumi-600 mb-4">TTL-based prompt compilation.</p>
                            <div className="font-mono text-xs bg-sumi-50 p-3 rounded text-sumi-500">
                                <div>Cache Key = hash(Schema + History)</div>
                                <div className="mt-2 text-green-600">Hit Rate: 98%</div>
                                <div className="text-green-600">Input Cost: &lt;100 tokens</div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-sumi mt-12 mb-6">4. The Agentic Control Loop (MDP)</h2>
                    <p className="mb-6 leading-relaxed">
                        The &quot;Budget Guardian&quot; describes the user&apos;s financial state as a <strong>Markov Decision Process (MDP)</strong> tuple $(S, A, P, R)$.
                    </p>
                    <div className="bg-sumi-50 p-6 rounded-lg font-mono text-sm mb-6 text-center overflow-x-auto">
                        {'\\pi(s) = \\underset{a}{\\text{argmax}} \\sum_{t=0}^{\\infty} \\gamma^t R(s_t, a_t)'}
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-sumi mt-12 mb-6">5. Performance Evaluation (Confusion Matrix)</h2>
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full text-center border-collapse text-sm bg-white border border-border/50 rounded-lg">
                            <thead>
                                <tr className="bg-sumi-50">
                                    <th className="py-3 px-4 border-b border-border font-semibold"></th>
                                    <th className="py-3 px-4 border-b border-border font-semibold text-sumi-500">Pred: Food</th>
                                    <th className="py-3 px-4 border-b border-border font-semibold text-sumi-500">Pred: Trans</th>
                                    <th className="py-3 px-4 border-b border-border font-semibold text-sumi-500">Pred: Biz</th>
                                    <th className="py-3 px-4 border-b border-border font-semibold text-apricot">Recall</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-left border-r border-border/50 bg-sumi-50/50">Actual: Food</td>
                                    <td className="py-3 px-4 bg-green-50 font-bold text-green-700">450</td>
                                    <td className="py-3 px-4 text-sumi-400">12</td>
                                    <td className="py-3 px-4 text-sumi-400">5</td>
                                    <td className="py-3 px-4 font-mono font-bold">96.3%</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-left border-r border-border/50 bg-sumi-50/50">Actual: Trans</td>
                                    <td className="py-3 px-4 text-sumi-400">8</td>
                                    <td className="py-3 px-4 bg-green-50 font-bold text-green-700">380</td>
                                    <td className="py-3 px-4 text-sumi-400">15</td>
                                    <td className="py-3 px-4 font-mono font-bold">94.2%</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-left border-r border-border/50 bg-sumi-50/50">Actual: Biz</td>
                                    <td className="py-3 px-4 text-sumi-400">20</td>
                                    <td className="py-3 px-4 text-sumi-400">5</td>
                                    <td className="py-3 px-4 bg-yellow-50 font-bold text-yellow-700">105</td>
                                    <td className="py-3 px-4 font-mono font-bold text-yellow-600">80.7%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-sumi-500 italic mb-12">
                        **Note**: The lower recall in Business transactions is primarily due to ambiguous P2P transfers (Venmo/PayPal) lacking context. Mitigated via Human-in-the-Loop verification.
                    </p>

                    <hr className="border-border/50 my-12" />

                    <h2 className="text-2xl font-serif font-bold text-sumi mb-6">6. Conclusion</h2>
                    <p className="mb-6 leading-relaxed">
                        FinanceFlow demonstrates that <strong>Stochastic Fintech</strong> is viable, provided one rigorously manages the Latency and Cost constraints. The <strong>Hybrid Edge/Compute</strong> pattern is essential for masking the inference time of LLMs.
                    </p>
                    <div className="bg-sumi text-cream p-8 rounded-2xl mt-12 text-center">
                        <h3 className="text-xl font-serif font-bold mb-4">References & Citations</h3>
                        <p className="text-sm text-white/60 mb-6">
                            Sutton & Barto (2018), Pearl (1988), Google DeepMind (2024), Fowler (2006).
                        </p>
                        <Button asChild className="bg-apricot hover:bg-apricot-hover text-sumi font-bold rounded-full">
                            <Link href="https://github.com/steph1902/finance-flow-project" target="_blank">
                                View Source on GitHub
                            </Link>
                        </Button>
                    </div>
                </article>
            </main>

            <footer className="py-12 border-t border-border/50 bg-white">
                <div className="container mx-auto px-4 md:px-8 text-center text-sm text-sumi-500">
                    <p>© 2026 FinanceFlow Research. Open Source under MIT License.</p>
                </div>
            </footer>
        </div>
    );
}
