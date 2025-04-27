import { NextResponse } from "next/server";
import {
  getLocations,
  getLocation,
  createLocation,
} from "@/lib/services/airtable";

export async function GET(request: Request) {
  try {
    // Check if we have an ID in the search params
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Get a single location if ID is provided
      const location = await getLocation(id);
      return NextResponse.json(location);
    } else {
      // Get all locations if no ID is provided
      const locations = await getLocations();
      return NextResponse.json(locations);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const location = await createLocation(data);
    return NextResponse.json(location);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 },
    );
  }
}
