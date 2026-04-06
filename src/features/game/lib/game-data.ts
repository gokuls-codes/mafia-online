import { type Faction, type Player, ROLES, type Room } from "@/types/game";

type RawRoomRow = {
  id: string;
  name: string;
  host_id: string;
  status: Room["status"];
  winner_faction?: Faction | null;
  settings: Room["settings"];
  created_at: string;
  join_code?: string;
  last_night_summary?: Room["last_night_summary"];
  last_vote_summary?: Room["last_vote_summary"];
  mafia_target?: string | null;
};

type RawPlayerRow = {
  id: string;
  room_id: string;
  user_id?: string;
  name: string;
  role_id?: string;
  faction?: Faction;
  is_alive: boolean;
  is_host: boolean;
  vote_target?: string;
  action_target?: string;
  last_action_target?: string;
};

type WinConditionPlayer = {
  is_alive?: boolean;
  isAlive?: boolean;
  faction?: Faction | string | null;
  role_id?: string | null;
  roleId?: string | null;
};

export const DEFAULT_ROOM_SETTINGS: Room["settings"] = {
  roleCounts: {
    [ROLES.VILLAGER.id]: 3,
    [ROLES.MAFIA.id]: 1,
    [ROLES.DOCTOR.id]: 1,
  },
  timerNight: 40,
  timerDay: 90,
  timerVoting: 45,
};

export function mapRoomRow(data: RawRoomRow): Room {
  return {
    id: data.id,
    name: data.name,
    hostId: data.host_id,
    status: data.status,
    winnerFaction: data.winner_faction,
    settings: data.settings,
    createdAt: data.created_at,
    join_code: data.join_code,
    last_night_summary: data.last_night_summary,
    last_vote_summary: data.last_vote_summary,
    mafia_target: data.mafia_target,
  };
}

export function mapPlayerRow(player: RawPlayerRow): Player {
  return {
    id: player.id,
    roomId: player.room_id,
    userId: player.user_id,
    name: player.name,
    roleId: player.role_id,
    faction: player.faction,
    isAlive: player.is_alive,
    isHost: player.is_host,
    voteTarget: player.vote_target,
    actionTarget: player.action_target,
    lastActionTarget: player.last_action_target,
  };
}

export function mapPlayerRows(players: RawPlayerRow[]) {
  return players.map(mapPlayerRow);
}

export function buildRolePool(roleCounts: Room["settings"]["roleCounts"]) {
  const rolePool: string[] = [];

  Object.entries(roleCounts).forEach(([roleId, count]) => {
    for (let i = 0; i < count; i += 1) {
      rolePool.push(roleId);
    }
  });

  return rolePool;
}

export function checkWinConditions(allPlayers: WinConditionPlayer[]) {
  const alive = allPlayers.filter((player) => player.is_alive ?? player.isAlive);
  if (alive.length === 0) {
    return { winner: "None" };
  }

  const mafiaCount = alive.filter((player) => player.faction === "Mafia").length;
  const neutralKillers = alive.filter(
    (player) => (player.role_id ?? player.roleId) === "serial_killer",
  ).length;

  if (mafiaCount === 0 && neutralKillers === 0) {
    return { winner: "Town" };
  }

  if (mafiaCount >= alive.length - mafiaCount) {
    return { winner: "Mafia" };
  }

  if (alive.length === 1 && neutralKillers === 1) {
    return { winner: "Neutral" };
  }

  if (alive.length === 2 && neutralKillers === 1 && mafiaCount === 0) {
    return { winner: "Neutral" };
  }

  return { winner: null };
}
