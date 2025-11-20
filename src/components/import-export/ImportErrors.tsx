"use client"

import { AlertCircleIcon } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImportError {
  row: number
  error: string
  data: {
    date?: string
    amount?: string
    type?: string
    category?: string
    description?: string
  }
}

interface ImportErrorsProps {
  errors: ImportError[]
}

export function ImportErrors({ errors }: ImportErrorsProps) {
  if (errors.length === 0) return null

  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="size-5 text-destructive" />
          <div>
            <CardTitle className="text-destructive">
              Import Errors ({errors.length})
            </CardTitle>
            <CardDescription>
              The following rows could not be imported
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {errors.map((error, index) => (
            <div
              key={index}
              className="border border-destructive/20 rounded-lg p-3 bg-destructive/5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="destructive" className="shrink-0">
                  Row {error.row}
                </Badge>
                <p className="text-sm text-destructive font-medium flex-1">
                  {error.error}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                {error.data.date && (
                  <div>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    <span className="font-mono">{error.data.date}</span>
                  </div>
                )}
                {error.data.amount && (
                  <div>
                    <span className="text-muted-foreground">Amount:</span>{" "}
                    <span className="font-mono">{error.data.amount}</span>
                  </div>
                )}
                {error.data.type && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="font-mono">{error.data.type}</span>
                  </div>
                )}
                {error.data.category && (
                  <div>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    <span className="font-mono">{error.data.category}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
