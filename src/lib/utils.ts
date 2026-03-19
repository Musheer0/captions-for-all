import { languages } from "@/constants/languages"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns";

export function timeAgo(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function normalizeLang(input: string) {
  if (!input) return null

  const clean = input.toLowerCase()

  // extract base lang (en-US → en)
  const base = clean.split(/[-_]/)[0]

  // try match by code
  let found = languages.find(l => l.code === base)

  // fallback: match by name
  if (!found) {
    found = languages.find(l =>
      l.language.toLowerCase() === clean
    )
  }

  return found || null
}                               