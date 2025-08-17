import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAL81HH_XDEALTYxI5bL1Cd_BfSCSwjyMk";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });