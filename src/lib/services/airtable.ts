"use server";

import Airtable from "airtable";
import { env } from "@/env";
import { formatDate } from "@/lib/utils";

// Initialize Airtable
const base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(
  env.AIRTABLE_BASE_ID,
);

export interface KategorijaRecord {
  id: string;
  name: string;
  sport: string[];
  notes: string;
  assignee: {
    id: string;
    email: string;
    name: string;
  };
  vrstaLige: string;
  status: string;
  teams: string[];
  startdate: string;
  enddate: string;
  [key: string]: any;
}

export interface SportRecord {
  id: string;
  name: string;
  icon: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  logo: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
    thumbnails?: {
      small?: {
        url: string;
        width: number;
        height: number;
      };
      large?: {
        url: string;
        width: number;
        height: number;
      };
    };
  }[];
  category: string[];
  address: string;
  website: string;
  sport: string[];
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

export interface MatchRecord {
  id: string;
  matchTime: string;
  sport: string[];
  kategorija: string[];
  matchDate: string;
  location: string[];
  homeTeam: string[];
  awayTeam: string[];
  homeTeamScore?: number;
  awayTeamScore?: number;
  matchResult?: string;
  officials?: string[];
  statistics?: string[];
  tournaments?: string[];
}

export interface LocationRecord {
  id: string;
  venueName: string;
  address: string;
  capacity?: number;
  facilities?: string[];
  photo?: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
    thumbnails?: {
      small?: {
        url: string;
        width: number;
        height: number;
      };
      large?: {
        url: string;
        width: number;
        height: number;
      };
    };
  }[];
  matchesHosted?: string[];
  tournamentsHosted?: string[];
  sport?: string[];
}

/**
 * Fetch all Kategorije from Airtable
 */
export async function getKategorije(): Promise<KategorijaRecord[]> {
  try {
    const records = await base("Kategorija")
      .select({
        view: "Grid view",
      })
      .all();

    return records.map((record) => {
      return {
        id: record.id,
        name: record.get("Name") as string,
        sport: record.get("Sport") as string[],
        notes: record.get("Notes") as string,
        assignee: record.get("Assignee") as {
          id: string;
          email: string;
          name: string;
        },
        status: record.get("Status") as string,
        vrstaLige: record.get("LeagueType") as string,
        teams: record.get("Momčadi") as string[],
        startdate: formatDate(record.get("StartDate") as string),
        enddate: formatDate(record.get("EndDate") as string),
      };
    });
  } catch (error) {
    console.error("Error fetching Kategorije from Airtable:", error);
    throw new Error("Failed to fetch Kategorije");
  }
}

/**
 * Fetch a single Sport record by ID from Airtable
 */
export async function getSport(id: string): Promise<SportRecord> {
  try {
    const record = await base("Sport").find(id);

    return {
      id: record.id,
      name: record.get("Sport Name") as string,
      icon: record.get("Icons") as string,
    };
  } catch (error) {
    console.error("Error fetching Sport from Airtable:", error);
    throw new Error("Failed to fetch Sport");
  }
}

/**
 * Fetch all Sports from Airtable
 */
export async function getSports(): Promise<SportRecord[]> {
  try {
    const records = await base("Sport")
      .select({
        view: "Grid view",
      })
      .all();

    return records.map((record) => {
      return {
        id: record.id,
        name: record.get("Sport Name") as string,
        icon: record.get("Icons") as string,
      };
    });
  } catch (error) {
    console.error("Error fetching Sports from Airtable:", error);
    throw new Error("Failed to fetch Sports");
  }
}

/**
 * Create a new Kategorija in Airtable
 */
export async function createKategorija(data: {
  name: string;
  sport: string[];
  notes?: string;
  assignee?: { id: string; email: string; name: string };
  vrstaLige: string;
  status: string;
  startdate: string;
  enddate: string;
}): Promise<KategorijaRecord> {
  try {
    const record = await base("Kategorija").create({
      Name: data.name,
      Sport: data.sport,
      Notes: data.notes || "",
      Assignee: data.assignee,
      Status: data.status,
      LeagueType: data.vrstaLige,
      StartDate: data.startdate,
      EndDate: data.enddate,
    });

    return {
      id: record.id,
      name: record.get("Name") as string,
      sport: record.get("Sport") as string[],
      notes: record.get("Notes") as string,
      assignee: record.get("Assignee") as {
        id: string;
        email: string;
        name: string;
      },
      status: record.get("Status") as string,
      vrstaLige: record.get("LeagueType") as string,
      teams: (record.get("Momčadi") as string[]) || [],
      startdate: formatDate(record.get("StartDate") as string),
      enddate: formatDate(record.get("EndDate") as string),
    };
  } catch (error) {
    console.error("Error creating Kategorija in Airtable:", error);
    throw new Error("Failed to create Kategorija");
  }
}

