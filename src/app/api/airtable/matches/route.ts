import { NextResponse } from "next/server";
import { getMatches, getMatch, createMatch } from "@/lib/services/airtable";

export async function GET(request: Request) {
  try {
    // Check if we have an ID in the search params
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Get a single match if ID is provided
      const match = await getMatch(id);
      return NextResponse.json(match);
    } else {
      // Get all matches if no ID is provided
      const matches = await getMatches();
      return NextResponse.json(matches);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const match = await createMatch(data);
    return NextResponse.json(match);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 },
    );
  }
}
