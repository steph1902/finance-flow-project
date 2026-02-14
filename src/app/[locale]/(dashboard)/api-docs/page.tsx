"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Database,
  Zap,
  Shield,
  Sparkles,
  CheckCircle2,
  Wallet,
  MessageSquare,
} from "lucide-react";

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 mb-4">
            <Code className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">
              Developer Documentation
            </span>
          </div>
          <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-4">
            FinanceFlow API Documentation
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Complete reference for the FinanceFlow REST API. Build powerful
            financial applications with our modern, type-safe endpoints.
          </p>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-soft rounded-[24px]">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Fast & Reliable</CardTitle>
              <CardDescription>
                Average response time &lt;100ms with 99.9% uptime SLA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-soft rounded-[24px]">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Secure by Default</CardTitle>
              <CardDescription>
                JWT authentication, rate limiting, and encrypted data
                transmission
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-soft rounded-[24px]">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Built-in AI categorization, insights, and recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quickstart" className="space-y-8">
          <TabsList className="bg-neutral-100 p-1 rounded-2xl">
            <TabsTrigger value="quickstart" className="rounded-xl">
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="rounded-xl">
              API Endpoints
            </TabsTrigger>
            <TabsTrigger value="authentication" className="rounded-xl">
              Authentication
            </TabsTrigger>
            <TabsTrigger value="examples" className="rounded-xl">
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Quick Start */}
          <TabsContent value="quickstart" className="space-y-6">
            <Card className="border-none shadow-soft rounded-[28px]">
              <CardHeader>
                <CardTitle className="text-2xl">Getting Started</CardTitle>
                <CardDescription>
                  Get up and running in 5 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                      1
                    </span>
                    Base URL
                  </h3>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm">
                    https://api.financeflow.com/v1
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                      2
                    </span>
                    Authentication
                  </h3>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm overflow-x-auto">
                    <div className="text-neutral-400">
                      // Include JWT token in Authorization header
                    </div>
                    <div className="mt-2">
                      Authorization: Bearer {"{"}YOUR_JWT_TOKEN{"}"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                      3
                    </span>
                    Make Your First Request
                  </h3>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm overflow-x-auto">
                    <div className="text-blue-400">curl</div>
                    <div className="pl-4 text-neutral-300">
                      -H{" "}
                      <span className="text-green-400">
                        &quot;Authorization: Bearer YOUR_JWT_TOKEN&quot;
                      </span>
                    </div>
                    <div className="pl-4 text-neutral-300">
                      -H{" "}
                      <span className="text-green-400">
                        &quot;Content-Type: application/json&quot;
                      </span>
                    </div>
                    <div className="pl-4">
                      https://api.financeflow.com/v1/transactions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Endpoints */}
          <TabsContent value="endpoints" className="space-y-6">
            {[
              {
                category: "Transactions",
                icon: Database,
                color: "bg-blue-50 text-blue-600",
                endpoints: [
                  {
                    method: "GET",
                    path: "/transactions",
                    description: "List all transactions",
                  },
                  {
                    method: "POST",
                    path: "/transactions",
                    description: "Create new transaction",
                  },
                  {
                    method: "GET",
                    path: "/transactions/:id",
                    description: "Get transaction by ID",
                  },
                  {
                    method: "PUT",
                    path: "/transactions/:id",
                    description: "Update transaction",
                  },
                  {
                    method: "DELETE",
                    path: "/transactions/:id",
                    description: "Delete transaction",
                  },
                ],
              },
              {
                category: "Budgets",
                icon: Wallet,
                color: "bg-green-50 text-green-600",
                endpoints: [
                  {
                    method: "GET",
                    path: "/budgets",
                    description: "List all budgets",
                  },
                  {
                    method: "POST",
                    path: "/budgets",
                    description: "Create new budget",
                  },
                  {
                    method: "GET",
                    path: "/budgets/:id/usage",
                    description: "Get budget usage stats",
                  },
                ],
              },
              {
                category: "AI Features",
                icon: Sparkles,
                color: "bg-purple-50 text-purple-600",
                endpoints: [
                  {
                    method: "POST",
                    path: "/ai/categorize",
                    description: "AI categorize transaction",
                  },
                  {
                    method: "POST",
                    path: "/ai/feedback",
                    description: "Submit AI feedback (accept/reject)",
                  },
                  {
                    method: "GET",
                    path: "/ai/analytics",
                    description: "Get AI performance analytics",
                  },
                  {
                    method: "POST",
                    path: "/ai/big4-analysis",
                    description: "Generate Big 4 financial analysis",
                  },
                ],
              },
            ].map((group, index) => {
              const Icon = group.icon;
              return (
                <Card
                  key={index}
                  className="border-none shadow-soft rounded-[28px]"
                >
                  <CardHeader className="bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${group.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-xl">
                        {group.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {group.endpoints.map((endpoint, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-colors"
                        >
                          <Badge
                            variant="outline"
                            className={`font-mono text-xs ${
                              endpoint.method === "GET"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : endpoint.method === "POST"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : endpoint.method === "PUT"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <div className="flex-1">
                            <code className="text-sm font-mono text-neutral-900">
                              {endpoint.path}
                            </code>
                            <p className="text-sm text-neutral-600 mt-1">
                              {endpoint.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Authentication */}
          <TabsContent value="authentication" className="space-y-6">
            <Card className="border-none shadow-soft rounded-[28px]">
              <CardHeader>
                <CardTitle className="text-2xl">JWT Authentication</CardTitle>
                <CardDescription>
                  Secure your API requests with JSON Web Tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    1. Login to Get Token
                  </h3>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm overflow-x-auto">
                    <div className="text-neutral-400">// POST /auth/login</div>
                    <div className="mt-2">
                      {"{"}&quot;email&quot;: &quot;user@example.com&quot;,
                      &quot;password&quot;: &quot;***&quot;{"}"}
                    </div>
                    <div className="mt-4 text-neutral-400">// Response:</div>
                    <div className="mt-2">
                      {"{"}&quot;accessToken&quot;: &quot;eyJhbGciOi...&quot;
                      {"}"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    2. Include Token in Requests
                  </h3>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm">
                    Authorization: Bearer
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">
                        Security Best Practices
                      </p>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>Never hardcode tokens in client-side code</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>
                            Store tokens in httpOnly cookies or secure storage
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>
                            Tokens expire after 1 hour - implement refresh logic
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples" className="space-y-6">
            <Card className="border-none shadow-soft rounded-[28px]">
              <CardHeader>
                <CardTitle className="text-2xl">Code Examples</CardTitle>
                <CardDescription>
                  Real-world usage examples in JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Create a Transaction",
                    code: `const response = await fetch('https://api.financeflow.com/v1/transactions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: -45.50,
    description: 'Grocery shopping',
    category: 'Food & Dining',
    date: new Date().toISOString()
  })
});

const transaction = await response.json();`,
                  },
                  {
                    title: "Get AI Categorization",
                    code: `const response = await fetch('https://api.financeflow.com/v1/ai/categorize', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Starbucks Coffee'
  })
});

const { category, confidence } = await response.json();
// { category: "Food & Dining", confidence: 0.95 }`,
                  },
                  {
                    title: "Generate Big 4 Analysis",
                    code: `const response = await fetch('https://api.financeflow.com/v1/ai/big4-analysis', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});

const analysis = await response.json();
// Returns: income, expenses, savings, spending patterns`,
                  },
                ].map((example, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-neutral-900 mb-3">
                      {example.title}
                    </h3>
                    <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl font-mono text-sm overflow-x-auto">
                      <pre className="text-neutral-300">{example.code}</pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-[32px] p-12">
          <h3 className="text-2xl font-medium text-neutral-900 mb-3">
            Need Help?
          </h3>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Have questions about the API? Check out our FAQ or reach out to our
            developer support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/financeflow"
              className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-6 py-3 hover:bg-neutral-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Join Discord</span>
            </a>
            <a
              href="mailto:api@financeflow.com"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-full px-6 py-3 hover:bg-indigo-700 transition-colors"
            >
              <span className="font-medium">Contact API Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
