import { toast as sonnerToast, type ExternalToast } from "sonner";

export type ToastOptions = ExternalToast;

export const toast = sonnerToast;

export function useToast() {
  return {
    toast,
  };
}
