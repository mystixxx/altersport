import { NextResponse } from "next/server";
import { updateLocation } from "@/lib/services/airtable";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Ensure the ID in the URL matches the ID in the data
    const updatedData = { ...data, id };

    const updatedLocation = await updateLocation(updatedData);
    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 },
    );
  }
}
