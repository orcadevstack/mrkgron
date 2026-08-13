import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, pattern = "MMM d, yyyy") {
    return format(parseISO(dateString), pattern);
}

export function formatCurrency(amount: string | number, currency = "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount));
}

export function truncate(text: string, maxLength = 50) {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}