/**
 * Update an existing Kategorija in Airtable
 */
export async function updateKategorija(data: {
  id: string;
  name: string;
  sport: string[];
  notes?: string;
  assignee?: { id: string; email: string; name: string };
  vrstaLige: string;
  status: string;
  startdate: string;
  enddate: string;
}): Promise<KategorijaRecord> {
  try {
    const record = await base("Kategorija").update(data.id, {
      Name: data.name,
      Sport: data.sport,
      Notes: data.notes || "",
      Assignee: data.assignee,
      Status: data.status,
      LeagueType: data.vrstaLige,
      StartDate: data.startdate,
      EndDate: data.enddate,
    });

    return {
      id: record.id,
      name: record.get("Name") as string,
      sport: record.get("Sport") as string[],
      notes: record.get("Notes") as string,
      assignee: record.get("Assignee") as {
        id: string;
        email: string;
        name: string;
      },
      status: record.get("Status") as string,
      vrstaLige: record.get("LeagueType") as string,
      teams: (record.get("Momčadi") as string[]) || [],
      startdate: formatDate(record.get("StartDate") as string),
      enddate: formatDate(record.get("EndDate") as string),
    };
  } catch (error) {
    console.error("Error updating Kategorija in Airtable:", error);
    throw new Error("Failed to update Kategorija");
  }
}

/**
 * Fetch a single Team record by ID from Airtable
 */
export async function getTeam(id: string): Promise<TeamRecord> {
  try {
    const record = await base("Momčadi").find(id);

    return {
      id: record.id,
      name: record.get("Team Name") as string,
      logo: record.get("Team Logo") as TeamRecord["logo"],
      category: record.get("Kategorija") as string[],
      sport: record.get("Sport") as string[],
      address: record.get("Address") as string,
      website: record.get("Website") as string,
      wins: record.get("Wins") as number,
      losses: record.get("Losses") as number,
      draws: record.get("Draws") as number,
      points: record.get("Total Points") as number,
    };
  } catch (error) {
    console.error("Error fetching Team from Airtable:", error);
    throw new Error("Failed to fetch Team");
  }
}

/**
 * Fetch all Teams from Airtable
 */
export async function getTeams(): Promise<TeamRecord[]> {
  try {
    const records = await base("Momčadi")
      .select({
        view: "Grid view",
      })
      .all();

    return records.map((record) => {
      return {
        id: record.id,
        name: record.get("Team Name") as string,
        logo: record.get("Team Logo") as TeamRecord["logo"],
        category: record.get("Kategorija") as string[],
        sport: record.get("Sport") as string[],
        address: record.get("Address") as string,
        website: record.get("Website") as string,
        wins: record.get("Wins") as number,
        losses: record.get("Losses") as number,
        draws: record.get("Draws") as number,
        points: record.get("Total Points") as number,
      };
    });
  } catch (error) {
    console.error("Error fetching Teams from Airtable:", error);
    throw new Error("Failed to fetch Teams");
  }
}

/**
 * Fetch all Matches from Airtable
 */
export async function getMatches(): Promise<MatchRecord[]> {
  try {
    const records = await base("Događanje")
      .select({
        view: "Grid view",
      })
      .all();

    return records.map((record) => {
      return {
        id: record.id,
        matchTime: record.get("Match Time") as string,
        sport: record.get("Sport") as string[],
        kategorija: record.get("Kategorija") as string[],
        matchDate: formatDate(record.get("Match Date") as string),
        location: record.get("Location") as string[],
        homeTeam: record.get("Home Team") as string[],
        awayTeam: record.get("Away Team") as string[],
        homeTeamScore: record.get("Home Team Score") as number,
        awayTeamScore: record.get("Away Team Score") as number,
        matchResult: record.get("Match Result") as string,
        officials: record.get("Officials") as string[],
        statistics: record.get("Statistics") as string[],
        tournaments: record.get("Tournaments") as string[],
      };
    });
  } catch (error) {
    console.error("Error fetching Matches from Airtable:", error);
    throw new Error("Failed to fetch Matches");
  }
}

/**
 * Fetch a single Match record by ID from Airtable
 */
