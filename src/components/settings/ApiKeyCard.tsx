"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  description: string;
  envVar: string;
  value?: string;
  required: boolean;
  docsUrl?: string;
  testable?: boolean;
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onUpdate: (id: string, value: string) => void;
  onTest?: (id: string) => Promise<boolean>;
}

export function ApiKeyCard({ apiKey, onUpdate, onTest }: ApiKeyCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(apiKey.value || "");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const isConfigured = Boolean(apiKey.value && apiKey.value.length > 0);

  const handleSave = () => {
    onUpdate(apiKey.id, editValue);
    setIsEditing(false);
    toast.success(`${apiKey.name} updated successfully`);
  };

  const handleTest = async () => {
    if (!onTest) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await onTest(apiKey.id);
      setTestResult(result);
      toast[result ? "success" : "error"](
        result
          ? `${apiKey.name} connection successful`
          : `${apiKey.name} connection failed`,
      );
    } catch (error) {
      setTestResult(false);
      toast.error(`Failed to test ${apiKey.name}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = () => {
    if (apiKey.value) {
      navigator.clipboard.writeText(apiKey.value);
      toast.success("Copied to clipboard");
    }
  };

  const maskValue = (value: string) => {
    if (!value) return "";
    if (value.length <= 8) return "*".repeat(value.length);
    return `${value.substring(0, 4)}${"*".repeat(value.length - 8)}${value.substring(value.length - 4)}`;
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{apiKey.name}</CardTitle>
              {apiKey.required && (
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              )}
              {isConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <CardDescription>{apiKey.description}</CardDescription>
          </div>
          {apiKey.docsUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(apiKey.docsUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variable */}
        <div>
          <Label className="text-xs text-muted-foreground">
            Environment Variable
          </Label>
          <code className="block text-sm bg-muted px-2 py-1 rounded mt-1">
            {apiKey.envVar}
          </code>
        </div>

        {/* Value Display/Edit */}
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor={`${apiKey.id}-input`}>API Key Value</Label>
              <Input
                id={`${apiKey.id}-input`}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Paste your API key here"
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(apiKey.value || "");
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted px-3 py-2 rounded font-mono text-sm">
                {isConfigured ? (
                  isVisible ? (
                    apiKey.value
                  ) : (
                    <span className="text-muted-foreground">
                      {maskValue(apiKey.value || "")}
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground italic">
                    Not configured
                  </span>
                )}
              </div>
              {isConfigured && (
                <>
                  <Button
                    onClick={() => setIsVisible(!isVisible)}
                    variant="outline"
                    size="sm"
                  >
                    {isVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                {isConfigured ? "Update" : "Configure"}
              </Button>
              {apiKey.testable && isConfigured && (
                <Button
                  onClick={handleTest}
                  variant="outline"
                  size="sm"
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              )}
            </div>

            {/* Test Result */}
            {testResult !== null && (
              <Alert variant={testResult ? "default" : "destructive"}>
                {testResult ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {testResult
                    ? "Connection successful! API key is working correctly."
                    : "Connection failed. Please check your API key and try again."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
