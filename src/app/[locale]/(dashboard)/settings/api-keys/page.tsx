"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Key, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeyCard } from "@/components/settings/ApiKeyCard";
import { toast } from "sonner";

const API_KEYS = [
    {
        id: "google-oauth",
        name: "Google OAuth",
        description: "Required for Google Sign-In functionality",
        envVar: "GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET",
        required: true,
        docsUrl: "https://console.cloud.google.com/apis/credentials",
        testable: false,
    },
    {
        id: "gemini-ai",
        name: "Gemini AI",
        description: "Powers smart categorization and Big 4 analysis",
        envVar: "GEMINI_API_KEY",
        required: true,
        docsUrl: "https://aistudio.google.com/app/apikey",
        testable: true,
    },
    {
        id: "resend",
        name: "Resend Email",
        description: "Sends transactional emails and notifications",
        envVar: "RESEND_API_KEY",
        required: false,
        docsUrl: "https://resend.com/api-keys",
        testable: true,
    },
    {
        id: "database",
        name: "Database URL",
        description: "PostgreSQL database connection string",
        envVar: "DATABASE_URL",
        required: true,
        docsUrl: "https://www.prisma.io/docs/reference/database-reference/connection-urls",
        testable: true,
    },
    {
        id: "nextauth",
        name: "NextAuth Secret",
        description: "Secret for encrypting session tokens",
        envVar: "NEXTAUTH_SECRET",
        required: true,
        docsUrl: "https://next-auth.js.org/configuration/options#secret",
        testable: false,
    },
];

type ApiKeyWithValue = typeof API_KEYS[number] & { value: string | undefined };

export default function ApiKeysPage() {
    const router = useRouter();
    const [apiKeys, setApiKeys] = useState<ApiKeyWithValue[]>(
        API_KEYS.map(key => ({ ...key, value: undefined }))
    );
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (id: string, value: string) => {
        setLoading(true);
        try {
            // Call API to update the key
            const res = await fetch("/api/settings/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, value }),
            });

            if (!res.ok) {
                throw new Error("Failed to update API key");
            }

            // Update local state
            setApiKeys(prev =>
                prev.map(key => (key.id === id ? { ...key, value } : key))
            );

            toast.success("API key updated successfully");
        } catch (error) {
            toast.error("Failed to update API key");
        } finally {
            setLoading(false);
        }
    };

    const handleTest = async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/settings/api-keys/test?id=${id}`);
            const data = await res.json();
            return data.success;
        } catch (error) {
            return false;
        }
    };

    const configuredCount = apiKeys.filter(k => k.value).length;
    const requiredCount = apiKeys.filter(k => k.required).length;
    const configuredRequired = apiKeys.filter(k => k.required && k.value).length;

    return (
        <div className="container max-w-4xl py-8 space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Settings
                </Button>

                <div className="flex items-center gap-2">
                    <Key className="w-8 h-8 text-primary" />
                    <h1 className="type-h2">API Keys</h1>
                </div>

                <p className="type-body text-muted-foreground max-w-2xl">
                    Manage your API keys and service integrations. These keys enable core features
                    like AI analysis, authentication, and email notifications.
                </p>
            </div>

            {/* Status Banner */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <div className="flex items-center justify-between">
                        <span>
                            {configuredRequired} of {requiredCount} required keys configured
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {configuredCount} / {apiKeys.length} total
                        </span>
                    </div>
                </AlertDescription>
            </Alert>

            {/* Important Notice */}
            <Alert variant="default" className="border-blue-200 bg-blue-50/50">
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                    <strong>Important:</strong> API keys are stored securely in your environment
                    variables. Changes require a server restart to take effect. For production deployments,
                    update these in your hosting platform's environment settings.
                </AlertDescription>
            </Alert>

            {/* API Keys List */}
            <div className="space-y-4">
                {apiKeys.map((key) => (
                    <ApiKeyCard
                        key={key.id}
                        apiKey={key}
                        onUpdate={handleUpdate}
                        onTest={key.testable ? handleTest : undefined}
                    />
                ))}
            </div>

            {/* Help Section */}
            <Alert>
                <AlertDescription>
                    <p className="font-semibold mb-2">Need help obtaining API keys?</p>
                    <ul className="space-y-1 text-sm">
                        <li>• Click the link icon next to each key for documentation</li>
                        <li>• Most services offer free tiers for development</li>
                        <li>• Test connections to verify keys are working correctly</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
}