export async function getMatch(id: string): Promise<MatchRecord> {
  try {
    const record = await base("Događanje").find(id);

    return {
      id: record.id,
      matchTime: record.get("Match Time") as string,
      sport: record.get("Sport") as string[],
      kategorija: record.get("Kategorija") as string[],
      matchDate: formatDate(record.get("Match Date") as string),
      location: record.get("Location") as string[],
      homeTeam: record.get("Home Team") as string[],
      awayTeam: record.get("Away Team") as string[],
      homeTeamScore: record.get("Home Team Score") as number,
      awayTeamScore: record.get("Away Team Score") as number,
      matchResult: record.get("Match Result") as string,
      officials: record.get("Officials") as string[],
      statistics: record.get("Statistics") as string[],
      tournaments: record.get("Tournaments") as string[],
    };
  } catch (error) {
    console.error("Error fetching Match from Airtable:", error);
    throw new Error("Failed to fetch Match");
  }
}

/**
 * Create a new Match in Airtable
 */
export async function createMatch(data: {
  matchTime: string;
  sport: string[];
  kategorija: string[];
  matchDate: string;
  location: string[];
  homeTeam: string[];
  awayTeam: string[];
  homeTeamScore?: number;
  awayTeamScore?: number;
  matchResult?: string;
  officials?: string[];
  statistics?: string[];
  tournaments?: string[];
}): Promise<MatchRecord> {
  try {
    const record = await base("Događanje").create({
      "Match Time": data.matchTime,
      Sport: data.sport,
      Kategorija: data.kategorija,
      "Match Date": data.matchDate,
      Location: data.location,
      "Home Team": data.homeTeam,
      "Away Team": data.awayTeam,
      "Home Team Score": data.homeTeamScore,
      "Away Team Score": data.awayTeamScore,
      "Match Result": data.matchResult,
      Officials: data.officials,
      Statistics: data.statistics,
      Tournaments: data.tournaments,
    });

    return {
      id: record.id,
      matchTime: record.get("Match Time") as string,
      sport: record.get("Sport") as string[],
      kategorija: record.get("Kategorija") as string[],
      matchDate: formatDate(record.get("Match Date") as string),
      location: record.get("Location") as string[],
      homeTeam: record.get("Home Team") as string[],
      awayTeam: record.get("Away Team") as string[],
      homeTeamScore: record.get("Home Team Score") as number,
      awayTeamScore: record.get("Away Team Score") as number,
      matchResult: record.get("Match Result") as string,
      officials: record.get("Officials") as string[],
      statistics: record.get("Statistics") as string[],
      tournaments: record.get("Tournaments") as string[],
    };
  } catch (error) {
    console.error("Error creating Match in Airtable:", error);
    throw new Error("Failed to create Match");
  }
}

/**
 * Update an existing Match in Airtable
 */
export async function updateMatch(data: {
  id: string;
  matchTime?: string;
  sport?: string[];
  kategorija?: string[];
  matchDate?: string;
  location?: string[];
  homeTeam?: string[];
  awayTeam?: string[];
  homeTeamScore?: number;
  awayTeamScore?: number;
  matchResult?: string;
  officials?: string[];
  statistics?: string[];
  tournaments?: string[];
}): Promise<MatchRecord> {
  try {
    const updateData: Record<string, any> = {};

    if (data.matchTime) updateData["Match Time"] = data.matchTime;
    if (data.sport) updateData["Sport"] = data.sport;
    if (data.kategorija) updateData["Kategorija"] = data.kategorija;
    if (data.matchDate) updateData["Match Date"] = data.matchDate;
    if (data.location) updateData["Location"] = data.location;
    if (data.homeTeam) updateData["Home Team"] = data.homeTeam;
    if (data.awayTeam) updateData["Away Team"] = data.awayTeam;
    if (data.homeTeamScore !== undefined)
      updateData["Home Team Score"] = data.homeTeamScore;
    if (data.awayTeamScore !== undefined)
      updateData["Away Team Score"] = data.awayTeamScore;
    if (data.matchResult) updateData["Match Result"] = data.matchResult;
    if (data.officials) updateData["Officials"] = data.officials;
    if (data.statistics) updateData["Statistics"] = data.statistics;
    if (data.tournaments) updateData["Tournaments"] = data.tournaments;

    const record = await base("Događanje").update(data.id, updateData);

    return {
      id: record.id,
      matchTime: record.get("Match Time") as string,
      sport: record.get("Sport") as string[],
      kategorija: record.get("Kategorija") as string[],
      matchDate: formatDate(record.get("Match Date") as string),
      location: record.get("Location") as string[],
      homeTeam: record.get("Home Team") as string[],
      awayTeam: record.get("Away Team") as string[],
      homeTeamScore: record.get("Home Team Score") as number,
      awayTeamScore: record.get("Away Team Score") as number,
      matchResult: record.get("Match Result") as string,
      officials: record.get("Officials") as string[],
      statistics: record.get("Statistics") as string[],
      tournaments: record.get("Tournaments") as string[],
    };
  } catch (error) {
    console.error("Error updating Match in Airtable:", error);
    throw new Error("Failed to update Match");
  }
}

