import { ROLES, type Role } from "@/types/game";

export const MAFIA_ROLE_IDS = ["mafia", "godfather"] as const;
export const SAVING_ROLE_IDS = ["doctor", "mayor"] as const;
export const NIGHT_ACTION_ROLE_IDS = [
  "doctor",
  "mafia",
  "godfather",
  "detective",
  "police",
  "mayor",
] as const;

export function getRole(roleId?: string | null): Role | null {
  if (!roleId) {
    return null;
  }

  return ROLES[roleId.toUpperCase()] ?? null;
}

export function isMafiaRole(roleId?: string | null) {
  return MAFIA_ROLE_IDS.includes((roleId ?? "").toLowerCase() as (typeof MAFIA_ROLE_IDS)[number]);
}

export function isSavingRole(roleId?: string | null) {
  return SAVING_ROLE_IDS.includes((roleId ?? "").toLowerCase() as (typeof SAVING_ROLE_IDS)[number]);
}

export function hasNightAction(roleId?: string | null) {
  return NIGHT_ACTION_ROLE_IDS.includes(
    (roleId ?? "").toLowerCase() as (typeof NIGHT_ACTION_ROLE_IDS)[number],
  );
}
