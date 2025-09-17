import { toast } from "sonner";

export const copyToClipboard = async (
  text: string,
  successMessage?: string
) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here if you have a toast system
    toast.success(successMessage ?? "URL copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy URL:", err);
  }
};
