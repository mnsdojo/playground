import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const capital = (s: string) =>
  s.at(0)?.toUpperCase() + s.substring(1, s.length);
