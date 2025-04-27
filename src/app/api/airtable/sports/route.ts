import { NextResponse } from "next/server";
import { getSports, getSport } from "@/lib/services/airtable";

export async function GET(request: Request) {
  try {
    // Check if we have an ID in the search params
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Get a single sport if ID is provided
      const sport = await getSport(id);
      return NextResponse.json(sport);
    } else {
      // Get all sports if no ID is provided
      const sports = await getSports();
      return NextResponse.json(sports);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports" },
      { status: 500 }
    );
  }
} 