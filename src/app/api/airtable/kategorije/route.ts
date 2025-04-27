import { NextResponse } from "next/server";
import { getKategorije, createKategorija } from "@/lib/services/airtable";

export async function GET() {
  try {
    const kategorije = await getKategorije();
    return NextResponse.json(kategorije);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch kategorije" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newKategorija = await createKategorija(data);
    return NextResponse.json(newKategorija);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to create league" },
      { status: 500 }
    );
  }
} 