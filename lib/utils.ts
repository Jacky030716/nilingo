import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string){
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export async function getImage(query: string){
  const apiKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
  const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}`)

  if(!res.ok){
    throw new Error("Failed to fetch image")
  }

  return res.json();
}