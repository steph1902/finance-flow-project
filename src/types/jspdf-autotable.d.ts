/**
 * Type declarations for jspdf-autotable
 */

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  export type RowInput = string | number | boolean | null | undefined | { content?: string; [key: string]: any };

  export interface UserOptions {
    head?: RowInput[][];
    body?: RowInput[][];
    foot?: RowInput[][];
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: 'striped' | 'grid' | 'plain';
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    [key: string]: any;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