/**
 * Fetch all Locations from Airtable
 */
export async function getLocations(): Promise<LocationRecord[]> {
  try {
    const records = await base("Lokacije")
      .select({
        view: "Grid view",
      })
      .all();

    return records.map((record) => {
      return {
        id: record.id,
        venueName: record.get("Venue Name") as string,
        address: record.get("Address") as string,
        capacity: record.get("Capacity") as number,
        facilities: record.get("Facilities") as string[],
        photo: record.get("Photo") as LocationRecord["photo"],
        matchesHosted: record.get("Matches Hosted") as string[],
        tournamentsHosted: record.get("Tournaments Hosted") as string[],
        sport: record.get("Sport") as string[],
      };
    });
  } catch (error) {
    console.error("Error fetching Locations from Airtable:", error);
    throw new Error("Failed to fetch Locations");
  }
}

/**
 * Fetch a single Location record by ID from Airtable
 */
export async function getLocation(id: string): Promise<LocationRecord> {
  try {
    const record = await base("Lokacije").find(id);

    return {
      id: record.id,
      venueName: record.get("Venue Name") as string,
      address: record.get("Address") as string,
      capacity: record.get("Capacity") as number,
      facilities: record.get("Facilities") as string[],
      photo: record.get("Photo") as LocationRecord["photo"],
      matchesHosted: record.get("Matches Hosted") as string[],
      tournamentsHosted: record.get("Tournaments Hosted") as string[],
      sport: record.get("Sport") as string[],
    };
  } catch (error) {
    console.error("Error fetching Location from Airtable:", error);
    throw new Error("Failed to fetch Location");
  }
}

/**
 * Create a new Location in Airtable
 */
export async function createLocation(data: {
  venueName: string;
  address: string;
  capacity?: number;
  facilities?: string[];
  photo?: any[]; // Using any for attachment uploads
  matchesHosted?: string[];
  tournamentsHosted?: string[];
  sport?: string[];
}): Promise<LocationRecord> {
  try {
    const record = await base("Lokacije").create({
      "Venue Name": data.venueName,
      Address: data.address,
      Capacity: data.capacity,
      Facilities: data.facilities,
      Photo: data.photo,
      "Matches Hosted": data.matchesHosted,
      "Tournaments Hosted": data.tournamentsHosted,
      Sport: data.sport,
    });

    return {
      id: record.id,
      venueName: record.get("Venue Name") as string,
      address: record.get("Address") as string,
      capacity: record.get("Capacity") as number,
      facilities: record.get("Facilities") as string[],
      photo: record.get("Photo") as LocationRecord["photo"],
      matchesHosted: record.get("Matches Hosted") as string[],
      tournamentsHosted: record.get("Tournaments Hosted") as string[],
      sport: record.get("Sport") as string[],
    };
  } catch (error) {
    console.error("Error creating Location in Airtable:", error);
    throw new Error("Failed to create Location");
  }
}

/**
 * Update an existing Location in Airtable
 */
export async function updateLocation(data: {
  id: string;
  venueName?: string;
  address?: string;
  capacity?: number;
  facilities?: string[];
  photo?: any[]; // Using any for attachment uploads
  matchesHosted?: string[];
  tournamentsHosted?: string[];
  sport?: string[];
}): Promise<LocationRecord> {
  try {
    const updateData: Record<string, any> = {};

    if (data.venueName) updateData["Venue Name"] = data.venueName;
    if (data.address) updateData["Address"] = data.address;
    if (data.capacity !== undefined) updateData["Capacity"] = data.capacity;
    if (data.facilities) updateData["Facilities"] = data.facilities;
    if (data.photo) updateData["Photo"] = data.photo;
    if (data.matchesHosted) updateData["Matches Hosted"] = data.matchesHosted;
    if (data.tournamentsHosted)
      updateData["Tournaments Hosted"] = data.tournamentsHosted;
    if (data.sport) updateData["Sport"] = data.sport;

    const record = await base("Lokacije").update(data.id, updateData);

    return {
      id: record.id,
      venueName: record.get("Venue Name") as string,
      address: record.get("Address") as string,
      capacity: record.get("Capacity") as number,
      facilities: record.get("Facilities") as string[],
      photo: record.get("Photo") as LocationRecord["photo"],
      matchesHosted: record.get("Matches Hosted") as string[],
      tournamentsHosted: record.get("Tournaments Hosted") as string[],
      sport: record.get("Sport") as string[],
    };
  } catch (error) {
    console.error("Error updating Location in Airtable:", error);
    throw new Error("Failed to update Location");
  }
}
