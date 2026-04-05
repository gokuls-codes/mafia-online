export type Faction = "Town" | "Mafia" | "Neutral";

export interface Role {
  id: string;
  name: string;
  description: string;
  faction: Faction;
  alignment: "Good" | "Evil" | "Chaos";
  powerDescription: string;
  maxCount: number;
}

export const ROLES: Record<string, Role> = {
  VILLAGER: {
    id: "villager",
    name: "Villager",
    description:
      "An ordinary person in town. No special powers but the power of the vote.",
    faction: "Town",
    alignment: "Good",
    powerDescription: "No active power.",
    maxCount: 10,
  },
  DOCTOR: {
    id: "doctor",
    name: "Doctor",
    description:
      "A medical professional who can save someone from getting killed by the mafia.",
    faction: "Town",
    alignment: "Good",
    powerDescription: "Protect one player from death due to mafia each night.",
    maxCount: 2,
  },
  DETECTIVE: {
    id: "detective",
    name: "Detective",
    description: "Follows people at night to see who they visit.",
    faction: "Town",
    alignment: "Good",
    powerDescription:
      "Investigate one player each night to see if they are suspicious.",
    maxCount: 2,
  },
  MAFIA: {
    id: "mafia",
    name: "Mafia",
    description: "The backbone of the Mafia. Carries out hits.",
    faction: "Mafia",
    alignment: "Evil",
    powerDescription: "Voted by the Mafia to kill someone each night.",
    maxCount: 3,
  },
  GODFATHER: {
    id: "godfather",
    name: "Godfather",
    description: "The leader of the Mafia. Appears innocent to investigations.",
    faction: "Mafia",
    alignment: "Evil",
    powerDescription: "Orders the hits. Appears as Town to Detectives.",
    maxCount: 1,
  },
  SERIAL_KILLER: {
    id: "serial_killer",
    name: "Serial Killer",
    description: "A lone wolf who wants to be the last one standing.",
    faction: "Neutral",
    alignment: "Chaos",
    powerDescription: "Kills one person every night.",
    maxCount: 1,
  },
  JESTER: {
    id: "jester",
    name: "Jester",
    description: "A trickster whose only goal is to be voted out.",
    faction: "Neutral",
    alignment: "Chaos",
    powerDescription: "Wins if voted out by the Town.",
    maxCount: 1,
  },
  MAYOR: {
    id: "mayor",
    name: "Mayor",
    description:
      "A high-ranking official with the authority to override the mob's verdict.",
    faction: "Town",
    alignment: "Good",
    powerDescription:
      "Executive Pardon: Can intervene during a vote to save a player from execution.",
    maxCount: 1,
  },
  INNOCENT: {
    id: "innocent",
    name: "Innocent",
    description: "A misunderstood citizen whose dark reputation precedes them.",
    faction: "Town",
    alignment: "Good",
    powerDescription:
      "Red Herring: Truly innocent, yet appears as 'Evil' to any investigation.",
    maxCount: 2,
  },
  POLICE: {
    id: "police",
    name: "Police",
    description:
      "A lawman who took his badge too far. He seeks justice by any means.",
    faction: "Town",
    alignment: "Good",
    powerDescription:
      "Street Justice: Can kill one player at night. If he kills an innocent, he dies from the guilt.",
    maxCount: 1,
  },
};

export type GameStatus = "Lobby" | "Night" | "Day" | "Voting" | "Finished";

export interface Room {
  id: string;
  name: string;
  hostId: string;
  status: GameStatus;
  winnerFaction?: Faction | null;
  createdAt: string;
  settings: {
    roleCounts: Record<string, number>;
    timerNight: number;
    timerDay: number;
    timerVoting: number;
  };
  join_code?: string;
  last_night_summary?: {
    deadNames: string[];
    message: string;
  };
  mafia_target?: string | null;
}

export interface Player {
  id: string;
  roomId: string;
  userId?: string;
  name: string;
  roleId?: string;
  faction?: Faction;
  isAlive: boolean;
  isHost: boolean;
  voteTarget?: string;
  actionTarget?: string;
}
