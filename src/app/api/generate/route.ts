import { NextResponse } from "next/server";
import type { Tone } from "@/lib/mockFaq";
import { getMockResponse } from "@/lib/mockResponder";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body?.query as string | undefined) ?? "";
    const tone = (body?.tone as Tone | undefined) ?? "professional";

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Customer message is required" },
        { status: 400 },
      );
    }

    if (query.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Please shorten it." },
        { status: 400 },
      );
    }

    const { response, matchedId } = getMockResponse(query, tone);

    return NextResponse.json({ response, matchedId });
  } catch (error: unknown) {
    console.error("Mock responder error", error);
    return NextResponse.json(
      { error: "Something went wrong while generating the response" },
      { status: 500 },
    );
  }
}