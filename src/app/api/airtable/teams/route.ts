import { NextResponse } from "next/server";
import { getTeams, getTeam } from "@/lib/services/airtable";

export async function GET(request: Request) {
  try {
    // Check if we have parameters in the search params
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const categoryId = url.searchParams.get("categoryId");

    if (id) {
      // Get a single team if ID is provided
      const team = await getTeam(id);
      return NextResponse.json(team);
    } else if (categoryId) {
      // Get teams by category ID
      const allTeams = await getTeams();
      const filteredTeams = allTeams.filter(
        (team) => team.category && team.category.includes(categoryId),
      );
      return NextResponse.json(filteredTeams);
    } else {
      // Get all teams if no ID is provided
      const teams = await getTeams();
      return NextResponse.json(teams);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
