"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X, Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { toast } from "sonner";

interface ScannedReceipt {
  merchant: string;
  amount: number;
  date: string;
  category?: string;
  items: Array<{
    name: string;
    quantity?: number;
    price?: number;
  }>;
  confidence: number;
  ocrText: string;
}

interface ReceiptScannerProps {
  onTransactionCreated?: (transaction: {
    description: string;
    amount: number;
    date: string;
    category: string;
  }) => void;
}

export function ReceiptScanner({ onTransactionCreated }: ReceiptScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedReceipt | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large. Maximum size is 4MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      scanReceipt(result);
    };
    reader.readAsDataURL(file);
  };

  const scanReceipt = async (imageBase64: string) => {
    setScanning(true);
    setScannedData(null);

    try {
      const response = await fetch("/api/v1/transactions/receipt-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        // Try to parse error message, but handle non-JSON responses
        let errorMessage = "Failed to scan receipt";
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (parseError) {
          // Response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse success response:", parseError);
        throw new Error("Invalid response from server");
      }

      const data: ScannedReceipt = result.data;

      setScannedData(data);
      setMerchant(data.merchant);
      setAmount(data.amount.toString());
      setDate(data.date);
      setCategory(data.category || "");

      toast.success("Receipt scanned successfully!", {
        description: `Found ${data.merchant} - ${formatCurrency(data.amount)}`,
      });
    } catch (error) {
      console.error("Receipt scan error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to scan receipt"
      );
      setImagePreview(null);
    } finally {
      setScanning(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!scannedData) return;

    // Validate
    if (!merchant.trim()) {
      toast.error("Merchant name is required");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Valid amount is required");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    if (!category) {
      toast.error("Category is required");
      return;
    }

    setSaving(true);

    try {
      // Create transaction
      const response = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: merchant,
          amount: amountNum,
          date: new Date(date).toISOString(),
          category,
          type: "expense",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      toast.success("Transaction created from receipt!");

      // Reset form
      setScannedData(null);
      setImagePreview(null);
      setMerchant("");
      setAmount("");
      setDate("");
      setCategory("");

      // Callback
      if (onTransactionCreated) {
        onTransactionCreated({
          description: merchant,
          amount: amountNum,
          date,
          category,
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setScannedData(null);
    setImagePreview(null);
    setMerchant("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Scan Receipt
        </CardTitle>
        <CardDescription>
          Take a photo or upload a receipt image to automatically create a transaction
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Controls */}
        {!imagePreview && (
          <div className="grid gap-3 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-24"
              onClick={() => cameraInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-6 w-6" />
                <span>Take Photo</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span>Upload Image</span>
              </div>
            </Button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Receipt preview"
              className="w-full max-h-64 object-contain rounded-lg border"
            />
            {!scanning && !scannedData && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Scanning State */}
        {scanning && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Scanning receipt...
              </p>
            </div>
          </div>
        )}

        {/* Scanned Data */}
        {scannedData && !scanning && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-sm">Receipt Scanned</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(scannedData.confidence * 100)}% confidence
              </span>
            </div>

            {/* Editable Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="Store name"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Items List */}
              {scannedData.items && scannedData.items.length > 0 && (
                <div className="space-y-1">
                  <Label>Items</Label>
                  <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                    <div className="space-y-1 text-sm">
                      {scannedData.items.slice(0, 10).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {item.quantity && `${item.quantity}x `}
                            {item.name}
                          </span>
                          {item.price && (
                            <span className="font-medium">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </div>
                      ))}
                      {scannedData.items.length > 10 && (
                        <p className="text-xs text-muted-foreground pt-1">
                          +{scannedData.items.length - 10} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveTransaction}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Transaction
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleClear}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
