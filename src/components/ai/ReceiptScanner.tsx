"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CameraIcon, UploadIcon, ScanIcon } from "lucide-react";
import { toast } from "sonner";

interface ReceiptScannerProps {
  onScanComplete?: (data: ReceiptData) => void;
}

interface ReceiptData {
  amount: number;
  merchant: string;
  category: string;
  date: string;
  description: string;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Scan receipt
    await scanReceipt(file);
  };

  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const response = await fetch("/api/ai/receipt-scan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Scan failed");

      const data = await response.json();
      toast.success("Receipt scanned successfully!");
      onScanComplete?.(data);
    } catch (error) {
      console.error("Failed to scan receipt:", error);
      toast.error("Failed to scan receipt. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanIcon className="size-5" />
          Receipt Scanner
        </CardTitle>
        <CardDescription>
          Upload a receipt photo to automatically extract transaction details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Receipt preview"
                fill
                className="object-contain rounded-lg border"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="w-full"
            >
              Clear
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="h-32 flex flex-col gap-2"
            >
              <CameraIcon className="size-8" />
              <span>Take Photo</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.removeAttribute("capture");
                  fileInputRef.current.click();
                }
              }}
              disabled={isScanning}
              className="h-32 flex flex-col gap-2"
            >
              <UploadIcon className="size-8" />
              <span>Upload Image</span>
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Scanning receipt...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
