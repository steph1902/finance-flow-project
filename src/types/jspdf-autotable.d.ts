/**
 * Type declarations for jspdf-autotable
 */

declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  export type RowInput =
    | string
    | number
    | boolean
    | null
    | undefined
    | { content?: string; [key: string]: unknown };

  export interface UserOptions {
    head?: RowInput[][];
    body?: RowInput[][];
    foot?: RowInput[][];
    startY?: number;
    margin?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: "striped" | "grid" | "plain";
    styles?: Record<string, unknown>;
    headStyles?: Record<string, unknown>;
    bodyStyles?: Record<string, unknown>;
    footStyles?: Record<string, unknown>;
    alternateRowStyles?: Record<string, unknown>;
    columnStyles?: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
