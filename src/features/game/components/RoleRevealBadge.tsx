import { useGame } from "@/store/GameContext";
import { type Player } from "@/types/game";
import { getRole } from "@/features/game/lib/roles";

type RoleRevealBadgeProps = {
  player: Player;
};

export function RoleRevealBadge({ player }: RoleRevealBadgeProps) {
  const { me } = useGame();
  const role = getRole(player.roleId);

  if (me?.isAlive !== false || !player.roleId || !role) {
    return null;
  }

  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
        role.faction === "Mafia"
          ? "border-red-500/20 bg-red-500/10 text-red-500"
          : role.faction === "Town"
            ? "border-green-500/20 bg-green-500/10 text-green-500"
            : "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
      }`}
    >
      {role.name}
    </span>
  );
}
