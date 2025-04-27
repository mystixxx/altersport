/**
 * Enums used for quiz components and data
 */

export enum EventType {
  MATCH = 1,
  TRAINING = 2,
  PLAYER = 3,
  CLUB = 4,
  TOURNAMENT = 5,
  LEAGUE = 6,
}

export enum GroupSportType {
  TEAM = 1,
  INDIVIDUAL = 2,
  DEFAULT = 3,
}

export enum ActivitiesEnjoyed {
  RUNNING = 1, // Trčanje
  STRENGTH_AND_ENDURANCE = 2, // Izgradnja snage i izdržljivosti
  STRATEGIC_PLANNING = 3, // Strateško planiranje poteza
  BALANCE_AND_AGILITY = 4, // Izgradnja ravnoteže i spretnosti
  MARTIAL_ARTS = 5, // Borilačke vještine
  SWIMMING_AND_WATER = 6, // Plivanje i vodene aktivnosti
  DANCE_AND_RHYTHM = 7, // Ples i ritmično kretanje
  BALL = 8, // Igranje lopte
  OTHER = 9, // Drugo
}

export enum AgeGroup {
  PRESCHOOL = 1, // (4-7 godina)
  PRIMARY_SCHOOL = 2, // (7-14 godina)
  JUNIORS = 3, // (15-18 godina)
  ADULTS = 4, // (18-40 godina)
  VETERANS = 5, // (35+ godina)
}

/**
 * Helper functions to convert between enum values and descriptive strings
 */

export const getEventTypeLabel = (type: EventType): string => {
  switch (type) {
    case EventType.MATCH:
      return "Match";
    case EventType.TRAINING:
      return "Training";
    case EventType.PLAYER:
      return "Player";
    case EventType.CLUB:
      return "Club";
    case EventType.TOURNAMENT:
      return "Tournament";
    case EventType.LEAGUE:
      return "League";
    default:
      return "Unknown";
  }
};

export const getGroupSportTypeLabel = (type: GroupSportType): string => {
  switch (type) {
    case GroupSportType.TEAM:
      return "U Timu";
    case GroupSportType.INDIVIDUAL:
      return "Samostalno";
    case GroupSportType.DEFAULT:
      return "Svejedno mi je";
    default:
      return "Unknown";
  }
};

export const getActivitiesEnjoyedLabel = (
  activity: ActivitiesEnjoyed,
): string => {
  switch (activity) {
    case ActivitiesEnjoyed.RUNNING:
      return "Trčanje";
    case ActivitiesEnjoyed.STRENGTH_AND_ENDURANCE:
      return "Izgradnja snage i izdržljivosti";
    case ActivitiesEnjoyed.STRATEGIC_PLANNING:
      return "Strateško planiranje poteza";
    case ActivitiesEnjoyed.BALANCE_AND_AGILITY:
      return "Izgradnja ravnoteže i spretnosti";
    case ActivitiesEnjoyed.MARTIAL_ARTS:
      return "Borilačke vještine";
    case ActivitiesEnjoyed.SWIMMING_AND_WATER:
      return "Plivanje i vodene aktivnosti";
    case ActivitiesEnjoyed.DANCE_AND_RHYTHM:
      return "Ples i ritmično kretanje";
    case ActivitiesEnjoyed.BALL:
      return "Igranje lopte";
    case ActivitiesEnjoyed.OTHER:
      return "Drugo";
    default:
      return "Unknown";
  }
};

export const getAgeGroupLabel = (group: AgeGroup): string => {
  switch (group) {
    case AgeGroup.PRESCHOOL:
      return "Predškolska dob (4-7 godina)";
    case AgeGroup.PRIMARY_SCHOOL:
      return "Osnovnoškolski uzrast (7-14 godina)";
    case AgeGroup.JUNIORS:
      return "Juniori (15-18 godina)";
    case AgeGroup.ADULTS:
      return "Seniori (18-40 godina)";
    case AgeGroup.VETERANS:
      return "Veterani (40+)";
    default:
      return "Unknown";
  }
};
