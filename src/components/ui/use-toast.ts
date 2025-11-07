import { toast as sonnerToast, type ExternalToast, type ToastT } from "sonner";

export type ToastOptions = ExternalToast;

export const toast: ToastT = sonnerToast;

export function useToast() {
  return {
    toast,
  };
}

