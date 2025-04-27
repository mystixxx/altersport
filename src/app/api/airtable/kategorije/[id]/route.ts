import { NextResponse } from "next/server";
import { updateKategorija } from "@/lib/services/airtable";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Ensure the ID in the URL matches the ID in the data
    const updatedData = { ...data, id };
    
    const updatedKategorija = await updateKategorija(updatedData);
    return NextResponse.json(updatedKategorija);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to update league" },
      { status: 500 }
    );
  }
}   