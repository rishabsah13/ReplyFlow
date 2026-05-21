// src/lib/mockResponder.ts

import { MOCK_FAQ, MockFaq, Tone } from "./mockFaq";

function normalize(text: string): string {
  return text.toLowerCase();
}

function matchesEntry(query: string, entry: MockFaq): boolean {
  if (!entry.keywords.length) return false;
  const q = normalize(query);
  return entry.keywords.some((kw) => q.includes(kw));
}

export function getMockResponse(query: string, tone: Tone): {
  response: string;
  matchedId: string;
} {
  // 1. Try to find the first matching FAQ entry
  const matched =
    MOCK_FAQ.find((entry) => matchesEntry(query, entry)) ??
    MOCK_FAQ.find((entry) => entry.id === "generic-fallback")!

  const base =
    matched?.baseResponse[tone] ??
    matched?.baseResponse.professional ??
    "Thanks for reaching out. A human representative will review your message and reply as soon as possible.";

  const response = base;

  return {
    response,
    matchedId: matched?.id ?? "generic-fallback",
  };
}