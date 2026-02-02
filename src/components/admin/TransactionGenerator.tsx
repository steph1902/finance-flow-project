'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function TransactionGenerator() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [transactionCount, setTransactionCount] = useState(100);

    const generateDemoTransactions = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/admin/demo-data/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count: transactionCount })
            });

            if (!res.ok) {
                throw new Error('Failed to generate transactions');
            }

            const data = await res.json();
            setSuccess(`Generated ${data.count} transactions successfully!`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Demo Transactions
                </CardTitle>
                <CardDescription>
                    Creates realistic transaction data for Big 4 analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {success && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-900 dark:text-green-100">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="count">Number of Transactions</Label>
                    <Input
                        id="count"
                        type="number"
                        min="10"
                        max="1000"
                        value={transactionCount}
                        onChange={(e) => setTransactionCount(parseInt(e.target.value) || 100)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Recommended: 100+ for accurate Big 4 analysis
                    </p>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">What gets created:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Income transactions (salary, freelance)
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Fixed expenses (rent, utilities)
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Discretionary spending (dining, shopping)
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            90-day historical data
                        </li>
                    </ul>
                </div>

                <Button
                    onClick={generateDemoTransactions}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Transactions
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
