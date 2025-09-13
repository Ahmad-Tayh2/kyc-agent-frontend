import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  setToken: (token: string, persistent: boolean = true): void => {
    if (persistent) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  removeToken: (): void => {
    localStorage.removeItem("token");
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
