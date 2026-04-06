import { Info, LogIn, Shield, UserX, Users } from "lucide-react";

import { RoleBadge } from "@/features/game/components/RoleBadge";
import { RoleRevealBadge } from "@/features/game/components/RoleRevealBadge";
import { useGame } from "@/store/GameContext";
import { ROLES } from "@/types/game";

const MINIMUM_PLAYERS = 3;

export function LobbyView() {
  const { room, players, me, startGame, updateSettings, kickPlayer } = useGame();

  if (!room) {
    return null;
  }

  const handleRoleCount = (roleId: string, delta: number) => {
    const current = room.settings.roleCounts[roleId] || 0;
    const next = Math.max(0, current + delta);

    updateSettings({
      ...room.settings,
      roleCounts: {
        ...room.settings.roleCounts,
        [roleId]: next,
      },
    });
  };

  const totalAssignedRoles = Object.values(room.settings.roleCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const isBalanced = totalAssignedRoles === players.length;
  const needsMore = players.length > totalAssignedRoles;
  const tooMany = totalAssignedRoles > players.length;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-8 md:grid-cols-3">
      <div className="space-y-8 md:col-span-2">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h2 className="mb-2 flex items-center gap-4 text-4xl font-cinzel">
              <Shield className="text-accent" />
              ROLE CONFIGURATION
            </h2>
            <p className="text-zinc-500">
              Assign roles to the inhabitants of {room.name}
            </p>
          </div>
          <div className={`text-right ${isBalanced ? "text-green-500" : "text-accent"}`}>
            <div className="text-3xl leading-none font-cinzel">
              {totalAssignedRoles} / {players.length}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-60">
              Roles Assigned
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.values(ROLES)
            .sort((left, right) => left.name.localeCompare(right.name))
            .map((role) => (
              <RoleBadge
                key={role.id}
                roleId={role.id}
                count={room.settings.roleCounts[role.id] || 0}
                onIncrement={() => handleRoleCount(role.id, 1)}
                onDecrement={() => handleRoleCount(role.id, -1)}
                canEdit={me?.isHost || false}
              />
            ))}
        </div>

        {me?.isHost && (
          <div className="space-y-4">
            {tooMany && (
              <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
                <Info className="h-5 w-5 shrink-0" />
                <span>
                  You have assigned {totalAssignedRoles - players.length} too many
                  roles. Remove some to start.
                </span>
              </div>
            )}
            {needsMore && players.length >= MINIMUM_PLAYERS && (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-400">
                <Info className="h-5 w-5 shrink-0" />
                <span>
                  You need to assign {players.length - totalAssignedRoles} more
                  roles (for example Villagers) to start.
                </span>
              </div>
            )}

            <button
              onClick={startGame}
              disabled={!isBalanced || players.length < MINIMUM_PLAYERS}
              className="group flex w-full items-center justify-center gap-4 rounded-3xl bg-accent p-6 text-2xl transition-all disabled:cursor-not-allowed disabled:grayscale disabled:opacity-30 hover:bg-accent-muted font-cinzel shadow-red"
            >
              {isBalanced ? "COMMENCE OPERATION" : "WAITING FOR BALANCE"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6 rounded-3xl border border-zinc-800 bg-panel-bg p-8">
        <h3 className="border-b border-zinc-800 pb-4 text-2xl font-cinzel">
          PARTICIPANTS
        </h3>
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                <Users className="h-5 w-5 text-zinc-500" />
              </div>
              <div className="flex flex-col">
                <span
                  className="flex items-center gap-2 font-medium font-outfit"
                  style={{ color: player.id === me?.id ? "red" : "white" }}
                >
                  {player.name}
                  {player.isHost && <Shield className="h-3 w-3 text-accent" />}
                  {player.id === me?.id && (
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      (You)
                    </span>
                  )}
                  <RoleRevealBadge player={player} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                  {player.isAlive ? "Status: Active" : "Status: Deceased"}
                </span>
              </div>
              {me?.isHost && player.id !== me.id && (
                <button
                  onClick={() => kickPlayer(player.id)}
                  className="ml-auto rounded-lg border border-red-500/10 bg-red-900/10 p-2 text-red-500 transition-all hover:scale-110 hover:bg-red-900/30 active:scale-95"
                  title="Kick Participant"
                >
                  <UserX className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {players.length < MINIMUM_PLAYERS && (
            <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center text-xs uppercase tracking-widest text-accent">
              Waiting for minimum {MINIMUM_PLAYERS} players...
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-12">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Invite Room
            </label>
            <span className="font-mono text-[10px] text-zinc-600">
              Code: {room.join_code}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?code=${room.join_code}`;
                navigator.clipboard.writeText(url);
              }}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm transition-all hover:bg-zinc-800 font-cinzel"
            >
              <LogIn className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
              COPY INVITE LINK
            </button>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                or share code
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <div className="rounded-xl border border-dashed border-zinc-800 bg-black p-4 text-center font-mono text-2xl tracking-[0.5em] text-zinc-400">
              {room.join_code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
