"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, EditIcon } from "lucide-react";
import { useState } from "react";

interface ReceiptData {
  amount: number;
  merchant: string;
  category: string;
  date: string;
  description: string;
}

interface ReceiptPreviewProps {
  data: ReceiptData;
  onConfirm?: (data: ReceiptData) => void;
  onCancel?: () => void;
}

export function ReceiptPreview({
  data: initialData,
  onConfirm,
  onCancel,
}: ReceiptPreviewProps) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scanned Receipt</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <EditIcon className="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="merchant">Merchant</Label>
          <Input
            id="merchant"
            value={data.merchant}
            onChange={(e) => setData({ ...data, merchant: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={data.amount}
            onChange={(e) =>
              setData({ ...data, amount: parseFloat(e.target.value) })
            }
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={data.category}
            onValueChange={(value) => setData({ ...data, category: value })}
            disabled={!isEditing}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food & Dining">Food & Dining</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Bills & Utilities">
                Bills & Utilities
              </SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          {onConfirm && (
            <Button onClick={() => onConfirm(data)} className="flex-1">
              <CheckIcon className="size-4 mr-1" />
              Add Transaction
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
