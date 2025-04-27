import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to Croatian format (DD.MM.YYYY.)
 * @param dateString - The date string to format
 * @param formatString - Optional custom format string
 * @returns Formatted date string or empty string if date is invalid
 */
export function formatDate(dateString?: string | null, formatString: string = 'dd.MM.yyyy.') {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (!isValid(date)) return '';
  
  return format(date, formatString);
}
