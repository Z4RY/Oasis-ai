import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function safeParseJson(text: string): Promise<any> {
  try {
    // Try to parse the JSON directly first
    return JSON.parse(text.trim());
  } catch (parseError) {
    // If direct parsing fails, try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerParseError) {
        throw new Error("Could not parse JSON from extracted content.");
      }
    }
    throw new Error("Could not find a valid JSON object in the response.");
  }
}